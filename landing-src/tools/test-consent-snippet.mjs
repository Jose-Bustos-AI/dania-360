import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const root = new URL('../../', import.meta.url);
const source = readFileSync(new URL('analytics.js', root), 'utf8');
const key = 'dania360_consent_v2';
const version = '/analytics.js?v=20261027-1';

// DOM and storage doubles: no browser network, tags or live analytics events.
function boot({ saved, ready = 'complete', storageBlocked = false } = {}) {
  const storage = new Map(saved ? [[key, saved]] : []);
  const head = [];
  const body = [];
  const appended = [];
  const listeners = new Map();
  let reloads = 0;
  function node(tag) {
    const attributes = new Map();
    const events = new Map();
    return {
      tagName: tag.toUpperCase(), attributes, events, removed: false,
      setAttribute(name, value) { attributes.set(name, value); },
      getAttribute(name) { return attributes.get(name) ?? null; },
      addEventListener(name, callback) { events.set(name, callback); },
      remove() { this.removed = true; },
    };
  }
  const document = {
    readyState: ready,
    createElement: node,
    head: { appendChild(element) { head.push(element); } },
    body: { appendChild(element) {
      body.push(element);
      appended.push({ tag: element.tagName, attributes: new Map(element.attributes) });
    } },
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, []);
      listeners.get(name).push(callback);
    },
  };
  const window = {
    localStorage: {
      getItem(name) { if (storageBlocked) throw new Error('blocked'); return storage.get(name) ?? null; },
      setItem(name, value) { if (storageBlocked) throw new Error('blocked'); storage.set(name, value); },
      removeItem(name) { if (storageBlocked) throw new Error('blocked'); storage.delete(name); },
    },
    location: { pathname: '/gestion-redes-sociales-veterinarias/', reload() { reloads += 1; } },
  };
  runInNewContext(source, { window, document, Date, encodeURIComponent });
  const banner = () => body.find(element => element.className === 'dania-consent');
  const scripts = () => head.filter(element => element.tagName === 'SCRIPT');
  const calls = () => window.dataLayer.map(args => Array.from(args));
  return {
    storage, head, body, appended, window, banner, scripts, calls,
    get reloads() { return reloads; },
    ready() { for (const callback of listeners.get('DOMContentLoaded') ?? []) callback(); },
    choose(choice) {
      const button = { getAttribute: name => name === 'data-consent' ? choice : null };
      banner().events.get('click')({ target: { closest: selector => selector === '[data-consent]' ? button : null } });
    },
    documentClick(target) { for (const callback of listeners.get('click') ?? []) callback({ target }); },
  };
}

test('el section ya tiene data-nosnippet cuando se inserta en el DOM', () => {
  const app = boot();
  assert.equal(app.appended.length, 1);
  assert.equal(app.appended[0].tag, 'SECTION');
  assert.equal(app.appended[0].attributes.get('data-nosnippet'), '');
  assert.equal(app.banner().getAttribute('role'), 'dialog');
  assert.equal(app.banner().getAttribute('aria-label'), 'Preferencias de privacidad');
});

test('el aviso sigue ofreciendo las mismas dos elecciones y la política', () => {
  const app = boot();
  for (const text of ['Tu privacidad importa', 'Si aceptas, usamos Google Analytics', 'data-consent="rejected"', 'data-consent="accepted"', 'href="/cookies/"']) {
    assert.ok(app.banner().innerHTML.includes(text), text);
  }
});

test('sin elección se mantiene el consentimiento denegado y no se cargan etiquetas', () => {
  const app = boot();
  const [command, mode, flags] = app.calls()[0];
  assert.equal(command, 'consent');
  assert.equal(mode, 'default');
  for (const flag of ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage']) assert.equal(flags[flag], 'denied');
  assert.equal(app.scripts().length, 0);
  assert.equal(app.window.fbq, undefined);
});

test('aceptar conserva la clave, carga los proveedores una vez y cierra el aviso', () => {
  const app = boot();
  app.choose('accepted');
  assert.equal(app.storage.get(key), 'accepted');
  assert.equal(app.scripts().length, 2);
  assert.ok(app.scripts().some(script => script.src.startsWith('https://www.googletagmanager.com/gtag/js?')));
  assert.ok(app.scripts().some(script => script.src === 'https://connect.facebook.net/en_US/fbevents.js'));
  assert.equal(app.banner().removed, true);
  assert.equal(app.head.find(element => element.tagName === 'STYLE').removed, true);
  assert.ok(app.calls().some(call => call[0] === 'consent' && call[1] === 'update' && call[2].analytics_storage === 'granted'));
});

test('rechazar conserva la elección y no carga etiquetas', () => {
  const app = boot();
  app.choose('rejected');
  assert.equal(app.storage.get(key), 'rejected');
  assert.equal(app.scripts().length, 0);
  assert.equal(app.banner().removed, true);
  assert.ok(app.calls().some(call => call[0] === 'consent' && call[1] === 'update' && call[2].analytics_storage === 'denied'));
});

test('una elección guardada no vuelve a pedir consentimiento al cambiar la versión del recurso', () => {
  for (const saved of ['accepted', 'rejected']) {
    const app = boot({ saved });
    assert.equal(app.body.length, 0);
    assert.equal(app.scripts().length, saved === 'accepted' ? 2 : 0);
    assert.equal(app.storage.get(key), saved);
  }
});

test('el modo DOMContentLoaded también inserta el atributo desde el principio', () => {
  const app = boot({ ready: 'loading' });
  assert.equal(app.body.length, 0);
  app.ready();
  assert.equal(app.appended[0].attributes.get('data-nosnippet'), '');
});

test('un almacenamiento bloqueado no rompe el aviso ni permite etiquetas al rechazar', () => {
  const app = boot({ storageBlocked: true });
  app.choose('rejected');
  assert.equal(app.banner().removed, true);
  assert.equal(app.scripts().length, 0);
});

test('retirar una elección guardada mantiene revocación y recarga', () => {
  const app = boot({ saved: 'accepted' });
  const reset = {};
  app.documentClick({ closest: selector => selector === '[data-consent-reset]' ? reset : null });
  assert.equal(app.storage.has(key), false);
  assert.equal(app.reloads, 1);
  assert.ok(app.window.fbq.queue.some(args => args[0] === 'consent' && args[1] === 'revoke'));
});

test('el clic de WhatsApp sigue condicionado a una aceptación', () => {
  const target = {
    closest: selector => selector === 'a[href*="wa.me/"]' ? {
      href: 'https://wa.me/34631105772', getAttribute: name => name === 'data-plan' ? 'Growth' : null,
    } : null,
  };
  for (const saved of ['accepted', 'rejected']) {
    const app = boot({ saved });
    app.documentClick(target);
    assert.equal(app.calls().filter(call => call[0] === 'event' && call[1] === 'whatsapp_click').length, saved === 'accepted' ? 1 : 0);
    assert.equal(app.scripts().length, saved === 'accepted' ? 2 : 0);
  }
});

test('las 30 páginas y las fuentes de las landings usan la versión nueva sin cambios de indexabilidad', () => {
  const sitemap = readFileSync(new URL('sitemap.xml', root), 'utf8');
  const paths = [...sitemap.matchAll(/<loc>https:\/\/dania360\.com\/([^<]*)<\/loc>/g)].map(match => match[1] + 'index.html');
  assert.equal(paths.length, 30);
  paths.push('landing-src/src/templates/salones-estetica.html', 'restaurantes-src/index.html', 'cookies/index.html');
  for (const path of paths) {
    const html = readFileSync(new URL(path, root), 'utf8');
    assert.equal(html.split(version).length - 1, 1, path);
    assert.ok(!html.includes('/analytics.js?v=20261001-orange'), path);
    if (path === 'cookies/index.html') {
      // La política ya era noindex,follow: no convertir una página legal en SEO.
      assert.ok(html.includes('<meta name="robots" content="noindex,follow"'), path);
    } else {
      assert.ok(!/<meta[^>]+name="robots"[^>]+content="[^"]*\b(?:noindex|nosnippet)\b/.test(html), path);
    }
  }
});
