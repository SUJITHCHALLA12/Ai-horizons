// Build step for Vercel: the project is a static site served from the
// repository root (see server.js for local dev), but the Vercel project
// expects an output directory named "public". Copy the static files
// into public/ so the deployment has that directory after the build.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, 'public');

const files = [
  'index.html',
  '404.html',
  'firebase-auth.js',
  'firebase-config.js',
  'firebase-database.js',
];

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const file of files) {
  const src = path.join(root, file);
  if (!fs.existsSync(src)) {
    throw new Error(`Build failed: missing static file ${file}`);
  }
  fs.copyFileSync(src, path.join(outDir, file));
}

console.log(`Build completed: copied ${files.length} files to public/`);
