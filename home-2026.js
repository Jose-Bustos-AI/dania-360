/* Portada de Dania360: apariciones, contadores y ejemplo vivo del hero.
   Sin JavaScript la página se ve completa; con reducir movimiento se usan fundidos. */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var calm = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var hasObserver = 'IntersectionObserver' in window;

  // Cabecera con sombra al desplazarse y botones de WhatsApp que aparecen tras el hero.
  var header = document.querySelector('[data-header]');
  var hero = document.getElementById('inicio');
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

  // El menú móvil se cierra al elegir un enlace o al pulsar fuera.
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
  var steps = document.querySelector('[data-steps]');

  if (hasObserver) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-in');
        el.querySelectorAll('[data-count]').forEach(runCount);
        revealObserver.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealItems.forEach(function (el) { revealObserver.observe(el); });

    // Contadores que no están dentro de un bloque con aparición.
    var looseCounters = Array.prototype.filter.call(document.querySelectorAll('[data-count]'), function (el) {
      return !el.closest('[data-reveal]');
    });
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    looseCounters.forEach(function (el) { countObserver.observe(el); });

    if (steps) {
      var stepsObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          steps.classList.add('is-in');
          stepsObserver.disconnect();
        }
      }, { threshold: 0.3 });
      stepsObserver.observe(steps);
    }
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-in'); });
    if (steps) steps.classList.add('is-in');
  }

  // Ejemplo vivo del hero: rota publicaciones, llena el calendario y escribe el chat.
  // Funciona también con reducir movimiento: el CSS cambia desplazamientos por fundidos.
  var live = document.querySelector('[data-live]');
  if (!live) return;
  var posts = live.querySelectorAll('.live-post');
  var dots = live.querySelectorAll('.phone__dots i');
  var cells = live.querySelectorAll('[data-calendar] i');
  var chat = live.querySelector('[data-chat]');
  var chatSteps = chat ? Array.prototype.slice.call(chat.children) : [];
  chatSteps.forEach(function (el) { el.setAttribute('data-step', ''); });

  var running = false;
  var timers = [];
  var postIndex = 0;
  var filled = 0;

  function later(fn, ms) { timers.push(window.setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(window.clearTimeout); timers = []; }

  function showPost(index) {
    posts.forEach(function (post, i) { post.classList.toggle('is-active', i === index); });
    dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === index); });
  }

  function rotatePosts() {
    if (!running) return;
    postIndex = (postIndex + 1) % posts.length;
    showPost(postIndex);
    later(rotatePosts, 3600);
  }

  function fillCalendar() {
    if (!running) return;
    if (filled >= cells.length) {
      later(function () {
        cells.forEach(function (cell) { cell.classList.remove('is-on'); });
        filled = 0;
        fillCalendar();
      }, 2400);
      return;
    }
    cells[filled].classList.add('is-on');
    filled += 1;
    later(fillCalendar, 140);
  }

  // La pregunta queda siempre a la vista; se repiten la escritura y la respuesta.
  if (chatSteps[0]) chatSteps[0].classList.add('is-shown');
  function playChat() {
    if (!running || chatSteps.length < 3) return;
    chatSteps[2].classList.remove('is-shown');
    later(function () { chatSteps[1].classList.add('is-shown'); }, 700);
    later(function () {
      chatSteps[1].classList.remove('is-shown');
      chatSteps[2].classList.add('is-shown');
    }, 2300);
    later(playChat, 7600);
  }

  function start() {
    if (running) return;
    running = true;
    later(rotatePosts, 3200);
    fillCalendar();
    playChat();
  }

  function stop() {
    running = false;
    clearTimers();
  }

  // Sin ejecutar nada mientras el hero no se ve o la pestaña está oculta.
  if (hasObserver) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !document.hidden) start();
      else stop();
    }, { threshold: 0.15 }).observe(live);
  } else {
    start();
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (live.getBoundingClientRect().bottom > 0) start();
  });
})();
