
const langButton = document.getElementById('languageSwitch');
let currentLang = 'en';

langButton.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'te' : 'en';
  document.documentElement.lang = currentLang;

  document.querySelectorAll('[data-en][data-te]').forEach(el => {
    el.innerHTML = el.dataset[currentLang];
  });

  langButton.textContent = currentLang === 'en' ? 'తెలుగు' : 'English';
  document.getElementById('bookSearch').placeholder =
    currentLang === 'en' ? 'Search by book title...' : 'పుస్తకం పేరుతో వెతకండి...';

  updateCount();
});

const search = document.getElementById('bookSearch');
const cards = [...document.querySelectorAll('.book-card')];

function updateCount() {
  const visible = cards.filter(c => !c.hidden).length;
  document.getElementById('bookCount').textContent =
    `${visible} ${currentLang === 'en' ? 'BOOKS' : 'పుస్తకాలు'}`;
  document.getElementById('noResults').hidden = visible !== 0;
}

search.addEventListener('input', () => {
  const term = search.value.trim().toLocaleLowerCase();
  cards.forEach(card => {
    card.hidden = !card.dataset.title.toLocaleLowerCase().includes(term);
  });
  updateCount();
});

const books = {
  1: {
    title: 'రైతు ఆత్మహత్యల గోస',
    cover: 'assets/book-1-cover.jpeg',
    descEn: 'A Telugu book documenting the experiences of farming families affected by farmer suicides.',
    descTe: 'రైతు ఆత్మహత్యలతో ప్రభావితమైన రైతు కుటుంబాల అనుభవాలను నమోదు చేసిన తెలుగు పుస్తకం.',
    pdf: 'https://github.com/srujanraju25/puliraju-e-library/releases/download/v1.0-books/Final.rythu.gosa.pdf'
  },
  2: {
    title: 'ఆత్మహత్యల గోస',
    cover: 'assets/book-2-cover.jpeg',
    descEn: 'Read the original Telugu book online or download its PDF.',
    descTe: 'ఈ తెలుగు పుస్తకాన్ని ఆన్‌లైన్‌లో చదవవచ్చు లేదా PDF డౌన్‌లోడ్ చేసుకోవచ్చు.',
    pdf: 'https://github.com/srujanraju25/puliraju-e-library/releases/download/v1.0-books/default.pdf'
  },
  3: {
    title: 'కన్నీళ్ల సాగరం',
    cover: 'assets/book-3-cover.jpeg',
    descEn: 'Read the original Telugu book online or download its PDF.',
    descTe: 'ఈ తెలుగు పుస్తకాన్ని ఆన్‌లైన్‌లో చదవవచ్చు లేదా PDF డౌన్‌లోడ్ చేసుకోవచ్చు.',
    pdf: 'https://github.com/srujanraju25/puliraju-e-library/releases/download/v1.0-books/Kannella.Sagaram_Inner_For.Print_27_02_26.copy.pdf'
  }
};

const dialog = document.getElementById('bookDialog');

document.querySelectorAll('.details-button').forEach(button => {
  button.addEventListener('click', () => {
    const book = books[button.dataset.book];

    document.getElementById('dialogContent').innerHTML = `
      <div class="detail-layout">
        <img src="${book.cover}" alt="${book.title} cover">
        <div>
          <p class="section-kicker">${currentLang === 'en' ? 'BOOK DETAILS' : 'పుస్తక వివరాలు'}</p>
          <h2>${book.title}</h2>
          <p>${currentLang === 'en' ? book.descEn : book.descTe}</p>
          <div class="dialog-actions">
            <a class="dialog-action" href="${book.pdf}" target="_blank" rel="noopener">
              ${currentLang === 'en' ? 'Read Online' : 'ఆన్‌లైన్‌లో చదవండి'}
            </a>
            <a class="dialog-action secondary-action" href="${book.pdf}" download>
              ${currentLang === 'en' ? 'Download PDF' : 'PDF డౌన్‌లోడ్'}
            </a>
          </div>
        </div>
      </div>
    `;

    dialog.showModal();
  });
});

document.getElementById('dialogClose').addEventListener('click', () => dialog.close());

dialog.addEventListener('click', e => {
  if (e.target === dialog) dialog.close();
});

document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('navigation').classList.toggle('open');
});

document.querySelectorAll('#navigation a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navigation').classList.remove('open');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
