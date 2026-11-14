(() => {
  // Con "reducir movimiento" no se desplaza nada, pero la página sigue viva:
  // fundidos, chat que se escribe, ficha que se completa, contadores y pestañas que rotan.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;
  root.classList.add('js');
  if (reduce) root.classList.add('calm');
  const hasIO = 'IntersectionObserver' in window;

  // Ejecuta un bucle solo mientras su bloque está en pantalla.
  const whileVisible = (el, start, stop, threshold = 0.25) => {
    if (!el) return;
    if (!hasIO) { start(); return; }
    let on = false;
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !on) { on = true; start(); }
      else if (!entry.isIntersecting && on) { on = false; stop(); }
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

  // WhatsApp flotante: aparece al pasar el hero y enseña su etiqueta un momento.
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

  // Reel de vivienda: tres escenas de 5 segundos, como el guion de 15 segundos.
  const reel = document.querySelector('.reel');
  if (reel) {
    const scenes = [...reel.querySelectorAll('.reel__scene')];
    const bars = [...reel.querySelectorAll('.reel__bars span')];
    let index = 0;
    let timer = null;
    const show = (i) => {
      index = i;
      scenes.forEach((scene, n) => scene.classList.toggle('is-on', n === i));
      bars.forEach((b, n) => {
        b.classList.remove('is-on');
        b.classList.toggle('is-done', n < i);
      });
      void reel.offsetWidth;
      bars[i].classList.add('is-on');
      // Reinicia el zoom suave de la escena activa (solo en modo normal).
      const img = scenes[i].querySelector('img');
      if (img) { img.style.animation = 'none'; void img.offsetWidth; img.style.animation = ''; }
    };
    whileVisible(reel, () => { show(index); timer = setInterval(() => show((index + 1) % scenes.length), 5000); },
      () => { clearInterval(timer); timer = null; });
  }

  // Chat de visita que se escribe solo: un comprador y un propietario, por turnos.
  const chat = document.querySelector('.chat');
  if (chat) {
    const talks = [
      [['in', 'Hola, he visto el reel de la ref. EJ‑01. ¿Sigue disponible?'],
       ['out', '¡Hola! Se lo paso al agente para que te confirme disponibilidad y horario de visita.'],
       ['sys', 'Consulta derivada al agente ✓']],
      [['in', 'Estoy pensando en vender mi piso en el barrio. ¿Cómo trabajáis?'],
       ['out', 'Te llama el agente de tu zona para explicarte la valoración y el proceso. ¿A qué hora te viene bien?'],
       ['sys', 'Propietario derivado al agente ✓']],
    ];
    let talk = 0;
    let step = 0;
    let timer = null;
    let running = false;
    const add = (kind, text) => {
      const p = document.createElement('p');
      p.className = `chat__msg chat__msg--${kind}`;
      p.textContent = text;
      chat.appendChild(p);
      return p;
    };
    const next = () => {
      if (!running) return;
      const lines = talks[talk];
      if (step === 0) chat.textContent = '';
      if (step >= lines.length) {
        step = 0;
        talk = (talk + 1) % talks.length;
        timer = setTimeout(next, 3200);
        return;
      }
      const [kind, text] = lines[step];
      step += 1;
      if (kind === 'sys') { add(kind, text); timer = setTimeout(next, 900); return; }
      const typing = add(kind, '•••');
      typing.classList.add('is-typing');
      timer = setTimeout(() => {
        typing.classList.remove('is-typing');
        typing.textContent = text;
        timer = setTimeout(next, 1300);
      }, kind === 'in' ? 900 : 1300);
    };
    whileVisible(chat, () => { running = true; step = 0; next(); }, () => { running = false; clearTimeout(timer); });
  }

  // Ficha del inmueble: la agencia confirma cada dato y queda lista para publicar.
  const listing = document.querySelector('.listing');
  if (listing) {
    const checks = [...listing.querySelectorAll('.listing__checks li')];
    let n = 0;
    let timer = null;
    const tick = () => {
      if (n < checks.length) {
        checks[n].classList.add('is-ok');
        n += 1;
        if (n === checks.length) listing.classList.add('is-ready');
        timer = setTimeout(tick, n === checks.length ? 4200 : 950);
      } else {
        n = 0;
        listing.classList.remove('is-ready');
        checks.forEach((li) => li.classList.remove('is-ok'));
        timer = setTimeout(tick, 900);
      }
    };
    whileVisible(listing, () => { timer = setTimeout(tick, 700); }, () => clearTimeout(timer), 0.1);
  }

  // Embudo: cada fase se ilumina por turnos; en modo normal caen además dos puntos.
  const funnel = document.querySelector('[data-funnel]');
  if (funnel) {
    const steps = [...funnel.querySelectorAll('.funnel__step')];
    let i = 0;
    let timer = null;
    const light = () => {
      steps.forEach((s, n) => s.classList.toggle('is-now', n === i));
      i = (i + 1) % steps.length;
    };
    whileVisible(funnel, () => { funnel.classList.add('is-live'); light(); timer = setInterval(light, 1800); },
      () => { funnel.classList.remove('is-live'); clearInterval(timer); });
  }

  // Pestañas por tipo de inmobiliaria: rotan solas hasta que alguien las toca.
  document.querySelectorAll('[data-tabs]').forEach((box) => {
    const tabs = [...box.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
    const timerBar = box.querySelector('.tabs__timer span');
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
      if (timerBar) { timerBar.style.animation = 'none'; void timerBar.offsetWidth; timerBar.style.animation = ''; }
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
    box.addEventListener('focusin', (event) => { if (event.target.closest('a, [role="tab"]')) stop(); });
    select(0, false);
    whileVisible(box, () => {
      if (box.classList.contains('is-manual')) return;
      box.classList.add('is-auto');
      select(current, false);
      timer = setInterval(() => select((current + 1) % tabs.length, false), 7000);
    }, () => { clearInterval(timer); timer = null; box.classList.remove('is-auto'); }, 0.35);
  });

  // Semana de contenido: el día activo avanza como en un calendario.
  const week = document.querySelector('[data-week]');
  if (week) {
    const days = [...week.querySelectorAll('.day')];
    let d = 0;
    let timer = null;
    const move = () => {
      days.forEach((day, n) => day.classList.toggle('is-now', n === d));
      d = (d + 1) % days.length;
    };
    whileVisible(week, () => { move(); timer = setInterval(move, 1900); }, () => clearInterval(timer));
  }

  // Difusión: la ficha llega a cada canal, uno detrás de otro.
  const broadcast = document.querySelector('[data-broadcast]');
  if (broadcast) {
    const channels = [...broadcast.querySelectorAll('.broadcast__channels li')];
    let c = 0;
    let timer = null;
    const send = () => {
      if (c < channels.length) {
        channels[c].classList.add('is-on');
        c += 1;
        timer = setTimeout(send, c === channels.length ? 3200 : 700);
      } else {
        c = 0;
        channels.forEach((ch) => ch.classList.remove('is-on'));
        timer = setTimeout(send, 800);
      }
    };
    whileVisible(broadcast, () => { timer = setTimeout(send, 400); }, () => clearTimeout(timer));
  }

  // Tarjetas que se inclinan hacia el ratón (solo ratón y sin reducir movimiento).
  if (fine && !reduce) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-3px)`;
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
  document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el));

  // Ficha técnica: los números cuentan hasta su valor real, que ya está en el HTML.
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
})();
