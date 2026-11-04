// Checks the actual homepage img src through both routing code and a live server.
// No browser state, credentials, remote services, or external packages are used.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {handler,base} from './serve.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function logoSpec(pageUrl='http://127.0.0.1:8765'+base) {
  const page=new URL(pageUrl);
  if(page.protocol!=='http:'||page.hostname!=='127.0.0.1'||page.pathname!==base||page.username||page.password||page.search||page.hash)throw Error('Use the loopback HTTP preview URL with the project path.');
  const html=fs.readFileSync(path.join(root,'index.html'));
  const image=html.toString('utf8').match(/<img\b[^>]*\bclass="[^"]*\bbrand-logo\b[^"]*"[^>]*>/)?.[0];
  const src=image?.match(/\bsrc="([^"]+)"/)?.[1];
  assert.ok(src?.startsWith('./assets/'),'Logo must use a local relative assets URL');
  const url=new URL(src,page);
  assert.equal(url.origin,page.origin);assert.ok(url.pathname.startsWith(base+'assets/'));
  assert.ok(!url.search&&!url.hash,'Logo filename must be unambiguous');
  const filename=url.pathname.slice(base.length);
  assert.ok(!filename.includes('..')&&!filename.includes('%'));
  const bytes=fs.readFileSync(path.join(root,filename));
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a','PNG signature');
  return {page,url,html,bytes};
}
function checkResponse(status,headers,body,spec) {
  assert.equal(status,200,'Logo HTTP status must be 200');
  assert.match(headers['content-type']||'',/^image\/png(?:;|$)/i,'Logo Content-Type');
  assert.equal(body.subarray(0,8).toString('hex'),'89504e470d0a1a0a','Response must contain PNG bytes');
  assert.deepEqual(body,spec.bytes,'Response must be the complete real logo, not HTML or Not found');
}
export function checkLogoRoute(spec=logoSpec()) {
  let status,headers,body;
  handler({method:'GET',url:spec.url.pathname},{writeHead(code,values){status=code;headers=Object.fromEntries(Object.entries(values).map(([k,v])=>[k.toLowerCase(),v]));},end(value){body=Buffer.from(value);}});
  checkResponse(status,headers,body,spec);
  return {path:spec.url.pathname,status,type:headers['content-type'],bytes:body.length};
}
export async function checkLivePreview(spec=logoSpec(),fetcher=fetch) {
  const page=await fetcher(spec.page,{redirect:'error',signal:AbortSignal.timeout(5000)});
  assert.equal(page.status,200,'Homepage status');
  assert.deepEqual(Buffer.from(await page.arrayBuffer()),spec.html,'Live homepage must match current index.html');
  const image=await fetcher(spec.url,{redirect:'error',signal:AbortSignal.timeout(5000)});
  const body=Buffer.from(await image.arrayBuffer());
  const result={url:spec.url.href,status:image.status,type:image.headers.get('content-type'),bytes:body.length};
  // Include the real failure in diagnostics before validating it.
  if(image.status!==200||!result.type?.startsWith('image/'))throw Error('Live logo response: '+JSON.stringify({...result,body:body.toString('utf8').slice(0,100)}));
  checkResponse(image.status,Object.fromEntries(image.headers),body,spec);
  return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const args=process.argv.slice(2);
    if(args.length>1)throw Error('Usage: node scripts/check-preview.mjs [http://127.0.0.1:8765/io-tech-learning-hub/]');
    const spec=logoSpec(args[0]);
    console.log('PASS in-process routing (not live HTTP): '+JSON.stringify(checkLogoRoute(spec)));
    console.log('PASS actual HTTP: '+JSON.stringify(await checkLivePreview(spec)));
    console.log('Browser decoding and desktop/mobile appearance still require browser verification.');
  } catch(error) {
    console.error('LIVE VERIFICATION NOT PASSED: '+(error.cause?.code||error.message));
    process.exitCode=1;
  }
}
