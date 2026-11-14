(() => {
  // Con "reducir movimiento" nada se desplaza, pero la página sigue viva:
  // fundidos, chat que se escribe, contadores, pestañas y sellos que cambian de color.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;
  const hasIO = 'IntersectionObserver' in window;
  root.classList.add('js');
  if (reduce) root.classList.add('calm');

  // Ejecuta una función solo mientras el elemento está en pantalla.
  const whileVisible = (el, onShow, onHide, threshold = 0.25) => {
    if (!el) return;
    if (!hasIO) { onShow(); return; }
    new IntersectionObserver(([entry]) => (entry.isIntersecting ? onShow() : onHide && onHide()), { threshold }).observe(el);
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

  // WhatsApp flotante: aparece al pasar el hero y enseña su texto un momento.
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

  // Móvil del hero: las publicaciones de mascotas se van turnando.
  const posts = [...document.querySelectorAll('.vet-post')];
  if (posts.length > 1) {
    let p = 0;
    let feedTimer = null;
    const next = () => {
      posts[p].classList.remove('is-active');
      p = (p + 1) % posts.length;
      posts[p].classList.add('is-active');
    };
    whileVisible(document.querySelector('.vet-feed'),
      () => { if (!feedTimer) feedTimer = setInterval(next, 3200); },
      () => { clearInterval(feedTimer); feedTimer = null; }, 0.1);
  }

  // Chat de WhatsApp que se escribe solo: tutor pregunta por la vacuna y recepción recoge la consulta.
  const chat = document.querySelector('[data-chat]');
  if (chat) {
    const msgs = [...chat.querySelectorAll('.vet-chat__msg')].map((el) => ({ el, text: el.textContent }));
    chat.style.minHeight = `${chat.offsetHeight}px`;
    let visible = !hasIO;
    let running = false;
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const typeInto = async (el, text) => {
      for (let i = 1; i <= text.length; i += 1) {
        el.textContent = text.slice(0, i);
        await wait(text[i - 1] === ' ' ? 18 : 32);
      }
    };
    const reset = () => msgs.forEach(({ el }) => { el.hidden = true; el.textContent = ''; el.style.opacity = ''; });
    const play = async () => {
      if (running) return;
      running = true;
      while (visible) {
        reset();
        await wait(600);
        for (const { el, text } of msgs) {
          if (!visible) break;
          el.hidden = false;
          if (el.classList.contains('vet-chat__msg--sys')) {
            el.style.opacity = '0';
            el.textContent = text;
            await wait(30);
            el.style.transition = 'opacity .6s ease';
            el.style.opacity = '1';
            await wait(900);
          } else {
            el.innerHTML = '<span class="vet-chat__typing"><i></i><i></i><i></i></span>';
            await wait(850);
            await typeInto(el, text);
            await wait(650);
          }
        }
        await wait(3800);
      }
      running = false;
      msgs.forEach(({ el, text }) => { el.hidden = false; el.textContent = text; });
    };
    whileVisible(chat, () => { visible = true; play(); }, () => { visible = false; }, 0.2);
  }

  // Pestañas por tipo de centro: rotan solas hasta que alguien las toca.
  document.querySelectorAll('[data-tabs]').forEach((box) => {
    const tabs = [...box.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
    let current = 0;
    let timer = null;
    const select = (index, focus) => {
      current = index;
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
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
    box.addEventListener('focusin', stop);
    box.addEventListener('pointerdown', stop);
    select(0, false);
    whileVisible(box, () => {
      if (!timer && !box.classList.contains('is-manual')) {
        box.classList.add('is-auto');
        timer = setInterval(() => select((current + 1) % tabs.length, false), 6000);
      }
    }, () => { if (timer) { clearInterval(timer); timer = null; box.classList.remove('is-auto'); } }, 0.4);
  });

  // Huellas del recorrido: se encienden una tras otra y vuelven a empezar.
  const trail = document.querySelector('[data-trail]');
  if (trail) {
    const steps = [...trail.children];
    let s = -1;
    let trailTimer = null;
    const tick = () => {
      s += 1;
      if (s >= steps.length + 2) { s = -1; steps.forEach((el) => el.classList.remove('is-lit')); return; }
      if (steps[s]) steps[s].classList.add('is-lit');
    };
    whileVisible(trail, () => { if (!trailTimer) trailTimer = setInterval(tick, 900); },
      () => { clearInterval(trailTimer); trailTimer = null; }, 0.3);
  }

  // Mes tipo: la semana activa va avanzando.
  const weeks = [...document.querySelectorAll('.calendar__board .month')];
  if (weeks.length) {
    let w = 0;
    let weekTimer = null;
    weeks[0].classList.add('is-now');
    whileVisible(document.querySelector('.calendar__board'), () => {
      if (weekTimer) return;
      weekTimer = setInterval(() => {
        weeks[w].classList.remove('is-now');
        w = (w + 1) % weeks.length;
        weeks[w].classList.add('is-now');
      }, 2400);
    }, () => { clearInterval(weekTimer); weekTimer = null; }, 0.3);
  }

  // Cartilla del año: los sellos se iluminan mes a mes; al tocar uno, se queda fijo.
  const year = document.querySelector('[data-year]');
  if (year) {
    const stamps = [...year.querySelectorAll('.stamp')];
    const now = new Date().getMonth();
    if (stamps[now]) stamps[now].classList.add('is-now');
    let m = -1;
    let yearTimer = null;
    let manual = false;
    const light = (index) => stamps.forEach((el, i) => el.classList.toggle('is-on', i === index));
    const stopYear = () => { clearInterval(yearTimer); yearTimer = null; };
    stamps.forEach((el, i) => {
      el.addEventListener('click', () => {
        manual = true; stopYear();
        const pressed = el.getAttribute('aria-pressed') === 'true';
        stamps.forEach((other) => other.setAttribute('aria-pressed', 'false'));
        el.setAttribute('aria-pressed', String(!pressed));
        light(pressed ? -1 : i);
      });
    });
    year.addEventListener('focusin', () => { manual = true; stopYear(); });
    whileVisible(year, () => {
      if (manual || yearTimer) return;
      yearTimer = setInterval(() => { m = (m + 1) % stamps.length; light(m); }, 1500);
    }, stopYear, 0.3);
  }

  // Tarjetas que se inclinan hacia el ratón (solo con ratón y sin reducir movimiento).
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

  if (!hasIO) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Aparición al entrar en pantalla (fundido simple si se reduce el movimiento).
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  document.querySelectorAll('.reveal, .tag-card').forEach((el) => revealer.observe(el));

  // Contadores de las chapas: cuentan hasta el valor real, que ya está en el HTML.
  const counter = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      counter.unobserve(entry.target);
      const el = entry.target;
      const target = Number(el.dataset.count);
      if (!target) return;
      const start = performance.now();
      const duration = 1200;
      const step = (t0) => {
        const t = Math.min(1, (t0 - start) / duration);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(step);
      };
      el.textContent = '0';
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => counter.observe(el));
})();
