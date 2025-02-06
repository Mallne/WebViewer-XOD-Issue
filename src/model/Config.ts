import {InputData} from "../services/Backend";

// Structure of the runtime config JSON file.
export interface Config {
    backend: BackendConfig
}

// Structure of the backend config object.
export type BackendConfig = MockBackendConfig;

// Structure of the mock backend config object.
export interface MockBackendConfig {
    type: 'mock'
    mockInputData: InputData
}

// Fetches the configuration via HTTP.
export async function fetchConfig(type: string): Promise<Config> {
    let xfdf = ""
    const docName = "test-quer"
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
                // @ts-ignore
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