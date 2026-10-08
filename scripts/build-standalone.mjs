import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const output = path.join(root, 'standalone', 'index.html');
const mimeTypes = { '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml' };
function dataUrl(file) {
  const mime = mimeTypes[path.extname(file)];
  if (!mime) throw new Error('Unsupported embedded asset: ' + file);
  return 'data:' + mime + ';base64,' + fs.readFileSync(file).toString('base64');
}
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
html = html.replace(/<link[^>]+href="([^"]+\.css)"[^>]*>/g, (_, href) => {
  const cssFile = path.join(dist, href.replace(/^\//, ''));
  let css = fs.readFileSync(cssFile, 'utf8');
  css = css.replace(/url\(([^)]+)\)/g, (original, raw) => {
    const url = raw.replace(/^["']|["']$/g, '');
    if (/^(data:|https?:|#)/.test(url)) return original;
    const asset = url.startsWith('/')
      ? path.join(dist, url.slice(1))
      : path.resolve(path.dirname(cssFile), url);
    return 'url("' + dataUrl(asset) + '")';
  });
  return '<style>' + css + '</style>';
});
html = html.replace(/<script[^>]+src="([^"]+\.js)"[^>]*><\/script>/g, (_, src) => {
  const js = fs.readFileSync(path.join(dist, src.replace(/^\//, '')), 'utf8');
  return '<script type="module">' + js.replace(/<\/script/gi, '<\\/script') + '</script>';
});
html = html.replace(
  'href="/favicon.svg"',
  'href="' + dataUrl(path.join(dist, 'favicon.svg')) + '"',
);
const packages = [
  '@fontsource-variable/dm-sans',
  '@fontsource/libre-caslon-display',
  'react',
  'react-dom',
  'lucide-react',
  'three',
];
const licenses = packages.map(
  (name) => name + '\n' + fs.readFileSync(path.join(root, 'node_modules', name, 'LICENSE'), 'utf8'),
);
html += '\n<!-- Bundled asset licenses\n' + licenses.join('\n\n').replaceAll('--', '—') + '\n-->\n';
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html);
console.log('Created standalone/index.html (' + Buffer.byteLength(html) + ' bytes).');
