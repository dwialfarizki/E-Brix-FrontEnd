/**
 * E-Brix Frontend API Client Module
 * Decoupled client service ready for separate REST API backend integration.
 */

const API_CONFIG = {
  // Set USE_MOCK_API to false when connecting to external backend REST API
  USE_MOCK_API: true,
  BASE_API_URL: 'https://api.e-brix.farm/v1',
};

// Initial Mock Dataset for Frontend Demonstration
const MockDatabase = {
  stats: {
    avgBrix: 18.7,
    avgRendemen: 8.42,
    totalAreaHa: 1450,
    accuracyRate: 97.4,
    samplesCount: 384
  },

  varieties: [
    {
      id: 'PS864',
      name: 'PS 864',
      origin: 'P3GI Pasuruan',
      maturity: 'Genjah-Sedang (10-12 Bulan)',
      targetBrix: 19.5,
      targetRendemen: 8.8,
      soilSuitability: 'Lahan Aluvial & Grumosol (Kering/Irigasi)',
      description: 'Varietas unggulan dengan potensi kadar gula tinggi, keprasan sangat baik, dan tahan kekeringan.',
      badge: 'Paling Populer'
    },
    {
      id: 'PS881',
      name: 'PS 881 (Bululawa)',
      origin: 'P3GI Pasuruan',
      maturity: 'Sedang-Lambat (12-14 Bulan)',
      targetBrix: 20.2,
      targetRendemen: 9.2,
      soilSuitability: 'Lahan Sawah & Tegal Subur',
      description: 'Batang tinggi dan berdiameter besar. Sangat cocok untuk produksi gula maksimal di akhir musim.',
      badge: 'Rendemen Tinggi'
    },
    {
      id: 'KK',
      name: 'Kidang Kencana (KK)',
      origin: 'Kultivar Lokal Unggul',
      maturity: 'Genjah (9-11 Bulan)',
      targetBrix: 18.2,
      targetRendemen: 8.1,
      soilSuitability: 'Lahan Pasir & Kering',
      description: 'Daya tumbuh cepat dengan ketahanan tinggi terhadap penyakit kepuk & buluk.',
      badge: 'Genjah'
    },
    {
      id: 'VMC71238',
      name: 'VMC 71-238',
      origin: 'Victorias Milling Co.',
      maturity: 'Sedang (11-12 Bulan)',
      targetBrix: 19.0,
      targetRendemen: 8.5,
      soilSuitability: 'Lahan Regosol & Latosol',
      description: 'Varietas impor yang terbukti stabil di berbagai iklim tropis dengan nira jernih.',
      badge: 'Stabil'
    },
    {
      id: 'PS891',
      name: 'PS 891',
      origin: 'P3GI Pasuruan',
      maturity: 'Genjah (10 Bulan)',
      targetBrix: 18.8,
      targetRendemen: 8.4,
      soilSuitability: 'Lahan Sawah Bertumpuk',
      description: 'Mudah dikepras, pertunasan rapat, dan toleran terhadap genangan air berkala.',
      badge: 'Tahan Genangan'
    }
  ],

  logs: [
    {
      id: 'LOG-2026-001',
      date: '2026-09-15',
      block: 'Blok A-12 (Kebun Utara)',
      variety: 'PS 864',
      ageMonths: 11,
      brixBottom: 21.0,
      brixMiddle: 19.2,
      brixTop: 16.5,
      brixAvg: 18.9,
      rendemen: 8.52,
      status: 'Optimal Panen'
    },
    {
      id: 'LOG-2026-002',
      date: '2026-09-14',
      block: 'Blok C-04 (Kebun Timur)',
      variety: 'PS 881',
      ageMonths: 12,
      brixBottom: 22.4,
      brixMiddle: 20.8,
      brixTop: 17.6,
      brixAvg: 20.26,
      rendemen: 9.15,
      status: 'Optimal Panen'
    },
    {
      id: 'LOG-2026-003',
      date: '2026-09-12',
      block: 'Blok B-08 (Kebun Selatan)',
      variety: 'Kidang Kencana',
      ageMonths: 8,
      brixBottom: 16.2,
      brixMiddle: 14.5,
      brixTop: 11.8,
      brixAvg: 14.16,
      rendemen: 6.20,
      status: 'Belum Matang'
    },
    {
      id: 'LOG-2026-004',
      date: '2026-09-10',
      block: 'Blok D-01 (Kebun Barat)',
      variety: 'VMC 71-238',
      ageMonths: 11,
      brixBottom: 19.8,
      brixMiddle: 18.0,
      brixTop: 15.2,
      brixAvg: 17.66,
      rendemen: 7.95,
      status: 'Mendekati Panen'
    }
  ]
};

// Frontend API Service Object
window.EBrixAPI = {
  /**
   * Calculate Sugar Content °Brix and Yield Rendemen
   */
  async calculateBrix(params) {
    const { brixBottom, brixMiddle, brixTop, weightKg = 1.0, waterContentPct = 70.0, ageMonths = 11 } = params;

    // Calculation Logic
    const bot = parseFloat(brixBottom) || 0;
    const mid = parseFloat(brixMiddle) || 0;
    const top = parseFloat(brixTop) || 0;

    const brixAvg = (bot + mid + top) / 3;

    // Formula Rendemen Tebu Nira: Rendemen = (Brix_Avg * Factor_Nira) - Factor_Fiber
    // Factor_Nira approx 0.55 - 0.60; Factor_Fiber approx 2.0
    const factorNira = 0.58;
    const rendemen = Math.max(0, (brixAvg * factorNira) - 2.2 + (ageMonths >= 10 ? 0.4 : 0));

    // Maturity Index: Ratio of Top Brix to Bottom Brix (Top / Bottom)
    // Ideal ratio close to 0.85 - 0.95 indicates uniform maturity
    const maturityRatio = bot > 0 ? (top / bot) : 0;

    let status = 'Belum Matang';
    let statusClass = 'status-warning';
    let advice = 'Tebu masih dalam tahap pembentukan sukrosa. Tunda panen 1-2 bulan lagi.';

    if (brixAvg >= 18.0 && maturityRatio >= 0.75) {
      status = 'Optimal Panen';
      statusClass = 'status-optimal';
      advice = 'Kadar gula dan maturitas seragam. Direkomendasikan segera dijadwalkan untuk tebang angkut!';
    } else if (brixAvg >= 16.0) {
      status = 'Mendekati Panen';
      statusClass = 'status-warning';
      advice = 'Maturitas belum optimal di bagian pucuk. Periksa kembali dalam 2-3 minggu.';
    } else if (brixAvg > 23.0) {
      status = 'Lewat Matang (Overripe)';
      statusClass = 'status-danger';
      advice = 'Kadar gula berisiko mengalami inversi menjadi glukosa/fruktosa. Segera tebang!';
    }

    return {
      brixAvg: Number(brixAvg.toFixed(2)),
      rendemen: Number(rendemen.toFixed(2)),
      maturityRatio: Number(maturityRatio.toFixed(2)),
      status,
      statusClass,
      advice,
      estimatedSugarKg: Number(((weightKg * (rendemen / 100))).toFixed(3))
    };
  },

  /**
   * Fetch Overview KPIs
   */
  async getDashboardStats() {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await fetch(`${API_CONFIG.BASE_API_URL}/stats`);
      return res.json();
    }
    return MockDatabase.stats;
  },

  /**
   * Fetch Varieties Catalog
   */
  async getVarieties() {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await fetch(`${API_CONFIG.BASE_API_URL}/varieties`);
      return res.json();
    }
    return MockDatabase.varieties;
  },

  /**
   * Fetch Sampling Logs
   */
  async getLogs() {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await fetch(`${API_CONFIG.BASE_API_URL}/logs`);
      return res.json();
    }
    return MockDatabase.logs;
  },

  /**
   * Add new sampling test record (Frontend mock store)
   */
  async addLog(newLogData) {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await fetch(`${API_CONFIG.BASE_API_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLogData)
      });
      return res.json();
    }

    const calcResult = await this.calculateBrix(newLogData);
    const entry = {
      id: `LOG-2026-${String(MockDatabase.logs.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      block: newLogData.block,
      variety: newLogData.variety,
      ageMonths: Number(newLogData.ageMonths),
      brixBottom: Number(newLogData.brixBottom),
      brixMiddle: Number(newLogData.brixMiddle),
      brixTop: Number(newLogData.brixTop),
      brixAvg: calcResult.brixAvg,
      rendemen: calcResult.rendemen,
      status: calcResult.status
    };

    MockDatabase.logs.unshift(entry);
    return { success: true, data: entry };
  }
};
