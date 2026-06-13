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
