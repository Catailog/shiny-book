import fs from 'node:fs';
import path from 'node:path';

const pagesDir = 'figma_data/pages/Page-1';
const assetsRoot = 'figma_data/assets';
const files = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.mcp.txt'));

const constRegex =
  /const\s+(\w+)\s*=\s*['"](https:\/\/www\.figma\.com\/api\/mcp\/asset\/[^'"]+)['"];/g;

let total = 0;
let ok = 0;
let failed = [];

for (const file of files) {
  const frameName = file.replace(/\.mcp\.txt$/, '');
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  const frameDir = path.join(assetsRoot, frameName);
  const matches = [...content.matchAll(constRegex)];
  if (matches.length === 0) continue;
  fs.mkdirSync(frameDir, { recursive: true });

  for (const [, varName, url] of matches) {
    total++;
    const ext = path.extname(new URL(url).pathname) || '.bin';
    const dest = path.join(frameDir, `${varName}${ext}`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      ok++;
    } catch (err) {
      failed.push(`${frameName}/${varName}: ${err.message}`);
    }
  }
  console.log(`${frameName}: ${matches.length} assets`);
}

console.log(`\nTotal: ${total}, OK: ${ok}, Failed: ${failed.length}`);
if (failed.length) {
  console.log('Failures:');
  for (const f of failed) console.log('  ' + f);
}
