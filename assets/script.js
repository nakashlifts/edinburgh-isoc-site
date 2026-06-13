/* =====================================================================
   ISocEd — site behaviour (vanilla JS, no dependencies)
   1. Mobile nav toggle
   2. Scroll-reveal via IntersectionObserver
   3. Footer year auto-fill
   4. Contact form -> mailto: handler
   5. Live prayer times (AlAdhan API) + next-prayer highlight
   ===================================================================== */
(function () {
  'use strict';

  /* ----------------------------------------------------------------
     1. Mobile navigation
  ---------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector('.hamburger');
    var overlay = document.querySelector('.nav-overlay');
    var links = document.querySelectorAll('.nav-links a');

    function close() { document.body.classList.remove('nav-open'); if (toggle) toggle.setAttribute('aria-expanded', 'false'); }
    function open() { document.body.classList.add('nav-open'); if (toggle) toggle.setAttribute('aria-expanded', 'true'); }

    if (toggle) {
      toggle.addEventListener('click', function () {
        if (document.body.classList.contains('nav-open')) { close(); } else { open(); }
      });
    }
    if (overlay) { overlay.addEventListener('click', close); }
    links.forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ----------------------------------------------------------------
     2. Scroll reveal
  ---------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------------
     3. Footer year
  ---------------------------------------------------------------- */
  function initYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------------
     4. Contact form -> mailto
  ---------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.elements['name'].value || '').trim();
      var email = (form.elements['email'].value || '').trim();
      var subject = (form.elements['subject'].value || '').trim();
      var message = (form.elements['message'].value || '').trim();

      var mailSubject = subject ? subject : 'Message from the ISocEd website';
      var body =
        'Assalamu alaikum ISocEd team,\n\n' +
        message + '\n\n' +
        '—\n' +
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n';

      var href = 'mailto:isoc@eusa.ed.ac.uk' +
        '?subject=' + encodeURIComponent(mailSubject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = href;

      var status = document.getElementById('form-status');
      if (status) {
        status.hidden = false;
        status.textContent = 'Opening your email app… if nothing happens, email us directly at isoc@eusa.ed.ac.uk or DM @isocedinburgh.';
      }
    });
  }

  /* ----------------------------------------------------------------
     5. Live prayer times (AlAdhan)
  ---------------------------------------------------------------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function to12h(hhmm) {
    if (!hhmm) return '—';
    var parts = hhmm.split(':');
    var h = parseInt(parts[0], 10);
    var m = parts[1] || '00';
    var ampm = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + ':' + m + ' ' + ampm;
  }

  function minutesFromHHMM(hhmm) {
    var p = hhmm.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  function initPrayerTimes() {
    var widget = document.getElementById('prayer-widget');
    if (!widget) return;

    var now = new Date();
    var dd = pad(now.getDate());
    var mm = pad(now.getMonth() + 1);
    var yyyy = now.getFullYear();
    var url = 'https://api.aladhan.com/v1/timingsByCity/' + dd + '-' + mm + '-' + yyyy +
      '?city=Edinburgh&country=United%20Kingdom&method=3';

    var order = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    var gregEl = document.getElementById('pw-greg');
    var hijriEl = document.getElementById('pw-hijri');
    var errEl = document.getElementById('pw-error');

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.data || !data.data.timings) throw new Error('Malformed response');
        var t = data.data.timings;
        var date = data.data.date || {};

        // Dates
        if (gregEl && date.gregorian) {
          gregEl.textContent = date.gregorian.weekday.en + ', ' + date.gregorian.day + ' ' +
            date.gregorian.month.en + ' ' + date.gregorian.year;
        }
        if (hijriEl && date.hijri) {
          hijriEl.textContent = date.hijri.day + ' ' + date.hijri.month.en + ' ' + date.hijri.year + ' AH';
        }

        // Determine next upcoming prayer (Sunrise is informational, not a prayer slot)
        var nowMin = now.getHours() * 60 + now.getMinutes();
        var prayerSlots = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        var nextName = 'Fajr'; // default: after Isha, next is tomorrow's Fajr
        for (var i = 0; i < prayerSlots.length; i++) {
          var name = prayerSlots[i];
          var raw = (t[name] || '').slice(0, 5);
          if (raw && minutesFromHHMM(raw) > nowMin) { nextName = name; break; }
        }

        order.forEach(function (name) {
          var cell = widget.querySelector('[data-prayer="' + name + '"]');
          if (!cell) return;
          var raw = (t[name] || '').slice(0, 5);
          var timeEl = cell.querySelector('.time');
          if (timeEl) timeEl.textContent = to12h(raw);
          cell.classList.remove('next');
          if (name === nextName) cell.classList.add('next');
        });

        if (errEl) errEl.hidden = true;
      })
      .catch(function () {
        order.forEach(function (name) {
          var cell = widget.querySelector('[data-prayer="' + name + '"]');
          if (cell) { var timeEl = cell.querySelector('.time'); if (timeEl) timeEl.textContent = '—'; }
        });
        if (gregEl) gregEl.textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        if (hijriEl) hijriEl.textContent = '';
        if (errEl) {
          errEl.hidden = false;
          errEl.textContent = 'We could not load live prayer times right now. Please check Edinburgh Central Mosque or a trusted app such as Muslim Pro / IslamicFinder for today’s timetable.';
        }
      });
  }

  /* ----------------------------------------------------------------
     Init
  ---------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initReveal();
    initYear();
    initContactForm();
    initPrayerTimes();
  });
})();
