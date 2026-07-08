const fs = require("fs");
const SVG = "public/logo/esgen_wordmark.svg";
const OUT = "src/components/logo/wordmarkPaths.ts";
const s = fs.readFileSync(SVG, "utf8");
const paths = s.match(/<path\b[^>]*>/g) || [];
const map = {};
paths.forEach((p) => {
  const id = (p.match(/id="([^"]+)"/) || [])[1];
  const d = (p.match(/\bd="([^"]+)"/) || [])[1];
  if (id && d) map[id] = d;
});
const ids = ["e1", "s", "g", "e2", "n"];
if (ids.some((i) => !map[i])) {
  console.error("MISSING paths; found:", Object.keys(map));
  process.exit(1);
}
function acc(d, b) {
  const toks = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, cmd = "";
  const num = () => parseFloat(toks[i++]);
  const up = (x, y) => {
    if (x < b.minx) b.minx = x;
    if (y < b.miny) b.miny = y;
    if (x > b.maxx) b.maxx = x;
    if (y > b.maxy) b.maxy = y;
  };
  while (i < toks.length) {
    const t = toks[i];
    if (/[a-zA-Z]/.test(t)) { cmd = t; i++; }
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    if (C === "M" || C === "L" || C === "T") {
      let x = num(), y = num(); if (rel) { x += cx; y += cy; } cx = x; cy = y; if (C === "M") { sx = cx; sy = cy; } up(cx, cy);
    } else if (C === "H") { let x = num(); if (rel) x += cx; cx = x; up(cx, cy); }
    else if (C === "V") { let y = num(); if (rel) y += cy; cy = y; up(cx, cy); }
    else if (C === "C") { let x1 = num(), y1 = num(), x2 = num(), y2 = num(), x = num(), y = num(); if (rel) { x1 += cx; y1 += cy; x2 += cx; y2 += cy; x += cx; y += cy; } up(x1, y1); up(x2, y2); cx = x; cy = y; up(cx, cy); }
    else if (C === "S" || C === "Q") { let x1 = num(), y1 = num(), x = num(), y = num(); if (rel) { x1 += cx; y1 += cy; x += cx; y += cy; } up(x1, y1); cx = x; cy = y; up(cx, cy); }
    else if (C === "A") { num(); num(); num(); num(); num(); let x = num(), y = num(); if (rel) { x += cx; y += cy; } cx = x; cy = y; up(cx, cy); }
    else if (C === "Z") { cx = sx; cy = sy; } else { i++; }
  }
}
const b = { minx: 1e9, miny: 1e9, maxx: -1e9, maxy: -1e9 };
ids.forEach((id) => acc(map[id], b));
const pad = 0.5;
const minx = b.minx - pad, miny = b.miny - pad, w = b.maxx - b.minx + pad * 2, h = b.maxy - b.miny + pad * 2;
const r = (n) => Math.round(n * 100) / 100;
const vb = [minx, miny, w, h].map(r).join(" ");
let ts = "// Auto-generated from public/logo/esgen_wordmark.svg via scripts/gen-paths.js.\n";
ts += "// WORDMARK_VIEWBOX is a TIGHT box computed from the real path geometry, so the\n";
ts += "// source asset dead padding does not squash or shrink the rendered mark.\n";
ts += "export const WORDMARK_VIEWBOX = " + JSON.stringify(vb) + ";\n\n";
ts += "export const LETTER_PATHS = {\n";
ids.forEach((id) => { ts += "  " + id + ": " + JSON.stringify(map[id]) + ",\n"; });
ts += "} as const;\n";
fs.writeFileSync(OUT, ts);
console.log("declared viewBox:", (s.match(/viewBox="([^"]+)"/) || [])[1]);
console.log("computed TIGHT viewBox:", vb, "| aspect:", (w / h).toFixed(2));
