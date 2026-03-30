import { writeFileSync } from "fs";
import { resolve } from "path";

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=./pt-BR.html" />
  <link rel="canonical" href="./pt-BR.html" />
  <title>Redirecting...</title>
</head>
<body>
  <script>window.location.replace("./pt-BR.html");</script>
</body>
</html>`;

writeFileSync(resolve("out", "index.html"), html);
console.log("✓ Created out/index.html redirect → /pt-BR");
