import {Config, fetchConfig} from "./model/Config.ts";
import {InputData} from "./services/Backend.ts";
import {MockBackend} from "./services/MockBackend.ts";

export interface State {
    inputData: InputData
    saveXfdf: (xfdfContent: string) => Promise<void>
}

export function extractTypeFromUrl(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('type') || "xod";
}

export async function getInitialState(type: string): Promise<State> {
    const config: Config = await fetchConfig(type);
    const backend = new MockBackend(config.backend);
    return {
        inputData: await backend.obtainInputData(),
        saveXfdf: async (xfdfContent) => {
            try {
                await backend.saveXfdf(xfdfContent)
                notify("Saved!")
            } catch (err) {
                // @ts-ignore
                error(err);
            }

        },
    };
}


export function error(message: string) {
    console.error(message);
    window.alert(message);
}

export function notify(message: string) {
    const x = document.querySelector<HTMLDivElement>("#snackbar")!
    x.innerHTML = message;
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}