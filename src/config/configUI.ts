import {WebViewerInstance} from "@pdftron/webviewer";
import {State} from "../util.ts";
import {insertCheckTool} from "./configureCustomTools.ts";


export default function configureUI(instance: WebViewerInstance, props: State) {
    createCustomButtons(instance, props);
    insertCheckTool(instance)
    removeComponents(instance)
}

function createCustomButtons(instance: WebViewerInstance, props: State) {
    const saveButton = new instance.UI.Components.CustomButton({
        dataElement: 'saveButton',
        title: 'Prüfspuren speichern',
        onClick: async () => {
            const xfdf = await instance.Core.annotationManager.exportAnnotations({
                widgets: false,
                links: false,
                fields: false
            });
            props.saveXfdf(xfdf);
        },
        img: 'icon-save',
    });
    const defaultHeader = instance.UI.getModularHeader('default-top-header')
    const items = defaultHeader.getItems()
    // @ts-ignore
    items[0]["items"].splice(4, 0, saveButton);
    defaultHeader.setItems(items);
}

function removeComponents(instance: WebViewerInstance) {
    const {UI, Core} = instance;
    const {Tools} = Core
    const {ToolNames} = Tools
    const defaultHeader = UI.getModularHeader('default-top-header')
    const toolsHeader = UI.getModularHeader('tools-header')
    const items = defaultHeader.getItems()
    const itms = toolsHeader.getItems()
    // @ts-ignore
    items[1]["items"].splice(3, items[1]["items"].length - 1);
    defaultHeader.setItems(items);
    //manually remove markReplaceTextToolButton (index 8) since it for whatever reason does not get deleted with Toolnames
    // @ts-ignore
    itms[0]["items"][0]["items"].splice(8, 1)
    toolsHeader.setItems(itms);

    UI.disableTools([ToolNames.STICKY, ToolNames.MARK_INSERT_TEXT, ToolNames.MARK_REPLACE_TEXT])
}