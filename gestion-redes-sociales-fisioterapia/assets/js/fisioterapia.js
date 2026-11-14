(() => {
  // Con "reducir movimiento" nada se desplaza, pero la página sigue viva: fundidos, chat que se escribe,
  // contadores, pestañas y zonas del cuerpo que cambian solas, día activo del plan semanal.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;
  const hasIO = 'IntersectionObserver' in window;
  root.classList.add('js');
  if (reduce) root.classList.add('calm');

  // Ejecuta un temporizador solo mientras el elemento está en pantalla.
  const whileVisible = (el, start, stop, threshold = 0.3) => {
    if (!hasIO) { start(); return; }
    new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold }).observe(el);
  };

  // Barra de progreso de lectura.
  const bar = document.querySelector('.progress span');
  if (bar) {
    let ticking = false;
    const update = () => {
      const max = root.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // Botón flotante de WhatsApp: aparece al pasar el hero y enseña su texto un momento.
  const float = document.querySelector('.wa-float');
  const hero = document.querySelector('.hero');
  if (float && hero && hasIO) {
    let shown = false;
    new IntersectionObserver(([entry]) => {
      float.classList.toggle('is-on', !entry.isIntersecting);
      if (!entry.isIntersecting && !shown) {
        shown = true;
        float.classList.add('is-open');
        setTimeout(() => float.classList.remove('is-open'), 4500);
      }
    }, { threshold: 0.12 }).observe(hero);
  } else if (float) {
    float.classList.add('is-on');
  }

  // Chat de cita que se escribe solo (también en modo calm: escribir no desplaza nada).
  const chat = document.querySelector('.chat__body');
  if (chat) {
    const msgs = [...chat.querySelectorAll('[data-type]')];
    const texts = msgs.map((m) => m.textContent);
    let timers = [];
    let running = false;
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    const reset = () => msgs.forEach((m) => { m.hidden = true; m.textContent = ''; m.className = m.className.replace(/\s?is-(typing|waiting)/g, ''); });
    const play = () => {
      reset();
      let t = 500;
      msgs.forEach((m, i) => {
        const text = texts[i];
        const incoming = m.classList.contains('chat__msg--in');
        const sys = m.classList.contains('chat__msg--sys');
        later(() => {
          m.hidden = false;
          if (sys) { m.textContent = text; return; }
          m.classList.add(incoming ? 'is-waiting' : 'is-typing');
          if (incoming) m.textContent = 'escribiendo…';
        }, t);
        if (sys) { t += 1400; return; }
        if (incoming) {
          t += 900;
          later(() => { m.classList.remove('is-waiting'); m.textContent = text; }, t);
          t += 900;
        } else {
          for (let c = 1; c <= text.length; c += 1) later(() => { m.textContent = text.slice(0, c); }, t + c * 32);
          t += text.length * 32 + 200;
          later(() => m.classList.remove('is-typing'), t);
          t += 800;
        }
      });
      later(play, t + 4200);
    };
    whileVisible(chat, () => { if (!running) { running = true; play(); } }, () => {
      running = false; clear();
      msgs.forEach((m, i) => { m.hidden = false; m.textContent = texts[i]; m.classList.remove('is-typing', 'is-waiting'); });
    }, 0.2);
  }

  // Pestañas por tipo de centro: rotan solas hasta que alguien las toca.
  document.querySelectorAll('[data-tabs]').forEach((box) => {
    const tabs = [...box.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
    const run = box.querySelector('.tabs__run span');
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
      restartRun();
      if (focus) tabs[index].focus();
    };
    const stop = () => { clearInterval(timer); timer = null; box.classList.add('is-manual'); box.classList.remove('is-auto'); };
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
    box.addEventListener('focusin', (event) => { if (event.target.closest('.tabs__panel')) stop(); });
    select(0, false);
    whileVisible(box, () => {
      if (timer || box.classList.contains('is-manual')) return;
      box.classList.add('is-auto');
      restartRun();
      timer = setInterval(() => select((current + 1) % tabs.length, false), 6000);
    }, () => { clearInterval(timer); timer = null; box.classList.remove('is-auto'); }, 0.35);
  });

  // Mapa corporal: la zona elegida se ilumina y muestra sus ideas de contenido.
  document.querySelectorAll('[data-zones]').forEach((stage) => {
    const chips = [...stage.querySelectorAll('.bodymap__chips [data-zone]')];
    const zones = [...stage.querySelectorAll('.zone[data-zone]')];
    const cards = [...stage.querySelectorAll('[data-zone-card]')];
    const ids = chips.map((c) => c.dataset.zone);
    let current = 0;
    let timer = null;
    let manual = false;
    const show = (id) => {
      current = Math.max(0, ids.indexOf(id));
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.zone === id)));
      zones.forEach((z) => z.classList.toggle('is-on', z.dataset.zone === id));
      cards.forEach((card) => { card.hidden = card.dataset.zoneCard !== id; });
    };
    const stop = () => { manual = true; clearInterval(timer); timer = null; };
    chips.forEach((c) => c.addEventListener('click', () => { stop(); show(c.dataset.zone); }));
    zones.forEach((z) => z.addEventListener('click', () => { stop(); show(z.dataset.zone); }));
    show(ids[0]);
    whileVisible(stage, () => {
      if (timer || manual) return;
      timer = setInterval(() => show(ids[(current + 1) % ids.length]), 4500);
    }, () => { clearInterval(timer); timer = null; }, 0.35);
  });

  // Plan semanal: el día activo avanza como una agenda.
  const week = document.querySelector('.week__grid');
  if (week) {
    const days = [...week.querySelectorAll('.day')];
    let d = (new Date().getDay() + 6) % 7;
    let timer = null;
    days[d].classList.add('is-now');
    whileVisible(week, () => {
      if (timer) return;
      timer = setInterval(() => {
        days[d].classList.remove('is-now');
        d = (d + 1) % days.length;
        days[d].classList.add('is-now');
      }, 2200);
    }, () => { clearInterval(timer); timer = null; }, 0.25);
  }

  // Tarjetas que se inclinan hacia el ratón (solo con ratón y sin reducir movimiento).
  if (fine && !reduce) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  if (!hasIO) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Aparición al entrar en pantalla (solo fundido en modo calm).
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el));

  // Contadores: cuentan hasta su valor real, que ya está escrito en el HTML.
  const counter = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      counter.unobserve(entry.target);
      const el = entry.target;
      const target = Number(el.dataset.count);
      if (!target) return;
      const start = performance.now();
      const duration = 1300;
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(step);
      };
      el.textContent = '0';
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => counter.observe(el));
})();
