import express from "express";
import cors from "cors";
import { writeFile, readFile } from "fs/promises";
import { mkdtemp } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const execAsync = promisify(exec);

app.post("/compile", async (req, res) => {
  const source = req.body?.source;
  if (!source) {
    return res.status(400).send("No source given");
  }

  try {
    const dir = await mkdtemp(join(tmpdir(), "latex-"));
    const texPath = join(dir, "main.tex");
    const pdfPath = join(dir, "main.pdf");

    await writeFile(texPath, source, "utf8");

    await execAsync(
      `tectonic ${texPath} --outdir ${dir} --synctex --keep-intermediates`
    );

    const pdfBuffer = await readFile(pdfPath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="output.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error while compiling LaTeX");
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`LaTeX backend listening on http://localhost:${PORT}`);
});
