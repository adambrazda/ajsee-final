import { translations } from '../i18n/translations.js';

function getCurrentLang() {
  return document.getElementById('lang-switcher')?.value || 'cs';
}

export async function loadEvents() {
  const container = document.getElementById('events-container');
  if (!container) return;

  const lang = getCurrentLang();
  const t = translations[lang] || translations.cs;

  const fallbackData = [
    {
      title: lang === 'en' ? "Opera Concert" : "Koncert v Opeře",
      date: lang === 'en' ? "Prague, May 25, 2025" : "Praha, 25. května 2025",
      linkText: t.eventDetail,
      linkHref: "#"
    },
    {
      title: lang === 'en' ? "Impressionist Exhibition" : "Výstava impresionistů",
      date: lang === 'en' ? "Brno, June 2, 2025" : "Brno, 2. června 2025",
      linkText: t.eventDetail,
      linkHref: "#"
    },
    {
      title: lang === 'en' ? "Summer Jazz Festival" : "Letní jazzový festival",
      date: lang === 'en' ? "Ostrava, July 10, 2025" : "Ostrava, 10. července 2025",
      linkText: t.eventDetail,
      linkHref: "#"
    }
  ];

  try {
    const response = await fetch('/data/events.json');
    if (!response.ok) throw new Error('API nedostupné');
    const events = await response.json();

    const localizedEvents = events.map(ev => ({
      ...ev,
      title: ev.name || ev.title,
      linkText: t.eventDetail,
      linkHref: `event-detail.html?id=${ev.id}`
    }));

    renderEvents(localizedEvents, container);
  } catch (error) {
    console.warn('❗ Fallback se používá:', error.message);
    renderEvents(fallbackData, container);
  }
}

function renderEvents(events, container) {
  container.innerHTML = '';
  events.forEach((event, index) => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <h3>${event.title}</h3>
      <p>${event.date}</p>
      <button class="detail-btn btn-small" data-index="${index}">${event.linkText}</button>
    `;
    container.appendChild(card);
  });
}

export async function setupModal() {
  const container = document.getElementById('events-container');
  const modal = document.getElementById('event-modal');
  if (!modal || !container) return;

  const lang = getCurrentLang();
  const t = translations[lang] || translations.cs;

  try {
    const response = await fetch('/data/events.json');
    const events = await response.json();

    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalLink = document.getElementById('modal-link');
    const closeBtn = modal.querySelector('.close-button');

    container.addEventListener('click', (e) => {
      if (e.target.classList.contains('detail-btn')) {
        const index = e.target.dataset.index;
        const event = events[index];
        modalTitle.textContent = event.name || event.title;
        modalDate.textContent = event.date;
        modalLink.href = event.link;
        modalLink.textContent = t.eventOfficial || 'Oficiální stránka';
        modal.classList.remove('hidden');
      }
    });

    closeBtn?.addEventListener('click', () => modal.classList.add('hidden'));
    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  } catch (err) {
    console.error("❌ Chyba při načítání modalu:", err);
  }
}
