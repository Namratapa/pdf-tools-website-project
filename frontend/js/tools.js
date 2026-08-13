/**
 * tools.js
 * Tool & category dataset, plus rendering logic for the homepage / tools page.
 *
 * NOTE: This is currently a static in-file dataset so the frontend is fully
 * demoable without the backend running. Once Stage 5/7 (FastAPI + Supabase)
 * are live, replace `getCategories()` / `getTools()` below with calls to
 * `window.PTH.api.getCategories()` / `window.PTH.api.getTools()`.
 * The rendering functions do not need to change — only the data source.
 */
(function () {
  const CATEGORIES = [
    { slug: 'convert-from-pdf', name: 'Convert from PDF', color: 'var(--cat-convert-from)', icon: 'fa-file-export' },
    { slug: 'convert-to-pdf', name: 'Convert to PDF', color: 'var(--cat-convert-to)', icon: 'fa-file-import' },
    { slug: 'ecommerce-tools', name: 'E-Commerce Tools', color: 'var(--cat-ecommerce)', icon: 'fa-cart-shopping' },
    { slug: 'edit-sign-pdf', name: 'Edit & Sign PDF', color: 'var(--cat-edit-sign)', icon: 'fa-signature' },
    { slug: 'merge-split-pdf', name: 'Merge & Split PDF', color: 'var(--cat-merge-split)', icon: 'fa-object-ungroup' },
    { slug: 'ocr-tools', name: 'OCR Tools', color: 'var(--cat-ocr)', icon: 'fa-glasses' },
    { slug: 'pdf-editing-tools', name: 'PDF Editing Tools', color: 'var(--cat-editing)', icon: 'fa-pen-to-square' },
    { slug: 'pdf-security-tools', name: 'PDF Security Tools', color: 'var(--cat-security)', icon: 'fa-lock' },
    { slug: 'pdf-viewing-organizing-tools', name: 'PDF Viewing & Organizing Tools', color: 'var(--cat-organize)', icon: 'fa-folder-tree' },
  ];

  // icon: Font Awesome class. slug becomes /tool.html?tool=<slug>
  const TOOLS = [
    // ---- Convert from PDF ----
    t('pdf-to-jpg', 'PDF to JPG', 'convert-from-pdf', 'fa-file-image', 'Turn every page of a PDF into high-quality JPG images in seconds.'),
    t('pdf-to-png', 'PDF to PNG', 'convert-from-pdf', 'fa-file-image', 'Export PDF pages as crisp, transparent-ready PNG images.'),
    t('pdf-to-webp', 'PDF to WEBP', 'convert-from-pdf', 'fa-file-image', 'Convert PDF pages to lightweight WEBP images for the web.'),
    t('pdf-to-bmp', 'PDF to BMP', 'convert-from-pdf', 'fa-file-image', 'Export PDF pages as uncompressed BMP image files.'),
    t('pdf-to-tiff', 'PDF to TIFF', 'convert-from-pdf', 'fa-file-image', 'Convert PDF pages into archival-quality TIFF images.'),
    t('pdf-to-image', 'PDF to Image', 'convert-from-pdf', 'fa-images', 'Choose your format and turn PDF pages into images instantly.'),
    t('pdf-to-text', 'PDF to Text', 'convert-from-pdf', 'fa-file-lines', 'Pull the raw text content out of any PDF in one click.'),
    t('pdf-to-word', 'PDF to Word', 'convert-from-pdf', 'fa-file-word', 'Convert PDFs into fully editable Word documents.'),
    t('pdf-to-excel', 'PDF to Excel', 'convert-from-pdf', 'fa-file-excel', 'Extract tables and data from PDFs straight into Excel.'),
    t('pdf-to-powerpoint', 'PDF to PowerPoint', 'convert-from-pdf', 'fa-file-powerpoint', 'Turn PDF pages into an editable PowerPoint presentation.'),
    t('pdf-to-csv', 'PDF to CSV', 'convert-from-pdf', 'fa-file-csv', 'Pull tabular data out of a PDF and save it as CSV.'),
    t('pdf-to-html', 'PDF to HTML', 'convert-from-pdf', 'fa-code', 'Convert PDF documents into clean, structured HTML.'),
    t('pdf-to-xml', 'PDF to XML', 'convert-from-pdf', 'fa-file-code', 'Extract PDF content into structured XML data.'),
    t('extract-images-from-pdf', 'Extract Images from PDF', 'convert-from-pdf', 'fa-object-ungroup', 'Pull every embedded image out of a PDF file, ready to save.'),
    t('pdf-thumbnail-generator', 'PDF Thumbnail Generator', 'convert-from-pdf', 'fa-table-cells', 'Generate quick preview thumbnails for every page of a PDF.'),
    t('merge-pdf-pages-into-image', 'Merge PDF Pages into Single Image', 'convert-from-pdf', 'fa-layer-group', 'Combine multiple PDF pages into one long shareable image.'),

    // ---- Convert to PDF ----
    t('jpg-to-pdf', 'JPG to PDF', 'convert-to-pdf', 'fa-file-pdf', 'Combine one or more JPG photos into a single PDF file.'),
    t('png-to-pdf', 'PNG to PDF', 'convert-to-pdf', 'fa-file-pdf', 'Convert PNG images into a clean, print-ready PDF.'),
    t('webp-to-pdf', 'WEBP to PDF', 'convert-to-pdf', 'fa-file-pdf', 'Turn WEBP images into a standard, shareable PDF document.'),
    t('word-to-pdf', 'Word to PDF', 'convert-to-pdf', 'fa-file-word', 'Convert Word documents to PDF while keeping formatting intact.'),
    t('excel-to-pdf', 'Excel to PDF', 'convert-to-pdf', 'fa-file-excel', 'Turn spreadsheets into print-friendly, shareable PDFs.'),
    t('powerpoint-to-pdf', 'PowerPoint to PDF', 'convert-to-pdf', 'fa-file-powerpoint', 'Export slide decks as polished, portable PDF files.'),
    t('text-to-pdf', 'Text to PDF', 'convert-to-pdf', 'fa-file-lines', 'Convert plain text files into a formatted PDF document.'),
    t('html-to-pdf', 'HTML to PDF', 'convert-to-pdf', 'fa-code', 'Render HTML pages or snippets into a downloadable PDF.'),
    t('xml-to-pdf', 'XML to PDF', 'convert-to-pdf', 'fa-file-code', 'Convert structured XML data into a readable PDF report.'),
    t('images-to-pdf', 'Images to PDF', 'convert-to-pdf', 'fa-images', 'Combine any mix of image files into a single multi-page PDF.'),

    // ---- E-Commerce Tools (placeholder category, no tools defined in brief yet) ----
    t('ecommerce-coming-soon', 'More tools coming soon', 'ecommerce-tools', 'fa-hourglass-half', 'E-commerce PDF tools (invoices, catalogs, labels) are on the roadmap.', true),

    // ---- Edit & Sign PDF ----
    t('add-text-to-pdf', 'Add Text to PDF', 'edit-sign-pdf', 'fa-font', 'Type directly onto any page of a PDF and save your changes.'),
    t('add-image-to-pdf', 'Add Image to PDF', 'edit-sign-pdf', 'fa-image', 'Place logos, photos, or signatures anywhere on a PDF page.'),
    t('pdf-annotation', 'PDF Annotation', 'edit-sign-pdf', 'fa-highlighter', 'Highlight, comment, and mark up PDF pages before sharing.'),

    // ---- Merge & Split PDF ----
    t('merge-pdf', 'Merge PDF', 'merge-split-pdf', 'fa-object-group', 'Combine multiple PDF files into a single organized document.'),
    t('split-pdf', 'Split PDF', 'merge-split-pdf', 'fa-scissors', 'Break one PDF into several smaller files by page range.'),
    t('extract-pdf-pages', 'Extract PDF Pages', 'merge-split-pdf', 'fa-file-export', 'Pull out specific pages into a brand-new PDF file.'),
    t('delete-pdf-pages', 'Delete PDF Pages', 'merge-split-pdf', 'fa-trash-can', 'Remove unwanted pages from a PDF in just a few clicks.'),
    t('rearrange-pdf-pages', 'Rearrange PDF Pages', 'merge-split-pdf', 'fa-arrows-up-down-left-right', 'Drag and drop to reorder the pages of your PDF.'),
    t('rotate-pdf-pages', 'Rotate PDF Pages', 'merge-split-pdf', 'fa-rotate', 'Rotate individual pages or the whole document at once.'),

    // ---- OCR Tools ----
    t('ocr-pdf', 'OCR PDF', 'ocr-tools', 'fa-glasses', 'Make scanned PDFs searchable and selectable with OCR.'),
    t('image-to-text', 'Image to Text', 'ocr-tools', 'fa-glasses', 'Extract editable text from any photo or scanned image.'),
    t('scan-pdf-to-text', 'Scan PDF to Text', 'ocr-tools', 'fa-glasses', 'Convert a scanned PDF into clean, editable plain text.'),

    // ---- PDF Editing Tools ----
    t('crop-pdf', 'Crop PDF', 'pdf-editing-tools', 'fa-crop-simple', 'Trim margins or resize the visible area of your PDF pages.'),
    t('rotate-pdf', 'Rotate PDF', 'pdf-editing-tools', 'fa-rotate', 'Fix sideways or upside-down pages across a whole PDF.'),
    t('add-watermark', 'Add Watermark', 'pdf-editing-tools', 'fa-stamp', 'Stamp a text or image watermark across every page.'),
    t('add-page-numbers', 'Add Page Numbers', 'pdf-editing-tools', 'fa-list-ol', 'Automatically number the pages of your PDF document.'),

    // ---- PDF Security Tools ----
    t('protect-pdf', 'Protect PDF', 'pdf-security-tools', 'fa-lock', 'Add a password so only the right people can open your PDF.'),
    t('unlock-pdf', 'Unlock PDF', 'pdf-security-tools', 'fa-lock-open', 'Remove a known password from a protected PDF file.'),
    t('remove-password', 'Remove Password', 'pdf-security-tools', 'fa-key', 'Strip password protection from a PDF you have access to.'),
    t('encrypt-pdf', 'Encrypt PDF', 'pdf-security-tools', 'fa-shield-halved', 'Encrypt a PDF so its contents stay private in transit.'),
    t('decrypt-pdf', 'Decrypt PDF', 'pdf-security-tools', 'fa-shield-halved', 'Decrypt a previously encrypted PDF you have the key for.'),

    // ---- PDF Viewing & Organizing Tools ----
    t('pdf-viewer', 'PDF Viewer', 'pdf-viewing-organizing-tools', 'fa-eye', 'Open and read PDF files instantly, right in your browser.'),
    t('organize-pdf', 'Organize PDF', 'pdf-viewing-organizing-tools', 'fa-folder-tree', 'Reorder, rotate, and remove pages in one visual workspace.'),
    t('compare-pdf', 'Compare PDF', 'pdf-viewing-organizing-tools', 'fa-code-compare', 'Spot the differences between two versions of a PDF.'),
    t('pdf-metadata-editor', 'PDF Metadata Editor', 'pdf-viewing-organizing-tools', 'fa-tags', 'View and edit the title, author, and other PDF metadata.'),
  ];

  function t(slug, name, categorySlug, icon, description, todo) {
    return { slug, name, categorySlug, icon, description, todo: !!todo };
  }

  function getCategories() { return CATEGORIES; }
  function getTools() { return TOOLS; }
  function getCategoryBySlug(slug) { return CATEGORIES.find((c) => c.slug === slug); }
  function getToolBySlug(slug) { return TOOLS.find((tool) => tool.slug === slug); }
  function getToolsByCategory(categorySlug) { return TOOLS.filter((tool) => tool.categorySlug === categorySlug); }

  // ---- Rendering (homepage / tools page) ----
  function toolCardHTML(tool) {
    const cat = getCategoryBySlug(tool.categorySlug);
    return `
      <a class="tool-card" href="tool.html?tool=${tool.slug}" data-tool-card
         style="--tool-accent:${cat.color}"
         data-name="${tool.name.toLowerCase()}" data-category="${cat.name.toLowerCase()}"
         data-description="${tool.description.toLowerCase()}">
        <div class="tool-icon">
          <i class="fa-solid ${tool.icon}"></i>
        </div>
        <h3>${tool.name}</h3>
        <p>${tool.description}</p>
        <span class="tool-link" style="color:${cat.color}">${tool.todo ? 'Coming soon' : 'Open tool'} <i class="fa-solid fa-arrow-right"></i></span>
      </a>`;
  }

  function renderCategoryPills(container) {
    if (!container) return;
    const pillsHTML = CATEGORIES.map(
      (cat) => `<button type="button" class="category-pill" data-category-filter="${cat.slug}">${cat.name}</button>`
    ).join('');
    container.innerHTML = `<button type="button" class="category-pill active" data-category-filter="all">All Tools</button>${pillsHTML}`;

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-category-filter]');
      if (!btn) return;
      container.querySelectorAll('.category-pill').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-category-filter');
      document.querySelectorAll('[data-category-block]').forEach((block) => {
        block.style.display = target === 'all' || block.dataset.categoryBlock === target ? '' : 'none';
      });
      if (target !== 'all') {
        document.querySelector(`[data-category-block="${target}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function renderToolsGrid(container) {
    if (!container) return;
    container.innerHTML = CATEGORIES.map((cat) => {
      const tools = getToolsByCategory(cat.slug);
      if (!tools.length) return '';
      return `
        <div class="category-block" data-category-block="${cat.slug}">
          <h3 class="category-heading">${cat.name}</h3>
          <div class="tools-grid">
            ${tools.map(toolCardHTML).join('')}
          </div>
        </div>`;
    }).join('');
  }

  window.PTH = window.PTH || {};
  window.PTH.tools = {
    getCategories, getTools, getCategoryBySlug, getToolBySlug, getToolsByCategory,
    renderCategoryPills, renderToolsGrid, toolCardHTML,
  };
})();
