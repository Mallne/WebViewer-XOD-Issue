# Prüfspuren App

> JavaScript (TypeScript) single-page application for annotating documents with so-called "Prüfspuren".

## TODO

Annotations of rotated documents in the `xod` filetype get shifted around. See the [issue](src/issue.md). For an example
start the Dev server using `npm run dev` and
open [this](http://localhost:5173/o/pruefspuren-frontend/?token=test-quer;xod). Notice that
the [PDF Variant](http://localhost:5173/o/pruefspuren-frontend/?token=test-quer;pdf) does not have this problem

## Usage

The resulting application bundle (`build` directory) is supposed to be embedded into
[pruefspuren-frontend](https://gitlab.tab.lan/ecohesion/liferay-portal/-/tree/master/pruefspuren-frontend) and deployed
to the Liferay Portal. But fortunately, it can also be run standalone for testing purposes.

### Run the app

Execute the following on the command line:

```sh
npm run dev
```

After that, point your browser to: http://localhost:5173/o/pruefspuren-frontend/?token=dummy

You will see a test PDF document with an existing annotation by Pittiplatsch. You can draw your own annotations.
Whenever you press the save button (floppy disk icon), all annotations will be logged to the browser console in
XFDF format (the same data that would be sent to the backend in a real-world scenario).

Read more about the possible configurations and testing approaches in the next section.

### Configuration

Prüfspuren App queries its configuration at runtime by requesting a file name `config.json`. A default config file is
provided, but you can and should replace it with your own one in production.

The basic structure of this file looks like this:

```json
{
  "backend": {
    "type": "..."
  }
}
```

The `type` property of the `backend` object decides which type of backend the application will use.

*Important:* By "backend" we don't mean the portal backend! We are talking about the backend from the perspective of
this single-page application. In production, this is usually the `/o/pruefspuren-proxy` servlet deployed in Liferay
(which is a part of
[pruefspuren-frontend](https://gitlab.tab.lan/ecohesion/liferay-portal/-/tree/master/pruefspuren-frontend)).

#### Mock backend (without server)

If `type` is `mock`, the app will work standalone and not query any backend. All the necessary input data (which
document to display etc.) is provided as part of the config in property `mockInputData`. This is the default and
well-suited for local development. Have a look into [public/config.json](public/config.json) to see a complete and
up-to-date example.

Here's a description of what each property means. *Attention:* This is not valid JSON because it contains comments.

```json5
{
  "backend": {
    "type": "mock",
    "mockInputData": {
      // URI of the document to be displayed. By default refers to a built-in test PDF document.
      "documentUri": "test/test.pdf",
      // Type of the document. Can be "pdf" or "xod". In production this will always be "xod". The possibility
      // to use PDF files directly didn't exist in the old WebViewer. Maybe we can use it in future and thereby
      // get rid of the XOD converter service. But it also has some drawbacks: The browser has more work to do and
      // we would need to expose the PDFTron license key in order to get rid of the watermark.
      "documentType": "pdf",
      // Initial annotations in XFDF format (`null` or missing if no annotations yet).
      "xfdfContent": null,
      // Annotation index data representing the currently editing author. 
      "annotationIndexData": {
        // String that contains a number (normal mode) or a letter (revision mode).
        "index": "2",
        // Name of the corresponding author. Portal sets this to the user login name. DFS sets this to a non-unique
        // Display name.
        "bearbeiter": "Mobbi"
      },
      // List of all authors that have contributed annotations to this document. Keys represent annotation indexes.
      "annotators": {
        "1": {
          // Author's display name. Should be equal to "bearbeiter".
          "name": "Pittiplatsch"
        },
        "2": {
          "name": "Mobbi"
        }
      }
    }
  }
}
```

#### Real backend (with server)

If `type` is `real`, the app will make HTTP requests to get the input data and save annotations. See
[src/main/resources/META-INF/resources/config.json](../resources/META-INF/resources/config.json) in
`pruefspuren-frontend` for a complete and up-to-date example.

Config file description:

```json5
{
  "backend": {
    "type": "real",
    // URI templates that represent the HTTP endpoints to which the app should send its requests.
    // The `{TOKEN}` placeholder will be replaced with the actual `token` URL query parameter.
    "serviceUriTemplates": {
      // Endpoint to add a new annotation index (POST) and query existing ones (GET).
      "annotationIndex": "/o/pruefspuren-proxy/annotationIndex?token={TOKEN}",
      // Endpoint to query the actual XOD document (it must be a XOD document, PDFs are not allowed for real backend). 
      "document": "/o/pruefspuren-proxy/viewerDokument?token={TOKEN}",
      // Endpoint to query the existing annotations (GET) and save them (POST).
      "annotations": "/o/pruefspuren-proxy/annotations?token={TOKEN}"
    }
  }
}
```

Learn more about the meaning of the service endpoints in the [README file](../../../README.md) of
`pruefspuren-frontend`.

### Proxy

The Java part of the projects provides a reverse proxy for retrieving information regarding the annotations.

| URI              | method | intention                                                                     | dms-service                          |
|------------------|--------|-------------------------------------------------------------------------------|--------------------------------------|
| /annotationIndex | GET    | get annotation indices of all users having annotated the specified document   | /dokumente/{refId}/annotationIndices |
| /annotationIndex | POST   | create or get annotation index infos for this user for the specified document | /dokumente/{refId}/annotationIndices |
| /annotations     | GET    | retrieving annotations                                                        | /dokumente/{refId}/annotations       |
| /annotations     | POST   | saving annotations                                                            | /dokumente/{refId}/annotations       |
| /viewerDokument  | GET    | get the document to work on                                                   | /dokumente/{refId}/pdf               |

## Development

### Basics

To keep complexity and refactoring at a minimum, this project uses Vite and Typescript as Dev Dependencies.

### Develop with hot-reload enabled

```sh
npm run dev
```

### Using different Configs with the Dev server

You can use different testing documents and annotations in the Dev server. To get started replace your random token with
the name of your document in the `test` directory, followed by a `;` and then the document type (`pdf` or `xod`). It
will load annotations accordingly if you provide any.

Examples:

- http://localhost:5173/o/pruefspuren-frontend/?token=test;pdf
- http://localhost:5173/o/pruefspuren-frontend/?token=test;xod
- http://localhost:5173/o/pruefspuren-frontend/?token=test1;pdf
- http://localhost:5173/o/pruefspuren-frontend/?token=test1;xod
- http://localhost:5173/o/pruefspuren-frontend/?token=test-quer;pdf
- http://localhost:5173/o/pruefspuren-frontend/?token=test-quer;xod

### Build

If you want to deploy to the URL root path, execute this:

```sh
npm run build
```