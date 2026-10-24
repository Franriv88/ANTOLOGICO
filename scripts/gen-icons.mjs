import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'fs';
import { join } from 'path';

const OUT = join(import.meta.dirname, '..', 'apps', 'web-tenant', 'public');

function iconSVG(size, { bg, edgeColor, edgeOpacity, nodes }) {
  const rx = Math.round(size * 8 / 48);
  const sw = (size * 1.8 / 48).toFixed(2);
  const s = (v) => (v * size / 48).toFixed(2);
  const edges = [[13,9,31,18],[13,9,10,31],[31,18,30,39],[10,31,30,39]];
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${rx}" fill="${bg}"/>
  <g stroke="${edgeColor}" stroke-width="${sw}" stroke-linecap="round" fill="none" opacity="${edgeOpacity}">
    ${edges.map(([x1,y1,x2,y2]) => `<line x1="${s(x1)}" y1="${s(y1)}" x2="${s(x2)}" y2="${s(y2)}"/>`).join('\n    ')}
  </g>
  ${nodes.map(([cx,cy,r,fill]) => `<circle cx="${s(cx)}" cy="${s(cy)}" r="${s(r)}" fill="${fill}"/>`).join('\n  ')}
</svg>`;
}

function maskableSVG(size, { bg, edgeColor, edgeOpacity, nodes }) {
  const pad = size * 0.1;
  const inner = size * 0.8;
  const sw = (inner * 1.8 / 48).toFixed(2);
  const s = (v) => (pad + v * inner / 48).toFixed(2);
  const edges = [[13,9,31,18],[13,9,10,31],[31,18,30,39],[10,31,30,39]];
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${bg}"/>
  <g stroke="${edgeColor}" stroke-width="${sw}" stroke-linecap="round" fill="none" opacity="${edgeOpacity}">
    ${edges.map(([x1,y1,x2,y2]) => `<line x1="${s(x1)}" y1="${s(y1)}" x2="${s(x2)}" y2="${s(y2)}"/>`).join('\n    ')}
  </g>
  ${nodes.map(([cx,cy,r,fill]) => `<circle cx="${s(cx)}" cy="${s(cy)}" r="${s(r)}" fill="${fill}"/>`).join('\n  ')}
</svg>`;
}

const DARK_BG = {
  bg: '#E85D4A', edgeColor: 'rgba(250,247,242,0.55)', edgeOpacity: 1,
  nodes: [[13,9,7,'#FAF7F2'],[31,18,9,'#B98527'],[10,31,7,'#FAF7F2'],[30,39,5,'#FAF7F2']],
};
const MASKABLE = {
  bg: '#E85D4A', edgeColor: 'rgba(250,247,242,0.55)', edgeOpacity: 1,
  nodes: [[13,9,7,'#FAF7F2'],[31,18,9,'#B98527'],[10,31,7,'#FAF7F2'],[30,39,5,'#FAF7F2']],
};
const LIGHT_BG = {
  bg: '#FBF8F2', edgeColor: '#A88C74', edgeOpacity: 0.65,
  nodes: [[13,9,7,'#E85D4A'],[31,18,9,'#B98527'],[10,31,7,'#E85D4A'],[30,39,5,'#E85D4A']],
};
const DARK_MODE = {
  bg: '#1A1611', edgeColor: '#A8907E', edgeOpacity: 0.65,
  nodes: [[13,9,7,'#EF7563'],[31,18,9,'#D49E3A'],[10,31,7,'#EF7563'],[30,39,5,'#EF7563']],
};

function svgToPng(svg) {
  return new Resvg(svg).render().asPng();
}

const files = [
  { name: 'icon-192.png',          svg: iconSVG(192, DARK_BG) },
  { name: 'icon-512.png',          svg: iconSVG(512, DARK_BG) },
  { name: 'apple-touch-icon.png',  svg: iconSVG(180, DARK_BG) },
  { name: 'icon-maskable-192.png', svg: maskableSVG(192, MASKABLE) },
  { name: 'icon-maskable-512.png', svg: maskableSVG(512, MASKABLE) },
  { name: 'icon-light-192.png',    svg: iconSVG(192, LIGHT_BG) },
  { name: 'icon-light-512.png',    svg: iconSVG(512, LIGHT_BG) },
  { name: 'icon-dark-192.png',     svg: iconSVG(192, DARK_MODE) },
  { name: 'icon-dark-512.png',     svg: iconSVG(512, DARK_MODE) },
];

for (const { name, svg } of files) {
  const png = svgToPng(svg);
  const path = join(OUT, name);
  writeFileSync(path, png);
  console.log(`  ${name} (${png.length} bytes)`);
}

console.log(`\n${files.length} icons → ${OUT}`);
