(() => {
  // Con "reducir movimiento" no se desplaza nada, pero la página sigue viva:
  // fundidos, chat y pizarra que se escriben, contadores, pestañas que rotan y meses que se iluminan.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;
  root.classList.add('js');
  if (reduce) root.classList.add('calm');
  const hasIO = 'IntersectionObserver' in window;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Ejecuta una tarea solo mientras el elemento está en pantalla.
  const whileVisible = (el, onIn, onOut, threshold = 0.3) => {
    if (!el) return;
    if (!hasIO) { onIn(); return; }
    new IntersectionObserver(([entry]) => (entry.isIntersecting ? onIn() : onOut()), { threshold }).observe(el);
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

  // Botón flotante de WhatsApp: aparece al pasar el héroe y muestra la etiqueta un momento.
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
    }, { threshold: 0.15 }).observe(hero);
  } else if (float) {
    float.classList.add('is-on');
  }

  // Móvil del héroe: las publicaciones van pasando (en modo calm, con fundido).
  const posts = [...document.querySelectorAll('.phone__feed .post')];
  if (posts.length > 1) {
    let p = 0;
    let feedTimer = null;
    const next = () => {
      const old = posts[p];
      p = (p + 1) % posts.length;
      old.classList.remove('is-on');
      old.classList.add('is-off');
      posts[p].classList.remove('is-off');
      posts[p].classList.add('is-on');
      setTimeout(() => old.classList.remove('is-off'), 800);
    };
    whileVisible(document.querySelector('.phone'),
      () => { if (!feedTimer) feedTimer = setInterval(next, 3200); },
      () => { clearInterval(feedTimer); feedTimer = null; }, 0.2);
  }

  // Chat de matrícula que se escribe solo, en bucle mientras se ve.
  const chat = document.querySelector('.chat');
  if (chat) {
    const msgs = [...chat.querySelectorAll('.chat__msg')];
    const typing = chat.querySelector('.chat__typing');
    let running = false;
    let visible = false;
    const typeInto = async (el, text) => {
      el.textContent = '';
      el.classList.add('is-shown');
      for (let i = 1; i <= text.length; i += 1) {
        el.textContent = text.slice(0, i);
        await wait(text[i - 1] === ' ' ? 18 : 34);
      }
    };
    const loop = async () => {
      if (running) return;
      running = true;
      while (visible) {
        msgs.forEach((m) => { m.classList.remove('is-shown'); m.textContent = ''; });
        for (const m of msgs) {
          if (!visible) break;
          const sys = m.classList.contains('chat__msg--sys');
          if (!sys) {
            chat.insertBefore(typing, m);
            typing.classList.toggle('is-out', m.classList.contains('chat__msg--out'));
            typing.classList.add('is-on');
            await wait(900);
            typing.classList.remove('is-on');
          }
          await typeInto(m, m.dataset.text || '');
          await wait(sys ? 600 : 500);
        }
        chat.appendChild(typing);
        await wait(4200);
      }
      msgs.forEach((m) => { m.classList.add('is-shown'); m.textContent = m.dataset.text || m.textContent; });
      running = false;
    };
    whileVisible(chat, () => { visible = true; loop(); }, () => { visible = false; }, 0.2);
  }

  // Pestañas accesibles que rotan solas hasta que alguien las toca.
  const makeTabs = (box, { interval = 6000, onSelect, start = 0 } = {}) => {
    const tabs = [...box.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
    let current = 0;
    let timer = null;
    box.style.setProperty('--run', `${interval / 1000}s`);
    const select = (index, focus) => {
      current = index;
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        if (panels[i]) panels[i].hidden = !on;
      });
      if (onSelect) onSelect(tabs[index], index);
      if (focus) tabs[index].focus();
    };
    const stop = () => { clearInterval(timer); timer = null; box.classList.add('is-manual'); };
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
    box.addEventListener('focusin', (event) => { if (event.target.closest('[role="tabpanel"], [role="tab"]')) stop(); });
    select(start, false);
    whileVisible(box, () => {
      if (!timer && !box.classList.contains('is-manual')) {
        box.classList.add('is-auto');
        timer = setInterval(() => select((current + 1) % tabs.length, false), interval);
      }
    }, () => { clearInterval(timer); timer = null; box.classList.remove('is-auto'); }, 0.35);
    return { select: (i) => { stop(); select(i, false); } };
  };

  // Agenda escolar: los meses de cada campaña se iluminan y se marca el mes actual.
  const agenda = document.querySelector('[data-agenda]');
  if (agenda) {
    const months = [...agenda.querySelectorAll('[data-month]')];
    const buttons = [...agenda.querySelectorAll('[role="tab"]')];
    const list = (value) => (value || '').split(',').filter(Boolean).map(Number);
    const camps = buttons.map((b) => ({ name: b.textContent.trim().toLowerCase(), prep: list(b.dataset.prep), peak: list(b.dataset.peak), tail: list(b.dataset.tail) }));
    const paint = (_tab, index) => {
      const c = camps[index];
      months.forEach((li) => {
        const m = Number(li.dataset.month);
        li.classList.toggle('is-prep', c.prep.includes(m));
        li.classList.toggle('is-peak', c.peak.includes(m));
        li.classList.toggle('is-tail', c.tail.includes(m));
      });
    };
    const now = new Date().getMonth();
    const names = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    months.forEach((li) => li.classList.toggle('is-today', Number(li.dataset.month) === now));
    let start = camps.findIndex((c) => c.prep.includes(now));
    let message = start >= 0 ? `Estamos en ${names[now]}: toca preparar la campaña de ${camps[start].name}.` : '';
    if (start < 0) {
      start = camps.findIndex((c) => c.peak.includes(now));
      if (start >= 0) message = `Estamos en ${names[now]}: matrícula de ${camps[start].name} abierta.`;
    }
    if (start < 0) {
      start = camps.findIndex((c) => c.tail.includes(now));
      if (start >= 0) message = `Estamos en ${names[now]}: últimas plazas de la campaña de ${camps[start].name}.`;
    }
    if (start < 0) {
      const ahead = camps.map((c, i) => ({ i, d: (Math.min(...c.prep) - now + 12) % 12 })).sort((a, b) => a.d - b.d)[0];
      start = ahead ? ahead.i : 0;
      message = `Estamos en ${names[now]}: buen momento para sostener la reputación antes de la campaña de ${camps[start].name}.`;
    }
    const nowBox = agenda.querySelector('[data-agenda-now]');
    if (nowBox && message) { nowBox.textContent = message; nowBox.hidden = false; }
    makeTabs(agenda, { interval: 6500, onSelect: paint, start });
  }

  // Pestañas por tipo de academia, y la cinta de tipos que se ilumina y abre la pestaña.
  const typeBox = document.querySelector('[data-tabs]');
  const typeTabs = typeBox ? makeTabs(typeBox, { interval: 6000 }) : null;
  const chips = [...document.querySelectorAll('[data-chip]')];
  if (chips.length) {
    let c = 0;
    let chipTimer = null;
    const light = () => {
      chips.forEach((chip, i) => chip.classList.toggle('is-lit', i === c));
      c = (c + 1) % chips.length;
    };
    whileVisible(document.querySelector('.academy-types'),
      () => { if (!chipTimer) { light(); chipTimer = setInterval(light, 1500); } },
      () => { clearInterval(chipTimer); chipTimer = null; }, 0.5);
    chips.forEach((chip) => chip.addEventListener('click', () => { if (typeTabs) typeTabs.select(Number(chip.dataset.chip)); }));
  }

  // Pizarra: el día activo avanza, se rodea con tiza y su tema se escribe solo.
  const board = document.querySelector('[data-board]');
  if (board) {
    const cells = [...board.querySelectorAll('.chalkboard__grid li')];
    const typed = board.querySelector('[data-board-type]');
    let d = 0;
    let boardTimer = null;
    let token = 0;
    const write = async (text) => {
      const mine = ++token;
      while (typed.textContent.length) {
        if (mine !== token) return;
        typed.textContent = typed.textContent.slice(0, -1);
        await wait(22);
      }
      for (let i = 1; i <= text.length; i += 1) {
        if (mine !== token) return;
        typed.textContent = text.slice(0, i);
        await wait(55);
      }
    };
    const show = (index) => {
      d = index;
      cells.forEach((cell, i) => cell.classList.toggle('is-now', i === index));
      if (typed) write(cells[index].dataset.topic || '');
    };
    const play = () => { if (!boardTimer) boardTimer = setInterval(() => show((d + 1) % cells.length), 2800); };
    const pause = () => { clearInterval(boardTimer); boardTimer = null; };
    cells.forEach((cell, i) => {
      cell.addEventListener('pointerenter', () => { pause(); show(i); });
      cell.addEventListener('pointerleave', play);
    });
    whileVisible(board, play, pause, 0.25);
  }

  // Tarjetas que se inclinan hacia el ratón (solo con ratón y sin reducir movimiento).
  if (fine && !reduce) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
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

  // Contadores: cuentan hasta el valor real, que ya está escrito en el HTML.
  const counter = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      counter.unobserve(entry.target);
      const el = entry.target;
      const target = Number(el.dataset.count);
      if (!target) return;
      const begin = performance.now();
      const duration = 1200;
      const step = (t) => {
        const k = Math.min(1, (t - begin) / duration);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(step);
      };
      el.textContent = '0';
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => counter.observe(el));
})();
