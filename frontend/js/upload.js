/**
 * upload.js
 * Reusable drag-and-drop file upload widget for the tool page.
 * Wired up to a specific PDF endpoint in Stage 4 (tool.html inline script)
 * once the FastAPI backend endpoints exist (Stage 5/6).
 */
(function () {
  const MAX_FILE_SIZE_MB = 50;

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  /**
   * Creates an upload widget bound to a dropzone element.
   * @param {Object} opts
   * @param {HTMLElement} opts.dropzone
   * @param {HTMLInputElement} opts.fileInput
   * @param {HTMLElement} opts.fileListEl
   * @param {boolean} [opts.multiple]
   * @param {string[]} [opts.acceptedExtensions] e.g. ['.pdf']
   * @param {(files: File[]) => void} [opts.onChange]
   */
  function createUploadWidget(opts) {
    const { dropzone, fileInput, fileListEl, multiple = false, acceptedExtensions = ['.pdf'], onChange } = opts;
    let files = [];

    function validate(file) {
      const ext = `.${file.name.split('.').pop().toLowerCase()}`;
      if (!acceptedExtensions.includes(ext)) {
        window.PTH?.toast?.(`"${file.name}" is not a supported file type.`, 'error');
        return false;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        window.PTH?.toast?.(`"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB limit.`, 'error');
        return false;
      }
      return true;
    }

    function renderList() {
      if (!fileListEl) return;
      fileListEl.innerHTML = files
        .map(
          (file, idx) => `
          <div class="file-row" data-idx="${idx}">
            <i class="fa-solid fa-file-pdf file-icon"></i>
            <div class="file-meta">
              <div class="file-name">${file.name}</div>
              <div class="file-size">${formatBytes(file.size)}</div>
            </div>
            <button type="button" class="file-remove" data-remove="${idx}" aria-label="Remove ${file.name}">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>`
        )
        .join('');
    }

    function addFiles(fileArr) {
      const valid = fileArr.filter(validate);
      if (!valid.length) return;
      files = multiple ? [...files, ...valid] : [valid[0]];
      renderList();
      onChange && onChange(files);
    }

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      addFiles(Array.from(e.dataTransfer.files));
    });
    fileInput.addEventListener('change', (e) => addFiles(Array.from(e.target.files)));

    fileListEl?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-remove]');
      if (!btn) return;
      const idx = Number(btn.dataset.remove);
      files.splice(idx, 1);
      renderList();
      onChange && onChange(files);
    });

    return {
      getFiles: () => files,
      clear: () => { files = []; renderList(); onChange && onChange(files); },
    };
  }

  window.PTH = window.PTH || {};
  window.PTH.upload = { createUploadWidget, formatBytes };
})();
