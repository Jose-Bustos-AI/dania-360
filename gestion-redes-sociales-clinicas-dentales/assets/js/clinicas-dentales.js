(() => {
  // Con "reducir movimiento" no se desplaza nada, pero la página sigue viva:
  // fundidos, chat que se escribe, contadores, pestañas que rotan y cambios de color.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasIO = 'IntersectionObserver' in window;
  const root = document.documentElement;
  root.classList.add('js');
  if (reduce) root.classList.add('calm');

  // Ejecuta un bucle solo mientras su bloque está en pantalla.
  const whileVisible = (el, start, stop, threshold = 0.3) => {
    if (!el) return;
    if (!hasIO) { start(); return; }
    new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold }).observe(el);
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

  // Botón flotante de WhatsApp: aparece al pasar el hero y enseña su etiqueta un momento.
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
    }, { threshold: 0.1 }).observe(hero);
  } else if (float) {
    float.classList.add('is-on');
  }

  // Móvil del hero: las publicaciones se relevan y el chat se escribe solo.
  const posts = [...document.querySelectorAll('.phone__feed .post')];
  let postTimer = null;
  let postIndex = 0;
  const nextPost = () => {
    const current = posts[postIndex];
    postIndex = (postIndex + 1) % posts.length;
    current.classList.remove('is-active');
    current.classList.add('is-leaving');
    setTimeout(() => current.classList.remove('is-leaving'), 700);
    posts[postIndex].classList.add('is-active');
  };
  const chat = document.querySelector('[data-chat]');
  const chips = [...document.querySelectorAll('.hero__chip')];
  const messages = chat ? [...chat.querySelectorAll('.chat__msg')] : [];
  let chatRun = 0;
  const wait = (ms, run) => new Promise((resolve, reject) => setTimeout(() => (run === chatRun ? resolve() : reject()), ms));
  const typeMessage = async (msg, run) => {
    const text = msg.dataset.text || msg.textContent;
    msg.textContent = '';
    msg.classList.add('is-shown', 'is-typing');
    for (let i = 1; i <= text.length; i += 1) {
      await wait(msg.classList.contains('chat__msg--in') ? 38 : 26, run);
      msg.textContent = text.slice(0, i);
    }
    msg.classList.remove('is-typing');
  };
  let chatActive = false;
  const playChat = async (run) => {
    try {
      while (run === chatRun) {
        messages.forEach((m) => { m.classList.remove('is-shown', 'is-typing'); m.textContent = m.dataset.text; });
        chips.forEach((c) => c.classList.remove('is-on'));
        await wait(700, run);
        for (const msg of messages) {
          if (msg.classList.contains('chat__msg--sys')) {
            await wait(500, run);
            msg.classList.add('is-shown');
            chips[0]?.classList.add('is-on');
          } else {
            await typeMessage(msg, run);
          }
          await wait(650, run);
        }
        await wait(900, run);
        chips[1]?.classList.add('is-on');
        await wait(4200, run);
      }
    } catch { /* bucle cancelado al salir de pantalla */ }
  };
  whileVisible(document.querySelector('.hero__visual'), () => {
    if (posts.length > 1 && !postTimer) postTimer = setInterval(nextPost, 3400);
    if (messages.length && !chatActive) { chatActive = true; playChat(++chatRun); }
  }, () => {
    clearInterval(postTimer); postTimer = null;
    if (!chatActive) return;
    chatActive = false;
    chatRun += 1; // cancela el bucle en curso
    messages.forEach((m) => { m.classList.add('is-shown'); m.classList.remove('is-typing'); m.textContent = m.dataset.text; });
    chips.forEach((c) => c.classList.add('is-on'));
  }, 0.2);

  // Pestañas de tratamientos: rotan solas hasta que alguien las toca.
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
      box.classList.add('is-restart');
      void box.offsetWidth;
      box.classList.remove('is-restart');
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
    select(0, false);
    whileVisible(box, () => {
      if (timer || box.classList.contains('is-manual')) return;
      box.classList.add('is-auto');
      select(current, false);
      timer = setInterval(() => select((current + 1) % tabs.length, false), 6000);
    }, () => {
      clearInterval(timer); timer = null; box.classList.remove('is-auto');
    }, 0.15);
  });

  // Recorrido del paciente: el paso activo avanza del reel a la reseña.
  const route = document.querySelector('[data-route]');
  if (route) {
    const stops = [...route.querySelectorAll('.route__stop')];
    let step = 0;
    let timer = null;
    let paused = false;
    const show = (index) => {
      step = index;
      stops.forEach((s, i) => { s.classList.toggle('is-now', i === index); s.classList.toggle('is-done', i < index); });
      route.style.setProperty('--progress', `${(index / (stops.length - 1)) * 100}%`);
    };
    route.addEventListener('pointerenter', () => { paused = true; });
    route.addEventListener('pointerleave', () => { paused = false; });
    stops.forEach((s, i) => s.addEventListener('pointerenter', () => show(i)));
    show(0);
    whileVisible(route, () => {
      if (!timer) timer = setInterval(() => { if (!paused) show((step + 1) % stops.length); }, 2600);
    }, () => { clearInterval(timer); timer = null; }, 0.15);
  }

  // Agenda semanal: el día que se publica "hoy" avanza.
  const agenda = document.querySelector('[data-agenda]');
  if (agenda) {
    const days = [...agenda.querySelectorAll('.agenda__day')];
    let d = 0;
    let timer = null;
    days[0].classList.add('is-now');
    whileVisible(agenda, () => {
      if (timer) return;
      timer = setInterval(() => {
        days[d].classList.remove('is-now');
        d = (d + 1) % days.length;
        days[d].classList.add('is-now');
      }, 2200);
    }, () => { clearInterval(timer); timer = null; }, 0.15);
  }

  // Tarjetas que se inclinan hacia el ratón (solo ratón y sin reducir movimiento).
  if (fine && !reduce) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-3px)`;
        card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
        card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  if (!hasIO) {
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

  // Cifras: cuentan hasta su valor real, que ya está escrito en el HTML.
  const counter = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      counter.unobserve(entry.target);
      const el = entry.target;
      const target = Number(el.dataset.count);
      if (!target) return;
      const start = performance.now();
      const duration = target > 100 ? 1400 : 1000;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => counter.observe(el));
})();
