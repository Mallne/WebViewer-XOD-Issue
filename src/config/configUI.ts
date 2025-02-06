import {WebViewerInstance} from "@pdftron/webviewer";
import {State} from "../util.ts";


export default function configureUI(instance: WebViewerInstance, props: State) {
    createCustomButtons(instance, props);
}

function createCustomButtons(instance: WebViewerInstance, props: State) {
    const saveButton = new instance.UI.Components.CustomButton({
        dataElement: 'saveButton',
        title: 'Save',
        onClick: async () => {
            const xfdf = await instance.Core.annotationManager.exportAnnotations({
                widgets: false,
                links: false,
                fields: false
            });
            await props.saveXfdf(xfdf);
        },
        img: 'icon-save',
    });
    const defaultHeader = instance.UI.getModularHeader('default-top-header')
    const items = defaultHeader.getItems()
    // @ts-ignore
    items[0]["items"].splice(4, 0, saveButton);
    defaultHeader.setItems(items);
}