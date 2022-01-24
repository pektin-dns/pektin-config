import Ajv from "ajv";
import yaml from "yaml";
import { promises as fs } from "fs";
import { PektinConfig } from "./types";
import _ from "lodash";

export const checkConfig = async (path: string) => {
    const schema = yaml.parse(await fs.readFile("schema.yml", { encoding: "utf-8" }));
    const ajv = new Ajv({ strictTuples: false });

    const validate = ajv.compile(schema);
    const jsonInput = await fs.readFile(path, { encoding: "utf-8" });
    const config = JSON.parse(jsonInput) as PektinConfig;
    const valid = validate(config);

    if (!valid) throw validate.errors;

    // domain must be valid if service is enabled
    [config.ui, config.api, config.vault, config.recursor].forEach((e, i) => {
        const s = ["ui", "api", "vault", "recursor"];
        if (e.enabled && e.domain.length < 4)
            throw Error(`${s[i]} is enabled but it's domain is invalid`);
    });

    // nodes must contain exactly one main node
    if (config.nodes.filter(node => node.main === true).length !== 1)
        throw Error(`nodes must contain exactly one main node`);

    // if node is not main it must contain a setup object
    if (
        config.nodes.filter(node => node.main !== true && typeof node.setup !== "object").length !==
        0
    )
        throw Error(`nodes that are not main must contain a setup object`);

    // nodes that are main cant contain a setup object
    if (
        config.nodes.filter(node => node.main === true && typeof node.setup !== "undefined")
            .length !== 0
    ) {
        throw Error(`the main node can't contain a setup object`);
    }

    // nodes must have a minium of one ip or one legacyIp
    if (config.nodes.filter(node => !node.ips?.length && !node.legacyIps?.length).length !== 0) {
        throw Error(`nodes must have a minium of one ip or one legacyIp`);
    }

    {
        // check if there are duplicate nodes
        if (
            Array.from(new Set(config.nodes.map(node => node.name))).length !== config.nodes.length
        ) {
            throw Error("Nodes must have distinct names");
        }
    }

    if (config.nameservers) {
        {
            const hasDuplicates = (array: string[]) => new Set(array).size !== array.length;
            const mainNs: string[] = [];
            config.nameservers.forEach(ns => {
                if (ns.main) {
                    mainNs.push(ns.domain);
                }
            });
            // check if a main ns is present
            if (mainNs.length === 0) {
                throw Error("A domain must have a primary nameserver");
            }
            // check if nameserver has only one main ns
            if (hasDuplicates(mainNs)) {
                throw Error("A domain can only have one main nameserver");
            }
        }
        {
            // check if all present domains have a main ns
            const distinctDomains = Array.from(new Set(config.nameservers.map(ns => ns.domain)));
            const allHaveMain = distinctDomains.every(d => {
                let hasMain = false;
                config.nameservers?.forEach(ns => {
                    if (d === ns.domain && ns.main) {
                        hasMain = true;
                    }
                });
                return hasMain;
            });
            if (!allHaveMain) {
                throw Error("Every distinct domain must have a main nameserver");
            }
        }
        {
            // check if there are duplicate nameservers
            if (
                Array.from(new Set(config.nameservers.map(ns => ns.subDomain + "." + ns.domain)))
                    .length !== config.nameservers.length
            ) {
                throw Error("Nameservers cant have duplicates");
            }
        }
        {
            // check if nodes names overlap with nameservers nodes

            const nodes = new Set(config.nodes.map(node => node.name));
            const distinctNsNodes = new Set(config.nameservers.map(ns => ns.node));
            if (!_.isEqual(nodes, distinctNsNodes)) {
                throw Error("Nameservers nodes dont overlap with nodes");
            }
        }
    }

    // if certificates are enabled the letsencrypt email must be set
    if (config.certificates.enabled && config.certificates.letsencryptEmail.length < 6)
        throw Error(`certificates is enabled but the letsencryptEmail is invalid`);

    console.log("Config is valid");
};
