(() => {
  // Landings sectoriales generadas. Sin librerías. Con "reducir movimiento" nada se desplaza,
  // se inclina ni hace zoom, pero la página sigue viva: fundidos, chat que se escribe,
  // contadores, publicaciones que se turnan por fundido y elementos que cambian de color.
  const d = document;
  const root = d.documentElement;
  window.sxReady = true;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) root.classList.add('calm');
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasIO = 'IntersectionObserver' in window;
  const $$ = (selector, scope = d) => [...scope.querySelectorAll(selector)];
  const wait = (ms) => new Promise((done) => setTimeout(done, ms));
  const below = (el) => el.getBoundingClientRect().top > innerHeight;

  // Llama a fn(true|false) al entrar o salir de pantalla.
  const watch = (el, fn, options = {threshold: 0.2}) => {
    if (!el) return;
    if (!hasIO) { fn(true); return; }
    new IntersectionObserver((entries) => entries.forEach((e) => fn(e.isIntersecting, e)), options).observe(el);
  };
  // Repite fn cada ms solo mientras el bloque está en pantalla.
  const loopWhileVisible = (el, fn, ms, options, onStop) => {
    let timer = 0;
    watch(el, (on) => {
      if (on && !timer) timer = setInterval(fn, ms);
      else if (!on && timer) { clearInterval(timer); timer = 0; if (onStop) onStop(); }
    }, options);
  };

  // Barra de progreso de lectura.
  const bar = d.querySelector('.progress span');
  if (bar) {
    let ticking = false;
    const update = () => {
      const max = root.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, {passive: true});
    update();
  }

  // WhatsApp flotante: aparece al dejar atrás los botones del hero (en móvil el hero es muy alto)
  // y se aparta cuando ya hay una llamada final en pantalla.
  const float = d.querySelector('.wa-float');
  const hero = d.querySelector('.hero .actions') || d.querySelector('.hero');
  if (float && hero && hasIO) {
    const state = {past: false, blockers: new Set()};
    let opened = false;
    const sync = () => {
      const on = state.past && !state.blockers.size;
      float.classList.toggle('is-on', on);
      if (on && !opened) {
        opened = true;
        float.classList.add('is-open');
        setTimeout(() => float.classList.remove('is-open'), 4500);
      }
    };
    watch(hero, (on, e) => { state.past = !on && e.boundingClientRect.top < 0; sync(); }, {threshold: 0});
    $$('.closing, .site-footer').forEach((el) => watch(el, (on) => { state.blockers[on ? 'add' : 'delete'](el); sync(); }, {threshold: 0}));
  } else if (float) {
    float.classList.add('is-on');
  }

  // Móvil del hero: tres publicaciones que se turnan y un chat que se escribe solo.
  const live = d.querySelector('[data-live]');
  if (live) {
    const posts = $$('.live-post', live);
    const dots = $$('.live-dots i', live);
    let current = 0;
    watch(live, (on) => live.classList.toggle('is-inview', on), {threshold: 0.1});
    loopWhileVisible(live, () => {
      current = (current + 1) % posts.length;
      posts.forEach((post, i) => post.classList.toggle('is-active', i === current));
      dots.forEach((dot, i) => dot.classList.toggle('is-on', i === current));
    }, 3400, {threshold: 0.1});

    const chat = live.querySelector('[data-chat]');
    const msgs = $$('.live-msg', chat).map((el) => ({el, text: el.textContent}));
    let visible = false;
    let running = false;
    const typeInto = async (el, text) => {
      for (let i = 1; i <= text.length && visible; i += 1) {
        el.textContent = text.slice(0, i);
        await wait(text[i - 1] === ' ' ? 16 : 30);
      }
      el.textContent = text;
    };
    const play = async () => {
      if (running) return;
      running = true;
      chat.style.minHeight = `${chat.offsetHeight}px`;
      while (visible) {
        msgs.forEach(({el}) => { el.classList.remove('is-shown'); el.textContent = ''; });
        await wait(700);
        for (const {el, text} of msgs) {
          if (!visible) break;
          el.classList.add('is-shown');
          if (el.classList.contains('live-msg--sys')) {
            el.textContent = text;
            await wait(1100);
          } else {
            el.innerHTML = '<span class="live-typing"><i></i><i></i><i></i></span>';
            await wait(900);
            await typeInto(el, text);
            await wait(700);
          }
        }
        await wait(4200);
      }
      msgs.forEach(({el, text}) => { el.classList.add('is-shown'); el.textContent = text; });
      running = false;
    };
    msgs.forEach(({el}) => el.classList.add('is-shown'));
    chat.classList.add('is-scripted');
    watch(chat, (on) => { visible = on; if (on) play(); }, {threshold: 0.3});
  }

  // Aparición al hacer scroll. Solo se oculta lo que aún está por debajo de la pantalla,
  // así nada parpadea y sin JavaScript todo se ve desde el principio.
  const reveals = $$('.score, .sector-body > *, .download, .offer, #preguntas, .related, .closing').filter(below);
  reveals.forEach((el) => el.classList.add('reveal'));
  if (hasIO) {
    const revealer = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      revealer.unobserve(e.target);
    }), {rootMargin: '0px 0px -8% 0px', threshold: 0});
    reveals.forEach((el) => revealer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  // Contadores del marcador: el valor real ya está en el HTML.
  $$('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    const from = Number(el.dataset.from || 0);
    if (below(el)) el.textContent = String(from);
    let done = false;
    watch(el, (on) => {
      if (!on || done) return;
      done = true;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / 1300);
        el.textContent = String(Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, {threshold: 0.6});
  });

  // Listas y pasos del contenido: un resaltado que los recorre mientras están en el centro de la pantalla.
  $$('.sector-body ol, .sector-body ul, .sector-body dl, .sector-body .stages, .sector-body .seasons').forEach((list) => {
    if (list.parentElement.closest('.sx-walk, li, dd')) return;
    let items = [...list.children];
    if (list.tagName === 'DL') items = items.some((x) => x.tagName === 'DIV') ? items.filter((x) => x.tagName === 'DIV') : items.filter((x) => x.tagName === 'DT');
    if (items.length < 3 || items.length > 10) return;
    list.classList.add('sx-walk');
    let k = -1;
    loopWhileVisible(list, () => {
      if (items[k]) items[k].classList.remove('sx-lit');
      k = (k + 1) % items.length;
      items[k].classList.add('sx-lit');
    }, 1800, {rootMargin: '-25% 0px -25% 0px', threshold: 0}, () => {
      items.forEach((x) => x.classList.remove('sx-lit'));
      k = -1;
    });
  });

  // Tarjetas que se inclinan hacia el ratón: solo con ratón y sin reducir movimiento.
  if (fine && !reduce) {
    $$('.tilt, .sector-body .panel').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
})();
