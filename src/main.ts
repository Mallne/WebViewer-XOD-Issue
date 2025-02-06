import "./App.css"
import {extractTypeFromUrl, getInitialState, State} from "./util.ts";
import WebViewer from "@pdftron/webviewer";
import configure from "./config";

(async () => {
    const domNode = document.querySelector<HTMLDivElement>("#app")!
    const type = extractTypeFromUrl()
    const props: State = await getInitialState(type)
    const instance = await WebViewer({
        path: 'webviewer/public',
        initialDoc: props.inputData.documentUri,
        annotationUser: props.inputData.annotationIndexData.index,
        // @ts-expect-error not an Error
        documentType: props.inputData.documentType,
        //licenseKey: "" ← we dont need this since we use XOD from a Server,
        // (https://docs.apryse.com/web/faq/add-license#custom-server-xod-additional-information)
    }, domNode)

    await configure(instance, props)
    
})()