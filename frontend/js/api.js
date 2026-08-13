/**
 * api.js
 * Centralized fetch wrapper for all backend communication.
 * Every other module should call window.PTH.api.* instead of using fetch() directly.
 */
(function () {
  // TODO: point this at your deployed backend URL in production.
  const BASE_URL = window.PTH_API_BASE_URL || 'http://localhost:8000';

  async function request(path, { method = 'GET', body, headers = {}, isFormData = false } = {}) {
    const opts = { method, headers: { ...headers } };

    if (body !== undefined) {
      if (isFormData) {
        opts.body = body; // browser sets multipart boundary automatically
      } else {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(body);
      }
    }

    let response;
    try {
      response = await fetch(`${BASE_URL}${path}`, opts);
    } catch (networkErr) {
      throw new ApiError('Could not reach the server. Check your connection and try again.', 0, null);
    }

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json().catch(() => null)
      : await response.blob().catch(() => null);

    if (!response.ok) {
      const message =
        (payload && payload.detail) ||
        (payload && payload.message) ||
        `Request failed with status ${response.status}`;
      throw new ApiError(message, response.status, payload);
    }

    return payload;
  }

  class ApiError extends Error {
    constructor(message, status, payload) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.payload = payload;
    }
  }

  const api = {
    // ---- Tools & categories ----
    getTools: () => request('/api/tools'),
    getTool: (slug) => request(`/api/tools/${encodeURIComponent(slug)}`),
    getCategories: () => request('/api/categories'),

    // ---- Contact ----
    sendContactMessage: (data) => request('/api/contact', { method: 'POST', body: data }),

    // ---- Blogs ----
    getBlogs: () => request('/api/blogs'),
    getBlog: (slug) => request(`/api/blogs/${encodeURIComponent(slug)}`),

    // ---- PDF processing ----
    // formData must contain the file(s) under the key(s) the endpoint expects.
    processPdf: (endpoint, formData, onProgress) => uploadWithProgress(`/api/pdf/${endpoint}`, formData, onProgress),
  };

  /**
   * Uses XMLHttpRequest instead of fetch so we can report upload progress,
   * which fetch does not support natively.
   */
  function uploadWithProgress(path, formData, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE_URL}${path}`);
      xhr.responseType = 'blob';

      xhr.upload.onprogress = (evt) => {
        if (onProgress && evt.lengthComputable) {
          onProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const disposition = xhr.getResponseHeader('content-disposition') || '';
          const match = disposition.match(/filename="?([^"]+)"?/);
          resolve({ blob: xhr.response, filename: match ? match[1] : 'output.pdf' });
        } else {
          // Try to parse JSON error out of the blob
          const reader = new FileReader();
          reader.onload = () => {
            let message = `Request failed with status ${xhr.status}`;
            try {
              const parsed = JSON.parse(reader.result);
              message = parsed.detail || parsed.message || message;
            } catch (e) { /* not JSON, keep default message */ }
            reject(new ApiError(message, xhr.status, null));
          };
          reader.readAsText(xhr.response);
        }
      };

      xhr.onerror = () => reject(new ApiError('Network error during upload.', 0, null));

      xhr.send(formData);
    });
  }

  window.PTH = window.PTH || {};
  window.PTH.api = api;
  window.PTH.ApiError = ApiError;
})();
