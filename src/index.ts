import Ajv from "ajv";
import yaml from "yaml";
import { promises as fs } from "fs";
import { PektinConfig } from "./config-types.js";
import _ from "lodash";
import { colors } from "@pektin/client/dist/js/utils/colors.js";

export const checkConfig = async (
    inputPath: string,
    schemaPath: string,
    mode: `yaml` | `json` = `json`
) => {
    const schema = yaml.parse(await fs.readFile(schemaPath, { encoding: `utf-8` }));
    /*@ts-ignore*/
    const ajv = new Ajv({ strictTuples: false });

    const validate = ajv.compile(schema);
    const input = await fs.readFile(inputPath, { encoding: `utf-8` });
    const config: PektinConfig = mode === `yaml` ? yaml.parse(input) : JSON.parse(input);
    const valid = validate(config);

    if (!valid) throw validate.errors;

    // domain must be valid if service is enabled
    [config.ui, config.api, config.vault, config.recursor].forEach((e, i) => {
        const s = [`ui`, `api`, `vault`, `recursor`];
        if (e.enabled && e.domain.length < 4) err(`${s[i]} is enabled but it's domain is invalid`);
    });

    // nodes must contain exactly one main node
    if (config.nodes.filter((node) => node.main === true).length !== 1) {
        err(`nodes must contain exactly one main node`);
    }

    // nodes that are main cant contain a setup object
    if (
        config.nodes.filter((node) => node.main === true && typeof node.setup !== `undefined`)
            .length !== 0
    ) {
        err(`the main node can't contain a setup object`);
    }

    // nodes must have a minium of one ip or one legacyIp
    if (
        config.nodes.filter((node) => !node.ansible && !node.ips?.length && !node.legacyIps?.length)
            .length !== 0
    ) {
        err(`nodes must have a minimum of one ip or one legacyIp or ansible configured`);
    }

    {
        // check if there are duplicate nodes
        if (
            Array.from(new Set(config.nodes.map((node) => node.name))).length !==
            config.nodes.length
        ) {
            err(`Nodes must have distinct names`);
        }
    }

    if (config.nameservers) {
        {
            const hasDuplicates = (array: string[]) => new Set(array).size !== array.length;
            const mainNs: string[] = [];
            config.nameservers.forEach((ns) => {
                if (ns.main) {
                    mainNs.push(ns.domain);
                }
            });
            // check if a main ns is present
            if (mainNs.length === 0) {
                err(`A domain must have a primary nameserver`);
            }
            // check if nameserver has only one main ns
            if (hasDuplicates(mainNs)) {
                err(`A domain can only have one main nameserver`);
            }
        }
        {
            // check if all present domains have a main ns
            const distinctDomains = Array.from(new Set(config.nameservers.map((ns) => ns.domain)));
            const allHaveMain = distinctDomains.every((d) => {
                let hasMain = false;
                config.nameservers?.forEach((ns) => {
                    if (d === ns.domain && ns.main) {
                        hasMain = true;
                    }
                });
                return hasMain;
            });
            if (!allHaveMain) {
                err(`Every distinct domain must have a main nameserver`);
            }
        }
        {
            // check if there are duplicate nameservers
            if (
                Array.from(new Set(config.nameservers.map((ns) => ns.subDomain + `.` + ns.domain)))
                    .length !== config.nameservers.length
            ) {
                err(`Nameservers cant have duplicates`);
            }
        }
        {
            // check if nodes names overlap with nameservers nodes

            const nodes = new Set(config.nodes.map((node) => node.name));
            const distinctNsNodes = new Set(config.nameservers.map((ns) => ns.node));
            if (!_.isEqual(nodes, distinctNsNodes)) {
                err(`Nameservers nodes dont overlap with nodes`);
            }
        }
    }

    // if certificates are enabled the letsencrypt email must be set
    if (config.certificates.enabled && config.certificates.letsencryptEmail.length < 6) {
        err(`certificates is enabled but the letsencryptEmail is invalid`);
    }

    // TODO check if all domains are absolute

    console.log(`${colors.bold}${colors.fg.green}Config is valid${colors.reset}`);
};

const err = (message: string) => {
    throw Error(`${colors.boldRed}${message}${colors.reset}`);
};
