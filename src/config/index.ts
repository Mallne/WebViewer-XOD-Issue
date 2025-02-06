import {WebViewerInstance} from "@pdftron/webviewer";
import {State} from "../util.ts";
import configureAnnotations from "./configAnnotations.ts";
import configureUI from "./configUI.ts";

export default async function configure(instance: WebViewerInstance, props: State) {
    configureUI(instance, props);
    configureAnnotations(instance, props)
}