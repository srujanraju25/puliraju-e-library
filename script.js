const $ = (s) => document.querySelector(s);
const grid = $("#bookGrid");
const searchInput = $("#searchInput");
const genreFilter = $("#genreFilter");
const modal = $("#readerModal");
let pageFlip = null;
let pdfDocument = null;
let currentBook = null;

$("#year").textContent = new Date().getFullYear();

function safeText(value="") {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function initGenres() {
  const genres = [...new Set((window.BOOKS || []).map(b => b.genre).filter(Boolean))].sort();
  genres.forEach(g => {
    const option = document.createElement("option");
    option.value = g; option.textContent = g; genreFilter.append(option);
  });
}
function renderBooks() {
  const query = searchInput.value.trim().toLowerCase();
  const genre = genreFilter.value;
  const books = (window.BOOKS || []).filter(b => {
    const haystack = [b.title,b.author,b.genre,b.description].join(" ").toLowerCase();
    return (!query || haystack.includes(query)) && (genre === "all" || b.genre === genre);
  });
  grid.innerHTML = books.map((b, i) => `
    <article class="book-card">
      <div class="cover-wrap">
        ${b.coverUrl ? `<img src="${safeText(b.coverUrl)}" alt="Cover of ${safeText(b.title)}" loading="lazy">` : `<div class="cover-placeholder">${safeText(b.title)}<small>${safeText(b.author || "AUTHOR")}</small></div>`}
      </div>
      <div class="book-meta">
        <h3>${safeText(b.title)}</h3>
        <div class="book-author">${safeText(b.author || "Author not specified")} · ${safeText(b.genre || "Uncategorised")}</div>
        <p class="book-description">${safeText(b.description || "")}</p>
        <div class="card-actions">
          <button type="button" data-read="${safeText(b.id)}" ${b.pdfUrl ? "" : "disabled title='Add a PDF URL in books.js first'"}>Read online</button>
          ${b.pdfUrl ? `<a class="secondary" href="${safeText(b.pdfUrl)}" download>Download PDF</a>` : `<button class="secondary" disabled title="Add a PDF URL in books.js first">PDF coming soon</button>`}
        </div>
      </div>
    </article>`).join("");
  $("#emptyState").hidden = books.length !== 0;
  grid.querySelectorAll("[data-read]").forEach(btn => btn.addEventListener("click", () => {
    const book = (window.BOOKS || []).find(b => b.id === btn.dataset.read);
    if (book) openReader(book);
  }));
}
searchInput.addEventListener("input", renderBooks);
genreFilter.addEventListener("change", renderBooks);
initGenres(); renderBooks();

async function openReader(book) {
  currentBook = book;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
  $("#readerTitle").textContent = book.title;
  $("#downloadButton").href = book.pdfUrl;
  $("#readerMessage").hidden = false;
  $("#readerMessage").textContent = "Loading your book…";
  $("#flipbook").innerHTML = "";
  $("#pageCounter").textContent = "Loading…";
  $("#prevPage").disabled = true; $("#nextPage").disabled = true;
  try {
    if (!window.pdfjsLib || !window.St || !window.St.PageFlip) {
      throw new Error("Reader libraries did not load. Check your internet connection and try again.");
    }
    if (pageFlip) { try { pageFlip.destroy(); } catch(e) {} pageFlip = null; }
    const loadingTask = window.pdfjsLib.getDocument({url: book.pdfUrl});
    pdfDocument = await loadingTask.promise;
    const images = [];
    for (let n=1; n<=pdfDocument.numPages; n++) {
      $("#readerMessage").textContent = `Preparing page ${n} of ${pdfDocument.numPages}…`;
      const page = await pdfDocument.getPage(n);
      const viewport = page.getViewport({scale:1.25});
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
      await page.render({canvasContext:context, viewport}).promise;
      images.push(canvas.toDataURL("image/jpeg",0.88));
    }
    const stage = $("#flipbook");
    const width = Math.min(440, Math.max(260, Math.floor(window.innerWidth * 0.39)));
    const height = Math.min(620, Math.floor(window.innerHeight * 0.68));
    pageFlip = new window.St.PageFlip(stage, {
      width, height, size:"stretch", minWidth:240, maxWidth:440,
      minHeight:320, maxHeight:620, maxShadowOpacity:0.45,
      showCover:true, mobileScrollSupport:false, usePortrait:true
    });
    pageFlip.loadFromImages(images);
    $("#readerMessage").hidden = true;
    updatePageCounter();
    $("#prevPage").disabled = false; $("#nextPage").disabled = false;
    pageFlip.on("flip", updatePageCounter);
  } catch (err) {
    console.error(err);
    $("#readerMessage").hidden = false;
    $("#readerMessage").textContent = `Could not open this PDF: ${err.message}. Check that the PDF URL is public and allows cross-origin access (CORS).`;
    $("#pageCounter").textContent = "Reader unavailable";
  }
}
function updatePageCounter() {
  if (!pageFlip || !pdfDocument) return;
  const current = pageFlip.getCurrentPageIndex()+1;
  $("#pageCounter").textContent = `Page ${current} of ${pdfDocument.numPages}`;
}
$("#prevPage").addEventListener("click",()=>pageFlip?.flipPrev());
$("#nextPage").addEventListener("click",()=>pageFlip?.flipNext());
function closeReader() {
  modal.classList.remove("open"); modal.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  if (pageFlip) { try {pageFlip.destroy();} catch(e){} pageFlip=null; }
  $("#flipbook").innerHTML = "";
}
$("#closeReader").addEventListener("click",closeReader);
document.addEventListener("keydown",e=>{if(e.key==="Escape" && modal.classList.contains("open")) closeReader();});
