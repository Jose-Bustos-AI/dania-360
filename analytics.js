(function () {
  'use strict';

  var MEASUREMENT_ID = 'G-MDS60C48BR';
  var CONSENT_KEY = 'dania360_consent_v2';
  var META_PIXEL_ID = '1093385700325597';
  var metaLoaded = false;
  var consentChoice = null;
  var tagLoaded = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  function loadGoogleTag() {
    if (tagLoaded) return;
    tagLoaded = true;

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      send_page_view: true
    });
  }

  function loadMetaPixel() {
    if (metaLoaded) return;
    metaLoaded = true;
    if (!window.fbq) {
      var queue = window.fbq = function () {
        queue.callMethod ? queue.callMethod.apply(queue, arguments) : queue.queue.push(arguments);
      };
      if (!window._fbq) window._fbq = queue;
      queue.push = queue;
      queue.loaded = true;
      queue.version = '2.0';
      queue.queue = [];
    }
    window.fbq('consent', 'grant');
    window.fbq('set', 'autoConfig', false, META_PIXEL_ID);
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  }

  function updateConsent(choice) {
    consentChoice = choice;
    var granted = choice === 'accepted' ? 'granted' : 'denied';

    window.gtag('consent', 'update', {
      ad_storage: granted,
      ad_user_data: granted,
      ad_personalization: granted,
      analytics_storage: granted
    });

    if (choice === 'accepted') {
      loadGoogleTag();
      loadMetaPixel();
    } else if (window.fbq) {
      window.fbq('consent', 'revoke');
    }
  }

  function saveChoice(choice) {
    try {
      window.localStorage.setItem(CONSENT_KEY, choice);
    } catch (error) {
      /* La navegación sigue funcionando aunque el almacenamiento esté bloqueado. */
    }
    updateConsent(choice);
  }

  function getSavedChoice() {
    try {
      return window.localStorage.getItem(CONSENT_KEY) || consentChoice;
    } catch (error) {
      return consentChoice;
    }
  }

  function createConsentBanner() {
    var banner = document.createElement('section');
    banner.className = 'dania-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Preferencias de privacidad');
    banner.innerHTML =
      '<div class="dania-consent__copy">' +
        '<strong>Tu privacidad importa</strong>' +
        '<p>Si aceptas, usamos Google Analytics y el píxel de Meta para medir visitas y clics en WhatsApp, atribuirlos a los anuncios y optimizar las campañas. Puedes rechazar y seguir navegando.</p>' +
        '<a href="/cookies/">Ver política de cookies</a>' +
      '</div>' +
      '<div class="dania-consent__actions">' +
        '<button type="button" data-consent="rejected">Rechazar</button>' +
        '<button type="button" data-consent="accepted">Aceptar</button>' +
      '</div>';

    var style = document.createElement('style');
    style.textContent =
      '.dania-consent{position:fixed;z-index:99999;left:16px;right:16px;bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:24px;max-width:920px;margin:auto;padding:18px 20px;background:#fff;color:#25211f;border:1px solid rgba(37,33,31,.14);border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,.2);font:15px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}' +
      '.dania-consent strong{display:block;font-size:16px;margin-bottom:3px}.dania-consent p{margin:0}.dania-consent a{color:inherit;text-decoration:underline;text-underline-offset:2px}' +
      '.dania-consent__actions{display:flex;gap:10px;flex:0 0 auto}.dania-consent button{min-width:112px;padding:11px 16px;border:1px solid #94513a;border-radius:999px;background:transparent;color:#5e3022;font:700 14px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer}' +
      '.dania-consent button[data-consent="accepted"]{background:#94513a;color:#fff}.dania-consent button:focus-visible{outline:3px solid #c7a87c;outline-offset:2px}' +
      '@media(max-width:700px){.dania-consent{align-items:stretch;flex-direction:column;gap:14px;padding:16px}.dania-consent__actions{display:grid;grid-template-columns:1fr 1fr}.dania-consent button{min-width:0}}';

    document.head.appendChild(style);
    document.body.appendChild(banner);

    banner.addEventListener('click', function (event) {
      var button = event.target.closest('[data-consent]');
      if (!button) return;
      saveChoice(button.getAttribute('data-consent'));
      banner.remove();
      style.remove();
    });
  }

  var savedChoice = getSavedChoice();
  if (savedChoice === 'accepted' || savedChoice === 'rejected') {
    updateConsent(savedChoice);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createConsentBanner);
  } else {
    createConsentBanner();
  }

  document.addEventListener('click', function (event) {
    var resetButton = event.target.closest('[data-consent-reset]');
    if (!resetButton) return;

    updateConsent('rejected');
    try {
      window.localStorage.removeItem(CONSENT_KEY);
    } catch (error) {
      /* El botón sigue informando aunque el almacenamiento esté bloqueado. */
    }
    window.location.reload();
  });

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href*="wa.me/"]');
    if (!link || getSavedChoice() !== 'accepted') return;

    // Contact represents a click opening WhatsApp, not a sent message or sale.
    if (window.fbq) {
      window.fbq('track', 'Contact', {
        contact_method: 'whatsapp',
        cta_location: link.getAttribute('data-cta-location') || link.getAttribute('data-cta') || 'sin_etiqueta',
        plan: link.getAttribute('data-plan') || ''
      });
    }
    window.gtag('event', 'whatsapp_click', {
      cta_location: link.getAttribute('data-cta-location') || link.getAttribute('data-cta') || 'sin_etiqueta',
      plan: link.getAttribute('data-plan') || '',
      link_url: link.href,
      page_path: window.location.pathname
    });
  }, true);
})();
