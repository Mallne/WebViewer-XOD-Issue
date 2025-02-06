// Data that represents one annotation author.
export interface AnnotationIndexData {
    // String that contains a number (normal mode) or a letter (revision mode).
    index: string
    // Some more user-friendly display name.
    bearbeiter: string
}