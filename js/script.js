// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// 1. Mobile menu
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

// 2. Dark/light theme (dark is the default)
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
function setTheme(t) {
  root.dataset.theme = t;
  const dark = t === 'dark';
  themeBtn.textContent = dark ? '☀️' : '🌙';
  themeBtn.setAttribute('aria-pressed', !dark);
  themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
}
setTheme('dark');
themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

// 3. Project filter
const filterBtns = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.card');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => {
    const on = b === btn;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on);
  });
  cards.forEach(c => { c.hidden = btn.dataset.filter !== 'all' && c.dataset.cat !== btn.dataset.filter; });
}));

// 4. Show/hide project details
document.querySelectorAll('.more').forEach(btn => btn.addEventListener('click', () => {
  const box = btn.nextElementSibling;
  box.hidden = !box.hidden;
  btn.setAttribute('aria-expanded', !box.hidden);
  btn.textContent = box.hidden ? 'Show details' : 'Hide details';
}));

// 5. Greeting changes with the visitor's choice
const greeting = document.getElementById('greeting');
document.querySelectorAll('[data-who]').forEach(btn => btn.addEventListener('click', () => {
  greeting.textContent = 'Welcome, ' + btn.dataset.who + '! I’m Nittin S.';
}));

// 6. Contact form check (does not send anything)
const form = document.getElementById('form');
const ok = document.getElementById('ok');
function check(id, errId, msg, valid) {
  const field = document.getElementById(id);
  const good = valid(field.value.trim());
  document.getElementById(errId).textContent = good ? '' : msg;
  field.classList.toggle('bad', !good);
  field.setAttribute('aria-invalid', !good);
  return good;
}
form.addEventListener('submit', e => {
  e.preventDefault();
  ok.textContent = '';
  const a = check('name', 'nameErr', 'Enter your name.', v => v.length > 0);
  const b = check('email', 'emailErr', 'Enter a valid email address, like name@example.com.', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  const c = check('msg', 'msgErr', 'Write a message of at least 10 characters.', v => v.length >= 10);
  if (a && b && c) {
    ok.textContent = 'Your entries look good. This demo form does not send messages, so please email me directly.';
    form.reset();
  }
});

// 7. Back to top button + highlight current nav link
const topBtn = document.getElementById('topBtn');
topBtn.addEventListener('click', () => window.scrollTo({ top: 0 }));
const links = [...nav.querySelectorAll('a')];
function onScroll() {
  topBtn.hidden = window.scrollY < 400;
  let current = '';
  links.forEach(l => {
    const s = document.querySelector(l.getAttribute('href'));
    if (s && s.getBoundingClientRect().top <= 120) current = l.getAttribute('href');
  });
  links.forEach(l => l.classList.toggle('current', l.getAttribute('href') === current));
}
window.addEventListener('scroll', onScroll);
onScroll();