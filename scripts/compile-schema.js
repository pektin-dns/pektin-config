import yaml from "yaml";
import { promises as fs } from "fs";
import { compile } from "json-schema-to-typescript";
import Ajv from "ajv";
import _ from "lodash";

{
    const read = await fs.readFile(`./pektin-config.schema.yml`, { encoding: `utf-8` });
    const json = yaml.parse(read);
    const ajv = new Ajv({ strictTuples: false });

    ajv.compile(_.cloneDeep(json));

    const ts = await compile(_.cloneDeep(json), `PektinConfig`, {
        bannerComment: `/* eslint-disable quotes */`,
    });
    await fs.writeFile(`src/config-types.ts`, ts);
    await fs.writeFile(`pektin-config.schema.json`, JSON.stringify(json));
}
{
    const read = await fs.readFile(`./foreign-apis.schema.yml`, { encoding: `utf-8` });
    const json = yaml.parse(read);
    const ajv = new Ajv({ strictTuples: false });

    ajv.compile(_.cloneDeep(json));

    const ts = await compile(_.cloneDeep(json), `ForeignApis`, {
        bannerComment: `/* eslint-disable quotes */`,
    });
    await fs.writeFile(`src/foreign-apis-types.ts`, ts);
    await fs.writeFile(`foreign-apis.schema.json`, JSON.stringify(json));
}
