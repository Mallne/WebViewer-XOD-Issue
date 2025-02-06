import {Core, WebViewerInstance} from "@pdftron/webviewer";
import {State} from "../util.ts";
import {InputData} from "../services/Backend.ts";
import installCheckmarkTool, {setDefaultCheckmarkTool} from "./configureCustomTools.ts";

export default function configureAnnotations(instance: WebViewerInstance, props: State) {
    installCheckmarkTool(instance)
    adjustSubjectForNewAnnotations(instance, props.inputData.annotationIndexData.index);
    setDefaultFontFamily(instance)
    loadInitialAnnotationsIfNotEmpty(instance, props);
    instance.Core.annotationManager.setAnnotationDisplayAuthorMap(createAuthorNameMapper(props.inputData));

}

function setDefaultFontFamily(instance: WebViewerInstance) {
    const {Core, UI} = instance;
    const {annotationManager} = Core
    const {Fonts} = UI
    Fonts.setAnnotationFonts(["Arial"])
    annotationManager.addEventListener('annotationChanged', (annotations: Core.Annotations.Annotation[], _) => {
        annotations.forEach((annot) => {
            // @ts-ignore
            if (annot["Font"] !== undefined) {
                // @ts-ignore
                annot["Font"] = "Arial"
            }
        })
    })
}

export function loadInitialAnnotationsIfNotEmpty(instance: WebViewerInstance, props: State) {
    instance.Core.documentViewer.addEventListener('documentLoaded', async () => {
        await forceLoadAnnotations(instance, props);
        setDefaultCheckmarkTool(instance);
    });
}

export async function forceLoadAnnotations(instance: WebViewerInstance, props: State) {
    const xfdfContent = props.inputData.xfdfContent;
    if (xfdfContent !== undefined) {
        const annots = instance.Core.annotationManager.getAnnotationsList();
        instance.Core.annotationManager.deleteAnnotations(annots);
        await instance.Core.annotationManager.importAnnotations(xfdfContent);
        await overrideAnnotations(instance);
    }
}

async function overrideAnnotations(instance: WebViewerInstance) {
    let {Core} = instance
    let {annotationManager} = Core
    annotationManager.getAnnotationsList().forEach((annot) => {
        // @ts-ignore
        if (annot["Font"] !== undefined) {
            // @ts-ignore
            annot["Font"] = "Arial"
        }
        annotationManager.updateAnnotation(annot)
    })
}

function createAuthorNameMapper(inputData: InputData): (userId: string) => string {
    return (userId) => {
        // We use the annotation subject for saving the author's annotation index, so we can take it from there.
        const annotationIndex = userId;
        const annotatorName = findAnnotatorName(annotationIndex, inputData);
        return annotatorName === undefined ? annotationIndex : `${annotatorName} (${annotationIndex})`;
    };
}

function findAnnotatorName(annotationIndex: string, inputData: InputData): string | undefined {
    if (annotationIndex === inputData.annotationIndexData.index) {
        // Annotation is by current author.
        return inputData.annotationIndexData.bearbeiter;
    } else {
        // Annotation is not by current author.
        return inputData.annotators[annotationIndex]?.name;
    }
}

function adjustSubjectForNewAnnotations(instance: WebViewerInstance, annoIndex: string) {
    instance.Core.annotationManager.addEventListener('annotationChanged', (annotations: Core.Annotations.Annotation[], action, options) => {
        if (action === 'add' && !options.imported) {
            for (const annotation of annotations) {
                annotation.Subject = annoIndex;
            }
        }
    });
}