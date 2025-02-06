import {BackendConfig} from "../model/Config";
import {MockBackend} from "./MockBackend";
import {RealBackend} from "./RealBackend";
import {DMSBackend} from "./DMSBackend";
import {AnnotationIndexData} from "../model/AnnotationIndexData";

// Defines the methods used by this app to determine the input for the Prüfspuren editor and save annotations.
export interface Backend {
    // Must return all required input data for the given token. Called only once when loading the app.
    obtainInputData: (token: string) => Promise<InputData>
    // Should do something useful with the given annotations. Called when pressing the save button.
    saveXfdf: (token: string, xfdfContent: string) => Promise<void>
}

// Represents the data necessary for displaying the Prüfspuren editor.
export interface InputData {
    // PDF/XOD Document to be displayed
    documentUri: string
    // Type of the document
    documentType: 'xod' | 'pdf'
    // Annotations encoded in XFDF format. Will be undefined when no annotations have been saved yet.
    xfdfContent?: string
    // Current annotation index representing the user sitting in front of the screen.
    annotationIndexData: AnnotationIndexData
    // Map of annotators. Key is the annotation index.
    annotators: { [index: string]: Annotator }
}

// Author which has already contributed annotations to this document.
export interface Annotator {
    name: string
}

// Creates the correct backend depending on the given runtime configuration.
export function createBackend(config: BackendConfig): Backend {
    console.debug(config.type)
    switch (config.type) {
        case 'mock':
            return new MockBackend(config);
        case 'real':
            return new RealBackend(config);
        case 'dms':
            return new DMSBackend(config);
        default:
            throw Error('Unknown backend type');
    }
}