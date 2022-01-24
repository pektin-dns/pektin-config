import yaml from "yaml";
import { promises as fs } from "fs";
import { compile } from "json-schema-to-typescript";

const read = await fs.readFile("./schema.yml", { encoding: "utf-8" });
const json = yaml.parse(read);
const ts = await compile(json, "PektinConfig");
await fs.writeFile("src/types.ts", ts);
console.log(read, JSON.stringify(json), ts);
