import {readFileSync,writeFileSync} from 'node:fs';
import {renderPackages,packageOffers,packages} from './render.mjs';

const root=new URL('../',import.meta.url);
const sectors=JSON.parse(readFileSync(new URL('sector-pages-src/pages.json',root),'utf8'));
const paths=['','salones-estetica','gestion-redes-sociales','precios-gestion-redes-sociales','gestion-redes-sociales-murcia',
  ...['gimnasios','restaurantes','clinicas-dentales','inmobiliarias','academias','comercios','abogados','fisioterapia','veterinarias'].map(x=>'gestion-redes-sociales-'+x),
  ...sectors.map(p=>'gestion-redes-sociales-'+p.slug)];
for(const path of paths) {
  const file=new URL((path?path+'/':'')+'index.html',root);
  let html=readFileSync(file,'utf8');
  const section=/<section class="d360-packages"[^>]*>[\s\S]*?<\/section>/g;
  if([...html.matchAll(section)].length!==1) throw new Error(path+': se esperaba un bloque de paquetes');
  html=html.replace(section,()=>renderPackages());
  html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(_,raw)=>{
    const data=JSON.parse(raw);
    const walk=x=>{
      if(Array.isArray(x)) return x.forEach(walk);
      if(!x||typeof x!=='object') return;
      if(x['@type']==='Service') {
        const offers=packageOffers('https://dania360.com/'+(path?path+'/':''));
        if(x.hasOfferCatalog) x.hasOfferCatalog.itemListElement=offers;
        else x.offers=offers;
      }
      Object.values(x).forEach(walk);
    };
    walk(data);return '<script type="application/ld+json">'+JSON.stringify(data)+'</script>';
  });
  writeFileSync(file,html,'utf8');
}
console.log(`${paths.length} páginas sincronizadas con los paquetes ${packages.version}. No publicadas.`);
