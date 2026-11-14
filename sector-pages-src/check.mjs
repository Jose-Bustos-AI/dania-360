import {readFileSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {prepareCatalog, resourcePresentation, heroLive, relatedFallback} from './catalog.mjs';
const source = fileURLToPath(new URL('.',import.meta.url)), root = resolve(source,'..');
const pages = JSON.parse(readFileSync(resolve(source,'pages.json'),'utf8'));
const groups = JSON.parse(readFileSync(resolve(source,'groups.json'),'utf8'));
const catalog = prepareCatalog(pages, groups);
const site = 'https://dania360.com';
const pagePath = p => `/gestion-redes-sociales-${p.slug}/`;
const plans = JSON.parse(readFileSync(resolve(root,'landing-src/config/planes.json'),'utf8'));
const growth = plans.planes.find(x=>x.id==='growth');
const growthText = growth.incluye.join(' ');
// Marcador esperado: cifras oficiales de Growth en este orden (publicaciones, redes, cuota, permanencia).
const expectedCounts = [Number(growthText.match(/\((\d+) al mes\)/)?.[1]), growth.canales.split('·').map(x=>x.trim()).filter(x=>x && x!=='Google').length, growth.precio, 0];
const version = file => createHash('sha256').update(readFileSync(resolve(source,file))).digest('hex').slice(0,10);
const sameFile = (a,b) => readFileSync(a).equals(readFileSync(b));
const css = readFileSync(resolve(source,'styles.css'),'utf8');
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
const templateErrors = [];
if(!existsSync(resolve(root,'sectores/sectores.js')) || !sameFile(resolve(source,'sectores.js'),resolve(root,'sectores/sectores.js'))) templateErrors.push('sectores.js publicado distinto de la fuente');
if(!sameFile(resolve(source,'styles.css'),resolve(root,'sectores/sectores.css'))) templateErrors.push('sectores.css publicado distinto de la fuente');
// Modo calma: no se admite una regla global que apague todas las animaciones.
if(/\*\s*(?:,[^{]*)?\{[^}]*(?:animation|transition)[^}]*(?:none|0?\.0*1m?s)[^}]*\}/i.test(css) || /animation-duration\s*:\s*0?\.0*1m?s\s*!important/i.test(css)) templateErrors.push('regla global que deja la página plana con reducir movimiento');
if(!/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)\s*\{[^@]*sx-fade/.test(css)) templateErrors.push('el modo calma debe sustituir desplazamientos por fundidos');
// Sin JavaScript la página se ve completa: lo que se oculta para aparecer depende de la clase js.
if(/(?:^|[},])\s*\.(?:reveal|wa-float|live-post)\b[^{]*\{[^}]*(?:opacity\s*:\s*0|visibility\s*:\s*hidden)/m.test(css)) templateErrors.push('una regla oculta contenido aunque no haya JavaScript');
const sectoresJs = readFileSync(resolve(source,'sectores.js'),'utf8');
const heroJs = sectoresJs.split('// Móvil del hero')[1]?.split('// Aparición')[0];
if(!heroJs || /reduce|calm/.test(heroJs) || !heroJs.includes('typeInto')) templateErrors.push('el chat y la rotación del hero deben funcionar también con reducir movimiento');
templateErrors.forEach(message=>fail('plantilla',message));
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
  // Plantilla viva: migas con el pilar, flotante, progreso, móvil del hero, marcador y relacionadas.
  if((html.match(/<h1[\s>]/g)||[]).length!==1) fail(p.slug,'debe haber un solo H1');
  const crumbNav = html.match(/<nav class="breadcrumb" aria-label="Ruta de navegación">([\s\S]*?)<\/nav>/)?.[1] ?? '';
  const crumbLinks = [...crumbNav.matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)].map(m=>[m[1],m[2]]);
  if(JSON.stringify(crumbLinks)!==JSON.stringify([['/','Inicio'],['/gestion-redes-sociales/','Gestión de redes sociales']]) || !crumbNav.endsWith(`<span aria-current="page">${esc(p.name)}</span>`)) fail(p.slug,'migas visibles sin el pilar');
  const crumbData = graph.find(x=>x['@type']==='BreadcrumbList')?.itemListElement ?? [];
  if(JSON.stringify(crumbData.map(x=>[x.position,x.name,x.item]))!==JSON.stringify([[1,'Inicio',site+'/'],[2,'Gestión de redes sociales',site+'/gestion-redes-sociales/'],[3,p.name,url]])) fail(p.slug,'BreadcrumbList sin el pilar');
  const webpage = graph.find(x=>x['@type']==='WebPage');
  if(webpage?.dateModified!==p.contentModified || webpage?.breadcrumb?.['@id']!==url+'#breadcrumb') fail(p.slug,'WebPage sin dateModified igual a contentModified');
  const floats = [...html.matchAll(/<a class="wa-float" href="([^"]+)" data-cta="([^"]+)">([\s\S]*?)<\/a>/g)];
  if(floats.length!==1) fail(p.slug,'debe haber un único WhatsApp flotante');
  else {
    const [,href,cta,inner] = floats[0];
    const message = href.startsWith('https://wa.me/34631105772?text=') ? decodeURIComponent(href.split('?text=')[1]) : '';
    if(!message.includes(p.name.toLowerCase()) || cta!==`${p.slug}-flotante`) fail(p.slug,'el flotante necesita un mensaje propio del sector');
    if(!inner.includes('<use href="#wa-glyph"/>') || !/<span class="wa-float__label">[^<]{4,40}<\/span>$/.test(inner)) fail(p.slug,'el flotante necesita icono y etiqueta breve');
  }
  if((html.match(/id="wa-glyph"/g)||[]).length!==1) fail(p.slug,'falta el icono de WhatsApp reutilizable');
  const waButtons = [...html.matchAll(/<a class="button[^"]*" href="https:\/\/wa\.me\/[^"]+"[^>]*>([\s\S]*?)<\/a>/g)];
  if(waButtons.length<3 || waButtons.some(([,inner])=>!inner.startsWith('<svg class="wa-icon"'))) fail(p.slug,'los botones principales de WhatsApp deben llevar el icono');
  if(!html.includes('<div class="progress" aria-hidden="true"><span></span></div>')) fail(p.slug,'falta la barra de progreso');
  if(!html.includes(`<script src="/sectores/sectores.js?v=${version('sectores.js')}" defer></script>`) || !html.includes(`href="/sectores/sectores.css?v=${version('styles.css')}"`)) fail(p.slug,'JS o CSS compartidos sin versión actual');
  if(/class="[^"]*\breveal\b/.test(html)) fail(p.slug,'las apariciones se añaden con JavaScript, no en el HTML');
  const figure = html.match(/<section class="hero">[\s\S]*?(<figure>[\s\S]*?<\/figure>)<\/section>/)?.[1] ?? '';
  const live = heroLive(p);
  if(!figure.includes('<div class="hero-live" data-live') || !figure.includes('<span class="live-tag">Ejemplo ilustrativo</span>')) fail(p.slug,'falta el móvil vivo del hero marcado como ejemplo ilustrativo');
  if((figure.match(/class="live-post/g)||[]).length!==3 || live.posts.some(post=>!figure.includes(`<strong>${esc(post.text)}</strong>`))) fail(p.slug,'el hero debe rotar las tres publicaciones de heroPosts');
  if(!figure.includes(`live-msg--in">${esc(live.chat.question)}</div>`) || !figure.includes(`live-msg--out">${esc(live.chat.answer)}</div>`)) fail(p.slug,'el chat del hero no coincide con heroChat');
  if([...live.posts.map(x=>x.text),live.chat.question,live.chat.answer].some(x=>/[«»“”‘’"']/.test(x))) fail(p.slug,'comillas en el ejemplo del hero');
  const counts = [...html.matchAll(/data-count="(\d+)"/g)].map(m=>Number(m[1]));
  if(JSON.stringify(counts)!==JSON.stringify(expectedCounts) || !html.includes('Datos oficiales del plan Growth')) fail(p.slug,`marcador distinto de las cifras oficiales de Growth (${counts})`);
  const related = html.match(/<section class="section related"[\s\S]*?<\/section>/)?.[0] ?? '';
  const relatedLinks = [...related.matchAll(/class="sector-link tilt" href="([^"]+)"/g)].map(m=>m[1]);
  const group = catalog.find(g=>g.pages.includes(p));
  const groupPaths = group.pages.filter(q=>q!==p).map(pagePath);
  const fallbackPaths = (relatedFallback[group.id] ?? []).map(ref=>ref.startsWith('/') ? ref : pagePath({slug:ref}));
  const same = relatedLinks.filter(x=>groupPaths.includes(x));
  const others = relatedLinks.filter(x=>!groupPaths.includes(x));
  if(relatedLinks.length<4 || relatedLinks.length>6 || new Set(relatedLinks).size!==relatedLinks.length || relatedLinks.includes(path)) fail(p.slug,`relacionadas incorrectas (${relatedLinks.length})`);
  if(same.length!==Math.min(6,groupPaths.length) || others.some(x=>!fallbackPaths.includes(x)) || (others.length && groupPaths.length>=4)) fail(p.slug,'las relacionadas deben salir del mismo grupo');
  if(!['/gestion-redes-sociales/','/precios-gestion-redes-sociales/','/sectores/'].every(href=>related.includes(`href="${href}"`))) fail(p.slug,'faltan enlaces al pilar, a precios o a sectores');
  if(/[«»]/.test(text(html))) fail(p.slug,'comillas angulares en la página');
  reports.push({slug:p.slug,related:relatedLinks.length,titleLength:p.title.length,descriptionLength:p.description.length,originalBodyWords:text(body).split(' ').length,localLinks,faqCount:questions.length,illustrationBytes:Buffer.byteLength(svg)});
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
