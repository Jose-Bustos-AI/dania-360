(() => {
  // Con "reducir movimiento" nada se desplaza, pero la página sigue viva:
  // fundidos, chat que se escribe, contadores, municipios que se encienden,
  // pestañas que rotan y estados que cambian de color.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;
  const hasIO = 'IntersectionObserver' in window;
  const WA = 'https://wa.me/34631105772?text=';
  root.classList.add('js');
  if (reduce) root.classList.add('calm');

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  // Ejecuta un bucle solo mientras el elemento está en pantalla.
  const whenVisible = (el, onStart, onStop, threshold = 0.25) => {
    if (!el) return;
    if (!hasIO) { onStart(); return; }
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onStart(); else if (onStop) onStop();
    }, { threshold }).observe(el);
  };

  // Barra de progreso de lectura.
  const bar = document.querySelector('.mu-progress span');
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

  // WhatsApp flotante: aparece al pasar el hero y enseña su etiqueta una vez.
  const float = document.querySelector('.wa-float');
  const hero = document.querySelector('.mu-hero');
  if (float && hero && hasIO) {
    let shown = false;
    new IntersectionObserver(([entry]) => {
      const past = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      float.classList.toggle('is-on', past);
      if (past && !shown) {
        shown = true;
        float.classList.add('is-open');
        setTimeout(() => float.classList.remove('is-open'), 4500);
      }
    }, { threshold: 0 }).observe(hero);
  } else if (float) {
    float.classList.add('is-on');
  }

  // Móvil del hero: publicaciones que rotan y un chat que se escribe solo.
  const phone = document.querySelector('.mu-phone');
  if (phone) {
    const posts = [...phone.querySelectorAll('.mu-post')];
    const dots = [...phone.querySelectorAll('.mu-feed__dots i')];
    let p = 0;
    let postTimer = null;
    const show = (next) => {
      const prev = posts[p];
      prev.classList.remove('is-on');
      prev.classList.add('is-out');
      setTimeout(() => prev.classList.remove('is-out'), 800);
      dots[p]?.classList.remove('is-on');
      p = next;
      posts[p].classList.add('is-on');
      dots[p]?.classList.add('is-on');
    };
    whenVisible(phone, () => {
      if (!postTimer) postTimer = setInterval(() => show((p + 1) % posts.length), 2800);
    }, () => { clearInterval(postTimer); postTimer = null; }, 0.2);

    const chat = phone.querySelector('.mu-chat');
    const msgs = [...chat.querySelectorAll('.mu-chat__msg')];
    let running = false;
    let visible = false;
    const typing = (out) => {
      const el = document.createElement('span');
      el.className = `mu-chat__typing${out ? ' mu-chat__typing--out' : ''}`;
      el.innerHTML = '<i></i><i></i><i></i>';
      chat.appendChild(el);
      return el;
    };
    const play = async () => {
      if (running) return;
      running = true;
      while (visible) {
        msgs.forEach((m) => { m.classList.remove('is-shown'); m.textContent = m.dataset.text; });
        await wait(700);
        for (const m of msgs) {
          const out = m.classList.contains('mu-chat__msg--out');
          const sys = m.classList.contains('mu-chat__msg--sys');
          if (!sys) {
            const dotsEl = typing(out);
            await wait(out ? 1300 : 900);
            dotsEl.remove();
          }
          if (out) {
            // La respuesta se escribe letra a letra.
            const text = m.dataset.text;
            const written = document.createTextNode('');
            const caret = document.createElement('span');
            caret.className = 'mu-caret';
            m.textContent = '';
            m.append(written, caret);
            m.classList.add('is-shown');
            for (let i = 1; i <= text.length; i += 2) {
              written.textContent = text.slice(0, i);
              await wait(28);
            }
            m.textContent = text;
          } else {
            m.classList.add('is-shown');
          }
          await wait(sys ? 2600 : 900);
        }
        await wait(2200);
      }
      running = false;
    };
    whenVisible(chat, () => { visible = true; play(); }, () => { visible = false; }, 0.3);
  }

  // Mapa de la Región: los municipios se encienden uno tras otro hasta que eliges el tuyo.
  const map = document.querySelector('[data-map]');
  if (map) {
    const chips = [...map.querySelectorAll('.mu-map__chips button')];
    const dots = new Map([...map.querySelectorAll('.mu-dot')].map((d) => [d.dataset.city, d]));
    const card = map.querySelector('.mu-map__card');
    const nameEl = map.querySelector('[data-map-name]');
    const textEl = map.querySelector('[data-map-text]');
    const ctaEl = map.querySelector('[data-map-cta]');
    const waEl = map.querySelector('[data-map-wa]');
    const zones = {
      huerta: 'Contenido para el cliente de barrio y de pedanía y para quien llega desde la capital.',
      costa: 'Contenido que tiene en cuenta la temporada de verano y al visitante que viene de fuera.',
      interior: 'Contenido para el cliente de la comarca y para quien se acerca de visita.',
    };
    let index = Math.max(0, chips.findIndex((c) => c.getAttribute('aria-pressed') === 'true'));
    let timer = null;
    let manual = false;
    const select = (i) => {
      index = i;
      const chip = chips[i];
      const name = chip.dataset.name;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      dots.forEach((d, key) => {
        if (d.classList.contains('is-on')) d.classList.add('is-lit');
        d.classList.toggle('is-on', key === chip.dataset.city);
      });
      nameEl.textContent = name;
      textEl.textContent = `Gestión online desde el primer día y visita concertada si ayuda a preparar el contenido. ${zones[chip.dataset.zone] || ''}`.trim();
      ctaEl.textContent = `Tengo un negocio en ${name}`;
      waEl.href = WA + encodeURIComponent(`Hola, tengo un negocio en ${name} y quiero información sobre la gestión de redes sociales.`);
      card.classList.remove('is-swap');
      void card.offsetWidth;
      card.classList.add('is-swap');
    };
    const stop = () => { manual = true; clearInterval(timer); timer = null; };
    chips.forEach((chip, i) => chip.addEventListener('click', () => { stop(); select(i); }));
    dots.forEach((d) => d.addEventListener('click', () => {
      const i = chips.findIndex((c) => c.dataset.city === d.dataset.city);
      if (i >= 0) { stop(); select(i); }
    }));
    whenVisible(map, () => {
      if (timer || manual) return;
      timer = setInterval(() => {
        // Al completar la vuelta se apagan los rastros y vuelve a empezar.
        if (index === chips.length - 1) dots.forEach((d) => d.classList.remove('is-lit'));
        select((index + 1) % chips.length);
      }, 2400);
    }, () => { clearInterval(timer); timer = null; }, 0.3);
  }

  // Circuito de marketing digital: avanza solo hasta que alguien elige un paso.
  const loop = document.querySelector('[data-loop]');
  if (loop) {
    const items = [...loop.querySelectorAll('.mu-loop__steps li')];
    const panels = [...loop.querySelectorAll('.mu-loop__panels article')];
    let k = 0;
    let timer = null;
    let manual = false;
    const light = (i) => {
      k = i;
      items.forEach((li, n) => {
        li.classList.toggle('is-on', n === k);
        li.classList.toggle('is-done', n < k);
        li.querySelector('button').setAttribute('aria-pressed', String(n === k));
      });
      panels.forEach((panel, n) => panel.classList.toggle('is-on', n === k));
    };
    items.forEach((li, i) => li.querySelector('button').addEventListener('click', () => {
      manual = true; clearInterval(timer); timer = null; light(i);
    }));
    whenVisible(loop, () => {
      if (timer || manual) return;
      timer = setInterval(() => light((k + 1) % items.length), 3400);
    }, () => { clearInterval(timer); timer = null; }, 0.3);
  }

  // Tipos de negocio: pestañas que rotan solas hasta que alguien las toca.
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
      // Reinicia la barra de tiempo de la pestaña activa.
      box.classList.remove('is-auto');
      void box.offsetWidth;
      if (timer) box.classList.add('is-auto');
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
    box.addEventListener('pointerdown', stop);
    select(0, false);
    whenVisible(box, () => {
      if (timer || box.classList.contains('is-manual')) return;
      timer = setInterval(() => select((current + 1) % tabs.length, false), 6500);
      box.classList.add('is-auto');
    }, () => { if (timer) { clearInterval(timer); timer = null; box.classList.remove('is-auto'); } }, 0.35);
  });

  // Calendario local: marca el mes actual y recorre el año mientras está a la vista.
  const months = document.querySelector('[data-months]');
  if (months) {
    const cards = [...months.children];
    const now = new Date().getMonth();
    cards.forEach((li) => {
      if (li.dataset.m.split(' ').map(Number).includes(now)) li.classList.add('is-now');
    });
    let f = -1;
    let timer = null;
    whenVisible(months, () => {
      if (timer) return;
      timer = setInterval(() => {
        cards[f]?.classList.remove('is-focus');
        f = (f + 1) % cards.length;
        if (!cards[f].classList.contains('is-now')) cards[f].classList.add('is-focus');
      }, 1500);
    }, () => { clearInterval(timer); timer = null; cards.forEach((li) => li.classList.remove('is-focus')); }, 0.3);
  }

  // Comparativa: en el móvil alterna sola entre los dos modelos; en todas las
  // pantallas las filas se iluminan una a una.
  const compare = document.querySelector('[data-compare]');
  if (compare) {
    const buttons = [...compare.querySelectorAll('[data-side]')];
    const rows = [...compare.querySelectorAll('tbody tr')];
    let side = 'team';
    let manual = false;
    let sideTimer = null;
    let rowTimer = null;
    let r = -1;
    const setSide = (value) => {
      side = value;
      compare.dataset.show = value;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.side === value)));
    };
    setSide('team');
    buttons.forEach((b) => b.addEventListener('click', () => {
      manual = true; clearInterval(sideTimer); sideTimer = null; setSide(b.dataset.side);
    }));
    whenVisible(compare, () => {
      if (!sideTimer && !manual) sideTimer = setInterval(() => setSide(side === 'team' ? 'agency' : 'team'), 5000);
      if (!rowTimer) rowTimer = setInterval(() => {
        rows[r]?.classList.remove('is-hot');
        r = (r + 1) % rows.length;
        rows[r].classList.add('is-hot');
      }, 1600);
    }, () => {
      clearInterval(sideTimer); sideTimer = null;
      clearInterval(rowTimer); rowTimer = null;
    }, 0.3);
  }

  // Proceso: los pasos se encienden uno tras otro.
  const steps = document.querySelector('[data-steps]');
  if (steps) {
    const items = [...steps.children];
    let k = 0;
    let timer = null;
    const light = (index) => {
      k = index;
      items.forEach((li, i) => { li.classList.toggle('is-on', i === k); li.classList.toggle('is-done', i < k); });
      steps.style.setProperty('--p', String(k / (items.length - 1)));
    };
    light(0);
    whenVisible(steps, () => {
      if (!timer) timer = setInterval(() => light((k + 1) % items.length), 2400);
    }, () => { clearInterval(timer); timer = null; }, 0.3);
  }

  // Tarjetas que se inclinan hacia el ratón (solo con ratón y sin reducir movimiento).
  if (fine && !reduce) {
    document.querySelectorAll('.tilt, .mu-phone').forEach((card) => {
      const strength = card.classList.contains('mu-phone') ? 5 : 6;
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // Aparición al entrar en pantalla (fundido simple si se reduce el movimiento).
  if (!hasIO) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el));
  }

  // Cifras: cuentan hasta su valor real, que ya está escrito en el HTML.
  if (hasIO) {
    const counter = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counter.unobserve(entry.target);
        const el = entry.target;
        const target = Number(el.dataset.count);
        if (!target) return;
        const start = performance.now();
        const duration = 1400;
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
  }
})();
