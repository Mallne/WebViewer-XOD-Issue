import {MockBackendConfig} from "../model/Config";
import {Backend, InputData} from "./Backend";
// @ts-nocheck

// This backend takes the input data from the runtime config file and "saves" annotations by printing them to the
// console.
export class MockBackend implements Backend {
    constructor(private config: MockBackendConfig) {
    }

    async obtainInputData(_token: string): Promise<InputData> {
        return this.config.mockInputData;
    }

    async saveXfdf(_token: string, xfdfContent: string): Promise<void> {
        console.dirxml(new DOMParser().parseFromString(xfdfContent, "text/xml"))
        console.debug(xfdfContent)
    }
}