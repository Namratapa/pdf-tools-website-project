/**
 * search.js
 * Powers the hero search box: filters the tools dataset by name, category,
 * or description and renders a live dropdown of matches.
 */
(function () {
  function initSearch() {
    const input = document.querySelector('[data-search-input]');
    const resultsBox = document.querySelector('[data-search-results]');
    if (!input || !resultsBox || !window.PTH || !window.PTH.tools) return;

    const tools = window.PTH.tools.getTools();

    function render(matches, query) {
      if (!query.trim()) {
        resultsBox.classList.remove('open');
        resultsBox.innerHTML = '';
        return;
      }
      if (!matches.length) {
        resultsBox.innerHTML = `<div class="search-empty">No tools found.</div>`;
        resultsBox.classList.add('open');
        return;
      }
      resultsBox.innerHTML = matches
        .slice(0, 8)
        .map((tool) => {
          const cat = window.PTH.tools.getCategoryBySlug(tool.categorySlug);
          return `
            <a class="search-result-item" href="tool.html?tool=${tool.slug}">
              <div class="tool-icon" style="width:34px;height:34px;font-size:14px;background:${cat.color}">
                <i class="fa-solid ${tool.icon}"></i>
              </div>
              <div>
                <div class="srt-title">${tool.name}</div>
                <div class="srt-cat">${cat.name}</div>
              </div>
            </a>`;
        })
        .join('');
      resultsBox.classList.add('open');
    }

    function search(query) {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      return tools.filter((tool) => {
        const cat = window.PTH.tools.getCategoryBySlug(tool.categorySlug);
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          cat.name.toLowerCase().includes(q)
        );
      });
    }

    let debounceTimer;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const query = input.value;
      debounceTimer = setTimeout(() => render(search(query), query), 120);
    });

    document.addEventListener('click', (e) => {
      if (!resultsBox.contains(e.target) && e.target !== input) {
        resultsBox.classList.remove('open');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') resultsBox.classList.remove('open');
    });
  }

  document.addEventListener('DOMContentLoaded', initSearch);
})();
