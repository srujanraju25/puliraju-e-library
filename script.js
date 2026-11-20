
const langButton = document.getElementById('languageSwitch');
let currentLang = 'en';

// Language switch
if (langButton) {
  langButton.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'te' : 'en';
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-en][data-te]').forEach(el => {
      el.innerHTML = el.dataset[currentLang];
    });

    langButton.textContent =
      currentLang === 'en' ? 'తెలుగు' : 'English';

    const searchInput = document.getElementById('bookSearch');
    if (searchInput) {
      searchInput.placeholder =
        currentLang === 'en'
          ? 'Search by book title...'
          : 'పుస్తకం పేరుతో వెతకండి...';
    }

    updateCount();
  });
}

// Book search
const search = document.getElementById('bookSearch');
const cards = [...document.querySelectorAll('.book-card')];

function updateCount() {
  const visible = cards.filter(card => !card.hidden).length;

  const count = document.getElementById('bookCount');
  if (count) {
    count.textContent =
      `${visible} ${currentLang === 'en' ? 'BOOKS' : 'పుస్తకాలు'}`;
  }

  const noResults = document.getElementById('noResults');
  if (noResults) {
    noResults.hidden = visible !== 0;
  }
}

if (search) {
  search.addEventListener('input', () => {
    const term = search.value.trim().toLocaleLowerCase();

    cards.forEach(card => {
      const title = (card.dataset.title || '').toLocaleLowerCase();
      card.hidden = !title.includes(term);
    });

    updateCount();
  });
}

// Book information and PDF links
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

// Book details dialog
const dialog = document.getElementById('bookDialog');

document.querySelectorAll('.details-button').forEach(button => {
  button.addEventListener('click', () => {
    const book = books[button.dataset.book];

    if (!book || !dialog) return;

    // Google PDF viewer URL
    const viewerURL =
      'https://docs.google.com/gview?embedded=1&url=' +
      encodeURIComponent(book.pdf);

    document.getElementById('dialogContent').innerHTML = `
      <div class="detail-layout">
        <img src="${book.cover}" alt="${book.title} cover">

        <div>
          <p class="section-kicker">
            ${currentLang === 'en' ? 'BOOK DETAILS' : 'పుస్తక వివరాలు'}
          </p>

          <h2>${book.title}</h2>

          <p>
            ${currentLang === 'en' ? book.descEn : book.descTe}
          </p>

          <div class="dialog-actions">

            <a class="dialog-action"
               href="${viewerURL}"
               target="_blank"
               rel="noopener noreferrer">
              ${currentLang === 'en' ? 'Read Online' : 'ఆన్‌లైన్‌లో చదవండి'}
            </a>

            <a class="dialog-action secondary-action"
               href="${book.pdf}"
               target="_blank"
               rel="noopener noreferrer">
              ${currentLang === 'en' ? 'Download PDF' : 'PDF డౌన్‌లోడ్'}
            </a>

          </div>
        </div>
      </div>
    `;

    dialog.showModal();
  });
});

// Close dialog
const closeButton = document.getElementById('dialogClose');

if (closeButton && dialog) {
  closeButton.addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}

// Mobile navigation
const menuToggle = document.getElementById('menuToggle');
const navigation = document.getElementById('navigation');

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    navigation.classList.toggle('open');
  });

  navigation.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navigation.classList.remove('open');
    });
  });
}

// Current year
const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}

updateCount();
