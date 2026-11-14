/* ==========================================================================
   Dania360 · Marketing para peluquerías y centros de estética
   JavaScript propio, sin dependencias. Todo el contenido es visible y
   utilizable aunque este archivo no cargue (clase sin-js en <html>).

   Con "reducir movimiento" (modo calm) no se desplaza ni se amplía nada,
   pero la página sigue viva: el chat se escribe, la agenda se llena con
   fundidos, los contadores cuentan, las pestañas rotan y el carrusel y la
   carta de servicios cambian de estado y de color.
   ========================================================================== */

(function () {
  'use strict';

  var raiz = document.documentElement;
  raiz.classList.remove('sin-js');
  raiz.classList.add('js');

  var calm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var ratonFino = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  var hayIO = 'IntersectionObserver' in window;
  if (calm) raiz.classList.add('calm');

  var todos = function (selector, base) {
    return Array.prototype.slice.call((base || document).querySelectorAll(selector));
  };

  /* Ejecuta una función solo mientras el elemento está en pantalla. */
  function mientrasVisible(elemento, alEntrar, alSalir, umbral) {
    if (!elemento) return;
    if (!hayIO) { alEntrar(); return; }
    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) alEntrar();
        else if (alSalir) alSalir();
      });
    }, { threshold: umbral || 0.25 }).observe(elemento);
  }

  /* --- Menú móvil ------------------------------------------------------- */

  var boton = document.querySelector('[data-menu-boton]');
  var menu = document.querySelector('[data-menu]');

  function cerrarMenu() {
    if (!boton || !menu) return;
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-label', 'Abrir el menú de navegación');
    menu.setAttribute('data-abierto', 'false');
  }

  if (boton && menu) {
    boton.addEventListener('click', function () {
      var abierto = boton.getAttribute('aria-expanded') === 'true';
      boton.setAttribute('aria-expanded', String(!abierto));
      boton.setAttribute('aria-label', abierto ? 'Abrir el menú de navegación' : 'Cerrar el menú de navegación');
      menu.setAttribute('data-abierto', String(!abierto));
    });
    /* Al saltar a una sección el menú debe desaparecer, o tapa el destino. */
    menu.addEventListener('click', function (evento) {
      if (evento.target.closest('a')) cerrarMenu();
    });
    document.addEventListener('keydown', function (evento) {
      if (evento.key !== 'Escape' || boton.getAttribute('aria-expanded') !== 'true') return;
      cerrarMenu();
      boton.focus();
    });
  }

  /* --- Barra de progreso de lectura ------------------------------------- */

  var barra = document.querySelector('.sl-progreso span');
  if (barra) {
    var pendiente = false;
    var pintarBarra = function () {
      var maximo = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.transform = 'scaleX(' + (maximo > 0 ? Math.min(1, window.scrollY / maximo) : 0) + ')';
      pendiente = false;
    };
    window.addEventListener('scroll', function () {
      if (!pendiente) { pendiente = true; requestAnimationFrame(pintarBarra); }
    }, { passive: true });
    pintarBarra();
  }

  /* --- Botón flotante de WhatsApp: aparece al pasar el hero -------------- */

  var flotante = document.querySelector('.wa-float');
  var hero = document.querySelector('[data-hero]');
  if (flotante && hero && hayIO) {
    var etiquetaMostrada = false;
    new IntersectionObserver(function (entradas) {
      var fuera = !entradas[0].isIntersecting;
      flotante.classList.toggle('is-on', fuera);
      if (fuera && !etiquetaMostrada) {
        etiquetaMostrada = true;
        flotante.classList.add('is-open');
        setTimeout(function () { flotante.classList.remove('is-open'); }, 4500);
      }
    }, { threshold: 0.12 }).observe(hero);
  } else if (flotante) {
    flotante.classList.add('is-on');
  }

  /* --- Hero: reel con rótulos y chat de reserva que se escribe solo ----- */

  var rotulos = todos('.sl-movil__rotulos p');
  var barras = todos('.sl-movil__barras i');
  if (rotulos.length && barras.length) {
    var r = -1;
    var siguienteRotulo = function () {
      r = (r + 1) % rotulos.length;
      rotulos.forEach(function (p, i) { p.classList.toggle('is-on', i === r); });
      barras.forEach(function (b, i) {
        b.classList.toggle('is-hecha', i < r);
        b.classList.remove('is-activa');
        if (i === r) { void b.offsetWidth; b.classList.add('is-activa'); }
      });
    };
    siguienteRotulo();
    setInterval(siguienteRotulo, 3000);
  }

  var chat = document.querySelector('[data-chat]');
  if (chat) {
    var mensajes = todos('.sl-chat__msg', chat);
    var temporizadores = [];
    var enMarcha = false;
    var espera = function (ms, fn) { temporizadores.push(setTimeout(fn, ms)); };
    var limpiarChat = function () {
      temporizadores.forEach(clearTimeout);
      temporizadores = [];
      todos('.sl-chat__escribiendo', chat).forEach(function (n) { n.remove(); });
      mensajes.forEach(function (m) { m.classList.remove('is-on'); m.textContent = m.getAttribute('data-texto'); });
    };
    var escribir = function (mensaje, alTerminar) {
      var texto = mensaje.getAttribute('data-texto');
      var n = 0;
      mensaje.textContent = '';
      mensaje.classList.add('is-on');
      (function letra() {
        n += 1;
        mensaje.textContent = texto.slice(0, n);
        if (n < texto.length) espera(26, letra);
        else alTerminar();
      })();
    };
    var paso = function (i) {
      if (i >= mensajes.length) {
        espera(3200, function () { limpiarChat(); espera(500, function () { paso(0); }); });
        return;
      }
      var mensaje = mensajes[i];
      if (mensaje.classList.contains('sl-chat__msg--sis')) {
        espera(500, function () { mensaje.classList.add('is-on'); paso(i + 1); });
        return;
      }
      var puntos = document.createElement('p');
      puntos.className = 'sl-chat__escribiendo' + (mensaje.classList.contains('sl-chat__msg--out') ? ' sl-chat__escribiendo--out' : '');
      puntos.innerHTML = '<i></i><i></i><i></i>';
      chat.insertBefore(puntos, mensaje);
      espera(i === 0 ? 700 : 950, function () {
        puntos.remove();
        escribir(mensaje, function () { espera(600, function () { paso(i + 1); }); });
      });
    };
    mientrasVisible(chat, function () {
      if (enMarcha) return;
      enMarcha = true;
      limpiarChat();
      paso(0);
    }, function () {
      enMarcha = false;
      limpiarChat();
      mensajes.forEach(function (m) { m.classList.add('is-on'); });
    }, 0.2);
  }

  /* --- Carta de servicios: en modo calm cambia el color de un servicio --- */

  var carta = document.querySelector('[data-carta]');
  if (carta && calm) {
    var servicios = todos('span:not(.sl-carta__copia)', carta);
    var s = 0;
    setInterval(function () {
      servicios.forEach(function (el, i) { el.classList.toggle('is-on', i === s); });
      s = (s + 1) % servicios.length;
    }, 1400);
  }

  /* --- Pestañas por tipo de salón: rotan solas hasta que alguien las toca */

  todos('[data-pestanas]').forEach(function (caja) {
    var pestanas = todos('[role="tab"]', caja);
    var paneles = pestanas.map(function (p) { return document.getElementById(p.getAttribute('aria-controls')); });
    var actual = 0;
    var reloj = null;

    var elegir = function (indice, enfocar) {
      actual = indice;
      pestanas.forEach(function (p, i) {
        var activa = i === indice;
        p.setAttribute('aria-selected', String(activa));
        p.tabIndex = activa ? 0 : -1;
        paneles[i].hidden = !activa;
        paneles[i].classList.toggle('is-entrando', activa);
      });
      if (enfocar) pestanas[indice].focus();
    };
    var parar = function () {
      clearInterval(reloj);
      reloj = null;
      caja.classList.add('is-manual');
    };

    pestanas.forEach(function (p, i) {
      p.addEventListener('click', function () { parar(); elegir(i, false); });
      p.addEventListener('keydown', function (evento) {
        var teclas = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (evento.key in teclas) {
          evento.preventDefault(); parar();
          elegir((i + teclas[evento.key] + pestanas.length) % pestanas.length, true);
        } else if (evento.key === 'Home' || evento.key === 'End') {
          evento.preventDefault(); parar();
          elegir(evento.key === 'Home' ? 0 : pestanas.length - 1, true);
        }
      });
    });
    caja.addEventListener('focusin', parar);
    elegir(0, false);

    mientrasVisible(caja, function () {
      if (reloj || caja.classList.contains('is-manual')) return;
      caja.classList.add('is-auto');
      elegir(actual, false);
      reloj = setInterval(function () { elegir((actual + 1) % pestanas.length, false); }, 6500);
    }, function () {
      if (!reloj) return;
      clearInterval(reloj);
      reloj = null;
      caja.classList.remove('is-auto');
    }, 0.35);
  });

  /* --- Agenda del salón que se va llenando ----------------------------- */

  var agenda = document.querySelector('[data-agenda]');
  if (agenda) {
    var citas = todos('.sl-cita', agenda).sort(function (a, b) {
      return Number(a.getAttribute('data-orden')) - Number(b.getAttribute('data-orden'));
    });
    var leyenda = {};
    todos('.sl-agenda__canales li', agenda).forEach(function (li) { leyenda[li.getAttribute('data-canal')] = li; });
    var total = agenda.querySelector('[data-agenda-total]');
    var c = 0;
    var relojAgenda = null;
    var pausaAgenda = null;

    var vaciar = function () {
      citas.forEach(function (cita) { cita.classList.remove('is-on', 'is-nueva'); });
      c = 0;
      if (total) total.textContent = '0';
    };
    var llenarUna = function () {
      if (c >= citas.length) {
        clearInterval(relojAgenda);
        relojAgenda = null;
        citas.forEach(function (cita) { cita.classList.remove('is-nueva'); });
        pausaAgenda = setTimeout(function () {
          vaciar();
          pausaAgenda = setTimeout(arrancar, 1100);
        }, 3600);
        return;
      }
      var cita = citas[c];
      citas.forEach(function (otra) { otra.classList.remove('is-nueva'); });
      cita.classList.add('is-on', 'is-nueva');
      var canal = leyenda[cita.getAttribute('data-canal')];
      if (canal) {
        canal.classList.add('is-ping');
        setTimeout(function () { canal.classList.remove('is-ping'); }, 700);
      }
      c += 1;
      if (total) total.textContent = String(c);
    };
    var arrancar = function () {
      if (relojAgenda) return;
      relojAgenda = setInterval(llenarUna, 800);
    };
    vaciar();
    mientrasVisible(agenda, arrancar, function () {
      clearInterval(relojAgenda);
      clearTimeout(pausaAgenda);
      relojAgenda = null;
    }, 0.3);
  }

  /* --- Carrusel de ideas de contenido ---------------------------------- */

  todos('[data-carrusel]').forEach(function (carrusel) {
    var pista = carrusel.querySelector('[data-carrusel-pista]');
    var tarjetas = todos('.sl-idea', pista);
    var actualTxt = carrusel.querySelector('[data-carrusel-actual]');
    var totalTxt = carrusel.querySelector('[data-carrusel-total]');
    var cajaPuntos = carrusel.querySelector('[data-carrusel-puntos]');
    var dos = function (n) { return (n < 10 ? '0' : '') + n; };
    var activa = 0;
    var auto = null;
    var manual = false;

    if (totalTxt) totalTxt.textContent = dos(tarjetas.length);
    var puntos = tarjetas.map(function () {
      var i = document.createElement('i');
      if (cajaPuntos) cajaPuntos.appendChild(i);
      return i;
    });

    var marcar = function (indice) {
      activa = indice;
      tarjetas.forEach(function (t, i) { t.classList.toggle('is-activa', i === indice); });
      puntos.forEach(function (p, i) { p.classList.toggle('is-on', i === indice); });
      if (actualTxt) actualTxt.textContent = dos(indice + 1);
    };
    var irA = function (indice, suave) {
      var t = tarjetas[indice];
      pista.scrollTo({ left: t.offsetLeft - pista.offsetLeft - 2, behavior: suave && !calm ? 'smooth' : 'auto' });
      marcar(indice);
    };
    var visibles = function () {
      var izq = pista.scrollLeft;
      var der = izq + pista.clientWidth;
      return tarjetas.map(function (t, i) {
        var a = t.offsetLeft - pista.offsetLeft;
        return a >= izq - 4 && a + t.offsetWidth <= der + 4 ? i : -1;
      }).filter(function (i) { return i >= 0; });
    };
    var avanzar = function () {
      if (calm) {
        /* Sin desplazar: el resaltado recorre las tarjetas que ya se ven. */
        var vistas = visibles();
        if (!vistas.length) return;
        var pos = vistas.indexOf(activa);
        marcar(vistas[(pos + 1) % vistas.length]);
      } else {
        irA((activa + 1) % tarjetas.length, true);
      }
    };
    var detener = function () { clearInterval(auto); auto = null; };
    var dejarManual = function () { manual = true; detener(); };

    var atras = carrusel.querySelector('[data-carrusel-atras]');
    var adelante = carrusel.querySelector('[data-carrusel-adelante]');
    if (atras) atras.addEventListener('click', function () { dejarManual(); irA((activa - 1 + tarjetas.length) % tarjetas.length, true); });
    if (adelante) adelante.addEventListener('click', function () { dejarManual(); irA((activa + 1) % tarjetas.length, true); });
    pista.addEventListener('pointerdown', dejarManual);
    pista.addEventListener('wheel', function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) dejarManual(); }, { passive: true });
    pista.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); dejarManual(); irA(Math.min(activa + 1, tarjetas.length - 1), true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); dejarManual(); irA(Math.max(activa - 1, 0), true); }
    });
    carrusel.addEventListener('mouseenter', detener);
    carrusel.addEventListener('mouseleave', function () { if (!manual && !auto) auto = setInterval(avanzar, 3800); });

    /* Al desplazar a mano, el índice sigue a la tarjeta más cercana. */
    var esperaScroll = null;
    pista.addEventListener('scroll', function () {
      if (!manual) return;
      clearTimeout(esperaScroll);
      esperaScroll = setTimeout(function () {
        var izq = pista.scrollLeft;
        var mejor = 0;
        var distancia = Infinity;
        tarjetas.forEach(function (t, i) {
          var d = Math.abs(t.offsetLeft - pista.offsetLeft - 2 - izq);
          if (d < distancia) { distancia = d; mejor = i; }
        });
        marcar(mejor);
      }, 120);
    }, { passive: true });

    marcar(0);
    mientrasVisible(carrusel, function () {
      if (!manual && !auto) auto = setInterval(avanzar, 3800);
    }, detener, 0.4);
  });

  /* --- Inclinación suave con el ratón (sin reducir movimiento) ---------- */

  if (ratonFino && !calm) {
    todos('.inclinar').forEach(function (tarjeta) {
      tarjeta.addEventListener('pointermove', function (e) {
        var caja = tarjeta.getBoundingClientRect();
        var x = (e.clientX - caja.left) / caja.width - 0.5;
        var y = (e.clientY - caja.top) / caja.height - 0.5;
        tarjeta.style.transform = 'perspective(800px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg) translateY(-3px)';
      });
      tarjeta.addEventListener('pointerleave', function () { tarjeta.style.transform = ''; });
    });
  }

  /* --- Aparición al desplazar y contadores ------------------------------ */

  var bloques = todos('.revelar');
  if (!hayIO) {
    bloques.forEach(function (b) { b.classList.add('is-visible'); });
    return;
  }

  var revelador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('is-visible');
      revelador.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
  bloques.forEach(function (b) { revelador.observe(b); });

  /* Los números cuentan hasta su valor real, que ya está escrito en el HTML. */
  var contador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      contador.unobserve(entrada.target);
      var el = entrada.target;
      var objetivo = Number(el.getAttribute('data-count'));
      var inicio = performance.now();
      var duracion = objetivo > 50 ? 1400 : 1000;
      var desde = objetivo === 0 ? 12 : 0;
      var dibujar = function (ahora) {
        var t = Math.min(1, (ahora - inicio) / duracion);
        var e = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(desde + (objetivo - desde) * e));
        if (t < 1) requestAnimationFrame(dibujar);
      };
      el.textContent = String(desde);
      requestAnimationFrame(dibujar);
    });
  }, { threshold: 0.6 });
  todos('[data-count]').forEach(function (el) { contador.observe(el); });
})();
