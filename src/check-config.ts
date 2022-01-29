import { checkConfig } from "./index.js";

await checkConfig("examples/ansible-compose-hetzner.json", "pektin-config.schema.yml");
