/* ==========================================================================
   Dania360 · Landing salones y centros de estética
   JavaScript propio, sin dependencias. Tres responsabilidades: menú móvil,
   acordeón de preguntas y medición de los clics a WhatsApp.
   Todo el contenido es visible y utilizable aunque este archivo no cargue.
   ========================================================================== */

(function () {
  'use strict';

  /* La clase sin-js se retira en cuanto hay JavaScript: hasta ese momento los
     bloques con animación de entrada se muestran ya visibles. */
  document.documentElement.classList.remove('sin-js');

  /* --- Menú móvil ------------------------------------------------------- */

  var boton = document.querySelector('[data-menu-boton]');
  var menu = document.querySelector('[data-menu]');

  function cerrarMenu() {
    if (!boton || !menu) return;
    boton.setAttribute('aria-expanded', 'false');
    menu.setAttribute('data-abierto', 'false');
  }

  if (boton && menu) {
    boton.addEventListener('click', function () {
      var abierto = boton.getAttribute('aria-expanded') === 'true';
      boton.setAttribute('aria-expanded', String(!abierto));
      menu.setAttribute('data-abierto', String(!abierto));
    });

    /* Al saltar a una sección el menú debe desaparecer, o tapa el destino. */
    menu.addEventListener('click', function (evento) {
      if (evento.target.closest('a')) cerrarMenu();
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key !== 'Escape') return;
      if (boton.getAttribute('aria-expanded') !== 'true') return;
      cerrarMenu();
      boton.focus();
    });
  }

  /* --- Preguntas frecuentes --------------------------------------------- */

  /* Acordeón con botones reales: accesible por teclado y anunciado por los
     lectores de pantalla mediante aria-expanded y aria-controls. */
  var preguntas = document.querySelectorAll('[data-faq-pregunta]');

  Array.prototype.forEach.call(preguntas, function (pregunta) {
    pregunta.addEventListener('click', function () {
      var respuesta = document.getElementById(
        pregunta.getAttribute('aria-controls'),
      );
      if (!respuesta) return;
      var abierta = pregunta.getAttribute('aria-expanded') === 'true';
      pregunta.setAttribute('aria-expanded', String(!abierta));
      respuesta.setAttribute('data-abierta', String(!abierta));
    });
  });

  /* --- Aparición al desplazar ------------------------------------------- */

  var bloques = document.querySelectorAll('.revelar');
  var reduceMovimiento =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduceMovimiento) {
    Array.prototype.forEach.call(bloques, function (bloque) {
      bloque.setAttribute('data-visible', 'true');
    });
  } else {
    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          entrada.target.setAttribute('data-visible', 'true');
          observador.unobserve(entrada.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    Array.prototype.forEach.call(bloques, function (bloque) {
      observador.observe(bloque);
    });
  }

  /* --- Medición de los clics a WhatsApp ---------------------------------- */

  /*
   * Se empuja un evento `whatsapp_click` a dataLayer con el lugar del botón y,
   * cuando corresponde, el plan. No se declara aquí ningún identificador de
   * Google Analytics ni de Google Ads: el contenedor de etiquetas es quien
   * decide qué hacer con el evento. Si no existe un contenedor, el array se
   * crea igualmente y no se pierde nada.
   */
  window.dataLayer = window.dataLayer || [];

  document.addEventListener('click', function (evento) {
    var enlace = evento.target.closest('a[data-cta-location]');
    if (!enlace) return;

    window.dataLayer.push({
      event: 'whatsapp_click',
      cta_location: enlace.getAttribute('data-cta-location'),
      plan: enlace.getAttribute('data-plan') || null,
      destino: enlace.getAttribute('href'),
      pagina: '/salones-estetica/',
    });
  });
})();
