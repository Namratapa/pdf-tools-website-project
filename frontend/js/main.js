/**
 * main.js
 * Shared behavior across every page: mobile nav drawer, toast notifications,
 * and small header interactions. Page-specific logic lives in its own module
 * (tools.js, search.js, upload.js).
 */
(function () {
  function initMobileNav() {
    const openBtn = document.querySelector('[data-mobile-nav-open]');
    const nav = document.querySelector('[data-mobile-nav]');
    const closeBtn = document.querySelector('[data-mobile-nav-close]');
    if (!openBtn || !nav) return;

    const open = () => {
      nav.classList.add('open');
      nav.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      nav.classList.remove('open');
      nav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    openBtn.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    nav.addEventListener('click', (e) => {
      if (e.target === nav) close();
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  function initActiveNavLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a, .mobile-nav-panel a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === path) link.classList.add('active');
    });
  }

  // ---- Toasts ----
  function ensureToastStack() {
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      stack.setAttribute('aria-live', 'polite');
      document.body.appendChild(stack);
    }
    return stack;
  }

  function showToast(message, type = 'info', duration = 3500) {
    const stack = ensureToastStack();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    stack.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }, duration);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initActiveNavLink();
  });

  window.PTH = window.PTH || {};
  window.PTH.toast = showToast;
})();
