import '../src/styles/main.scss';
import './events.js';
import { changeLang, detectBrowserLang, setupCopyStatusTranslation } from '../i18n/i18n.js';
import { translations } from '../i18n/translations.js';

function getCurrentLang() {
  return document.getElementById('lang-switcher')?.value || 'cs';
}

document.addEventListener('DOMContentLoaded', async () => {
  const userLang = detectBrowserLang();
  const switcher = document.getElementById('lang-switcher');

  if (switcher) {
    switcher.value = userLang;
    switcher.addEventListener('change', async () => {
      const lang = getCurrentLang();
      changeLang(lang);
      setupCopyStatusTranslation(lang);
      await loadEvents();
    });
  }

  changeLang(userLang);
  setupCopyStatusTranslation(userLang);
  await loadEvents();
  setupModal();

  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('nav ul');
  const navLinks = navMenu?.querySelectorAll('a') || [];

  hamburger?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('active');
      hamburger?.classList.remove('active');
    });
  });

  document.querySelectorAll('.faq-item .faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.classList.toggle('active');
    });
  });
});
