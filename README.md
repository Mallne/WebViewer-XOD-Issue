# Apryse WebViewer XOD Issue

> [GitHub](https://github.com/ApryseSDK/webviewer-ui/issues/1087)

Documents with rotated pages or alternating page sizes and orientations that get loaded as a XOD document have shifted
Annotations. Creating new Annotations works just fine, but after the document is reopened, the Circle and Polyline
annotations are shifted to a different position. If the document is a PDF, not a XOD, this is fixed. The sizing box of
the annotations remain in the correct position. If the "moved" annotations get saved and the document gets merged with
the annotations in the Backend using:

```
fdfDoc = FDFDoc.createFromXFDF(IOUtils.toString(annotations, StandardCharsets.UTF_8));
pdfDoc = this.openDocument(document);
pdfDoc.flattenAnnotations(false);
pdfDoc.fdfMerge(fdfDoc);
```

the before "moved" annotations are now in the correct place again.

## Example

To get started use the Vite Dev Server (`npm run dev`). The configuration is minimal, to ensure the XFDF annotations get
loaded and the Author is correctly displayed. When the Dev Server is running you can
open [the Application](http://localhost:5173/) in your
Browser. It will automatically load the Document provided in `test/test-quer.[pdf,xod]` and the annotations (
`test/test-quer.xfdf`) if you want to check the PDF version where the issue does not occur, simply use the query
parameter `type=pdf` like [here](http://localhost:5173/?type=pdf).

To log the exported annotations use the save button. It will log the response that would be sent to a service in the
console.