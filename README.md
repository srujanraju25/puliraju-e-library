# Digital Library Starter

A static, brandable digital book library starter for Cloudflare Pages.

## Files
- `index.html` — website structure
- `style.css` — responsive design
- `script.js` — search, category filtering and PDF flipbook reader
- `books.js` — add your book metadata and public PDF/cover URLs

## Add a book
Edit `books.js` and add an object to `window.BOOKS`:

```js
window.BOOKS = [
  {
    id: "my-book",
    title: "My Book Title",
    author: "Your Name",
    genre: "Fiction",
    description: "A short description.",
    coverUrl: "https://your-public-host/cover.jpg",
    pdfUrl: "https://your-public-host/book.pdf"
  }
];
```

Use public HTTPS file URLs. A PDF host must permit browser access from your website (CORS). For large files, use Cloudflare R2 or another object-storage service. Do not upload copyrighted books unless you own them or have permission to distribute them.

## Preview locally
For a quick test, open `index.html` in a browser. Some browsers restrict PDF loading from local files; use a local development server if needed. You can use VS Code Live Server or Python:
`python -m http.server 8000`
Then open `http://localhost:8000`.

## Deploy to Cloudflare Pages with Git
1. Create a GitHub repository named `digital-library`.
2. Upload the four site files (`index.html`, `style.css`, `script.js`, `books.js`) and this README.
3. In Cloudflare Dashboard, go to **Workers & Pages → Create application → Pages → Connect to Git**.
4. Select the repository and production branch `main`.
5. Framework preset: **None**.
6. Build command: leave blank.
7. Build output directory: `/` (repository root).
8. Save and deploy. Cloudflare will provide a `*.pages.dev` URL.

## Important notes
- This starter uses PDF.js and StPageFlip from public CDNs. The first load requires an internet connection.
- PDF.js renders PDF pages to images before loading them into the flipbook. Very large books can use significant browser memory and take time to prepare. For large books, consider rendering pages progressively or using a hosted flipbook service.
- Downloading is enabled through the original PDF URL. Public PDFs can be copied, saved or screenshotted; a website cannot guarantee copy protection.
- Google indexing is a separate step after deployment: verify the site in Google Search Console, add a sitemap, and ensure each book has a crawlable detail page. This starter is a first version; book-specific SEO pages and sitemap can be added as the library grows.
- Replace the placeholder brand name and update the page title, description and footer before launch.
