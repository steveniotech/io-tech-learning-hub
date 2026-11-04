import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {createPreviewServer,handler,base} from '../scripts/serve.mjs';
import {logoSpec,checkLogoRoute,checkLivePreview} from '../scripts/check-preview.mjs';
const require=createRequire(import.meta.url),courses=require('../courses.js');
const {renderCourses}=require('../app.js');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');

// Independent acceptance fixture preserves every original path and fragment.
const expected=[
 ['Express Concepts Review','Coding','https://steveniotech.github.io/express-concepts-review/'],
 ['Python Steps Lab','Python','https://steveniotech.github.io/python-steps-lab/index.html'],
 ['Reading Steps','Reading','https://steveniotech.github.io/reading-steps/'],
 ['Builder Island','3D Design','https://steveniotech.github.io/builder-island/'],
 ['mBot Robotics','Robotics','https://iotechcentermbotpractice.netlify.app/#level-3'],
 ['Snap Circuits','Circuits','https://iocentersnapcircuitspractice.netlify.app/#learn'],
 ['Terminal Steps Lab','Computer Skills','https://steveniotech.github.io/terminal-steps-lab/']
];
assert.equal(courses.length,7);assert.equal(new Set(courses.map(c=>c.id)).size,7);
assert.deepEqual([...courses].sort((a,b)=>a.order-b.order).map(c=>[c.name,c.category,c.url]),expected);
console.log('PASS: exactly 7 unique courses; names, categories and complete URLs match the supplied list.');
const expectedCopy=[['Review coding ideas with short practice activities.', 'Start Learning'], ['Write Python code and build your skills, one step at a time.', 'Start Coding'], ['Practice reading and understanding what you read.', 'Start Reading'], ['Explore shapes and practice your 3D design skills.', 'Start Building'], ['Practice coding for your mBot robot.', 'Explore Robots'], ['Explore circuits and practice your electronics skills.', 'Explore Circuits'], ['Learn to use the terminal, one command at a time.', 'Try the Terminal']];
assert.deepEqual(courses.map(c=>[c.description,c.button]),expectedCopy);

class Element {
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.textContent='';this.hidden=true;}
 append(...items){this.children.push(...items);}
 setAttribute(key,value){this.attributes[key]=value;}
 replaceChildren(fragment){this.children=fragment.children;}
 get lastChild(){return this.children.at(-1);}
}
const elements=new Map(['course-grid','course-count','course-error','contact-info'].map(id=>[id,new Element('div')]));
const document={createElement:tag=>new Element(tag),createElementNS:(_,tag)=>new Element(tag),createDocumentFragment:()=>new Element('fragment'),getElementById:id=>elements.get(id)};
renderCourses(document,[...courses].reverse());
let grid=elements.get('course-grid');assert.equal(grid.children.length,7);
for(const [index,item] of grid.children.entries()){
 const card=item.children[0],link=card.children.at(-1);
 assert.equal(card.dataset.course,courses[index].id);assert.equal(link.tagName,'a');
 assert.equal(link.attributes.href,expected[index][2]);assert.equal(link.attributes.target,undefined);
 assert.equal(link.attributes['aria-label'],courses[index].button+': '+expected[index][0]);
 assert.equal(link.children[0].textContent,courses[index].button);
 assert.equal(card.children[2].textContent,expected[index][0]);
}
renderCourses(document,courses);assert.equal(grid.children.length,7,'Rerender must not duplicate cards');
assert.throws(()=>renderCourses(document,[{...courses[0],url:'javascript:alert(1)'}]));
assert.throws(()=>renderCourses(document,[courses[0],courses[0]]));
const startup=vm.createContext({document,LearningCourses:courses,URL});
vm.runInContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),startup);
assert.equal(grid.children.length,7);assert.equal(elements.get('course-error').hidden,true);
vm.runInNewContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),{document,URL});
assert.equal(elements.get('course-error').hidden,false,'Missing configuration gives a visible error');
console.log('PASS: shipped rendering, sorting, same-tab accessible anchors, duplicate prevention and invalid-catalog handling.');

const textAssets=['index.html','styles.css','courses.js','app.js'];
const assets=[...textAssets,'assets/io-tech-center-logo.png'];
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,ref] of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
 if(ref.startsWith('tel:')||ref.startsWith('https:'))continue;
 assert.ok(ref.startsWith('./'),'Local asset must be relative: '+ref);
 assert.ok(fs.existsSync(path.join(root,ref)),'Missing local asset: '+ref);
 assert.equal(new URL(ref,'https://example.test/io-tech-learning-hub/').pathname,'/io-tech-learning-hub/'+ref.slice(2));
}
for(const file of textAssets){
 const text=fs.readFileSync(path.join(root,file),'utf8');
 assert.ok(!/[\u3400-\u9fff\uf900-\ufaff]/u.test(text),file+' interface is English only');
 assert.ok(!/\b(?:TODO|TBD|lorem ipsum|placeholder)\b/i.test(text),file+' no placeholder copy');
 assert.ok(!/localStorage|sessionStorage|document\.cookie|\bfetch\s*\(|XMLHttpRequest|sendBeacon|iframe|@import|@font-face|https?:\/\/(?:[^\s'"]+\.)?(?:google-analytics|googletagmanager)/i.test(text),file+' no storage, remote APIs, tracking, iframe or fonts');
 assert.ok(!/\/Users\/|[A-Z]:\\Users\\|sb_(?:secret|publishable)_|service_role|eyJ[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]+|password\s*[:=]\s*['"][^'"]+/i.test(text),file+' no private paths or credentials');
}
const header=html.match(/<header class="site-header">([\s\S]*?)<\/header>/)[1];
assert.ok(header.includes('Visit Us')&&header.includes('1647 Bath Ave')&&header.includes('Brooklyn, NY 11214'));
assert.ok(header.includes('href="tel:+17183745518">(718) 374-5518</a>'));
assert.ok(!/Contact details are not available|site-config|Website/.test(html));
assert.ok(!/renderContact|LearningCenter/.test(fs.readFileSync(path.join(root,'app.js'),'utf8')));
const maps=new URL(header.match(/class="directions-link" href="([^"]+)"/)[1].replaceAll('&amp;','&'));
assert.equal(maps.origin,'https://www.google.com');assert.equal(maps.pathname,'/maps/search/');
assert.deepEqual([...maps.searchParams],[['api','1'],['query','1647 Bath Ave, Brooklyn, NY 11214']]);
assert.ok(!header.includes('target='));
console.log('PASS: contact details are static HTML, independent of JavaScript; exact telephone and clean Maps links; no Website button.');
assert.ok(html.includes('<html lang="en">')&&html.includes('class="skip-link"'));
assert.ok(html.includes('What will you <span>explore today?</span>'));
assert.ok(html.includes('Pick a course. Try something new. Learn at your own pace.'));
assert.ok(html.includes('Keep exploring. Every small step helps you learn.'));
assert.ok(html.includes('<title>io Tech Learning Hub</title>'));
assert.ok(html.includes('alt="io Tech Learning Center — Explore. Create. Grow."'));
assert.ok(html.includes('width="1383" height="742"'));
const logo=fs.readFileSync(path.join(root,'assets/io-tech-center-logo.png'));
assert.equal(logo.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
assert.equal(logo.readUInt32BE(16),1383);assert.equal(logo.readUInt32BE(20),742);
assert.equal(logo[25],2,'Web logo is RGB with an opaque background');
const actualLogo=logoSpec();
assert.equal(actualLogo.url.href,'http://127.0.0.1:8765/io-tech-learning-hub/assets/io-tech-center-logo.png');
assert.deepEqual(checkLogoRoute(actualLogo),{path:actualLogo.url.pathname,status:200,type:'image/png',bytes:logo.length});
// A 200 HTML fallback must fail the same verifier used for real HTTP.
let requestCount=0;
await assert.rejects(checkLivePreview(actualLogo,async()=>++requestCount===1?new Response(actualLogo.html,{status:200}):new Response('<html>fallback</html>',{status:200,headers:{'Content-Type':'text/html'}})),/Live logo response/);
requestCount=0;
await assert.rejects(checkLivePreview(actualLogo,async()=>++requestCount===1?new Response(actualLogo.html,{status:200}):new Response('Not found',{status:200,headers:{'Content-Type':'image/png'}})),/Response must contain PNG bytes/);
requestCount=0;
const completeLogoResponse=await checkLivePreview(actualLogo,async()=>++requestCount===1?new Response(actualLogo.html,{status:200}):new Response(actualLogo.bytes,{status:200,headers:{'Content-Type':'image/png'}}));
assert.equal(completeLogoResponse.bytes,logo.length);
console.log('PASS: the homepage img src resolves through preview routing to the exact PNG; a live-style 200 HTML fallback is rejected.');
assert.ok(fs.readdirSync(path.join(root,'assets')).every(name=>['io-tech-center-logo-original.jpg','io-tech-center-logo.png'].includes(name)));
assert.ok(fs.existsSync(path.join(root,'assets/io-tech-center-logo.png')));
const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
assert.ok(css.includes(':focus-visible')&&css.includes('min-height:48px')&&css.includes('max-width:950px')&&css.includes('max-width:600px'));
// Actual palette contrast for muted copy and the primary navigation buttons.
function luminance(hex){const rgb=hex.match(/[a-f0-9]{2}/gi).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
function contrast(a,b){const v=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (v[0]+.05)/(v[1]+.05);}
const palette=Object.fromEntries([...css.matchAll(/--([a-z-]+):#([0-9a-f]{6})\s*;/gi)].map(([,name,value])=>[name,value]));
for(const [foreground,background] of [['muted','paper'],['muted','white'],['ink','paper'],['brand-dark-blue','white'],['white','action'],['white','action-hover']]){
 assert.ok(contrast(palette[foreground],palette[background])>=4.5,foreground+' / '+background+' contrast');
}
assert.ok(contrast(palette.focus,palette.paper)>=3);
assert.ok(css.includes('.brand-logo{')&&css.includes('height:auto')&&css.includes('grid-template-columns:minmax(0,1fr)'));
console.log('PASS: actual logo dimensions, opaque background, exact alt text, asset allowlist and brand palette contrast.');
console.log('PASS: subpath resources, local-only runtime, privacy scan, focus/target rules and text contrast.');

const requestCases=[
 ['GET',base,200,'text/html'],...assets.map(file=>['GET',base+file,200,file.endsWith('.png')?'image/png':null]),
 ['GET','/',302,null],['GET',base+'../README.md',404,null],['GET',base+'%2e%2e/README.md',404,null],
 ['GET',base+'assets/io-tech-center-logo-original.jpg',404,null],['GET',base+'site-config.js',404,null],['GET',base+'README.md',404,null],['GET',base+'.env',404,null],['GET','/other-project/index.html',404,null],['POST',base,405,null],['HEAD',base+'courses.js',200,'text/javascript']
];
for(const [method,url,status,type] of requestCases){
 let body='';const response={writeHead(actual,headers){assert.equal(actual,status,url);if(type)assert.ok(headers['Content-Type'].startsWith(type));assert.equal(headers['X-Learning-Hub-Preview'],'static-header-v4');},end(value){body=value;}};
 handler({method,url},response);if(method==='HEAD')assert.equal(body,undefined);
 if(url===base+'assets/io-tech-center-logo.png'){
  assert.ok(Buffer.isBuffer(body));assert.deepEqual(body,logo,'The 200 response must be the real PNG, not an HTML fallback');
  assert.equal(body.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 }
}
const server=createPreviewServer();
try {
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 const address='http://127.0.0.1:'+server.address().port;
 for(const file of ['',...assets]){
  const response=await fetch(address+base+file);assert.equal(response.status,200);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),fs.readFileSync(path.join(root,file||'index.html')));
 }
 console.log('PASS: real loopback HTTP, exact asset responses and project-subpath preview.');
} catch(error) {
 if(error.code==='EPERM'||error.code==='EACCES')console.log('NOT RUN: loopback HTTP blocked by environment ('+error.code+'); in-memory handler checks passed.');
 else throw error;
} finally {if(server.listening)await new Promise(resolve=>server.close(resolve));}
console.log('Local checks complete. Browser layout and destination-site availability require separate observations.');
