const revealItems = [...document.querySelectorAll('.reveal')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) {
  revealItems.forEach(item => item.classList.add('is-visible'));
} else if ('IntersectionObserver' in window) {
  document.body.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -24px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

const productCards = [...document.querySelectorAll('.product-card')];
let firstCard = 0;
function rotateCards(direction) {
  if (productCards.length < 2) return;
  firstCard = (firstCard + direction + productCards.length) % productCards.length;
  productCards.forEach((card, index) => {
    card.style.order = String((index - firstCard + productCards.length) % productCards.length);
  });
}
document.querySelector('.previous')?.addEventListener('click', () => rotateCards(-1));
document.querySelector('.next')?.addEventListener('click', () => rotateCards(1));

const initialSearch = new URLSearchParams(window.location.search).get('search');
if (initialSearch) {
  const match = productCards.find(card => card.innerText.toLowerCase().includes(initialSearch.toLowerCase()));
  if (match) {
    window.setTimeout(() => {
      match.scrollIntoView({ behavior: 'smooth', block: 'center' });
      match.classList.add('highlight');
      window.setTimeout(() => match.classList.remove('highlight'), 1200);
    }, 500);
  }
}

document.querySelectorAll('.enquiry-form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(form);
    const recipient = form.dataset.mailto;
    const subject = `Website enquiry — ${fields.get('interest') || 'General enquiry'}`;
    const body = [
      `Name: ${fields.get('name')}`,
      `Email: ${fields.get('email')}`,
      `Company: ${fields.get('company') || 'Not provided'}`,
      `Interest: ${fields.get('interest') || 'General enquiry'}`,
      '', String(fields.get('message') || '')
    ].join('\n');
    form.querySelector('.form-success').hidden = false;
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});

const requestedVariety = new URLSearchParams(window.location.search).get('variety');
if (requestedVariety) {
  const interest = document.querySelector('#interest');
  const message = document.querySelector('#message');
  if (interest) interest.value = 'Chilli varieties';
  if (message) message.value = `I’m interested in ${requestedVariety} chilli. Please share more information.`;
}
