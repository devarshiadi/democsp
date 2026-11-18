const icon = (path, viewBox = '0 0 24 24') => `<svg viewBox="${viewBox}" aria-hidden="true">${path}</svg>`;

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const page = document.body.dataset.page || 'home';
    const links = [
      ['home', 'Home', 'index.html'], ['chillies', 'Our Chillies', 'chillies.html'],
      ['farms', 'Farms', 'farms.html'], ['quality', 'Quality', 'quality.html'],
      ['about', 'About Us', 'about.html'], ['contact', 'Contact', 'contact.html']
    ];
    this.innerHTML = `
      <header class="site-header">
        <a class="brand" href="index.html" aria-label="Indian Red Chilli Co. home">
          <svg class="brand-pepper" viewBox="0 0 100 52" aria-hidden="true"><path d="M91 7c-6 5-9 11-13 18-9 15-24 21-42 20C22 44 10 39 3 31c16 3 24-3 38-8C57 17 70 17 83 18c1-7 4-12 8-17"/><path class="pepper-vein" d="M12 31c17 6 36 2 52-7"/></svg>
          <span class="brand-name">Indian<br>Red Chilli Co.<small>PURE · AUTHENTIC · INDIAN</small></span>
        </a>
        <button class="menu-toggle" aria-label="Open navigation" aria-expanded="false"><span></span><span></span></button>
        <nav class="main-nav" aria-label="Main navigation">${links.map(([id,label,url]) => `<a class="${page === id ? 'active' : ''}" href="${url}" ${page === id ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav>
        <div class="header-actions">
          <button class="search-button" aria-label="Open search" aria-expanded="false" aria-controls="site-search-panel">${icon('<circle cx="10.8" cy="10.8" r="6.7"/><path d="m16 16 5 5"/>')}</button>
          <span class="language" aria-label="Current language: English">EN ${icon('<path d="m3 4.5 3 3 3-3"/>','0 0 12 12')}</span>
          <a class="enquire" href="contact.html">Enquire Now ${icon('<path d="M4 12 12 4M5 4h7v7"/>','0 0 16 16')}</a>
        </div>
        <form class="search-panel" id="site-search-panel" role="search" hidden>
          <label for="site-search">Search Indian Red Chilli Co.</label>
          <div class="search-field"><input id="site-search" type="search" placeholder="Try “Byadgi”" autocomplete="off"><button type="button" class="search-close" aria-label="Close search">×</button></div>
          <p class="search-feedback" aria-live="polite">Search varieties, farms and quality.</p>
        </form>
      </header>`;
    const header = this.querySelector('.site-header');
    const menuButton = this.querySelector('.menu-toggle');
    const nav = this.querySelector('.main-nav');
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    }));
    document.addEventListener('click', event => {
      if (header.contains(event.target) || menuButton.getAttribute('aria-expanded') !== 'true') return;
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || menuButton.getAttribute('aria-expanded') !== 'true') return;
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      menuButton.focus();
    });
    const searchButton = this.querySelector('.search-button');
    const panel = this.querySelector('.search-panel');
    const input = panel.querySelector('input');
    const feedback = panel.querySelector('.search-feedback');
    const close = () => { panel.hidden = true; searchButton.setAttribute('aria-expanded', 'false'); };
    searchButton.addEventListener('click', () => {
      const open = panel.hidden;
      panel.hidden = !open;
      searchButton.setAttribute('aria-expanded', String(open));
      if (open) input.focus();
    });
    panel.querySelector('.search-close').addEventListener('click', close);
    const getSearchTargets = () => [
      ...[...document.querySelectorAll('[data-searchable]')],
      ...[...document.querySelectorAll('main section')].filter(section => !section.querySelector('[data-searchable]'))
    ];
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      if (!query) { feedback.textContent = 'Search varieties, farms and quality.'; return; }
      const matches = getSearchTargets().filter(item => item.innerText.toLowerCase().includes(query));
      feedback.textContent = `${matches.length} result${matches.length === 1 ? '' : 's'} found.`;
    });
    input.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      const query = input.value.trim().toLowerCase();
      const result = getSearchTargets().find(item => item.innerText.toLowerCase().includes(query));
      if (result) { result.scrollIntoView({ behavior: 'smooth', block: 'center' }); result.classList.add('highlight'); window.setTimeout(() => result.classList.remove('highlight'), 1200); close(); }
      else if (query) window.location.href = `chillies.html?search=${encodeURIComponent(query)}`;
    });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) close(); });
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<footer class="site-footer">
      <div class="footer-main"><div class="footer-brand"><a class="brand" href="index.html"><svg class="brand-pepper" viewBox="0 0 100 52" aria-hidden="true"><path d="M91 7c-6 5-9 11-13 18-9 15-24 21-42 20C22 44 10 39 3 31c16 3 24-3 38-8C57 17 70 17 83 18c1-7 4-12 8-17"/></svg><span class="brand-name">Indian<br>Red Chilli Co.<small>PURE · AUTHENTIC · INDIAN</small></span></a><p>India’s chilli heritage,<br>shared with the world.</p></div>
      <div class="footer-column"><h2>Discover</h2><a href="chillies.html">Our Chillies</a><a href="farms.html">Our Farms</a><a href="quality.html">Quality</a></div>
      <div class="footer-column"><h2>Our Company</h2><a href="about.html">About Us</a><a href="contact.html">Contact</a><a href="contact.html">Enquire Now</a></div>
      <div class="footer-note"><p class="section-kicker left-kicker"><span></span> FROM INDIA, WITH CARE</p><p>Rooted in the land.<br>Ready for the world.</p><a class="text-link" href="contact.html">Start a conversation <span>→</span></a></div></div>
      <div class="footer-bottom"><span>© <span class="current-year"></span> Indian Red Chilli Co.</span><span>Pure · Authentic · Indian</span><a href="contact.html">Get in touch ↗</a></div>
    </footer>`;
    this.querySelector('.current-year').textContent = new Date().getFullYear();
  }
}

class ChilliCard extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute('name') || 'Indian Chilli';
    const slug = this.getAttribute('slug') || name.toLowerCase().replaceAll(' ', '-');
    const image = this.getAttribute('image') || 'teja';
    const note = this.getAttribute('note') || '';
    const heat = this.getAttribute('heat') || '';
    const colour = this.getAttribute('colour') || '';
    const imagePath = `assets/chilli-${image}.jpg`;
    this.innerHTML = `<article class="product-card" id="${slug}" data-searchable><div class="product-image"><img src="${imagePath}" alt="Dried ${name} chillies" loading="lazy" decoding="async"></div><div class="product-info"><h3>${name} Chilli</h3><p>${heat}<i></i>${colour}</p><a class="round-link" href="contact.html?variety=${encodeURIComponent(name)}" aria-label="Enquire about ${name} Chilli">↗</a></div>${note ? `<p class="product-note">${note}</p>` : ''}</article>`;
  }
}

customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);
customElements.define('chilli-card', ChilliCard);
