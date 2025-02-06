import {InputData} from "../services/Backend";

// Structure of the runtime config JSON file.
export interface Config {
    backend: BackendConfig
}

// Structure of the backend config object.
export type BackendConfig = MockBackendConfig | RealBackendConfig | DMSBackendConfig;

// Structure of the mock backend config object.
export interface MockBackendConfig {
    type: 'mock'
    mockInputData: InputData
}

// Structure of the real backend config object.
export interface RealBackendConfig {
    type: 'real'
    // URI templates where placeholder `{TOKEN}` will be replaced with the real token.
    serviceUriTemplates: {
        annotationIndex: string
        document: string
        annotations: string
    }
}

export interface DMSBackendConfig {
    type: 'dms'
    // URI templates where placeholder `{TOKEN}` will be replaced with the real token.
    serviceUriTemplates: {
        annotationIndex: string
        document: string
        annotations: string
    }
}

// Fetches the configuration via HTTP.
export async function fetchConfig(configHint: string | undefined, token: string): Promise<Config> {
    if (!configHint) {
        const parts = token.split(";")
        if (parts.length === 2) {
            // @ts-ignore
            return await generateTestConfig(parts[0], parts[1])
        }
    }
    const configFile = configHint ? 'config_' + configHint + '.json' : 'config.json';

    const response = await fetch(configFile);
    if (!response.ok) {
        throw Error(`Couldn't fetch config: ${response.statusText}`);
    }
    const json = await response.text();
    // We just want to deal with `undefined` never with `null` (in order to take advantage of TypeScript).
    return JSON.parse(json, (_key, value) => value === null ? undefined : value);
}

async function generateTestConfig(docName: string, type: string) {
    let xfdf = ""
    try {
        const resp = await fetch(`test/${docName}.xfdf`)
        xfdf = await resp.text();
    } catch (e) {
        console.error(e);
    }

    return {
        "backend": {
            "type": "mock",
            "mockInputData": {
                "documentUri": `test/${docName}.${type}`,
                "documentType": type,
                "xfdfContent": xfdf,
                "annotationIndexData": {
                    "index": "2",
                    "bearbeiter": "Mobbi"
                },
                "annotators": {
                    "1": {
                        "name": "Pittiplatsch"
                    },
                    "2": {
                        "name": "Mobbi"
                    }
                }
            }
        }
    }
}