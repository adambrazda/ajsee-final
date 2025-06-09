import { translations } from './translations.js';

export function detectBrowserLang() {
  const storedLang = localStorage.getItem('preferredLang');
  if (storedLang) return storedLang;

  const browserLang = navigator.language.slice(0, 2).toLowerCase();
  return ['cs', 'en', 'de', 'sk', 'pl', 'hu'].includes(browserLang) ? browserLang : 'cs';
}

export function changeLang(lang) {
  localStorage.setItem('preferredLang', lang);
  const t = translations[lang] || translations.cs;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });

  translatePlaceholders(lang);
}

function translatePlaceholders(lang) {
  const t = translations[lang] || translations.cs;

  const placeholders = {
    name: 'placeholderName',
    email: 'placeholderEmail',
    message: 'placeholderMessage'
  };

  Object.entries(placeholders).forEach(([id, key]) => {
    const input = document.getElementById(id);
    if (input && t[key]) input.placeholder = t[key];
  });
}

export function setupCopyStatusTranslation(lang) {
  const copyButtons = document.querySelectorAll('[data-copy]');
  const t = translations[lang] || translations.cs;

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const originalText = btn.textContent;
      btn.textContent = t.copied || 'Zkopírováno!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    });
  });
}
