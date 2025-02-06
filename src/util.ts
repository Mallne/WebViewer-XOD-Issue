import {fetchConfig} from "./model/Config.ts";
import {createBackend, InputData} from "./services/Backend.ts";

export interface State {
    inputData: InputData
    saveXfdf: (xfdfContent: string) => Promise<void>
}

export function extractTokenFromUrl(): string | undefined {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token') || undefined;
}

export function extractConfigHintFromUrl(): string | undefined {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('config') || undefined;
}

export async function getInitialState(token: string, configHint: string | undefined): Promise<State> {
    const config = await fetchConfig(configHint, token);
    const backend = createBackend(config.backend);
    return {
        inputData: await backend.obtainInputData(token),
        saveXfdf: async (xfdfContent) => {
            try {
                await backend.saveXfdf(token, xfdfContent)
                notify("Prüfspuren gespeichert!")
            } catch (err) {
                // @ts-ignore
                error(err);
            }

        },
    };
}

export function loader(): string {
    return `
    <div class="loader"></div>
    `
}

export function removeLoader() {
    document.querySelector(".loader")?.remove();
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