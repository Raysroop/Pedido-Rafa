// =========================================================
// TRACKER DO SITE
// Arquivo: tracker.js
// =========================================================

(function () {

  const TRACKER_URL = 'https://yip.su/pedido';

  // Identificador anônimo deste navegador
  let visitorId = localStorage.getItem('deathNoteVisitorId');

  if (!visitorId) {
    visitorId =
      crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now() + '-' + Math.random().toString(36).substring(2);

    localStorage.setItem(
      'deathNoteVisitorId',
      visitorId
    );
  }


  // Envia um evento
  window.trackEvent = function (eventName, extraData = {}) {

    const eventData = {

      event: eventName,

      visitorId: visitorId,

      page:
        window.location.href,

      timestamp:
        new Date().toISOString(),

      ...extraData

    };


    // Guarda uma cópia local
    try {

      const events =
        JSON.parse(
          localStorage.getItem('deathNoteEvents') || '[]'
        );

      events.push(eventData);

      localStorage.setItem(
        'deathNoteEvents',
        JSON.stringify(events)
      );

    } catch (error) {

      console.warn(
        'Não foi possível salvar o evento localmente.',
        error
      );

    }


    // Envia para o endpoint
    try {

      const body =
        JSON.stringify(eventData);


      if (navigator.sendBeacon) {

        const blob =
          new Blob(
            [body],
            {
              type: 'application/json'
            }
          );

        navigator.sendBeacon(
          TRACKER_URL,
          blob
        );

      } else {

        fetch(
          TRACKER_URL,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: body,
            keepalive: true
          }
        ).catch(() => {});

      }

    } catch (error) {

      console.warn(
        'Não foi possível enviar o evento.',
        error
      );

    }

  };


  // Registra automaticamente a visita
  trackEvent('page_view');


})();
