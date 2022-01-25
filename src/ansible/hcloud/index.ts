import { promises as fs } from "fs";
import path from "path";
import { PektinConfig } from "../../types";
import { FloatingIpResponse } from "./types";

export const mergeConfig = async (configPath: string, floatingIpResponseFolderPath: string) => {
    const config: PektinConfig = JSON.parse(await fs.readFile(configPath, { encoding: "utf8" }));
    const files = await fs.readdir(floatingIpResponseFolderPath, { encoding: "utf-8" });

    const nodes = Array.from(
        new Set(files.map(filePath => filePath.substring(0, filePath.indexOf("--"))))
    );
    config.nodes = [] as unknown as PektinConfig["nodes"];
    for (let i = 0; i < nodes.length; i++) {
        const nodeName = nodes[i];

        /*@ts-ignore*/
        config.nodes[i] = {};
        const [ipFile, legacyIpFile] = await Promise.all([
            fs.readFile(path.join(floatingIpResponseFolderPath, nodeName + "--ip.json"), {
                encoding: "utf8"
            }),
            fs.readFile(path.join(floatingIpResponseFolderPath, nodeName + "--legacyIp.json"), {
                encoding: "utf8"
            })
        ]);

        const [ip, legacyIp] = [
            JSON.parse(ipFile) as FloatingIpResponse,
            JSON.parse(legacyIpFile) as FloatingIpResponse
        ];

        // sets the nodes ip in the config
        if (ip?.hcloud_floating_ip?.ip) {
            config.nodes[i].ips = [ip?.hcloud_floating_ip?.ip.replace("/64", "")];
        }
        // sets the nodes legacy ip in the config
        if (legacyIp?.hcloud_floating_ip?.ip) {
            config.nodes[i].legacyIps = [legacyIp?.hcloud_floating_ip?.ip];
        }

        // get whether the node is the main node
        if (ip?.hcloud_floating_ip && ip?.hcloud_floating_ip.labels.group === "main") {
            config.nodes[i].main = true;
        } else if (
            legacyIp?.hcloud_floating_ip &&
            legacyIp?.hcloud_floating_ip.labels.group === "main"
        ) {
            config.nodes[i].main = true;
        } else {
            config.nodes[i].setup = {
                system: "ubuntu",
                cloneRepo: true,
                root: {
                    disableSystemdResolved: true,
                    installDocker: true
                },
                setup: true,
                start: true
            };
        }
        config.nodes[i].name = nodeName;
    }
    await fs.writeFile(configPath, JSON.stringify(config, null, "    "));
};

export const createConfigureFloatingIpsScript = async (configPath: string, outDir: string) => {
    const config: PektinConfig = JSON.parse(await fs.readFile(configPath, { encoding: "utf8" }));

    const nodes = config.nodes;
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        let file = ``;
        if (node.ips?.length) {
            file += `
network:
    version: 2
    renderer: networkd
    ethernets:
        eth0:
            addresses:
                - ${node.ips[0]}/64
`;
        }
        if (node.legacyIps?.length) {
            file += `
network:
    version: 2
    renderer: networkd
    ethernets:
        eth0:
            addresses:
                - ${node.legacyIps[0]}/32
`;
        }
        file = `echo '${file}' > /etc/netplan/60-floating-ip.yaml\nnetplan apply`;
        await fs.writeFile(path.join(outDir, node.name + "-configure-floating-ips.sh"), file);
    }
};
