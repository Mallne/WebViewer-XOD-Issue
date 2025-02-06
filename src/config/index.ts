import {WebViewerInstance} from "@pdftron/webviewer";
import {State} from "../util.ts";
import configureColor from "./configColor.ts";
import configureAnnotations from "./configAnnotations.ts";
import configureUI from "./configUI.ts";
import configureIndicies from "./configIndex.ts";

export default async function configure(instance: WebViewerInstance, props: State) {
    await instance.UI.setLanguage("de")
    configureUI(instance, props);
    configureAnnotations(instance, props)
    configureColor(instance, props);
    configureIndicies(instance);
}