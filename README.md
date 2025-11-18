# LaTeX Backend

Simple Node.js/Express server that compiles LaTeX source code to PDF using `tectonic`, then returns the resulting PDF to the client as binary data (ideal for use as a `Blob` in a browser).

## Features

- `POST /compile` endpoint to compile LaTeX.
- Accepts LaTeX source as JSON in the request body.
- Uses `tectonic` to generate a temporary PDF file.
- Returns the PDF with appropriate `Content-Type` and `Content-Disposition` headers.
- CORS enabled for use from a separate frontend.

## Requirements

- Node.js (LTS recommended).
- npm (or another Node.js package manager).
- [`tectonic`](https://tectonic-typesetting.github.io/) installed and available in your `PATH`.

Example installation of `tectonic` on macOS with Homebrew:

```bash
brew install tectonic
```

You can verify it is installed with:

```bash
tectonic --version
```

## Installation

Clone the repository and install dependencies:

```bash
git clone <REPOSITORY_URL>
cd latex-backend
npm install
```

## Running the Server

Development mode (with `nodemon` hot reload):

```bash
npm run dev
```

By default the server listens on:

```text
http://localhost:4000
```

## API

### `POST /compile`

Compile LaTeX source and return a PDF.

- **URL**: `http://localhost:4000/compile`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Request body**:

```json
{
  "source": "\\\\documentclass{article}\\n\\\\begin{document}\\nHello LaTeX!\\n\\\\end{document}"
}
```

- **Responses**:
  - `200 OK`: PDF binary in the response body.
    - `Content-Type: application/pdf`
    - `Content-Disposition: inline; filename="output.pdf"`
  - `400 Bad Request`: if the `source` field is missing.
  - `500 Internal Server Error`: if an error occurs during compilation.

## Example Frontend Usage (Blob)

Minimal example in browser JavaScript to request a PDF and open it in a new tab:

```js
const source = `
\\documentclass{article}
\\begin{document}
Hello LaTeX!
\\end{document}
`;

fetch("http://localhost:4000/compile", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ source }),
})
  .then((res) => res.blob())
  .then((blob) => {
    const url = URL.createObjectURL(blob);
    window.open(url); // open PDF in a new tab
  })
  .catch(console.error);
```

## Notes

- Temporary files are created in the system temp directory using `mkdtemp`.
- Make sure `tectonic` runs correctly in the same environment as Node.js.

