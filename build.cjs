// Genera public/index.html a partir de state.json (solo para regenerar; el deploy no lo necesita)
const fs = require("fs");
const path = require("path");
const css = fs.readFileSync(path.join(__dirname, "style.css"), "utf8");
const state = JSON.parse(fs.readFileSync(path.join(__dirname, "state.json"), "utf8"));
const PIL = {1:"Pilar 1 — El mito de “Hacienda no se entera”",2:"Pilar 2 — Lo que no te cuenta quien te vende la empresa",3:"Pilar 3 — Para quien juega en otro nivel",4:"Pilar 4 — Por qué nosotros"};
const esc = s => String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const nl = s => esc(s).replace(/\n/g,"<br>");
let cards = "", last = null;
state.reels.forEach((r,i)=>{
  if (r.pilar!==last){ cards += `<h2 class="pilar">${esc(PIL[r.pilar])}</h2>`; last=r.pilar; }
  cards += `<article class="card" data-i="${i}"><div class="code">Reel ${String(i+1).padStart(2,"0")}${r.tag?" · "+esc(r.tag):""}</div>
<h3 class="f" data-k="titulo" contenteditable="true">${nl(r.titulo)}</h3>
<div class="who f" data-k="quien" contenteditable="true">${nl(r.quien)}</div>
<div class="hook"><small>Hook · texto en pantalla</small><div class="h1 f" data-k="hook1" contenteditable="true">${nl(r.hook1)}</div><div class="h2 f" data-k="hook2" contenteditable="true">${nl(r.hook2)}</div></div>
<div class="beat"><b>Validación</b><div class="f" data-k="validacion" contenteditable="true">${nl(r.validacion)}</div></div>
<div class="beat"><b>Giro</b><div class="f" data-k="giro" contenteditable="true">${nl(r.giro)}</div></div>
<div class="beat cierre"><b>Cierre</b><div class="f" data-k="cierre" contenteditable="true">${nl(r.cierre)}</div></div>
</article>\n`;
});
const runtime = fs.readFileSync(path.join(__dirname, "runtime.js"), "utf8");
const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Guiones Reels Altamira Legal</title>
<style>${css}</style>
</head>
<body>
<header class="bar"><div class="bar-in"><div class="t">Altamira Legal · Guiones de reels</div><button id="save" type="button">Guardar cambios</button><span id="status" class="status"></span></div></header>
<main class="page">
<h1 class="f" data-k="titulo" data-root="1" contenteditable="true">${nl(state.titulo)}</h1>
<p class="sub f" data-k="sub" data-root="1" contenteditable="true">${nl(state.sub)}</p>
<p class="hint" id="hint">Tocá cualquier texto para editarlo y pulsá “Guardar cambios”. Los cambios se guardan en el servidor y los ve todo el que abra esta página, desde cualquier dispositivo.</p>
<div id="cards">
${cards}</div>
</main>
<script>${runtime}</script>
</body>
</html>
`;
fs.mkdirSync(path.join(__dirname,"public"),{recursive:true});
fs.writeFileSync(path.join(__dirname,"public/index.html"), html);
console.log("ok", html.length);
