(() => {
  // Con "reducir movimiento" nada se desplaza, pero la página sigue viva:
  // fundidos, chat que se escribe, contadores, pestañas que rotan y estados que cambian.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;
  const hasIO = 'IntersectionObserver' in window;
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

  // Botón flotante de WhatsApp: aparece al pasar el hero y enseña su etiqueta una vez.
  const float = document.querySelector('.wa-float');
  const hero = document.querySelector('.hero');
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

  // Móvil del hero: carrusel del despacho, sello de revisión y chat que se escribe solo.
  const phone = document.querySelector('.phone');
  if (phone) {
    const slides = [...phone.querySelectorAll('.slide')];
    const dots = [...phone.querySelectorAll('.slides__dots i')];
    const stamp = phone.querySelector('.stamp');
    let s = 0;
    let slideTimer = null;
    const show = (next) => {
      slides[s].classList.remove('is-on');
      slides[s].classList.add('is-out');
      const prev = slides[s];
      setTimeout(() => prev.classList.remove('is-out'), 950);
      dots[s]?.classList.remove('is-on');
      s = next;
      slides[s].classList.add('is-on');
      dots[s]?.classList.add('is-on');
      if (stamp) stamp.classList.toggle('is-on', s === slides.length - 1);
    };
    whenVisible(phone, () => {
      if (!slideTimer) slideTimer = setInterval(() => show((s + 1) % slides.length), 2600);
    }, () => { clearInterval(slideTimer); slideTimer = null; }, 0.2);

    const chat = phone.querySelector('.chat');
    const msgs = [...chat.querySelectorAll('.chat__msg')];
    let running = false;
    let visible = false;
    const typing = (out) => {
      const el = document.createElement('span');
      el.className = `chat__typing${out ? ' chat__typing--out' : ''}`;
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
          const out = m.classList.contains('chat__msg--out');
          const sys = m.classList.contains('chat__msg--sys');
          if (!sys) {
            const dotsEl = typing(out);
            await wait(out ? 1300 : 900);
            dotsEl.remove();
          }
          if (out) {
            // La respuesta del despacho se escribe letra a letra.
            const text = m.dataset.text;
            const written = document.createTextNode('');
            const caret = document.createElement('span');
            caret.className = 'caret';
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

  // Especialidades: pestañas de archivador que rotan solas hasta que alguien las toca.
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
      // Reinicia la línea de tiempo de la pestaña activa.
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

  // Expediente editorial: cada pieza pasa de borrador a revisión y a aprobada.
  const brief = document.querySelector('.brief');
  if (brief) {
    const rows = [...brief.querySelectorAll('article')];
    const count = brief.querySelector('.brief__count b');
    const labels = { draft: 'Borrador', review: 'Revisión del abogado', ok: 'Aprobado ✓' };
    const setState = (row, state) => {
      const chip = row.querySelector('.brief__status');
      chip.dataset.state = state;
      chip.textContent = labels[state];
    };
    let active = false;
    let looping = false;
    const loop = async () => {
      if (looping) return;
      looping = true;
      while (active) {
        rows.forEach((r) => { setState(r, 'draft'); r.classList.remove('is-active'); });
        brief.classList.remove('is-complete');
        brief.style.setProperty('--done', '0%');
        if (count) count.textContent = '0';
        await wait(900);
        for (let i = 0; i < rows.length && active; i++) {
          rows[i].classList.add('is-active');
          await wait(700);
          setState(rows[i], 'review');
          await wait(1300);
          setState(rows[i], 'ok');
          brief.style.setProperty('--done', `${((i + 1) / rows.length) * 100}%`);
          if (count) count.textContent = String(i + 1);
          await wait(500);
          rows[i].classList.remove('is-active');
        }
        if (!active) break;
        brief.classList.add('is-complete');
        await wait(4200);
      }
      looping = false;
    };
    whenVisible(brief, () => { active = true; loop(); }, () => { active = false; }, 0.35);
  }

  // Calendario editorial: el día activo avanza y muestra el tema de la publicación.
  const month = document.querySelector('.month');
  if (month) {
    const cells = [...month.querySelectorAll('.month__grid li')];
    const detail = month.querySelector('.month__detail');
    const dayEl = month.querySelector('.month__day');
    const kindEl = month.querySelector('.month__kind');
    const titleEl = month.querySelector('.month__title');
    const legend = [...document.querySelectorAll('.legend li')];
    let d = 0;
    let timer = null;
    const paint = (index) => {
      cells[d].classList.remove('is-now');
      d = index;
      const cell = cells[d];
      cell.classList.add('is-now');
      detail.dataset.kind = cell.dataset.kind;
      dayEl.textContent = `Día ${d + 1}`;
      kindEl.textContent = cell.dataset.label;
      titleEl.textContent = cell.dataset.title;
      detail.classList.remove('is-swap');
      void detail.offsetWidth;
      detail.classList.add('is-swap');
      legend.forEach((li) => li.classList.toggle('is-now', li.dataset.kind === cell.dataset.kind));
    };
    paint(0);
    whenVisible(month, () => {
      if (!timer) timer = setInterval(() => paint((d + 1) % cells.length), 1700);
    }, () => { clearInterval(timer); timer = null; }, 0.3);
  }

  // Recorrido del cliente: los pasos se encienden uno tras otro.
  const steps = document.querySelector('[data-steps]');
  if (steps) {
    const items = [...steps.children];
    let k = 0;
    let timer = null;
    const light = (index) => {
      k = index;
      items.forEach((li, i) => { li.classList.toggle('is-on', i === k); li.classList.toggle('is-done', i < k); });
      steps.style.setProperty('--p', `${(k / (items.length - 1)) * 100}%`);
    };
    light(0);
    whenVisible(steps, () => {
      if (!timer) timer = setInterval(() => light((k + 1) % items.length), 2400);
    }, () => { clearInterval(timer); timer = null; }, 0.3);
  }

  // Tarjetas que se inclinan hacia el ratón (solo con ratón y sin reducir movimiento).
  if (fine && !reduce) {
    document.querySelectorAll('.tilt, .phone').forEach((card) => {
      const strength = card.classList.contains('phone') ? 5 : 6;
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
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

  // Folios: las cifras cuentan hasta su valor real, que ya está en el HTML.
  if (hasIO) {
    const counter = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counter.unobserve(entry.target);
        const el = entry.target;
        const target = Number(el.dataset.count);
        if (!target) return;
        const start = performance.now();
        const duration = 1200;
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
  }
})();
