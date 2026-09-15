/**
 * E-Brix Main UI Controller JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initRangeSliders();
  initCalculatorForm();
  initModalListeners();
});

/* Mobile Navigation Toggle */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
  }
}

/* Bind Range Slider inputs to live value badges */
function initRangeSliders() {
  const sliders = document.querySelectorAll('.range-input');
  sliders.forEach(slider => {
    const valSpan = document.getElementById(`${slider.id}Val`);
    if (valSpan) {
      slider.addEventListener('input', (e) => {
        valSpan.textContent = e.target.value;
      });
    }
  });
}

/* Real-time Brix Calculator Handler */
function initCalculatorForm() {
  const calcForm = document.getElementById('brixCalcForm');
  if (!calcForm) return;

  const inputs = calcForm.querySelectorAll('input, select');
  
  // Real-time calculation on input change
  inputs.forEach(input => {
    input.addEventListener('input', runLiveCalculation);
  });

  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    runLiveCalculation();
    showToast('Kalkulasi Brix & Rendemen berhasil diperbarui!', 'success');
  });

  // Run initial calculation on page load
  runLiveCalculation();
}

async function runLiveCalculation() {
  const bot = document.getElementById('brixBottom')?.value || 21;
  const mid = document.getElementById('brixMiddle')?.value || 19;
  const top = document.getElementById('brixTop')?.value || 16;
  const weight = document.getElementById('sampleWeight')?.value || 1.0;
  const age = document.getElementById('plantAge')?.value || 11;

  if (window.EBrixAPI) {
    const res = await window.EBrixAPI.calculateBrix({
      brixBottom: bot,
      brixMiddle: mid,
      brixTop: top,
      weightKg: weight,
      ageMonths: age
    });

    // Update UI elements
    const gaugeBrix = document.getElementById('resBrixAvg');
    const gaugeRendemen = document.getElementById('resRendemen');
    const gaugeRatio = document.getElementById('resRatio');
    const statusBadge = document.getElementById('resStatus');
    const harvestAdvice = document.getElementById('resAdvice');
    const estSugar = document.getElementById('resSugarKg');

    if (gaugeBrix) gaugeBrix.textContent = res.brixAvg;
    if (gaugeRendemen) gaugeRendemen.textContent = `${res.rendemen}%`;
    if (gaugeRatio) gaugeRatio.textContent = res.maturityRatio;
    if (estSugar) estSugar.textContent = `${res.estimatedSugarKg} kg`;

    if (statusBadge) {
      statusBadge.textContent = res.status;
      statusBadge.className = `gauge-status ${res.statusClass}`;
    }

    if (harvestAdvice) {
      harvestAdvice.textContent = res.advice;
    }
  }
}

/* Toast Notifications */
window.showToast = function(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

/* Modal Handler */
function initModalListeners() {
  const openBtns = document.querySelectorAll('[data-open-modal]');
  const closeBtns = document.querySelectorAll('[data-close-modal]');

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-open-modal');
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add('show');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) modal.classList.remove('show');
    });
  });
}
