import { ValidateFunction } from "ajv";

export const schemaHasAllMeta = (a: Record<string, any>, validateMeta: ValidateFunction, propChain: string[] = []) => {
    console.log(a);

    if (a.properties === undefined) return propChain;
    const tlValues: Record<string, any>[] = Object.values(a.properties);
    const tlKeys = Object.keys(a.properties);

    tlValues.forEach((val, i) => {
        if (val.type === `object`) {
            propChain.push(tlKeys[i]);
            propChain = schemaHasAllMeta(val, validateMeta, propChain);
        } else if (val.type === `array` && val.items.properties) {
            propChain.push(tlKeys[i]);
            propChain = schemaHasAllMeta(val.items, validateMeta, propChain);
        } else {
            if (val.type === `array`) val = val.items;

            if (val.examples === undefined) {
                propChain.push(tlKeys[i]);
                throw Error(`Missing meta for ${propChainDots(propChain)}`);
            }
            const m = getExamplesMeta(val.examples);
            if (!val.examples.length || !m) {
                propChain.push(tlKeys[i]);
                throw Error(`Missing meta for ${propChainDots(propChain)}`);
            }

            const v = validateMeta(m);
            if (!v) {
                propChain.push(tlKeys[i]);
                propChain.push(`examples`);
                propChain.push(`meta`);
                throw Error(`${propChainDots(propChain)} ${JSON.stringify(validateMeta.errors, null, `    `)}`);
            }
        }
    });
    propChain.pop();
    return propChain;
};

export const getExamplesMeta = (examples: any[]) => {
    let oc = 0;
    let m: boolean | Record<string, any> = false;
    for (let i = 0; i < examples.length; i++) {
        const ex = examples[i];
        if (typeof ex === `object` && ex.hasOwnProperty(`meta`)) {
            oc++;
            m = ex.meta;
        }
    }
    if (oc > 1) {
        throw Error(`More than one meta object present`);
    }
    return m;
};

export const propChainDots = (propChain: string[]) => {
    let a = ``;
    propChain.forEach((p, i) => (a += `${i > 0 ? `.` : ``}${p}`));
    return a;
};
