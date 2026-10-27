// ФинРевизор — интерактивные элементы памятки

(function () {
  'use strict';

  // --- Мобильное меню ---
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('open');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
  }

  // --- Форма записи на консультацию ---
  var form = document.getElementById('form');
  var ok = document.getElementById('form-ok');

  if (form && ok) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('f-name');
      var phone = document.getElementById('f-phone');

      if (!name.value.trim()) {
        name.focus();
        name.style.borderColor = '#a8433a';
        return;
      }
      if (phone.value.trim().length < 6) {
        phone.focus();
        phone.style.borderColor = '#a8433a';
        return;
      }

      name.style.borderColor = '';
      phone.style.borderColor = '';

      form.querySelector('button[type="submit"]').style.display = 'none';
      form.querySelector('.form__hint').style.display = 'none';
      ok.classList.add('show');
      ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // --- Проверка обещанной доходности (всё локально) ---
  var rateInput = document.getElementById('rate-input');
  var rateBar = document.getElementById('rate-bar');
  var rateVerdict = document.getElementById('rate-verdict');
  var rateRules = document.getElementById('rate-rules');

  if (rateInput && rateBar && rateVerdict && rateRules) {
    rateInput.addEventListener('input', function () {
      var v = parseFloat(String(rateInput.value).replace(',', '.'));
      var flags = rateRules.children;

      var f1 = v > 0 && v <= 1.5;   // реалистично
      var f2 = v > 1.5 && v <= 4;   // высокий риск
      var f3 = v > 4;               // пирамида
      var f4 = v > 0;               // «гарантированно» — всегда обман

      flags[0].setAttribute('data-ok', f1 ? '1' : '0');
      flags[1].setAttribute('data-ok', f2 ? '1' : '0');
      flags[2].setAttribute('data-ok', f3 ? '1' : '0');
      flags[3].setAttribute('data-ok', f4 ? '1' : '0');

      if (!v || v <= 0) {
        rateBar.style.width = '0';
        rateVerdict.textContent = 'Введите обещанный процент';
        rateVerdict.style.color = '';
        return;
      }

      var text, color, width;
      if (f3) {
        text = 'Классический признак пирамиды — не переводите деньги';
        color = '#a8433a'; width = '100%';
      } else if (f2) {
        text = 'Подозрительно высоко — проверьте компанию в реестре ЦБ';
        color = '#b3762e'; width = '66%';
      } else {
        text = 'Похоже на реалистичную доходность — но проверьте лицензию';
        color = '#2e7d5b'; width = '33%';
      }
      rateBar.style.width = width;
      rateBar.style.background = color;
      rateVerdict.textContent = text;
      rateVerdict.style.color = color;
    });
  }

  // --- FAQ-аккордеон ---
  var faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(function (item) {
    var q = item.querySelector('.faq__q');
    if (!q) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      faqItems.forEach(function (other) { other.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

  // --- Подсветка активного раздела в шапке ---
  var sections = ['about', 'scheme', 'flags', 'protect', 'incident', 'consult'];
  var links = nav ? nav.querySelectorAll('a') : [];

  if ('IntersectionObserver' in window && links.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.style.color = a.getAttribute('href') === '#' + entry.target.id ? '#1d5c4a' : '';
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }
})();
