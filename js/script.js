// Footer year
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();

// 1. Mobile menu
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

// 2. Dark/light theme (remembers your choice on every page)
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
function setTheme(t) {
  root.dataset.theme = t;
  const dark = t === 'dark';
  themeBtn.textContent = dark ? '☀️' : '🌙';
  themeBtn.setAttribute('aria-pressed', !dark);
  themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  try { localStorage.setItem('theme', t); } catch (e) {}
}
let saved = 'dark';
try { saved = localStorage.getItem('theme') || 'dark'; } catch (e) {}
setTheme(saved);
themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

// 3. Project filter (Projects page)
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

// 4. Show/hide project details (Projects page)
document.querySelectorAll('.more').forEach(btn => btn.addEventListener('click', () => {
  const box = btn.nextElementSibling;
  box.hidden = !box.hidden;
  btn.setAttribute('aria-expanded', !box.hidden);
  btn.textContent = box.hidden ? 'Show details' : 'Hide details';
}));

// 5. Greeting changes with the visitor's choice (Home page)
const greeting = document.getElementById('greeting');
document.querySelectorAll('[data-who]').forEach(btn => btn.addEventListener('click', () => {
  greeting.textContent = 'Welcome, ' + btn.dataset.who + '! I’m Nittin S.';
}));

// 6. Contact form: validate, then save the message in localStorage (Contact page)
const form = document.getElementById('form');
if (form) {
  const KEY = 'portfolioMessages';
  const ok = document.getElementById('ok');
  const mailLink = document.getElementById('mailLink');
  const list = document.getElementById('msgList');
  const emptyNote = document.getElementById('emptyNote');
  const clearBtn = document.getElementById('clearBtn');

  function loadMessages() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function saveMessages(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); return true; } catch (e) { return false; }
  }
  function render() {
    const msgs = loadMessages();
    list.textContent = '';
    emptyNote.hidden = msgs.length > 0;
    clearBtn.hidden = msgs.length === 0;
    msgs.forEach(m => {
      const li = document.createElement('li');
      li.className = 'msg-item';
      const meta = document.createElement('p');
      meta.className = 'meta';
      meta.textContent = m.name + ' (' + m.email + ') · ' + m.date;
      const text = document.createElement('p');
      text.className = 'text';
      text.textContent = m.msg;
      const del = document.createElement('button');
      del.type = 'button';
      del.textContent = 'Delete';
      del.setAttribute('aria-label', 'Delete message from ' + m.name);
      del.addEventListener('click', () => {
        saveMessages(loadMessages().filter(x => x.id !== m.id));
        render();
      });
      li.append(meta, text, del);
      list.append(li);
    });
  }

  const check = (id, errId, msg, valid) => {
    const field = document.getElementById(id);
    const good = valid(field.value.trim());
    document.getElementById(errId).textContent = good ? '' : msg;
    field.classList.toggle('bad', !good);
    field.setAttribute('aria-invalid', !good);
    return good;
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    ok.textContent = '';
    mailLink.hidden = true;
    const a = check('name', 'nameErr', 'Enter your name.', v => v.length > 0);
    const b = check('email', 'emailErr', 'Enter a valid email address, like name@example.com.', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    const c = check('msg', 'msgErr', 'Write a message of at least 10 characters.', v => v.length >= 10);
    if (!(a && b && c)) return;

    const entry = {
      id: Date.now(),
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      msg: document.getElementById('msg').value.trim(),
      date: new Date().toLocaleString()
    };
    const msgs = loadMessages();
    msgs.push(entry);
    if (saveMessages(msgs)) {
      ok.textContent = 'Message saved in this browser. It has not been emailed yet.';
      mailLink.href = 'mailto:snittin08@gmail.com?subject=' + encodeURIComponent('Portfolio message from ' + entry.name) +
        '&body=' + encodeURIComponent(entry.msg + '\n\nFrom: ' + entry.email);
      mailLink.hidden = false;
      form.reset();
      render();
    } else {
      ok.textContent = 'Could not save the message. Your browser may be blocking storage.';
    }
  });

  clearBtn.addEventListener('click', () => {
    if (confirm('Delete all saved messages from this browser?')) {
      saveMessages([]);
      render();
    }
  });
  render();
}

// Copy email button (Contact page)
const copyBtn = document.getElementById('copyBtn');
if (copyBtn) copyBtn.addEventListener('click', () => {
  const msg = document.getElementById('copyMsg');
  navigator.clipboard.writeText('snittin08@gmail.com')
    .then(() => { msg.textContent = 'Copied!'; })
    .catch(() => { msg.textContent = 'Copy failed. Please select the email and copy it.'; });
});

// 7. Back to top button
const topBtn = document.getElementById('topBtn');
topBtn.addEventListener('click', () => window.scrollTo({ top: 0 }));
window.addEventListener('scroll', () => { topBtn.hidden = window.scrollY < 400; });