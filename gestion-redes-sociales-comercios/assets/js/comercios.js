(() => {
  // Con "reducir movimiento" nada se desplaza, pero el escaparate cambia, el chat se escribe,
  // los contadores cuentan y las etiquetas cambian de color: la página sigue viva.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const io = 'IntersectionObserver' in window;
  const root = document.documentElement;
  root.classList.add('js');
  if (reduce) root.classList.add('calm');

  // Ejecuta cb(true/false) cuando el elemento entra o sale de pantalla.
  const watch = (el, cb, threshold = 0.25) => {
    if (!io) { cb(true); return; }
    new IntersectionObserver(([entry]) => cb(entry.isIntersecting), { threshold }).observe(el);
  };
  // Intervalo que solo corre mientras el bloque se ve.
  const loopWhileVisible = (el, fn, ms, threshold, immediate = false) => {
    let timer = null;
    watch(el, (on) => {
      if (on && !timer) { if (immediate) fn(); timer = setInterval(fn, ms); }
      else if (!on && timer) { clearInterval(timer); timer = null; }
    }, threshold);
  };

  // Barra de progreso de lectura.
  const bar = document.querySelector('.progress span');
  if (bar) {
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // Botón flotante de WhatsApp: aparece al pasar el hero y enseña la etiqueta una vez.
  const float = document.querySelector('.wa-float');
  const hero = document.querySelector('.hero');
  if (float && hero && io) {
    let shown = false;
    watch(hero, (on) => {
      float.classList.toggle('is-on', !on);
      if (!on && !shown) {
        shown = true;
        float.classList.add('is-open');
        setTimeout(() => float.classList.remove('is-open'), 4500);
      }
    }, 0.12);
  } else if (float) {
    float.classList.add('is-on');
  }

  // Escaparate del hero: cambia de tema cada pocos segundos (fundido; en modo normal, además, las etiquetas caen y se balancean).
  const front = document.querySelector('[data-shopfront]');
  if (front) {
    const scenes = [...front.querySelectorAll('.scene')];
    const dots = [...front.querySelectorAll('.shopfront__dots i')];
    let s = 0;
    loopWhileVisible(front, () => {
      s = (s + 1) % scenes.length;
      scenes.forEach((scene, i) => scene.classList.toggle('is-on', i === s));
      dots.forEach((dot, i) => dot.classList.toggle('is-on', i === s));
    }, 3400, 0.2);
  }

  // Pestañas por tipo de tienda: rotan solas hasta que alguien las toca.
  document.querySelectorAll('[data-tabs]').forEach((box) => {
    const tabs = [...box.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
    const run = box.querySelector('.types__run span');
    let current = 0;
    let timer = null;
    const restartRun = () => {
      if (!run) return;
      run.classList.remove('is-running');
      void run.offsetWidth;
      run.classList.add('is-running');
    };
    const select = (index, focus) => {
      current = index;
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (timer) restartRun();
      if (focus) tabs[index].focus();
    };
    const stop = () => { clearInterval(timer); timer = null; box.classList.remove('is-auto'); box.classList.add('is-manual'); };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => { stop(); select(i, false); });
      tab.addEventListener('keydown', (event) => {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (event.key in keys) {
          event.preventDefault(); stop();
          select((i + keys[event.key] + tabs.length) % tabs.length, true);
        } else if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault(); stop();
          select(event.key === 'Home' ? 0 : tabs.length - 1, true);
        }
      });
    });
    box.addEventListener('focusin', stop);
    // Al pasar el ratón, se pausa sin quedarse en manual.
    box.addEventListener('pointerenter', () => { if (timer) { clearInterval(timer); timer = null; box.classList.remove('is-auto'); } });
    select(0, false);
    const startAuto = () => {
      if (timer || box.classList.contains('is-manual')) return;
      box.classList.add('is-auto');
      restartRun();
      timer = setInterval(() => select((current + 1) % tabs.length, false), 6000);
    };
    box.addEventListener('pointerleave', () => { if (inView) startAuto(); });
    let inView = false;
    watch(box, (on) => {
      inView = on;
      if (on) startAuto();
      else if (timer) { clearInterval(timer); timer = null; box.classList.remove('is-auto'); }
    }, 0.35);
  });

  // Móvil: las novedades rotan y el chat de "¿lo tenéis en mi talla?" se escribe solo, marcando cada paso del recorrido.
  const feed = document.querySelector('[data-feed]');
  if (feed) {
    const posts = [...feed.querySelectorAll('.post')];
    let p = 0;
    loopWhileVisible(feed, () => {
      p = (p + 1) % posts.length;
      posts.forEach((post, i) => post.classList.toggle('is-on', i === p));
    }, 3200, 0.3);
  }
  const chat = document.querySelector('[data-chat]');
  if (chat) {
    const msgs = [...chat.querySelectorAll('.msg:not(.msg--typing)')];
    const typing = chat.querySelector('.msg--typing');
    const steps = [...document.querySelectorAll('[data-step]')];
    msgs.forEach((m) => { m.dataset.full = m.textContent; });
    let active = false;
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const whenVisible = async () => { while (!active || document.hidden) await sleep(400); };
    const mark = (n) => steps.forEach((step, i) => step.classList.toggle('is-now', i === n));
    const play = async () => {
      for (;;) {
        await whenVisible();
        msgs.forEach((m) => { m.classList.remove('is-on', 'is-typing'); if ('type' in m.dataset) m.textContent = ''; });
        feed?.classList.remove('is-saved');
        mark(0);
        await sleep(1000);
        feed?.classList.add('is-saved');
        mark(1);
        await sleep(900);
        for (const m of msgs) {
          await whenVisible();
          if (m.classList.contains('msg--out') && typing) {
            typing.classList.add('is-on');
            await sleep(1300);
            typing.classList.remove('is-on');
          }
          m.classList.add('is-on');
          if ('type' in m.dataset) {
            m.classList.add('is-typing');
            const full = m.dataset.full;
            for (let i = 1; i <= full.length; i += 1) {
              m.textContent = full.slice(0, i);
              await sleep(58);
            }
            m.classList.remove('is-typing');
          }
          if (m.dataset.mark) mark(Number(m.dataset.mark));
          await sleep(m.classList.contains('msg--sys') ? 1400 : 1200);
        }
        mark(4);
        await sleep(4200);
      }
    };
    watch(chat, (on) => { active = on; }, 0.3);
    play();
  }

  // Etiquetas de "qué publicar": una se ilumina por turnos (en modo normal, además, se balancean).
  const tags = [...document.querySelectorAll('.tags .tag')];
  if (tags.length) {
    let t = -1;
    loopWhileVisible(tags[0].parentElement, () => {
      t = (t + 1) % tags.length;
      tags.forEach((tag, i) => tag.classList.toggle('is-lit', i === t));
    }, 1700, 0.15, true);
  }

  // Calendario: el día activo avanza.
  const calendar = document.querySelector('[data-calendar]');
  if (calendar) {
    const days = [...calendar.querySelectorAll('article')];
    const states = days.map((day) => day.querySelector('.calendar__state'));
    let d = -1;
    loopWhileVisible(calendar, () => {
      d = (d + 1) % days.length;
      days.forEach((day, i) => {
        day.classList.toggle('is-now', i === d);
        if (states[i]) states[i].textContent = i === d ? 'Publicando' : (i < d ? 'Publicado' : 'Listo');
      });
    }, 2300, 0.3, true);
  }

  // Tarjetas que se inclinan hacia el ratón (solo ratón y sin reducir movimiento).
  if (fine && !reduce) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  if (!io) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Aparición al entrar en pantalla (solo fundido si se reduce el movimiento).
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el));

  // Tique: los números cuentan hasta su valor real, que ya está en el HTML.
  const counter = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      counter.unobserve(entry.target);
      const el = entry.target;
      const target = Number(el.dataset.count);
      if (!target) return;
      const start = performance.now();
      const duration = target > 100 ? 1500 : 1100;
      const step = (now) => {
        const k = Math.min(1, (now - start) / duration);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(step);
      };
      el.textContent = '0';
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => counter.observe(el));
})();
