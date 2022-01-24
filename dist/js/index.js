import Ajv from "ajv";
import yaml from "yaml";
import { promises as fs } from "fs";
const schema = yaml.parse(await fs.readFile("schema.yml", { encoding: "utf-8" }));
const ajv = new Ajv({ strictTuples: false });
const validate = ajv.compile(schema);
const jsonInput = await fs.readFile("examples/pektin-test.json", { encoding: "utf-8" });
const config = JSON.parse(jsonInput);
const valid = validate(config);
if (!valid)
    throw validate.errors;
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
if (config.nodes.filter(node => node.main !== true && typeof node.setup !== "object").length !== 0)
    throw Error(`nodes that are not main must contain a setup object`);
// nodes that are main cant contain a setup object
if (config.nodes.filter(node => node.main === true && typeof node.setup !== "undefined").length !==
    0) {
    throw Error(`the main node can't contain a setup object`);
}
// nodes must have a minium of one ip or one legacyIp
if (config.nodes.filter(node => { var _a, _b; return !((_a = node.ips) === null || _a === void 0 ? void 0 : _a.length) && !((_b = node.legacyIps) === null || _b === void 0 ? void 0 : _b.length); }).length !== 0) {
    throw Error(`nodes must have a minium of one ip or one legacyIp`);
}
if (config.certificates.enabled && config.certificates.letsencryptEmail.length < 6)
    throw Error(`certificates is enabled but the letsencryptEmail is invalid`);
