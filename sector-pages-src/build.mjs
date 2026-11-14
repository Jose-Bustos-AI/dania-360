import {readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {prepareCatalog, resourcePresentation, heroLive, relatedFallback} from './catalog.mjs';
const source = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(source, '..');
const pages = JSON.parse(readFileSync(resolve(source, 'pages.json'), 'utf8'));
const groups = JSON.parse(readFileSync(resolve(source, 'groups.json'), 'utf8'));
const catalog = prepareCatalog(pages, groups);
const plans = JSON.parse(readFileSync(resolve(root, 'landing-src/config/planes.json'), 'utf8'));
const growth = plans.planes.find(p => p.id === 'growth');
if (growth.precio !== 297) throw new Error('Revisar el alcance comercial antes de regenerar con otro precio');
const site = 'https://dania360.com';
const version = file => createHash('sha256').update(readFileSync(resolve(source,file))).digest('hex').slice(0,10);
const styleVersion = version('styles.css');
const scriptVersion = version('sectores.js');
// Cifras oficiales de Growth para el marcador: se leen del plan, no son resultados.
const growthText = growth.incluye.join(' ');
const growthFacts = {
  posts: Number(growthText.match(/\((\d+) al mes\)/)?.[1]),
  seconds: Number(growthText.match(/vídeos de (\d+) segundos/)?.[1]),
  networks: growth.canales.split('·').map(s => s.trim()).filter(s => s && s !== 'Google'),
};
if (!growthFacts.posts || !growthFacts.seconds || !growthFacts.networks.length || !/Sin permanencia/.test(plans.microcopy)) {
  throw new Error('No se pueden leer las cifras oficiales de Growth para el marcador');
}
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const json = value => JSON.stringify(value).replaceAll('<','\\u003c');
const pathFor = p => `/gestion-redes-sociales-${p.slug}/`;
const whatsapp = p => `https://wa.me/34631105772?text=${encodeURIComponent(`Hola, quiero una auditoría gratuita de la presencia digital de mi empresa. Sector: ${p.name}. Mi web o perfil es:`)}`;
const floatWhatsapp = p => `https://wa.me/34631105772?text=${encodeURIComponent(`Hola, vengo de la página de ${p.name.toLowerCase()} de Dania360 y quiero información sobre la gestión de redes sociales para mi negocio.`)}`;
const waIcon = `<svg class="wa-icon" viewBox="0 0 32 32" width="22" height="22" aria-hidden="true" focusable="false"><use href="#wa-glyph"/></svg>`;
const waSprite = `<svg class="sx-sprite" aria-hidden="true" focusable="false"><symbol id="wa-glyph" viewBox="0 0 32 32"><path fill="currentColor" d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.2-3.8 1.2 1.2-3.7-.3-.4c-1.2-1.8-1.8-3.8-1.8-5.9C5 9.9 9.9 5.2 16 5.2s11 4.7 11 10.6-4.9 10.6-11 10.6zm6-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.4-.5-2.6-1.6-1-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.7 1.2 3.1 1.4 3.4c.2.2 2.3 3.5 5.6 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></symbol></svg>`;
const listEs = items => items.length > 1 ? `${items.slice(0,-1).join(', ')} y ${items.at(-1)}` : items[0];
const brand = `<a class="brand" href="/" aria-label="Dania360, inicio"><img src="/logo-dania360-orange-black.webp" width="44" height="44" alt=""/><span>DANIA <b>360</b></span></a>`;
const organization = {'@type':'Organization','@id':`${site}/#organization`,name:'Dania360',url:`${site}/`,logo:`${site}/logo-dania360-orange-black.webp`,email:'hola@dania360.com',telephone:'+34631105772'};
function shell({path,title,description,body,graph,layout='',sector=null}) {
  return `<!doctype html>\n<html lang="es"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(title)}</title><meta name="description" content="${esc(description)}"/><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"/><link rel="canonical" href="${site}${path}"/>
<meta property="og:type" content="website"/><meta property="og:locale" content="es_ES"/><meta property="og:site_name" content="Dania360"/><meta property="og:title" content="${esc(title)}"/><meta property="og:description" content="${esc(description)}"/><meta property="og:url" content="${site}${path}"/><meta property="og:image" content="${site}/og-mas-clientes.png"/><meta property="og:image:alt" content="Dania360, gestión de redes sociales con web y chat"/><meta name="twitter:card" content="summary_large_image"/><meta name="theme-color" content="#000000"/>
<link rel="icon" href="/favicon-dania360-orange.png" sizes="64x64"/><link rel="apple-touch-icon" href="/apple-touch-icon-dania360-orange.png"/><link rel="stylesheet" href="/sectores/sectores.css?v=${styleVersion}"/>${sector ? `<script>document.documentElement.classList.add('js');setTimeout(function(){window.sxReady||document.documentElement.classList.remove('js')},4000)</script>` : ''}
<script type="application/ld+json">${json({'@context':'https://schema.org','@graph':graph})}</script></head>
<body class="layout-${esc(layout)}"><a class="skip" href="#contenido">Saltar al contenido</a>${sector ? `${waSprite}<div class="progress" aria-hidden="true"><span></span></div>` : ''}<header class="site-header">${brand}<nav aria-label="Navegación principal"><a href="/sectores/">Sectores</a><a href="/gestion-redes-sociales/">Servicio</a><a href="/precios-gestion-redes-sociales/">Precios</a></nav></header>
<main id="contenido">${body}</main><footer class="site-footer">${brand}<p class="identity">Dania360 es franquicia oficial de Dania.ai. <a href="/quienes-somos/">José Antonio Bustos García y la atención de Dania360</a>: estudiamos tu negocio, recomendamos el servicio adecuado y te acompañamos durante su gestión.</p><nav aria-label="Empresa y condiciones"><a href="mailto:hola@dania360.com">hola@dania360.com</a><a href="/recursos/">Recursos</a><a href="/aviso-legal/">Aviso legal</a><a href="/privacidad/">Privacidad</a><a href="/cookies/">Cookies</a><a href="/cookies/" data-consent-reset>Preferencias de cookies</a></nav></footer>${sector ? `
<a class="wa-float" href="${floatWhatsapp(sector)}" data-cta="${sector.slug}-flotante">${waIcon}<span class="wa-float__label">¿Hablamos por WhatsApp?</span></a><script src="/sectores/sectores.js?v=${scriptVersion}" defer></script>` : ''}
<script src="/analytics.js?v=20261103-snippet" defer></script></body></html>\n`;
}
function offer(p) {
  return `<section class="offer" id="growth" aria-labelledby="growth-title"><div><p class="kicker">Redes + web + bot de IA</p><h2 id="growth-title">Todo el plan Growth</h2><p class="offer-price">297 € <small>/mes</small></p><p>Gestión de redes sociales con una página web profesional y chat con modo automático de IA incluidos.</p><a class="button" href="${whatsapp(p)}" data-cta="${p.slug}-growth">${waIcon}Pide tu auditoría gratis →</a><p class="scope">${esc(plans.microcopy)} <a href="/precios-gestion-redes-sociales/">Ver alcance de los planes y condiciones</a>.</p></div><div><ul>${growth.incluye.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p class="scope">El chat de la web permite responder desde tu móvil con la app DANIA y activar el modo automático de IA. La decisión técnica, el presupuesto y la disponibilidad del trabajo los confirma tu empresa. La cuota mostrada no incluye inversión publicitaria ni grabaciones presenciales.</p></div></section>`;
}
function scoreboard() {
  const item = (value, unit, label, detail, from) => `<div class="score__item tilt"><p class="score__num"><strong data-count="${value}"${from === undefined ? '' : ` data-from="${from}"`}>${value}</strong>${unit ? `<small>${unit}</small>` : ''}</p><p class="score__label">${label}</p><p>${detail}</p></div>`;
  return `<section class="score" aria-labelledby="score-title"><h2 class="score__title" id="score-title">El plan Growth en cifras</h2><div class="score__grid">${[
    item(growthFacts.posts, '', 'publicaciones al mes', `Una al día, con vídeos de ${growthFacts.seconds} segundos.`),
    item(growthFacts.networks.length, '', 'redes sociales', `${esc(listEs(growthFacts.networks))}, más tu perfil de Google.`),
    item(growth.precio, '€/mes', 'cuota de Growth', 'Redes, web y bot de IA incluidos.'),
    item(0, '', 'meses de permanencia', 'Servicio mensual: decides cada mes.', 12),
  ].join('')}</div><p class="score__note">Datos oficiales del plan Growth. No son resultados de clientes ni promesas de resultados.</p></section>`;
}
function heroCard(p) {
  const live = heroLive(p);
  return `<div class="hero-live" data-live role="img" aria-label="Ejemplo ilustrativo de tres publicaciones y una conversación por WhatsApp"><div class="live-top"><span class="live-tag">Ejemplo ilustrativo</span><span class="live-who">${esc(p.name)}</span></div><div class="live-body"><div class="live-feed">${live.posts.map((post,i)=>`<div class="live-post${i ? '' : ' is-active'}"><span class="live-net">${esc(post.format)}</span><strong>${esc(post.text)}</strong><span class="live-meta">${i+1}/3</span></div>`).join('')}<div class="live-dots"><i class="is-on"></i><i></i><i></i></div></div><div class="live-chat" data-chat><div class="live-chat__head">${waIcon}<b>WhatsApp</b><span>en línea</span></div><div class="live-msg live-msg--in">${esc(live.chat.question)}</div><div class="live-msg live-msg--out">${esc(live.chat.answer)}</div><div class="live-msg live-msg--sys">Consulta derivada a tu equipo</div></div></div></div>`;
}
const existing = [
['/salones-estetica/','Peluquerías y estética','Servicios, citas y confianza'],['/gestion-redes-sociales-gimnasios/','Gimnasios','Clases, equipo y socios'],['/gestion-redes-sociales-restaurantes/','Restaurantes','Carta, ambiente y reservas'],['/gestion-redes-sociales-clinicas-dentales/','Clínicas dentales','Tratamientos, profesionales y citas'],['/gestion-redes-sociales-inmobiliarias/','Inmobiliarias','Propietarios, inmuebles y visitas'],['/gestion-redes-sociales-academias/','Academias','Cursos, docentes y matrículas'],['/gestion-redes-sociales-comercios/','Tiendas y comercios','Productos, consultas y visitas'],['/gestion-redes-sociales-abogados/','Abogados','Especialidades y consultas'],['/gestion-redes-sociales-fisioterapia/','Fisioterapia','Servicios, equipo y citas'],['/gestion-redes-sociales-veterinarias/','Veterinarias','Prevención, servicios y atención']];
const cards = (entries, extra = '') => entries.map(([url,name,detail])=>`<a class="sector-link${extra}" href="${url}"><strong>${esc(name)}</strong><span>${esc(detail)}</span><span aria-hidden="true">Ver solución →</span></a>`).join('');
// Relacionadas: las siguientes del mismo grupo en orden circular (hasta seis) para repartir los enlaces;
// los grupos pequeños se completan hasta cuatro con relatedFallback.
function relatedSection(p) {
  const group = catalog.find(g => g.pages.includes(p));
  const i = group.pages.indexOf(p);
  const links = [];
  for (let k = 1; k < group.pages.length && links.length < 6; k++) {
    const q = group.pages[(i + k) % group.pages.length];
    links.push([pathFor(q), q.name, q.promise]);
  }
  for (const ref of relatedFallback[group.id] ?? []) {
    if (links.length >= 4) break;
    const q = ref.startsWith('/') ? null : pages.find(page => page.slug === ref);
    const entry = ref.startsWith('/') ? existing.find(([url]) => url === ref) : q && [pathFor(q), q.name, q.promise];
    if (!entry) throw new Error(`${p.slug}: relacionada inexistente ${ref}`);
    links.push(entry);
  }
  if (links.length < 4) throw new Error(`${p.slug}: hacen falta al menos cuatro sectores relacionados`);
  return `<section class="section related" aria-labelledby="related-title"><p class="kicker">${esc(group.title)}</p><h2 id="related-title">Sectores cercanos al tuyo</h2><p class="related__intro">Cada página explica cómo trabajamos con negocios parecidos al tuyo. Todas forman parte de nuestro servicio de <a href="/gestion-redes-sociales/">gestión de redes sociales para empresas</a>.</p><div class="sector-grid">${cards(links, ' tilt')}</div><p class="related__more"><a href="/sectores/">Ver todos los sectores</a><span aria-hidden="true">·</span><a href="/precios-gestion-redes-sociales/">Precios y alcance de los planes</a><span aria-hidden="true">·</span><a href="/gestion-redes-sociales/">Cómo funciona el servicio</a></p></section>`;
}
mkdirSync(resolve(root, 'sectores'), {recursive:true});
copyFileSync(resolve(source, 'styles.css'), resolve(root, 'sectores/sectores.css'));
copyFileSync(resolve(source, 'sectores.js'), resolve(root, 'sectores/sectores.js'));
for (const p of pages) {
  const resource = resourcePresentation(p);
  const path = pathFor(p), url = site+path, out = resolve(root, `.${path}`);
  mkdirSync(out, {recursive:true});
  copyFileSync(resolve(source, `art/${p.slug}.svg`), resolve(out, 'ilustracion.svg'));
  writeFileSync(resolve(out, 'ficha-editorial.txt'), `\uFEFF${p.resourceTitle.toUpperCase()}\n${resource.documentSubtitle}\n\n${p.resource.join('\n')}\n\n${url}\n`, 'utf8');
  const crumbs = {'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'Inicio',item:site+'/'},{'@type':'ListItem',position:2,name:'Gestión de redes sociales',item:site+'/gestion-redes-sociales/'},{'@type':'ListItem',position:3,name:p.name,item:url}]};
  const service = {'@type':'Service','@id':url+'#service',name:p.h1,serviceType:p.h1,description:p.lead,provider:{'@id':organization['@id']},areaServed:{'@type':'Country',name:'España'},url,offers:{'@type':'Offer',name:'Growth: redes sociales, web y bot de IA',price:'297',priceCurrency:'EUR',url:url+'#growth',priceSpecification:{'@type':'UnitPriceSpecification',price:'297',priceCurrency:'EUR',unitText:'mes'}}};
  const faq = {'@type':'FAQPage','@id':url+'#preguntas',mainEntity:p.faq.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))};
  const page = {'@type':'WebPage','@id':url+'#webpage',url,name:p.title,description:p.description,inLanguage:'es-ES',dateModified:p.contentModified,mainEntity:{'@id':service['@id']},breadcrumb:{'@id':crumbs['@id']},publisher:{'@id':organization['@id']}};
  const content = readFileSync(resolve(source, `content/${p.slug}.html`), 'utf8');
  const priceLine = `<p class="price-line"><strong>Growth · 297 €/mes</strong> · Web y bot de IA incluidos</p>`;
  const heroOffer = p.heroExampleLabel
    ? `<p class="lead">${esc(p.lead)}</p><p class="price-line"><a href="#growth"><strong>Growth · 297 €/mes</strong></a> · Web y bot de IA incluidos</p>`
    : `<p class="promise">${esc(p.promise)}</p><p class="lead">${esc(p.lead)}</p>`;
  const body = `<nav class="breadcrumb" aria-label="Ruta de navegación"><a href="/">Inicio</a><span aria-hidden="true">/</span><a href="/gestion-redes-sociales/">Gestión de redes sociales</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.name)}</span></nav>
<section class="hero"><div><p class="kicker">${esc(p.eyebrow)}</p><h1>${esc(p.h1)}</h1>${heroOffer}<div class="actions"><a class="button" href="${whatsapp(p)}" data-cta="${p.slug}-hero">${waIcon}Pide tu auditoría gratis →</a><a class="button secondary" href="#ejemplo">${esc(p.heroExampleLabel ?? "Ver un ejemplo")}</a></div>${p.heroExampleLabel ? "" : priceLine}</div><figure><img src="${path}ilustracion.svg" width="640" height="480" alt="${esc(p.artAlt)}" fetchpriority="high"/>${heroCard(p)}<figcaption>${esc(p.artCaption)}</figcaption></figure></section>
${scoreboard()}
<div class="sector-body">${content}</div>
<section class="download" aria-labelledby="ficha-title"><div><p class="kicker">Un recurso para empezar</p><h2 id="ficha-title">${esc(p.resourceTitle)}</h2><p>${esc(resource.description)}</p></div><a class="button secondary" href="${path}ficha-editorial.txt" download>${esc(resource.linkLabel)}</a></section>
${offer(p)}
<section class="section" id="preguntas" aria-labelledby="faq-title"><p class="kicker">Antes de contratar</p><h2 id="faq-title">Preguntas sobre el servicio para ${esc(p.name.toLowerCase())}</h2><div class="faq-list">${p.faq.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></section>
${relatedSection(p)}
<section class="closing"><p class="kicker">Empezamos por tu negocio</p><h2>Una auditoría gratuita para decidir qué mejorar</h2><p>Envíanos tu web o tu perfil y cuéntanos qué servicios quieres comunicar. Revisamos tu presencia digital y te explicamos si Growth encaja con tu situación.</p><div class="actions"><a class="button" href="${whatsapp(p)}" data-cta="${p.slug}-final">${waIcon}Pide tu auditoría gratis por WhatsApp</a></div><p class="identity">Puedes <a href="/sectores/">consultar las soluciones por sector</a> y conocer <a href="/gestion-redes-sociales/">cómo funciona el servicio</a>.</p></section>`;
  writeFileSync(resolve(out, 'index.html'), shell({path,title:p.title,description:p.description,body,graph:[organization,page,service,crumbs,faq],layout:p.layout,sector:p}), 'utf8');
}
const groupSections = catalog.map(group=>`<section class="section" id="${esc(group.id)}"><h2>${esc(group.title)}</h2><div class="sector-grid">${cards(group.pages.map(p=>[pathFor(p),p.name,p.promise]))}</div></section>`).join('');
const groupNavigation = catalog.length > 1 ? `<nav class="actions" aria-label="Áreas de actividad">${catalog.map(group=>`<a class="button secondary" href="#${esc(group.id)}">${esc(group.title)}</a>`).join('')}</nav>` : '';
const hubBody = `<nav class="breadcrumb" aria-label="Ruta de navegación"><a href="/">Inicio</a><span aria-hidden="true">/</span><span aria-current="page">Sectores</span></nav><section class="hub-hero"><p class="kicker">Dania360 · Soluciones por actividad</p><h1>Gestión de redes sociales por sectores</h1><p><a href="#${esc(catalog[0].id)}">Elige tu actividad</a> para conocer el enfoque del contenido, un ejemplo de trabajo y cómo atendemos las consultas. El servicio debe explicar lo que vendes y ayudar a quien está valorando contratarte.</p><p>Growth reúne gestión de redes sociales, web y bot de IA por 297 €/mes. Los ejemplos de cada sector son propuestas editoriales; no representan clientes ni resultados obtenidos.</p>${groupNavigation}</section>${groupSections}<section class="section"><h2>Servicios, comercios y negocios locales</h2><div class="sector-grid">${cards(existing)}</div></section><section class="closing"><h2>¿Tu actividad combina varios servicios?</h2><p>Cuéntanos cuál es tu cliente y qué trabajo quieres priorizar. Te orientaremos hacia el enfoque que mejor encaje, sin obligarte a presentar todos tus servicios de la misma manera.</p><a class="button" href="https://wa.me/34631105772?text=${encodeURIComponent('Hola, quiero una auditoría gratuita para mi negocio. Mi actividad es:')}" data-cta="sectores-auditoria">Pide tu auditoría gratis</a><p><a href="/gestion-redes-sociales/">Consultar el servicio de gestión de redes sociales</a></p></section>`;
const hubTitle = 'Gestión de redes sociales por sectores | Dania360';
const hubDescription = 'Encuentra la gestión de redes sociales para tu actividad. Ejemplos y enfoques por sector, con web y bot de IA en Growth por 297 €/mes. Auditoría gratis.';
const hubOutput = resolve(root, 'sectores/index.html');
const hubHtml = shell({path:'/sectores/',title:hubTitle,description:hubDescription,body:hubBody,graph:[organization,{'@type':'CollectionPage',url:site+'/sectores/',name:hubTitle,description:hubDescription,mainEntity:{'@type':'ItemList',itemListElement:[...catalog.flatMap(group=>group.pages.map(p=>[pathFor(p),p.name])),...existing].map(([url,name],i)=>({'@type':'ListItem',position:i+1,name,url:site+url}))}}]});
const hubChanged = !existsSync(hubOutput) || readFileSync(hubOutput,'utf8').replaceAll('\r\n','\n') !== hubHtml.replaceAll('\r\n','\n');
writeFileSync(hubOutput, hubHtml, 'utf8');
// Authored content dates: a rebuild must not pretend every page changed today.
let sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');
const previousHubDate = sitemap.match(/<url>\s*<loc>https:\/\/dania360\.com\/sectores\/<\/loc>\s*<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/)?.[1];
const hubModified = !hubChanged && previousHubDate ? previousHubDate : pages.map(p=>p.contentModified).sort().at(-1);
for (const [path,modified] of [['/sectores/',hubModified],...pages.map(p=>[pathFor(p),p.contentModified])]) {
  const loc = `<loc>${site}${path}</loc>`;
  if (!sitemap.includes(loc)) sitemap = sitemap.replace('</urlset>', `  <url>${loc}<lastmod>${modified}</lastmod></url>\n</urlset>`);
  else sitemap = sitemap.split(/(<url>[\s\S]*?<\/url>)/g).map(block=>block.includes(loc)?block.replace(/<lastmod>[^<]*<\/lastmod>/,`<lastmod>${modified}</lastmod>`):block).join('');
}
writeFileSync(resolve(root, 'sitemap.xml'), sitemap, 'utf8');
console.log(`${pages.length} landings originales y el índice sectorial generados; no publicados.`);
