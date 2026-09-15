/**
 * E-Brix Chart.js Visualizations Module
 */

document.addEventListener('DOMContentLoaded', () => {
  initBrixProgressionChart();
  initRendemenBarChart();
  initMaturityDoughnutChart();
});

/* Line Chart: Perkembangan °Brix berdasarkan Usia Tanam */
function initBrixProgressionChart() {
  const canvas = document.getElementById('brixProgressionChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const gradientPS864 = ctx.createLinearGradient(0, 0, 0, 300);
  gradientPS864.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
  gradientPS864.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

  const gradientPS881 = ctx.createLinearGradient(0, 0, 0, 300);
  gradientPS881.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
  gradientPS881.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Bulan 1', 'Bulan 3', 'Bulan 5', 'Bulan 7', 'Bulan 9', 'Bulan 11 (Panen)', 'Bulan 12'],
      datasets: [
        {
          label: 'PS 864 (Genjah-Sedang)',
          data: [4.2, 7.8, 11.5, 15.2, 18.1, 19.8, 20.1],
          borderColor: '#10b981',
          backgroundColor: gradientPS864,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8
        },
        {
          label: 'PS 881 (Bululawa)',
          data: [3.8, 6.9, 10.2, 13.8, 17.0, 19.5, 20.8],
          borderColor: '#f59e0b',
          backgroundColor: gradientPS881,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 12 } }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#f8fafc',
          bodyColor: '#10b981',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}°Bx`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8' }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', callback: (val) => `${val}°Bx` },
          suggestedMin: 0,
          suggestedMax: 24
        }
      }
    }
  });
}

/* Bar Chart: Perbandingan Rendemen per Blok Lahan */
function initRendemenBarChart() {
  const canvas = document.getElementById('rendemenBarChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Blok A-12', 'Blok B-08', 'Blok C-04', 'Blok D-01', 'Blok E-15', 'Blok F-03'],
      datasets: [{
        label: 'Estimasi Rendemen (%)',
        data: [8.52, 6.20, 9.15, 7.95, 8.80, 8.35],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(244, 63, 94, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(6, 182, 212, 0.8)'
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `Rendemen: ${ctx.raw}%`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', callback: (val) => `${val}%` },
          suggestedMin: 0,
          suggestedMax: 12
        }
      }
    }
  });
}

/* Doughnut Chart: Distribusi Kematangan Lahan Tebu */
function initMaturityDoughnutChart() {
  const canvas = document.getElementById('maturityDoughnutChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Siap Panen (Optimal)', 'Fase Pertumbuhan (Vegetatif)', 'Mendekati Panen', 'Lewat Matang'],
      datasets: [{
        data: [45, 30, 20, 5],
        backgroundColor: [
          '#10b981',
          '#06b6d4',
          '#f59e0b',
          '#f43f5e'
        ],
        borderWidth: 2,
        borderColor: '#0b1320'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#94a3b8', padding: 15, font: { size: 11 } }
        }
      },
      cutout: '70%'
    }
  });
}
