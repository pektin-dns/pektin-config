import yaml from "yaml";
import { promises as fs } from "fs";
import { compile } from "json-schema-to-typescript";
import Ajv from "ajv";

const read = await fs.readFile(`./pektin-config.schema.yml`, { encoding: `utf-8` });
const json = yaml.parse(read);
const ajv = new Ajv({ strictTuples: false });

ajv.compile(json);

const ts = await compile(json, `PektinConfig`, { bannerComment: `/* eslint-disable quotes */` });
await fs.writeFile(`src/config-types.ts`, ts);
await fs.writeFile(`pektin-config.schema.json`, JSON.stringify(json));
