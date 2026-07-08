// Replace with your deployed Google Apps Script Web App URL (see apps-script/README.md)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzUEh5xQQxisXURtqlfINQesN5vjFzv-OrA5zinhN4Umm6WnHN-q24Eodak0d7ryOsE/exec';

document.querySelectorAll('.org-logo-img, .partner-logo-img').forEach((img) => {
  img.addEventListener('error', () => {
    const label = document.createElement('span');
    label.className = 'org-logo-fallback';
    label.textContent = img.alt;
    img.replaceWith(label);
  });
});

const posterImg = document.getElementById('poster-img');
posterImg.addEventListener('error', () => {
  const fallback = document.createElement('div');
  fallback.className = 'poster-img poster-fallback';
  fallback.id = 'poster-img';
  fallback.textContent = 'Add the event poster at assets/img/poster.png';
  posterImg.replaceWith(fallback);
});

// --- Countdown ---

const EVENT_DATE = new Date('2026-07-11T18:30:00Z'); // 6:30 PM GMT (Liberia time)

function updateCountdown() {
  const remaining = Math.max(0, EVENT_DATE - new Date());
  const pad = (n) => String(n).padStart(2, '0');

  document.getElementById('cd-days').textContent = pad(Math.floor(remaining / 86400000));
  document.getElementById('cd-hours').textContent = pad(Math.floor(remaining / 3600000) % 24);
  document.getElementById('cd-minutes').textContent = pad(Math.floor(remaining / 60000) % 60);
  document.getElementById('cd-seconds').textContent = pad(Math.floor(remaining / 1000) % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// --- Multi-step wizard ---

const steps = Array.from(document.querySelectorAll('.step'));
const stepIndicator = document.getElementById('step-indicator');
let currentStep = 0;

steps.forEach(() => {
  const dot = document.createElement('span');
  dot.className = 'dot';
  stepIndicator.appendChild(dot);
});
const dots = Array.from(stepIndicator.children);

function showStep(index) {
  steps.forEach((step, i) => step.classList.toggle('active', i === index));
  dots.forEach((dot, i) => dot.classList.toggle('current', i === index));
  currentStep = index;
  window.scrollTo(0, 0);
}

function fieldsInStep(step) {
  return Array.from(step.querySelectorAll('input, textarea'));
}

steps.forEach((step) => {
  const nextBtn = step.querySelector('[data-next]');
  const backBtn = step.querySelector('[data-back]');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const fields = fieldsInStep(step);
      const invalid = fields.find((field) => !field.checkValidity());
      if (invalid) {
        invalid.reportValidity();
        return;
      }
      showStep(currentStep + 1);
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      showStep(currentStep - 1);
    });
  }
});

showStep(0);

// --- Form submission ---

const form = document.getElementById('registration-form');
const statusEl = document.getElementById('form-status');
const successCard = document.getElementById('success-card');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const submitBtn = form.querySelector('.submit-btn');
  submitBtn.disabled = true;
  statusEl.textContent = 'Submitting...';

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    if (SCRIPT_URL.startsWith('PASTE_')) {
      throw new Error('Form backend not configured yet.');
    }

    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    form.hidden = true;
    stepIndicator.hidden = true;
    successCard.hidden = false;
    statusEl.textContent = '';
  } catch (err) {
    statusEl.textContent = 'Something went wrong submitting the form. Please try again or contact us directly.';
    submitBtn.disabled = false;
  }
});
