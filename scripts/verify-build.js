import { existsSync } from 'node:fs';

if (!existsSync('dist/index.html')) {
  console.error('Missing dist/index.html. The ZIP must include the prebuilt dist folder.');
  process.exit(1);
}

console.log('Prebuilt dist folder found. No Vite build required on Render.');
