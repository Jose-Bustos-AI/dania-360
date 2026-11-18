/* Dania360 (2026): comportamiento común de las páginas principales (servicio, precios y quiénes somos).
   Cabecera, menú móvil, apariciones, contadores y piezas vivas de cada cabecera.
   Sin JavaScript la página se ve completa; con "reducir movimiento" el CSS cambia desplazamientos por fundidos. */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var calm = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var hasObserver = 'IntersectionObserver' in window;

  // Cabecera con sombra al desplazarse y botones de WhatsApp que aparecen tras la cabecera de la página.
  var header = document.querySelector('[data-header]');
  var hero = document.querySelector('[data-hero]');
  var floatButton = document.querySelector('.whatsapp-float');
  var mobileBar = document.querySelector('[data-mobile-bar]');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    var past = hero ? y > hero.offsetHeight * 0.55 : y > 400;
    if (floatButton) floatButton.classList.toggle('is-visible', past);
    if (mobileBar) mobileBar.classList.toggle('is-visible', past);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // El menú móvil se cierra al elegir un enlace, al pulsar fuera o con Escape.
  var menu = document.querySelector('.mobile-menu');
  if (menu) {
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) menu.removeAttribute('open');
    });
    document.addEventListener('click', function (event) {
      if (menu.hasAttribute('open') && !menu.contains(event.target)) menu.removeAttribute('open');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.hasAttribute('open')) {
        menu.removeAttribute('open');
        menu.querySelector('summary').focus();
      }
    });
  }

  // Contadores: el HTML ya trae la cifra real; aquí solo se anima hasta ella.
  function runCount(el) {
    var target = Number(el.getAttribute('data-count'));
    if (!target) return;
    var duration = calm.matches ? 900 : 1400;
    var start = null;
    function frame(time) {
      if (start === null) start = time;
      var progress = Math.min((time - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(frame);
    }
    el.textContent = '0';
    window.requestAnimationFrame(frame);
  }

  // Apariciones escalonadas al entrar en pantalla.
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var groups = new Map();
  revealItems.forEach(function (el) {
    var parent = el.parentElement;
    var index = groups.get(parent) || 0;
    groups.set(parent, index + 1);
    el.style.setProperty('--delay', Math.min(index * 0.08, 0.4) + 's');
  });

  if (hasObserver) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        // También se muestran los bloques que ya han quedado por encima (saltos con anclas o desplazamientos rápidos).
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
        var el = entry.target;
        el.classList.add('is-in');
        el.querySelectorAll('[data-count]').forEach(runCount);
        revealObserver.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealItems.forEach(function (el) { revealObserver.observe(el); });

    var looseCounters = Array.prototype.filter.call(document.querySelectorAll('[data-count]'), function (el) {
      return !el.closest('[data-reveal]') && !el.closest('[data-receipt]');
    });
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    looseCounters.forEach(function (el) { countObserver.observe(el); });

    document.querySelectorAll('[data-steps]').forEach(function (steps) {
      var stepsObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          steps.classList.add('is-in');
          stepsObserver.disconnect();
        }
      }, { threshold: 0.3 });
      stepsObserver.observe(steps);
    });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-in'); });
    document.querySelectorAll('[data-steps]').forEach(function (el) { el.classList.add('is-in'); });
  }

  // Bucle de una pieza viva: solo funciona mientras se ve y la pestaña está activa.
  function liveLoop(el, setup) {
    if (!el) return;
    var timers = [];
    var running = false;
    var api = {
      later: function (fn, ms) { timers.push(window.setTimeout(function () { if (running) fn(); }, ms)); },
      get running() { return running; }
    };
    var tick = setup(api);
    function start() {
      if (running) return;
      running = true;
      tick();
    }
    function stop() {
      running = false;
      timers.forEach(window.clearTimeout);
      timers = [];
    }
    if (hasObserver) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !document.hidden) start();
        else stop();
      }, { threshold: 0.15 }).observe(el);
    } else {
      start();
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (el.getBoundingClientRect().bottom > 0 && el.getBoundingClientRect().top < window.innerHeight) start();
    });
  }

  // Chat de ejemplo: la pregunta queda a la vista; se repiten la escritura y la respuesta.
  document.querySelectorAll('[data-chat]').forEach(function (chat) {
    var steps = Array.prototype.slice.call(chat.children);
    if (steps.length < 3) return;
    steps.forEach(function (el) { el.setAttribute('data-step', ''); });
    steps[0].classList.add('is-shown');
    liveLoop(chat, function (loop) {
      return function play() {
        steps[2].classList.remove('is-shown');
        loop.later(function () { steps[1].classList.add('is-shown'); }, 700);
        loop.later(function () {
          steps[1].classList.remove('is-shown');
          steps[2].classList.add('is-shown');
        }, 2300);
        loop.later(play, 7600);
      };
    });
  });

  // Tablero del mes (servicio): cada publicación pasa por las fases y se marca en el calendario.
  liveLoop(document.querySelector('[data-board]'), function (loop) {
    var board = document.querySelector('[data-board]');
    var stages = board.querySelectorAll('[data-stage]');
    var days = board.querySelectorAll('[data-day]');
    var titles = board.querySelectorAll('[data-title]');
    var nets = board.querySelectorAll('[data-net]');
    var day = Number(board.getAttribute('data-today') || 0);
    var title = 0;
    function setStage(index) {
      stages.forEach(function (stage, i) {
        stage.classList.toggle('is-done', i < index);
        stage.classList.toggle('is-current', i === index);
      });
      board.style.setProperty('--stage', String(index));
    }
    return function cycle() {
      titles.forEach(function (t, i) { t.classList.toggle('is-active', i === title); });
      setStage(0);
      loop.later(function () { setStage(1); }, 1400);
      loop.later(function () { setStage(2); }, 2800);
      loop.later(function () {
        setStage(3);
        nets.forEach(function (net, i) {
          window.setTimeout(function () { net.classList.add('is-on'); }, i * 160);
        });
        if (days[day]) days[day].classList.add('is-on');
      }, 4200);
      loop.later(function () {
        nets.forEach(function (net) { net.classList.remove('is-on'); });
        day += 1;
        if (day >= days.length) {
          day = Number(board.getAttribute('data-today') || 0);
          days.forEach(function (d, i) { if (i >= day) d.classList.remove('is-on'); });
        }
        title = (title + 1) % titles.length;
        cycle();
      }, 6200);
    };
  });

  // Desglose de la cuota (precios): las partidas se confirman una a una y luego se resaltan por turnos.
  liveLoop(document.querySelector('[data-receipt]'), function (loop) {
    var receipt = document.querySelector('[data-receipt]');
    var rows = receipt.querySelectorAll('[data-row]');
    var total = receipt.querySelector('[data-count]');
    var filled = false;
    var focus = 0;
    function highlight() {
      rows.forEach(function (row, i) { row.classList.toggle('is-focus', i === focus); });
      focus = (focus + 1) % rows.length;
      loop.later(highlight, 2200);
    }
    return function start() {
      if (filled) { highlight(); return; }
      receipt.classList.add('is-filling');
      rows.forEach(function (row, i) {
        loop.later(function () { row.classList.add('is-on'); }, 300 + i * 260);
      });
      loop.later(function () {
        filled = true;
        receipt.classList.add('is-done');
        if (total) runCount(total);
        loop.later(highlight, 1600);
      }, 300 + rows.length * 260);
    };
  });
})();
