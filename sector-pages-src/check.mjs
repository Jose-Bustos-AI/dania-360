import {readFileSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {prepareCatalog, resourcePresentation} from './catalog.mjs';
const source = fileURLToPath(new URL('.',import.meta.url)), root = resolve(source,'..');
const pages = JSON.parse(readFileSync(resolve(source,'pages.json'),'utf8'));
const groups = JSON.parse(readFileSync(resolve(source,'groups.json'),'utf8'));
const catalog = prepareCatalog(pages, groups);
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const htmlAt = path => readFileSync(resolve(root,'.'+path,path.endsWith('/')?'index.html':''),'utf8');
const text = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const errors=[], reports=[];
const fail = (slug,message) => errors.push(`${slug}: ${message}`);
const sitemap = readFileSync(resolve(root,'sitemap.xml'),'utf8');
const hub = htmlAt('/sectores/');
const bodies = [];
for (const group of groups) {
  const present = catalog.some(g=>g.id===group.id);
  if(present && !hub.includes(`id="${group.id}"><h2>${esc(group.title)}</h2>`)) fail(group.id,'falta el grupo visible en el índice');
  if(!present && (hub.includes(`id="${group.id}"`) || hub.includes(`href="#${group.id}"`))) fail(group.id,'grupo vacío anunciado en el índice');
}
const listedLinks = [...hub.matchAll(/class="sector-link" href="([^"]+)"/g)].map(m=>'https://dania360.com'+m[1]);
const hubGraph = JSON.parse(hub.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/)[1])['@graph'];
const listedEntities = hubGraph.find(x=>x['@type']==='CollectionPage').mainEntity.itemListElement;
if(JSON.stringify(listedLinks)!==JSON.stringify(listedEntities.map(x=>x.url))) fail('índice','las páginas visibles y la lista estructurada no coinciden');
if(listedEntities.some((x,i)=>x.position!==i+1) || new Set(listedLinks).size!==listedLinks.length) fail('índice','orden o destinos repetidos en el catálogo');
for(const p of pages) {
  const presentation = resourcePresentation(p);
  const path = `/gestion-redes-sociales-${p.slug}/`, url = 'https://dania360.com'+path;
  const html = htmlAt(path), body = readFileSync(resolve(source,`content/${p.slug}.html`),'utf8');
  if(!hub.includes(`href="${path}"`)) fail(p.slug,'no hay enlace entrante desde el índice');
  if(!sitemap.includes(`<loc>${url}</loc>`)) fail(p.slug,'ausente del sitemap');
  if(!p.research?.queries?.length || p.research.sources.length < 1 || !p.research.distinctFrom) fail(p.slug,'investigación incompleta');
  if(p.research.queries.some(q=>/dania/i.test(q))) fail(p.slug,'consulta de investigación con marca');
  if(!html.includes(body)) fail(p.slug,'salida y cuerpo original desincronizados');
  if(!html.includes(`<h1>${p.h1}</h1>`)) fail(p.slug,'H1 distinto de la intención declarada');
  if(!html.includes(`rel="canonical" href="${url}"`)) fail(p.slug,'canonical incorrecto');
  if(/noindex/.test(html)) fail(p.slug,'noindex inesperado');
  if(!html.includes('id="ejemplo"')) fail(p.slug,'falta ejemplo editorial propio');
  if(!html.includes('Web y bot de IA incluidos') || !html.includes('297 €/mes')) fail(p.slug,'oferta de Growth incompleta');
  if(/[«»“”‘’"']/.test(text(body)) || p.faq.flat().some(s=>/[«»“”‘’"']/.test(s))) fail(p.slug,'comillas en prosa nueva');
  const authoredProse = [p.title,p.description,p.h1,p.eyebrow,p.lead,p.promise,p.artAlt,p.artCaption,p.resourceTitle,...p.resource,...Object.values(presentation)];
  if(authoredProse.some(s=>/[«»“”‘’"']/.test(s))) fail(p.slug,'comillas en metadatos o recurso');
  if(/\b(?:85|199|299|397)\s*(?:€|EUR)/.test(text(html))) fail(p.slug,'precio no oficial');
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/)[1])['@graph'];
  const service = graph.find(x=>x['@type']==='Service');
  if(service.offers.price !== '297' || service.offers.priceCurrency !== 'EUR' || service.offers.priceSpecification.unitText !== 'mes') fail(p.slug,'oferta estructurada incorrecta');
  const questions = graph.find(x=>x['@type']==='FAQPage').mainEntity;
  if(questions.length !== p.faq.length) fail(p.slug,'FAQ incompleta');
  questions.forEach((q,i)=>{if(q.name!==p.faq[i][0] || q.acceptedAnswer.text!==p.faq[i][1]) fail(p.slug,'FAQ visible y estructurada distintas');});
  if(graph.some(x=>x['@type']==='LocalBusiness' || x.aggregateRating || x.review)) fail(p.slug,'entidad local o reseñas no justificadas');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(ids.length!==new Set(ids).size) fail(p.slug,'identificadores repetidos');
  let localLinks=0;
  for(const [,href] of html.matchAll(/\bhref="([^"]+)"/g)) {
    const target = new URL(href,url);
    if(target.origin!=='https://dania360.com') continue;
    const file=resolve(root,'.'+decodeURIComponent(target.pathname),target.pathname.endsWith('/')?'index.html':'');
    if(!existsSync(file)) {fail(p.slug,`enlace sin destino ${href}`);continue;}
    localLinks++;
    if(target.hash && target.pathname.endsWith('/')) {
      const targetHtml=readFileSync(file,'utf8');
      if(!targetHtml.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`)) fail(p.slug,`ancla inexistente ${href}`);
    }
  }
  const svg=readFileSync(resolve(root,'.'+path,'ilustracion.svg'),'utf8');
  if(!svg.includes('<title') || !svg.includes('<desc') || !svg.includes('viewBox="0 0 640 480"')) fail(p.slug,'ilustración sin semántica o proporción reservada');
  const resource=readFileSync(resolve(root,'.'+path,'ficha-editorial.txt'),'utf8').replaceAll('\r\n','\n');
  const resourceBytes=readFileSync(resolve(root,'.'+path,'ficha-editorial.txt'));
  if(!resourceBytes.subarray(0,3).equals(Buffer.from([0xef,0xbb,0xbf]))) fail(p.slug,'la ficha necesita una marca UTF-8 para servidores text/plain sin charset');
  if(!p.resource.every(line=>resource.includes(line))) fail(p.slug,'ficha descargable desincronizada');
  if(!resource.includes(presentation.documentSubtitle+'\n') || !html.includes(esc(presentation.description)) || !html.includes(`>${esc(presentation.linkLabel)}</a>`)) fail(p.slug,'presentación del descargable desincronizada');
  reports.push({slug:p.slug,titleLength:p.title.length,descriptionLength:p.description.length,originalBodyWords:text(body).split(' ').length,localLinks,faqCount:questions.length,illustrationBytes:Buffer.byteLength(svg)});
  bodies.push([p.slug,new Set(text(body).toLowerCase().match(/[a-záéíóúñü]+/g))]);
}
// A diagnostic, not proof of quality: the substantive bodies must not be the same text with a trade substituted.
for(let i=0;i<bodies.length;i++) for(let j=i+1;j<bodies.length;j++) {
  const [a,A]=bodies[i],[b,B]=bodies[j];
  const intersection=[...A].filter(x=>B.has(x)).length;
  const similarity=intersection/(A.size+B.size-intersection);
  if(similarity>.72) fail(`${a}/${b}`,`revisar cuerpos demasiado similares (${similarity.toFixed(2)})`);
}
for(const entry of ['/','/gestion-redes-sociales/']) if(!htmlAt(entry).includes('href="/sectores/"')) fail(entry,'el índice no es accesible desde esta página');
if(!readFileSync(resolve(root,'robots.txt'),'utf8').includes('Disallow: /sector-pages-src/')) fail('robots','la fuente del generador no debe formar parte del contenido rastreable');
if(errors.length) {console.error(errors.join('\n'));process.exitCode=1;} else console.log(JSON.stringify({status:'passed',pages:reports},null,2));
