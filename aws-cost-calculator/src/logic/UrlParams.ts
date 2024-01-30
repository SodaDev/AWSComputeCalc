export interface URLParams {
    lambdaParams?: LambdaUrlParams;
    fargateParams?: FargateUrlParams;
    ec2Params?: Ec2UrlParams;
    eventsParams?: EventsUrlParams;
}

export interface Ec2UrlParams {
    instanceType?: string;
    numberOfInstances?: number;
}

export interface FargateUrlParams {
    numberOfTasks?: number;
    fargateConfig?: FargateConfig;
    appRunnerConfig?: AppRunnerConfig;
}

export interface AppRunnerConfig {
    enabled: boolean;
    rpmPerTask: number;
}

export interface FargateConfig {
    vCPU?: number;
    memory?: number;
}

export interface LambdaUrlParams {
    avgResponseTimeInMs?: number;
    requests?: number;
    interval?: string;
    lambdaSize?: number;
    freeTier?: boolean;
}

export interface EventsUrlParams {
    events?: number;
    interval?: string;
    consumers?: number;
    avgPayloadSize?: number
    shards?: number
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toURLParams(json: string): URLParams {
        return cast(JSON.parse(json), r("URLParams"));
    }

    public static uRLParamsToJson(value: URLParams): string {
        return JSON.stringify(uncast(value, r("URLParams")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`,);
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = {key: p.js, typ: p.typ});
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = {key: p.json, typ: p.typ});
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems") ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty("props") ? transformObject(getProps(typ), typ.additional, val)
                    : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function u(...typs: any[]) {
    return {unionMembers: typs};
}

function o(props: any[], additional: any) {
    return {props, additional};
}

function r(name: string) {
    return {ref: name};
}

const typeMap: any = {
    "URLParams": o([
        {json: "lambdaParams", js: "lambdaParams", typ: u(undefined, r("LambdaUrlParams"))},
        {json: "fargateParams", js: "fargateParams", typ: u(undefined, r("FargateUrlParams"))},
        {json: "ec2Params", js: "ec2Params", typ: u(undefined, r("Ec2UrlParams"))},
        {json: "eventsParams", js: "eventsParams", typ: u(undefined, r("EventsUrlParams"))},
    ], false),
    "Ec2UrlParams": o([
        {json: "instanceType", js: "instanceType", typ: u(undefined, "")},
        {json: "numberOfInstances", js: "numberOfInstances", typ: u(undefined, 0)},
    ], false),
    "FargateUrlParams": o([
        {json: "fargateConfig", js: "fargateConfig", typ: u(undefined, r("FargateConfig"))},
        {json: "numberOfTasks", js: "numberOfTasks", typ: u(undefined, 0)},
        {json: "appRunnerConfig", js: "appRunnerConfig", typ: u(undefined, r("AppRunnerConfig"))},
    ], false),
    "AppRunnerConfig": o([
        {json: "enabled", js: "enabled", typ: u(undefined, true)},
        {json: "rpmPerTask", js: "rpmPerTask", typ: u(undefined, 0)},
    ], false),
    "FargateConfig": o([
        {json: "vCPU", js: "vCPU", typ: u(undefined, 0)},
        {json: "memory", js: "memory", typ: u(undefined, 0)},
    ], false),
    "LambdaUrlParams": o([
        {json: "avgResponseTimeInMs", js: "avgResponseTimeInMs", typ: u(undefined, 0)},
        {json: "requests", js: "requests", typ: u(undefined, 0)},
        {json: "interval", js: "interval", typ: u(undefined, "")},
        {json: "lambdaSize", js: "lambdaSize", typ: u(undefined, 0)},
        {json: "freeTier", js: "freeTier", typ: u(undefined, true)},
    ], false),
    "EventsUrlParams": o([
        {json: "avgPayloadSize", js: "avgPayloadSize", typ: u(undefined, 0)},
        {json: "events", js: "events", typ: u(undefined, 0)},
        {json: "interval", js: "interval", typ: u(undefined, "")},
        {json: "consumers", js: "consumers", typ: u(undefined, 0)},
        {json: "shards", js: "shards", typ: u(undefined, 0)},
    ], false),
};
