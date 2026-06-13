// Mobile nav toggle
const burger = document.querySelector('.burger');
const links = document.querySelector('.navlinks');
if (burger) {
  burger.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}
// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
// Footer year
const y = document.getElementById('yr');
if (y) y.textContent = new Date().getFullYear();
// Contact form (mailto fallback)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const f = new FormData(form);
    const subject = encodeURIComponent('[Website] ' + (f.get('subject') || 'Message from ' + f.get('name')));
    const body = encodeURIComponent('Name: ' + f.get('name') + '\nEmail: ' + f.get('email') + '\n\n' + f.get('message'));
    window.location.href = 'mailto:isoc@eusa.ed.ac.uk?subject=' + subject + '&body=' + body;
  });
}

// Live prayer times for Edinburgh (AlAdhan API, Muslim World League)
const ptimes = document.getElementById('ptimes');
if (ptimes) {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const url = 'https://api.aladhan.com/v1/timingsByCity/' + dd + '-' + mm + '-' + yyyy +
    '?city=Edinburgh&country=United%20Kingdom&method=3';
  fetch(url)
    .then(r => r.json())
    .then(j => {
      const t = j.data.timings;
      ptimes.querySelectorAll('[data-k]').forEach(el => {
        const k = el.getAttribute('data-k');
        if (t[k]) el.textContent = t[k];
      });
      const h = j.data.date.hijri, g = j.data.date.gregorian;
      const dateEl = document.getElementById('ptimes-date');
      if (dateEl) dateEl.textContent = h.weekday.en + ', ' + h.day + ' ' + h.month.en + ' ' + h.year + ' AH \u00b7 ' + g.date;
      // Highlight the next upcoming prayer
      const order = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      const mins = now.getHours() * 60 + now.getMinutes();
      let next = null;
      for (const k of order) {
        const parts = (t[k] || '').split(':');
        const m = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        if (!isNaN(m) && m >= mins) { next = k; break; }
      }
      if (!next) next = 'Fajr';
      const cell = ptimes.querySelector('[data-k="' + next + '"]');
      if (cell && cell.closest('.ptime')) cell.closest('.ptime').classList.add('next');
    })
    .catch(() => {
      const dateEl = document.getElementById('ptimes-date');
      if (dateEl) dateEl.textContent = 'Couldn\u2019t load live times \u2014 please check a prayer app or Edinburgh Central Mosque.';
    });
}
