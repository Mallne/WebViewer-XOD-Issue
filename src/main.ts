import "./Colors.css"
import "./App.css"
import {
    error,
    extractConfigHintFromUrl,
    extractTokenFromUrl,
    getInitialState,
    loader,
    removeLoader,
    State
} from "./util.ts";
import WebViewer from "@pdftron/webviewer";
import configure from "./config";

const DEBUG: any = {info: "Universal Debug Bundle"};

(async () => {
    const domNode = document.querySelector<HTMLDivElement>("#app")!
    DEBUG["domNode"] = domNode
    domNode.innerHTML = loader()

    const token = extractTokenFromUrl()
    DEBUG["token"] = token
    if (token === undefined) {
        error("Ein Dokument kann nur mit gültigem Token geöffnet werden")
        removeLoader()
    } else {
        const props: State = await getInitialState(token, extractConfigHintFromUrl())
        DEBUG["props"] = props
        const instance = await WebViewer({
            path: 'webviewer/public',
            initialDoc: props.inputData.documentUri,
            annotationUser: props.inputData.annotationIndexData.index,
            // @ts-expect-error not an Error
            documentType: props.inputData.documentType,
            //licenseKey: "" ← dadurch, dass wir XOD schicken brauchen wir im Frontend (noch) keinen Lizenzschlüssel
            // (https://docs.apryse.com/web/faq/add-license#custom-server-xod-additional-information)
        }, domNode)

        await configure(instance, props)
        //Dont Question the GODS of Apryse in their making: https://community.apryse.com/t/webviewer-version-11-2-0-initialdoc-not-loading/11070
        await instance.Core.documentViewer.loadDocument(props.inputData.documentUri, {
            type: props.inputData.documentType,
            xodOptions: {
                streaming: true,
            }
        })

        DEBUG["webViewer"] = instance

        removeLoader()

        console.debug(DEBUG)
    }
})()