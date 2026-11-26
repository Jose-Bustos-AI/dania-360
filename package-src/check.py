"""Cross-site regression checks for the approved package catalogue."""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit, unquote
import json, re

ROOT = Path(__file__).resolve().parent.parent
CATALOGUE = json.loads((ROOT/'landing-src/config/planes.json').read_text(encoding='utf8'))
SECTORS = json.loads((ROOT/'sector-pages-src/pages.json').read_text(encoding='utf8'))
ORIGINALS = ['salones-estetica'] + ['gestion-redes-sociales-'+x for x in ['gimnasios','restaurantes','clinicas-dentales','inmobiliarias','academias','comercios','abogados','fisioterapia','veterinarias']]
COMMERCIAL = ['index.html'] + [p+'/index.html' for p in ORIGINALS+['gestion-redes-sociales-'+d['slug'] for d in SECTORS]+['gestion-redes-sociales','precios-gestion-redes-sociales','gestion-redes-sociales-murcia']]
errors=[]; descriptions={}; report=[]; destination_cache={}
def check(condition,page,message):
    if not condition: errors.append(f'{page}: {message}')
def norm(s): return ' '.join(s.split())
def entities(x):
    if isinstance(x,list):
        for v in x:yield from entities(v)
    elif isinstance(x,dict):
        yield x
        for v in x.values():yield from entities(v)

for page in COMMERCIAL:
    soup=BeautifulSoup((ROOT/page).read_text(encoding='utf8'),'html.parser')
    section=soup.select('[data-packages-version]')
    check(len(section)==1,page,'one server-rendered package section')
    check(len(soup.select('h1'))==1,page,'one H1')
    ids=[n['id'] for n in soup.select('[id]')]
    check(len(ids)==len(set(ids)),page,'duplicate IDs')
    description=soup.find('meta',attrs={'name':'description'})['content']
    check(description not in descriptions,page,'duplicate meta description with '+descriptions.get(description,''))
    descriptions[description]=page
    for plan in CATALOGUE['planes']:
        cards=soup.select('[data-package="'+plan['id']+'"]')
        check(len(cards)==1,page,plan['id']+' card count')
        if len(cards)!=1:continue
        card=cards[0]
        check(card.select_one('.d360-package__price strong').text==str(plan['precio'])+' €',page,plan['id']+' price')
        check([n.text for n in card.select('.d360-package__features li')]==plan['incluye'],page,plan['id']+' scope differs from source')
        check([n.text for n in card.select('.d360-package__pending li')]==plan['pendiente'],page,plan['id']+' pending features differ')
        if plan['disponible']:
            check(len(card.select('a[data-plan]'))==1,page,plan['id']+' CTA')
            message=unquote(card.select_one('a[data-plan]')['href'])
            check(str(plan['precio'])+' €/mes' in message,page,plan['id']+' message price')
        else:
            check(not card.select('a'),page,'unavailable Scale must not have purchase CTA')
            check('Próximamente' in card.get_text(),page,'Scale availability label')
    graph=[]
    for script in soup.select('script[type="application/ld+json"]'):
        try:graph+=list(entities(json.loads(script.string or script.text)))
        except Exception as e:errors.append(f'{page}: invalid JSON-LD {e}')
    for entity in graph:
        if entity.get('@type')=='Offer':
            check(str(entity.get('price')) in ['199','299'],page,'unavailable or obsolete structured offer')
        if entity.get('@type')=='Question':
            answer=entity.get('acceptedAnswer',{}).get('text','')
            check(norm(answer) in norm(soup.get_text(' ',strip=True)),page,'FAQ mismatch: '+entity.get('name',''))
    text=norm(soup.get_text(' ',strip=True))
    check(not re.search(r'(?<!\d)(?:99|297|497)\s*(?:€|EUR)',text),page,'obsolete visible price')
    check(not re.search(r'(?:30 publicaciones|30 contenidos|un contenido al día|formato de vídeo de Growth|30 al mes en 4 redes|Contenido diario, comentarios|inversión publicitaria no está incluida en ningún plan)',text,re.I),page,'retired content quota')
    check(not soup.find(re.compile('none$',re.I)),page,'invalid migrated tag')
    for a in soup.select('a[href]'):
        link=urlsplit(a['href'])
        if link.netloc=='wa.me':check(not re.search(r'(?<!\d)(?:99|297|497)\s*(?:€|EUR)',unquote(a['href'])),page,'obsolete WhatsApp price')
        if link.netloc and link.netloc!='dania360.com':continue
        if not link.path.startswith('/') and not link.fragment:continue
        target=ROOT/link.path.lstrip('/') if link.path else ROOT/page
        if target.is_dir():target=target/'index.html'
        check(target.exists(),page,'missing local destination '+a['href'])
        if link.fragment and target.exists() and target.suffix=='.html':
            dest=soup if target.resolve()==(ROOT/page).resolve() else destination_cache[str(target)] if str(target) in destination_cache else BeautifulSoup(target.read_text(encoding='utf8'),'html.parser')
            destination_cache[str(target)]=dest
            check(dest.find(id=unquote(link.fragment)) is not None,page,'missing fragment '+a['href'])
    report.append({'page':page,'packages':3,'metaDescriptionLength':len(description),'faq':sum(e.get('@type')=='Question' for e in graph)})

# Supporting pages must not quote the retired tariff either.
for p in list((ROOT/'recursos').glob('*/index.html'))+list(ROOT.glob('*/index.html')):
    if p.parent.name.endswith('-src'):continue
    soup=BeautifulSoup(p.read_text(encoding='utf8'),'html.parser')
    check(not re.search(r'(?<!\d)(?:99|297|497)\s*(?:€|EUR)',soup.get_text(' ',strip=True)),str(p.relative_to(ROOT)),'obsolete supporting-page tariff')
    for script in soup.select('script[type="application/ld+json"]'):
        for entity in entities(json.loads(script.string or script.text)):
            if entity.get('@type')=='Question':
                check(norm(entity['acceptedAnswer']['text']) in norm(soup.get_text(' ',strip=True)),str(p.relative_to(ROOT)),'supporting FAQ mismatch: '+entity['name'])


output={'commercialPages':len(COMMERCIAL),'sectorPages':100,'checks':report,'errors':errors}
(ROOT/'package-src/validation.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
if errors:
    print('\n'.join(errors));raise SystemExit(1)
print(f'OK: {len(COMMERCIAL)} commercial pages, three packages per page, current prices, pending features, Scale unavailable, coherent FAQ and local links.')
