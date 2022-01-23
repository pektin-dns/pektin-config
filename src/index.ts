import Ajv from "ajv";
import yaml from "yaml";
import { promises as fs } from "fs";

const schema = yaml.parse(await fs.readFile("schema.yml", { encoding: "utf-8" }));
delete schema["$schema"];
const ajv = new Ajv();

console.log(schema);

const validate = ajv.compile(schema);
const jsonInput = await fs.readFile("input.json", { encoding: "utf-8" });

const valid = validate(JSON.parse(jsonInput));

if (!valid) {
    console.log(validate.errors);
} else {
    console.log("Valid");
}
