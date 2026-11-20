const langButton=document.getElementById('languageSwitch');
let currentLang='en';
langButton.addEventListener('click',()=>{
  currentLang=currentLang==='en'?'te':'en'; document.documentElement.lang=currentLang;
  document.querySelectorAll('[data-en][data-te]').forEach(el=>{el.innerHTML=el.dataset[currentLang]});
  langButton.textContent=currentLang==='en'?'తెలుగు':'English';
  document.getElementById('bookSearch').placeholder=currentLang==='en'?'Search by book title...':'పుస్తకం పేరుతో వెతకండి...';
  updateCount();
});
const search=document.getElementById('bookSearch');
const cards=[...document.querySelectorAll('.book-card')];
function updateCount(){const visible=cards.filter(c=>!c.hidden).length;document.getElementById('bookCount').textContent=`${visible} ${currentLang==='en'?'BOOKS':'పుస్తకాలు'}`;document.getElementById('noResults').hidden=visible!==0;}
search.addEventListener('input',()=>{const term=search.value.trim().toLocaleLowerCase();cards.forEach(card=>card.hidden=!card.dataset.title.toLocaleLowerCase().includes(term));updateCount();});
const books={
  1:{title:'రైతు ఆత్మహత్యల గోస',cover:'assets/book-1-cover.jpeg',descEn:'A 376-page Telugu book documenting the experiences of farming families affected by farmer suicides. The PDF supplied for this preview includes publication details for 2023 and 2024.',descTe:'రైతు ఆత్మహత్యలతో ప్రభావితమైన రైతు కుటుంబాల అనుభవాలను నమోదు చేసిన 376 పేజీల తెలుగు పుస్తకం. ఈ ప్రివ్యూకు అందించిన PDFలో 2023, 2024 ముద్రణ వివరాలు ఉన్నాయి.',pdf:'assets/rythu-atmahatyala-gosa.pdf'},
  2:{title:'ఆత్మహత్యల గోస',cover:'assets/book-2-cover.jpeg',descEn:'The original cover image is added. The book description and PDF will be connected after you share the remaining file.',descTe:'అసలు పుస్తక కవర్ జోడించాం. మిగిలిన PDF అందిన తర్వాత పుస్తక వివరణ, చదివే సదుపాయం జోడిస్తాం.'},
  3:{title:'కన్నీళ్ల సాగరం',cover:'assets/book-3-cover.jpeg',descEn:'The original cover image is added. The book description and PDF will be connected after you share the remaining file.',descTe:'అసలు పుస్తక కవర్ జోడించాం. మిగిలిన PDF అందిన తర్వాత పుస్తక వివరణ, చదివే సదుపాయం జోడిస్తాం.'}
};
const dialog=document.getElementById('bookDialog');
document.querySelectorAll('.details-button').forEach(button=>button.addEventListener('click',()=>{
  const b=books[button.dataset.book]; const ready=!!b.pdf;
  document.getElementById('dialogContent').innerHTML=`<div class="detail-layout"><img src="${b.cover}" alt="${b.title} cover"><div><p class="section-kicker">${currentLang==='en'?'BOOK DETAILS':'పుస్తక వివరాలు'}</p><h2>${b.title}</h2><p>${currentLang==='en'?b.descEn:b.descTe}</p>${ready?`<div class="dialog-actions"><a class="dialog-action" href="${b.pdf}" target="_blank" rel="noopener">${currentLang==='en'?'Read Online':'ఆన్‌లైన్‌లో చదవండి'}</a><a class="dialog-action secondary-action" href="${b.pdf}" download>${currentLang==='en'?'Download PDF':'PDF డౌన్‌లోడ్'}</a></div>`:`<p class="placeholder-note">${currentLang==='en'?'PDF not added yet — this will be connected when you upload it.':'PDF ఇంకా జోడించలేదు — మీరు అప్‌లోడ్ చేసిన తర్వాత కలుపుతాం.'}</p>`}</div></div>`;
  dialog.showModal();
}));
document.getElementById('dialogClose').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
document.getElementById('menuToggle').addEventListener('click',()=>document.getElementById('navigation').classList.toggle('open'));
document.querySelectorAll('#navigation a').forEach(a=>a.addEventListener('click',()=>document.getElementById('navigation').classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();
