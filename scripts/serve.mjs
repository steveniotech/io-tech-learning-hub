// Dependency-free preview. Only this site's public assets are served.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const base = '/io-tech-learning-hub/';
const assets = new Map([
  ['index.html','text/html; charset=utf-8'],['styles.css','text/css; charset=utf-8'],
  ['courses.js','text/javascript; charset=utf-8'],['app.js','text/javascript; charset=utf-8'],
  ['assets/io-tech-center-logo.png','image/png']
]);
export function handler(request,response) {
  const reply = (status,body,headers={}) => {response.writeHead(status,{'Content-Type':'text/plain; charset=utf-8','X-Content-Type-Options':'nosniff','X-Learning-Hub-Preview':'static-header-v4','Cache-Control':'no-store',...headers});response.end(request.method==='HEAD'?undefined:body);};
  if (!['GET','HEAD'].includes(request.method)) return reply(405,'Method not allowed',{'Allow':'GET, HEAD'});
  const pathname = request.url.split('?')[0];
  if (pathname === '/') return reply(302,'',{'Location':base});
  if (pathname === base.slice(0,-1)) return reply(302,'',{'Location':base});
  if (!pathname.startsWith(base)) return reply(404,'Not found');
  const file = pathname.slice(base.length) || 'index.html';
  if (!assets.has(file)) return reply(404,'Not found');
  try {
    const filename = path.join(root,file);
    if (!fs.lstatSync(filename).isFile() || fs.lstatSync(filename).isSymbolicLink()) return reply(404,'Not found');
    const content = fs.readFileSync(filename);
    reply(200,content,{'Content-Type':assets.get(file),'Content-Length':content.length});
  } catch { reply(500,'Preview asset unavailable'); }
}
export const createPreviewServer = () => http.createServer(handler);

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const port = args.length===0?8765:args.length===2&&args[0]==='--port'?Number(args[1]):NaN;
  if (!Number.isInteger(port)||port<1024||port>65535) {console.error('Usage: node scripts/serve.mjs [--port 8765]');process.exitCode=1;}
  else {
    const server = createPreviewServer();
    server.on('error',error => {
      console.error(error.code==='EADDRINUSE'?'Port is already in use. Leave that service running and choose a different --port.':'Cannot bind the local preview server: '+error.code);
      process.exitCode=1;
    });
    server.listen(port,'127.0.0.1',() => console.log('Preview static-header-v4: http://127.0.0.1:'+port+base+' (Control+C to stop)'));
  }
}
