import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// A raiz não passa pelo layout do Next: a prévia do link (og:*) do endereço curto sai daqui
const SITE_URL = "https://erikeliasv.github.io/portfolio";
const { Metadata } = JSON.parse(readFileSync(resolve("messages", "pt-BR.json"), "utf8"));
const attr = (text) => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=./pt-BR" />
  <link rel="canonical" href="./pt-BR" />
  <title>${attr(Metadata.title)}</title>
  <meta name="description" content="${attr(Metadata.description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Erik Elias" />
  <meta property="og:locale" content="pt_BR" />
  <meta property="og:title" content="${attr(Metadata.title)}" />
  <meta property="og:description" content="${attr(Metadata.description)}" />
  <meta property="og:image" content="${SITE_URL}/og/pt-BR.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
</head>
<body>
  <script>window.location.replace("./pt-BR");</script>
</body>
</html>`;

writeFileSync(resolve("out", "index.html"), html);
console.log("✓ Created out/index.html redirect → /pt-BR");
