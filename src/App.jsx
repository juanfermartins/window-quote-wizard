import { useState, useEffect, useRef } from 'react';

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  bg: '#F8F7F4',
  surface: '#FFFFFF',
  surfaceAlt: '#F2F1EE',
  border: '#E4E2DC',
  borderFocus: '#1A1A1A',
  text: '#1A1A1A',
  textMuted: '#6B6863',
  textLight: '#A09C96',
  accent: '#2563EB',
  accentLight: '#EFF4FF',
  accentHover: '#1D4ED8',
  success: '#16A34A',
  successLight: '#F0FDF4',
  warning: '#D97706',
  warningLight: '#FFFBEB',
  danger: '#DC2626',
  dangerLight: '#FEF2F2',
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    font-family: 'DM Sans', sans-serif;
    background: ${T.bg};
    color: ${T.text};
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  .mono { font-family: 'DM Mono', monospace; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }

  /* Wizard shell */
  .wizard-shell {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    background: ${T.surface};
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 60px rgba(0,0,0,0.06);
  }

  /* Admin shell */
  .admin-shell {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    min-height: 100vh;
  }

  /* Top nav */
  .top-nav {
    padding: 16px 20px;
    border-bottom: 1px solid ${T.border};
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${T.surface};
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .logo {
    font-weight: 700;
    font-size: 15px;
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-icon {
    width: 28px; height: 28px;
    background: ${T.text};
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    color: white;
    font-size: 13px;
  }

  /* Stepper */
  .stepper {
    padding: 20px 20px 0;
    display: flex;
    align-items: center;
    gap: 0;
  }

  .step-item {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .step-dot {
    width: 26px; height: 26px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
    font-weight: 600;
    flex-shrink: 0;
    transition: all 0.25s ease;
  }
  .step-dot.done { background: ${T.text}; color: white; }
  .step-dot.active { background: ${T.accent}; color: white; box-shadow: 0 0 0 4px ${T.accentLight}; }
  .step-dot.pending { background: ${T.surfaceAlt}; color: ${T.textLight}; border: 1.5px solid ${T.border}; }

  .step-line {
    flex: 1;
    height: 2px;
    background: ${T.border};
    margin: 0 4px;
    transition: background 0.25s;
  }
  .step-line.done { background: ${T.text}; }

  /* Step content */
  .step-content {
    padding: 24px 20px;
    flex: 1;
    overflow-y: auto;
  }

  .step-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 4px;
  }

  .step-subtitle {
    font-size: 13px;
    color: ${T.textMuted};
    margin-bottom: 24px;
  }

  /* Form elements */
  .field { margin-bottom: 16px; }
  
  .label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: ${T.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }

  .input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid ${T.border};
    border-radius: 10px;
    font-family: inherit;
    font-size: 15px;
    color: ${T.text};
    background: ${T.surface};
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .input:focus { border-color: ${T.borderFocus}; box-shadow: 0 0 0 3px rgba(0,0,0,0.06); }
  .input::placeholder { color: ${T.textLight}; }
  .input.error { border-color: ${T.danger}; }

  .select {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid ${T.border};
    border-radius: 10px;
    font-family: inherit;
    font-size: 15px;
    color: ${T.text};
    background: ${T.surface};
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B6863' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .select:focus { border-color: ${T.borderFocus}; outline: none; }

  /* Pill selector */
  .pill-group { display: flex; flex-wrap: wrap; gap: 8px; }
  
  .pill {
    padding: 7px 14px;
    border: 1.5px solid ${T.border};
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;
    background: ${T.surface};
    color: ${T.textMuted};
  }
  .pill:hover { border-color: ${T.text}; color: ${T.text}; }
  .pill.selected { background: ${T.text}; border-color: ${T.text}; color: white; }

  /* Cards */
  .card {
    background: ${T.surface};
    border: 1.5px solid ${T.border};
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 12px;
  }

  .card-sm {
    background: ${T.surfaceAlt};
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 10px;
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 20px;
    border-radius: 12px;
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    text-decoration: none;
  }

  .btn-primary {
    background: ${T.text};
    color: white;
  }
  .btn-primary:hover { background: #333; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  .btn-primary:active { transform: translateY(0); }

  .btn-secondary {
    background: ${T.surfaceAlt};
    color: ${T.text};
    border: 1.5px solid ${T.border};
  }
  .btn-secondary:hover { background: ${T.border}; }

  .btn-accent {
    background: ${T.accent};
    color: white;
  }
  .btn-accent:hover { background: ${T.accentHover}; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.3); }

  .btn-danger {
    background: ${T.dangerLight};
    color: ${T.danger};
    border: 1.5px solid #FCA5A5;
  }
  .btn-danger:hover { background: #FEE2E2; }

  .btn-sm { padding: 7px 12px; font-size: 13px; border-radius: 8px; }
  .btn-full { width: 100%; }

  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

  /* Bottom action bar */
  .bottom-bar {
    padding: 16px 20px;
    border-top: 1px solid ${T.border};
    display: flex;
    gap: 12px;
    background: ${T.surface};
    position: sticky;
    bottom: 0;
  }

  /* Checkbox */
  .checkbox-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px;
    border: 1.5px solid ${T.border};
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.15s;
    margin-bottom: 10px;
    user-select: none;
  }
  .checkbox-row:hover { border-color: ${T.text}; }
  .checkbox-row.checked { border-color: ${T.text}; background: ${T.surfaceAlt}; }

  .checkbox-box {
    width: 20px; height: 20px;
    border: 2px solid ${T.border};
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s;
    margin-top: 1px;
  }
  .checkbox-box.checked { background: ${T.text}; border-color: ${T.text}; }

  .checkbox-label { font-size: 14px; font-weight: 500; }
  .checkbox-desc { font-size: 12px; color: ${T.textMuted}; margin-top: 2px; }

  /* Badge */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2px;
  }
  .badge-blue { background: ${T.accentLight}; color: ${T.accent}; }
  .badge-green { background: ${T.successLight}; color: ${T.success}; }
  .badge-orange { background: ${T.warningLight}; color: ${T.warning}; }
  .badge-red { background: ${T.dangerLight}; color: ${T.danger}; }
  .badge-gray { background: ${T.surfaceAlt}; color: ${T.textMuted}; }

  /* Price row */
  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    font-size: 14px;
    border-bottom: 1px solid ${T.border};
  }
  .price-row:last-child { border-bottom: none; }
  .price-row.total { font-weight: 700; font-size: 17px; padding-top: 14px; }
  .price-row .muted { color: ${T.textMuted}; }

  /* Admin layout */
  .admin-header {
    padding: 20px 0;
    border-bottom: 1px solid ${T.border};
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .admin-nav {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: ${T.surfaceAlt};
    border-radius: 12px;
    margin-bottom: 28px;
  }

  .admin-nav-item {
    padding: 8px 16px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    color: ${T.textMuted};
    transition: all 0.15s;
    border: none;
    background: none;
    font-family: inherit;
  }
  .admin-nav-item.active { background: ${T.surface}; color: ${T.text}; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  .admin-nav-item:hover:not(.active) { color: ${T.text}; }

  /* Table */
  .table-wrap { overflow-x: auto; border: 1.5px solid ${T.border}; border-radius: 14px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th {
    text-align: left;
    padding: 12px 16px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${T.textMuted};
    background: ${T.surfaceAlt};
    border-bottom: 1px solid ${T.border};
  }
  td {
    padding: 13px 16px;
    border-bottom: 1px solid ${T.border};
    color: ${T.text};
  }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: ${T.surfaceAlt}; }

  /* Range slider */
  .slider {
    width: 100%;
    -webkit-appearance: none;
    height: 4px;
    border-radius: 2px;
    background: ${T.border};
    outline: none;
    margin: 12px 0;
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: ${T.text};
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }

  /* Down payment selector */
  .dp-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .dp-option {
    padding: 14px 8px;
    border: 1.5px solid ${T.border};
    border-radius: 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;
  }
  .dp-option:hover { border-color: ${T.text}; }
  .dp-option.selected { border-color: ${T.text}; background: ${T.text}; color: white; }
  .dp-option .dp-pct { font-size: 20px; font-weight: 700; }
  .dp-option .dp-label { font-size: 11px; opacity: 0.7; margin-top: 2px; }

  /* Progress bar */
  .progress-bar {
    height: 3px;
    background: ${T.border};
    border-radius: 2px;
    margin: 16px 20px 0;
  }
  .progress-fill {
    height: 100%;
    background: ${T.text};
    border-radius: 2px;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Success screen */
  .success-icon {
    width: 64px; height: 64px;
    background: ${T.successLight};
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
    margin: 0 auto 20px;
  }

  /* Stripe mock */
  .stripe-card {
    background: #0A2540;
    border-radius: 14px;
    padding: 20px;
    color: white;
    margin-bottom: 16px;
  }

  /* Window item in list */
  .window-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border: 1.5px solid ${T.border};
    border-radius: 12px;
    margin-bottom: 8px;
    background: ${T.surface};
  }

  /* Divider */
  .divider { height: 1px; background: ${T.border}; margin: 20px 0; }

  /* Row helper */
  .row { display: flex; gap: 12px; }
  .col { flex: 1; }

  /* Animate in */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.3s ease forwards; }

  /* Signature pad */
  .sig-pad {
    border: 2px dashed ${T.border};
    border-radius: 12px;
    background: ${T.surfaceAlt};
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${T.textLight};
    font-size: 13px;
    cursor: crosshair;
    position: relative;
    overflow: hidden;
  }

  /* Toggle view */
  .view-toggle {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
  }

  /* Info box */
  .info-box {
    background: ${T.accentLight};
    border: 1px solid #BFDBFE;
    border-radius: 10px;
    padding: 12px 14px;
    font-size: 13px;
    color: ${T.accent};
    margin-bottom: 16px;
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  /* Subscription card */
  .sub-card {
    background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    margin-bottom: 20px;
  }

  .usage-bar {
    height: 8px;
    background: rgba(255,255,255,0.15);
    border-radius: 4px;
    overflow: hidden;
    margin-top: 8px;
  }
  .usage-fill {
    height: 100%;
    background: linear-gradient(90deg, #60A5FA, #34D399);
    border-radius: 4px;
    transition: width 0.6s ease;
  }

  /* Responsive hint for admin on mobile */
  @media (max-width: 768px) {
    .admin-shell { padding: 0 16px; }
    .hide-mobile { display: none !important; }
  }
`;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const WINDOW_TYPES = [
  'Single Hung',
  'Double Hung',
  'Sliding',
  'Picture',
  'Impact',
];
const MATERIALS = ['Vinyl', 'Aluminum'];
const COLORS = ['White', 'Bronze', 'Black', 'Tan', 'Gray'];
const GLASS_OPTIONS = [
  'Standard',
  'Low-E',
  'Tempered',
  'Laminated',
  'Hurricane Impact',
];

const CITY_RULES = {
  33101: {
    city: 'Miami',
    county: 'Miami-Dade',
    permit: true,
    hurricane: true,
    inspection: true,
    permitCost: 150,
  },
  33139: {
    city: 'Miami Beach',
    county: 'Miami-Dade',
    permit: true,
    hurricane: true,
    inspection: false,
    permitCost: 125,
  },
  90210: {
    city: 'Beverly Hills',
    county: 'LA County',
    permit: false,
    hurricane: false,
    inspection: false,
    permitCost: 0,
  },
  10001: {
    city: 'New York',
    county: 'Manhattan',
    permit: true,
    hurricane: false,
    inspection: true,
    permitCost: 200,
  },
  default: {
    city: 'Unknown',
    county: '—',
    permit: false,
    hurricane: false,
    inspection: false,
    permitCost: 0,
  },
};

const BASE_PRICES = {
  'Single Hung': 280,
  'Double Hung': 340,
  Sliding: 320,
  Picture: 260,
  Impact: 520,
};
const MATERIAL_MULT = { Vinyl: 1.0, Aluminum: 1.15 };
const COLOR_MULT = {
  White: 1.0,
  Bronze: 1.05,
  Black: 1.1,
  Tan: 1.02,
  Gray: 1.05,
};
const GLASS_MULT = {
  Standard: 1.0,
  'Low-E': 1.12,
  Tempered: 1.15,
  Laminated: 1.2,
  'Hurricane Impact': 1.35,
};
const SIZE_MULT = (w, h) => {
  const area = (w * h) / 144;
  if (area < 6) return 0.9;
  if (area < 10) return 1.0;
  if (area < 15) return 1.12;
  return 1.25;
};

const INSTALL_PER_WINDOW = 120;
const GC_FEE = 350;
const DISPOSAL_FEE = 75;
const TAX_RATE = 0.07;

function calcWindowPrice(w) {
  const base = BASE_PRICES[w.type] || 300;
  const mat = MATERIAL_MULT[w.material] || 1;
  const col = COLOR_MULT[w.color] || 1;
  const gl = GLASS_MULT[w.glass] || 1;
  const sz = SIZE_MULT(w.width || 36, w.height || 48);
  return Math.round(base * mat * col * gl * sz * (w.qty || 1));
}

const MOCK_QUOTES = [
  {
    id: 'Q-1042',
    customer: 'Sarah Johnson',
    date: 'Mar 4, 2026',
    windows: 6,
    total: 8420,
    status: 'signed',
  },
  {
    id: 'Q-1041',
    customer: 'Mike Torres',
    date: 'Mar 3, 2026',
    windows: 3,
    total: 3150,
    status: 'paid',
  },
  {
    id: 'Q-1040',
    customer: 'Linda Park',
    date: 'Mar 1, 2026',
    windows: 12,
    total: 15800,
    status: 'finalized',
  },
  {
    id: 'Q-1039',
    customer: 'Dave Wilson',
    date: 'Feb 28, 2026',
    windows: 4,
    total: 5200,
    status: 'draft',
  },
  {
    id: 'Q-1038',
    customer: 'Ana Reyes',
    date: 'Feb 25, 2026',
    windows: 8,
    total: 9600,
    status: 'signed',
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(n);

const StatusBadge = ({ status }) => {
  const map = {
    draft: 'badge-gray',
    finalized: 'badge-blue',
    signed: 'badge-orange',
    paid: 'badge-green',
  };
  return (
    <span className={`badge ${map[status] || 'badge-gray'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    check: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
          d="M3 8l3.5 3.5L13 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    x: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
          d="M4 4l8 8M12 4l-8 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    plus: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
          d="M8 3v10M3 8h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    edit: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
          d="M10.5 3.5l2 2L5 13H3v-2L10.5 3.5z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
    trash: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
          d="M3 5h10M6 5V3h4v2M6 8v4M10 8v4M4 5l1 8h6l1-8"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    window: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <rect
          x="2"
          y="2"
          width="12"
          height="12"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <line
          x1="8"
          y1="2"
          x2="8"
          y2="14"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <line
          x1="2"
          y1="8"
          x2="14"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
    ),
    info: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M8 7v4M8 5.5v.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    download: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
          d="M8 3v7M5 8l3 3 3-3M3 13h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    arrow_right: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
          d="M3 8h10M9 5l4 3-4 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
          d="M8 2l5 2v4c0 3-2.5 5.5-5 6-2.5-.5-5-3-5-6V4l5-2z"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
    ),
    settings: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    ),
    map: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
          d="M5.5 2L2 4v10l3.5-2 5 2L14 12V2L10.5 4l-5-2z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M5.5 2v10M10.5 4v10"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    list: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <path
          d="M3 4h10M3 8h10M3 12h7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    star: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1l1.8 5.5H15l-4.6 3.3 1.7 5.2L8 12l-4.1 3 1.7-5.2L1 6.5h5.2z" />
      </svg>
    ),
    lock: (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <rect
          x="3"
          y="7"
          width="10"
          height="8"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M5 7V5a3 3 0 016 0v2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    ),
  };
  return icons[name] || null;
};

// ─── STEP 1: CUSTOMER INFO ────────────────────────────────────────────────────
function Step1({ data, onChange, errors }) {
  const fields = [
    {
      key: 'name',
      label: 'Full Name',
      placeholder: 'Jane Smith',
      type: 'text',
    },
    {
      key: 'email',
      label: 'Email Address',
      placeholder: 'jane@email.com',
      type: 'email',
    },
    {
      key: 'phone',
      label: 'Phone Number',
      placeholder: '(305) 555-0123',
      type: 'tel',
    },
    {
      key: 'address',
      label: 'Property Address',
      placeholder: '123 Main Street',
      type: 'text',
    },
    { key: 'zip', label: 'ZIP Code', placeholder: '33101', type: 'text' },
  ];

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Your Information</h2>
      <p className="step-subtitle">
        We'll use this to generate your personalized quote.
      </p>
      {fields.map((f) => (
        <div className="field" key={f.key}>
          <label className="label">{f.label}</label>
          <input
            className={`input ${errors[f.key] ? 'error' : ''}`}
            type={f.type}
            placeholder={f.placeholder}
            value={data[f.key] || ''}
            onChange={(e) => onChange(f.key, e.target.value)}
          />
          {errors[f.key] && (
            <div style={{ fontSize: 11, color: T.danger, marginTop: 4 }}>
              {errors[f.key]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── STEP 2: WINDOW CONFIGURATOR ─────────────────────────────────────────────
function Step2({ windows, setWindows }) {
  const empty = {
    type: 'Double Hung',
    material: 'Vinyl',
    color: 'White',
    glass: 'Standard',
    width: 36,
    height: 48,
    qty: 1,
  };
  const [form, setForm] = useState(empty);
  const [editIdx, setEditIdx] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    if (editIdx !== null) {
      const updated = [...windows];
      updated[editIdx] = form;
      setWindows(updated);
      setEditIdx(null);
    } else {
      setWindows([...windows, { ...form, id: Date.now() }]);
    }
    setForm(empty);
    setShowForm(false);
  };

  const handleEdit = (i) => {
    setForm(windows[i]);
    setEditIdx(i);
    setShowForm(true);
  };
  const handleDelete = (i) => setWindows(windows.filter((_, idx) => idx !== i));

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Windows</h2>
      <p className="step-subtitle">
        Configure each window for accurate pricing.
      </p>

      {windows.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {windows.map((w, i) => (
            <div className="window-item" key={w.id || i}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {w.qty}× {w.type}
                </div>
                <div style={{ fontSize: 12, color: T.textMuted }}>
                  {w.material} · {w.color} · {w.glass}
                </div>
                <div style={{ fontSize: 12, color: T.textMuted }}>
                  {w.width}"W × {w.height}"H
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontFamily: 'DM Mono',
                    fontSize: 14,
                  }}
                >
                  {fmt(calcWindowPrice(w))}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleEdit(i)}
                  >
                    <Icon name="edit" size={13} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(i)}
                  >
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!showForm ? (
        <button
          className="btn btn-secondary btn-full"
          onClick={() => setShowForm(true)}
        >
          <Icon name="plus" /> Add Window
        </button>
      ) : (
        <div className="card fade-up">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>
            {editIdx !== null ? 'Edit Window' : 'New Window'}
          </div>

          <div className="field">
            <label className="label">Window Type</label>
            <div className="pill-group">
              {WINDOW_TYPES.map((t) => (
                <div
                  key={t}
                  className={`pill ${form.type === t ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, type: t })}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="row">
            <div className="col field">
              <label className="label">Material</label>
              <select
                className="select"
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
              >
                {MATERIALS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="col field">
              <label className="label">Color</label>
              <select
                className="select"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              >
                {COLORS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label className="label">Glass Type</label>
            <select
              className="select"
              value={form.glass}
              onChange={(e) => setForm({ ...form, glass: e.target.value })}
            >
              {GLASS_OPTIONS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col field">
              <label className="label">Width (in.)</label>
              <input
                className="input"
                type="number"
                value={form.width}
                min={12}
                max={120}
                onChange={(e) =>
                  setForm({ ...form, width: Number(e.target.value) })
                }
              />
            </div>
            <div className="col field">
              <label className="label">Height (in.)</label>
              <input
                className="input"
                type="number"
                value={form.height}
                min={12}
                max={120}
                onChange={(e) =>
                  setForm({ ...form, height: Number(e.target.value) })
                }
              />
            </div>
            <div className="col field">
              <label className="label">Qty</label>
              <input
                className="input"
                type="number"
                value={form.qty}
                min={1}
                max={50}
                onChange={(e) =>
                  setForm({ ...form, qty: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div
            style={{
              background: T.surfaceAlt,
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 13, color: T.textMuted }}>
              Estimated price
            </span>
            <span style={{ fontWeight: 700, fontFamily: 'DM Mono' }}>
              {fmt(calcWindowPrice(form))}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => {
                setShowForm(false);
                setEditIdx(null);
                setForm(empty);
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 2 }}
              onClick={handleAdd}
            >
              {editIdx !== null ? 'Save Changes' : 'Add Window'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STEP 3: SERVICES ─────────────────────────────────────────────────────────
function Step3({ services, setServices, zip }) {
  const rules = CITY_RULES[zip] || CITY_RULES['default'];

  const toggle = (key) => setServices((s) => ({ ...s, [key]: !s[key] }));

  useEffect(() => {
    if (rules.permit) setServices((s) => ({ ...s, permit: true }));
  }, [zip]);

  const svcList = [
    {
      key: 'installation',
      label: 'Professional Installation',
      desc: `$${INSTALL_PER_WINDOW}/window · Certified installers`,
      icon: '🔧',
    },
    {
      key: 'permit',
      label: 'Building Permit',
      desc: rules.permit
        ? `Required in ${rules.city} · $${rules.permitCost} flat`
        : 'Optional · varies by city',
      icon: '📋',
      required: rules.permit,
    },
    {
      key: 'gc',
      label: 'General Contractor Oversight',
      desc: `$${GC_FEE} flat · Required for 5+ windows`,
      icon: '👷',
    },
    {
      key: 'disposal',
      label: 'Disposal & Haul-Away',
      desc: `$${DISPOSAL_FEE} · Old windows removed & recycled`,
      icon: '♻️',
    },
  ];

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Services</h2>
      <p className="step-subtitle">
        Add any additional services to your project.
      </p>

      {/* City Rules Card */}
      <div
        className="card"
        style={{ background: T.surfaceAlt, marginBottom: 20 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 10,
          }}
        >
          <Icon name="map" size={15} />
          <span style={{ fontWeight: 700, fontSize: 13 }}>
            Rules for {rules.city || zip || 'your area'}
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {rules.permit && (
            <span className="badge badge-red">⚠ Permit Required</span>
          )}
          {rules.hurricane && (
            <span className="badge badge-orange">🌀 Hurricane Zone</span>
          )}
          {rules.inspection && (
            <span className="badge badge-blue">🔍 Inspection Needed</span>
          )}
          {!rules.permit && !rules.hurricane && !rules.inspection && (
            <span className="badge badge-green">
              ✓ Standard zone — no special requirements
            </span>
          )}
        </div>
        {rules.permitCost > 0 && (
          <div style={{ fontSize: 12, color: T.textMuted, marginTop: 8 }}>
            Permit fee: ${rules.permitCost} flat rate
          </div>
        )}
      </div>

      {svcList.map((s) => (
        <div
          key={s.key}
          className={`checkbox-row ${services[s.key] ? 'checked' : ''}`}
          onClick={() => !s.required && toggle(s.key)}
        >
          <div className={`checkbox-box ${services[s.key] ? 'checked' : ''}`}>
            {services[s.key] && <Icon name="check" size={12} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="checkbox-label">
                {s.icon} {s.label}
              </span>
              {s.required && (
                <span className="badge badge-red" style={{ fontSize: 10 }}>
                  Required
                </span>
              )}
            </div>
            <div className="checkbox-desc">{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── STEP 4: PRICE SUMMARY ────────────────────────────────────────────────────
function Step4({ windows, services, zip, downPct, setDownPct }) {
  const rules = CITY_RULES[zip] || CITY_RULES['default'];
  const windowTotal = windows.reduce((sum, w) => sum + calcWindowPrice(w), 0);
  const windowCount = windows.reduce((sum, w) => sum + (w.qty || 1), 0);
  const installFee = services.installation
    ? windowCount * INSTALL_PER_WINDOW
    : 0;
  const permitFee = services.permit ? rules.permitCost : 0;
  const gcFee = services.gc ? GC_FEE : 0;
  const disposalFee = services.disposal ? DISPOSAL_FEE : 0;
  const subtotal = windowTotal + installFee + permitFee + gcFee + disposalFee;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;
  const downAmt = Math.round(total * (downPct / 100));

  const lines = [
    { label: `Windows (${windowCount} units)`, amount: windowTotal },
    services.installation && { label: 'Installation', amount: installFee },
    services.permit && { label: 'Permit Fee', amount: permitFee },
    services.gc && { label: 'General Contractor', amount: gcFee },
    services.disposal && { label: 'Disposal & Haul-Away', amount: disposalFee },
    { label: `Sales Tax (${(TAX_RATE * 100).toFixed(0)}%)`, amount: tax },
  ].filter(Boolean);

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Price Summary</h2>
      <p className="step-subtitle">Review your quote breakdown.</p>

      <div className="card">
        {lines.map((l, i) => (
          <div key={i} className="price-row">
            <span className="muted">{l.label}</span>
            <span className="mono" style={{ fontWeight: 500 }}>
              {fmt(l.amount)}
            </span>
          </div>
        ))}
        <div className="price-row total">
          <span>Total</span>
          <span className="mono">{fmt(total)}</span>
        </div>
      </div>

      <div className="divider" />

      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
        Down Payment
      </div>
      <div className="dp-options">
        {[10, 20, 30].map((pct) => (
          <div
            key={pct}
            className={`dp-option ${downPct === pct ? 'selected' : ''}`}
            onClick={() => setDownPct(pct)}
          >
            <div className="dp-pct">{pct}%</div>
            <div className="dp-label">
              {fmt(Math.round((total * pct) / 100))}
            </div>
          </div>
        ))}
      </div>

      <div className="info-box" style={{ marginTop: 16 }}>
        <Icon name="info" size={15} />
        <span>
          Balance of <strong>{fmt(total - downAmt)}</strong> due upon
          completion.
        </span>
      </div>
    </div>
  );
}

// ─── STEP 5: REVIEW & CONFIRM ─────────────────────────────────────────────────
function Step5({ customer, windows, services, zip, downPct, onConfirm }) {
  const [agreed, setAgreed] = useState(false);
  const rules = CITY_RULES[zip] || CITY_RULES['default'];
  const windowTotal = windows.reduce((sum, w) => sum + calcWindowPrice(w), 0);
  const windowCount = windows.reduce((sum, w) => sum + (w.qty || 1), 0);
  const installFee = services.installation ? windowCount * 120 : 0;
  const permitFee = services.permit ? rules.permitCost : 0;
  const gcFee = services.gc ? GC_FEE : 0;
  const disposalFee = services.disposal ? DISPOSAL_FEE : 0;
  const subtotal = windowTotal + installFee + permitFee + gcFee + disposalFee;
  const total = Math.round(subtotal * (1 + TAX_RATE));
  const downAmt = Math.round((total * downPct) / 100);

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Review & Confirm</h2>
      <p className="step-subtitle">
        Verify everything looks correct before generating your contract.
      </p>

      <div className="card-sm">
        <div
          style={{
            fontWeight: 600,
            fontSize: 12,
            color: T.textMuted,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Customer
        </div>
        <div style={{ fontWeight: 600 }}>{customer.name}</div>
        <div style={{ fontSize: 13, color: T.textMuted }}>
          {customer.email} · {customer.phone}
        </div>
        <div style={{ fontSize: 13, color: T.textMuted }}>
          {customer.address}, {customer.zip}
        </div>
      </div>

      <div className="card-sm">
        <div
          style={{
            fontWeight: 600,
            fontSize: 12,
            color: T.textMuted,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Windows ({windows.length} types)
        </div>
        {windows.map((w, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              marginBottom: 4,
            }}
          >
            <span>
              {w.qty}× {w.type} · {w.material} · {w.glass}
            </span>
            <span style={{ fontFamily: 'DM Mono', fontWeight: 500 }}>
              {fmt(calcWindowPrice(w))}
            </span>
          </div>
        ))}
      </div>

      <div className="card-sm">
        <div
          style={{
            fontWeight: 600,
            fontSize: 12,
            color: T.textMuted,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Services
        </div>
        {[
          services.installation && 'Installation',
          services.permit && 'Permit',
          services.gc && 'General Contractor',
          services.disposal && 'Disposal',
        ]
          .filter(Boolean)
          .map((s) => (
            <div
              key={s}
              style={{
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 3,
              }}
            >
              <Icon name="check" size={12} /> {s}
            </div>
          ))}
      </div>

      <div className="card-sm">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600 }}>Total</span>
          <span
            style={{ fontWeight: 700, fontFamily: 'DM Mono', fontSize: 16 }}
          >
            {fmt(total)}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 4,
            fontSize: 13,
            color: T.textMuted,
          }}
        >
          <span>Down payment ({downPct}%)</span>
          <span style={{ fontFamily: 'DM Mono' }}>{fmt(downAmt)}</span>
        </div>
      </div>

      <div
        className={`checkbox-row ${agreed ? 'checked' : ''}`}
        onClick={() => setAgreed(!agreed)}
        style={{ marginTop: 16 }}
      >
        <div className={`checkbox-box ${agreed ? 'checked' : ''}`}>
          {agreed && <Icon name="check" size={12} />}
        </div>
        <div>
          <div className="checkbox-label">
            I agree to the Terms & Conditions
          </div>
          <div className="checkbox-desc">
            By checking this, you accept the service agreement, warranty terms,
            and payment schedule.
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary btn-full"
        style={{ marginTop: 16 }}
        disabled={!agreed}
        onClick={onConfirm}
      >
        Generate Contract <Icon name="arrow_right" />
      </button>
    </div>
  );
}

// ─── POST-WIZARD SCREENS ──────────────────────────────────────────────────────
function ContractReady({ customer, total, downPct, onSign }) {
  const downAmt = Math.round((total * downPct) / 100);
  return (
    <div
      className="step-content fade-up"
      style={{ textAlign: 'center', paddingTop: 40 }}
    >
      <div className="success-icon">📄</div>
      <h2 className="step-title" style={{ textAlign: 'center' }}>
        Contract Ready
      </h2>
      <p className="step-subtitle" style={{ textAlign: 'center' }}>
        Your contract has been generated and is ready for signature.
      </p>

      {/* PDF Preview Mock */}
      <div
        className="card"
        style={{
          textAlign: 'left',
          background: '#FAFAFA',
          fontFamily: 'DM Mono',
          fontSize: 11,
          lineHeight: 1.7,
          color: T.textMuted,
        }}
      >
        <div
          style={{
            borderBottom: `1px solid ${T.border}`,
            paddingBottom: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: T.text,
              fontFamily: 'DM Sans',
            }}
          >
            WINDOW INSTALLATION CONTRACT
          </div>
          <div>
            Quote #Q-{Math.floor(Math.random() * 1000) + 1000} ·{' '}
            {new Date().toLocaleDateString()}
          </div>
        </div>
        <div>Customer: {customer.name}</div>
        <div>
          Address: {customer.address}, {customer.zip}
        </div>
        <div style={{ marginTop: 8 }}>TOTAL CONTRACT VALUE: {fmt(total)}</div>
        <div>
          DOWN PAYMENT DUE: {fmt(downAmt)} ({downPct}%)
        </div>
        <div style={{ marginTop: 8, fontStyle: 'italic' }}>
          ...full terms on 3 pages...
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }}>
          <Icon name="download" /> PDF
        </button>
        <button
          className="btn btn-primary"
          style={{ flex: 2 }}
          onClick={onSign}
        >
          <Icon name="lock" /> Sign Contract
        </button>
      </div>
    </div>
  );
}

function SignContract({ customer, onPay }) {
  const canvasRef = useRef(null);
  const [signed, setSigned] = useState(false);
  const [drawing, setDrawing] = useState(false);

  const handleMouseDown = (e) => {
    setDrawing(true);
  };
  const handleMouseUp = () => {
    setDrawing(false);
    setSigned(true);
  };
  const handleMouseMove = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = T.text;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setSigned(false);
  };

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Sign Contract</h2>
      <p className="step-subtitle">
        Draw your signature below to legally sign the agreement.
      </p>

      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
        Signature
      </div>
      <div
        style={{
          position: 'relative',
          border: `1.5px solid ${T.border}`,
          borderRadius: 12,
          overflow: 'hidden',
          background: T.surfaceAlt,
        }}
      >
        <canvas
          ref={canvasRef}
          width={350}
          height={120}
          style={{ display: 'block', cursor: 'crosshair', touchAction: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
        {!signed && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: T.textLight,
              fontSize: 13,
              pointerEvents: 'none',
            }}
          >
            Draw your signature here
          </div>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 8,
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: 12, color: T.textMuted }}>
          {customer.name} · {new Date().toLocaleDateString()}
        </span>
        <button
          style={{
            background: 'none',
            border: 'none',
            fontSize: 12,
            color: T.accent,
            cursor: 'pointer',
          }}
          onClick={clear}
        >
          Clear
        </button>
      </div>

      <button
        className="btn btn-primary btn-full"
        disabled={!signed}
        onClick={onPay}
      >
        Confirm Signature → Pay Deposit
      </button>
    </div>
  );
}

function PayDeposit({ downAmt }) {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
    }, 2500);
  };

  if (paid)
    return (
      <div
        className="step-content fade-up"
        style={{ textAlign: 'center', paddingTop: 60 }}
      >
        <div className="success-icon">✅</div>
        <h2 className="step-title" style={{ textAlign: 'center' }}>
          Payment Received!
        </h2>
        <p className="step-subtitle" style={{ textAlign: 'center' }}>
          Your deposit of <strong>{fmt(downAmt)}</strong> has been processed. A
          confirmation email is on its way.
        </p>
        <div style={{ marginTop: 24, fontSize: 13, color: T.textMuted }}>
          Quote #Q-{Math.floor(Math.random() * 1000) + 1000}
        </div>
      </div>
    );

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Pay Deposit</h2>
      <p className="step-subtitle">
        Secure your project with a deposit payment.
      </p>

      <div className="stripe-card">
        <div
          style={{
            fontSize: 11,
            opacity: 0.6,
            marginBottom: 16,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          Powered by Stripe
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
            Card number
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '12px 14px',
              fontSize: 15,
              letterSpacing: 2,
            }}
          >
            4242 4242 4242 4242
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
              Expiry
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '12px 14px',
                fontSize: 15,
              }}
            >
              12/27
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
              CVC
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '12px 14px',
                fontSize: 15,
              }}
            >
              •••
            </div>
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>Deposit Amount</div>
          <div style={{ fontSize: 12, color: T.textMuted }}>Charged now</div>
        </div>
        <div style={{ fontWeight: 800, fontSize: 22, fontFamily: 'DM Mono' }}>
          {fmt(downAmt)}
        </div>
      </div>

      <button
        className="btn btn-accent btn-full"
        onClick={handlePay}
        disabled={paying}
      >
        {paying ? 'Processing...' : `Pay ${fmt(downAmt)} Now`}
      </button>
      <div
        style={{
          textAlign: 'center',
          fontSize: 11,
          color: T.textLight,
          marginTop: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <Icon name="lock" size={11} /> Secured by Stripe
      </div>
    </div>
  );
}

// ─── WIZARD ───────────────────────────────────────────────────────────────────
function Wizard() {
  const [step, setStep] = useState(1);
  const [postStep, setPostStep] = useState(null); // "contract" | "sign" | "pay"
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    zip: '',
  });
  const [windows, setWindows] = useState([]);
  const [services, setServices] = useState({
    installation: true,
    permit: false,
    gc: false,
    disposal: false,
  });
  const [downPct, setDownPct] = useState(20);
  const [errors, setErrors] = useState({});

  const stepLabels = ['Info', 'Windows', 'Services', 'Pricing', 'Review'];

  const validate1 = () => {
    const e = {};
    if (!customer.name.trim()) e.name = 'Name is required';
    if (!customer.email.match(/\S+@\S+\.\S+/)) e.email = 'Valid email required';
    if (!customer.phone.trim()) e.phone = 'Phone is required';
    if (!customer.address.trim()) e.address = 'Address is required';
    if (!customer.zip.trim()) e.zip = 'ZIP code is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validate1()) return;
    if (step === 2 && windows.length === 0) {
      alert('Add at least one window.');
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const rules = CITY_RULES[customer.zip] || CITY_RULES['default'];
  const windowTotal = windows.reduce((sum, w) => sum + calcWindowPrice(w), 0);
  const windowCount = windows.reduce((sum, w) => sum + (w.qty || 1), 0);
  const total = Math.round(
    (windowTotal +
      (services.installation ? windowCount * 120 : 0) +
      (services.permit ? rules.permitCost : 0) +
      (services.gc ? GC_FEE : 0) +
      (services.disposal ? DISPOSAL_FEE : 0)) *
      (1 + TAX_RATE)
  );
  const downAmt = Math.round((total * downPct) / 100);

  if (postStep === 'pay')
    return (
      <div className="wizard-shell">
        <div className="top-nav">
          <div className="logo">
            <div className="logo-icon">
              <Icon name="window" size={14} />
            </div>{' '}
            WindowQuote
          </div>
        </div>
        <PayDeposit downAmt={downAmt} />
      </div>
    );

  if (postStep === 'sign')
    return (
      <div className="wizard-shell">
        <div className="top-nav">
          <div className="logo">
            <div className="logo-icon">
              <Icon name="window" size={14} />
            </div>{' '}
            WindowQuote
          </div>
        </div>
        <SignContract customer={customer} onPay={() => setPostStep('pay')} />
      </div>
    );

  if (postStep === 'contract')
    return (
      <div className="wizard-shell">
        <div className="top-nav">
          <div className="logo">
            <div className="logo-icon">
              <Icon name="window" size={14} />
            </div>{' '}
            WindowQuote
          </div>
        </div>
        <ContractReady
          customer={customer}
          total={total}
          downPct={downPct}
          onSign={() => setPostStep('sign')}
        />
      </div>
    );

  return (
    <div className="wizard-shell">
      <div className="top-nav">
        <div className="logo">
          <div className="logo-icon">
            <Icon name="window" size={14} />
          </div>{' '}
          WindowQuote
        </div>
        <span style={{ fontSize: 12, color: T.textMuted }}>
          Step {step} of 5
        </span>
      </div>

      {/* Progress */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      {/* Stepper */}
      <div className="stepper">
        {[1, 2, 3, 4, 5].map((s, i) => (
          <div key={s} className="step-item">
            <div
              className={`step-dot ${
                s < step ? 'done' : s === step ? 'active' : 'pending'
              }`}
            >
              {s < step ? <Icon name="check" size={11} /> : s}
            </div>
            {i < 4 && <div className={`step-line ${s < step ? 'done' : ''}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Step1
          data={customer}
          onChange={(k, v) => {
            setCustomer((c) => ({ ...c, [k]: v }));
            setErrors((e) => ({ ...e, [k]: null }));
          }}
          errors={errors}
        />
      )}
      {step === 2 && <Step2 windows={windows} setWindows={setWindows} />}
      {step === 3 && (
        <Step3
          services={services}
          setServices={setServices}
          zip={customer.zip}
        />
      )}
      {step === 4 && (
        <Step4
          windows={windows}
          services={services}
          zip={customer.zip}
          downPct={downPct}
          setDownPct={setDownPct}
        />
      )}
      {step === 5 && (
        <Step5
          customer={customer}
          windows={windows}
          services={services}
          zip={customer.zip}
          downPct={downPct}
          onConfirm={() => setPostStep('contract')}
        />
      )}

      {step < 5 && (
        <div className="bottom-bar">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={handleBack}>
              Back
            </button>
          )}
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleNext}
          >
            {step === 4 ? 'Review Quote' : 'Continue'}{' '}
            <Icon name="arrow_right" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel() {
  const [tab, setTab] = useState('quotes');
  const [quotes, setQuotes] = useState(MOCK_QUOTES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const tabs = [
    { id: 'quotes', label: '📋 Quotes' },
    { id: 'products', label: '🪟 Products' },
    { id: 'services', label: '🔧 Services' },
    { id: 'cities', label: '🗺 City Rules' },
    { id: 'subscription', label: '⭐ Subscription' },
  ];

  const filteredQuotes = quotes.filter(
    (q) =>
      (statusFilter === 'all' || q.status === statusFilter) &&
      (q.customer.toLowerCase().includes(search.toLowerCase()) ||
        q.id.includes(search))
  );

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <div>
          <div className="logo" style={{ fontSize: 17, marginBottom: 4 }}>
            <div className="logo-icon">
              <Icon name="window" size={15} />
            </div>{' '}
            WindowQuote Admin
          </div>
          <div style={{ fontSize: 13, color: T.textMuted }}>
            Manage your quoting system
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="badge badge-green">● Live</span>
          <button className="btn btn-primary btn-sm">
            <Icon name="settings" /> Settings
          </button>
        </div>
      </div>

      <div className="admin-nav">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`admin-nav-item ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* QUOTES TAB */}
      {tab === 'quotes' && (
        <div className="fade-up">
          <div
            style={{
              display: 'flex',
              gap: 12,
              marginBottom: 20,
              flexWrap: 'wrap',
            }}
          >
            <input
              className="input"
              style={{ maxWidth: 280 }}
              placeholder="Search quotes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="select"
              style={{ maxWidth: 160 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="finalized">Finalized</option>
              <option value="signed">Signed</option>
              <option value="paid">Paid</option>
            </select>
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginLeft: 'auto' }}
            >
              <Icon name="download" /> Export CSV
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Quote ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Windows</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((q) => (
                  <tr key={q.id}>
                    <td>
                      <span className="mono" style={{ fontWeight: 600 }}>
                        {q.id}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{q.customer}</td>
                    <td style={{ color: T.textMuted }}>{q.date}</td>
                    <td style={{ color: T.textMuted }}>{q.windows}</td>
                    <td>
                      <span className="mono" style={{ fontWeight: 600 }}>
                        {fmt(q.total)}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={q.status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm">
                          <Icon name="edit" size={12} />
                        </button>
                        <button className="btn btn-danger btn-sm">
                          <Icon name="trash" size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: T.textMuted }}>
            {filteredQuotes.length} quotes shown
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {tab === 'products' && (
        <div className="fade-up">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <h3 style={{ fontWeight: 700, fontSize: 18 }}>Window Products</h3>
            <button className="btn btn-primary btn-sm">
              <Icon name="plus" /> Add Product
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Base Price</th>
                  <th>Vinyl Mult</th>
                  <th>Aluminum Mult</th>
                  <th>Impact Mult</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(BASE_PRICES).map(([type, price]) => (
                  <tr key={type}>
                    <td style={{ fontWeight: 600 }}>{type}</td>
                    <td>
                      <span className="mono">{fmt(price)}</span>
                    </td>
                    <td>
                      <span className="badge badge-gray">1.00×</span>
                    </td>
                    <td>
                      <span className="badge badge-blue">1.15×</span>
                    </td>
                    <td>
                      <span className="badge badge-orange">
                        {type === 'Impact' ? 'incl.' : '1.35×'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm">
                          <Icon name="edit" size={12} />
                        </button>
                        <button className="btn btn-danger btn-sm">
                          <Icon name="trash" size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 20 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 12 }}>
              Color & Glass Multipliers
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Color</th>
                      <th>Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(COLOR_MULT).map(([c, m]) => (
                      <tr key={c}>
                        <td>{c}</td>
                        <td className="mono">{m.toFixed(2)}×</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Glass</th>
                      <th>Multiplier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(GLASS_MULT).map(([g, m]) => (
                      <tr key={g}>
                        <td>{g}</td>
                        <td className="mono">{m.toFixed(2)}×</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SERVICES TAB */}
      {tab === 'services' && (
        <div className="fade-up">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <h3 style={{ fontWeight: 700, fontSize: 18 }}>Service Pricing</h3>
            <button className="btn btn-primary btn-sm">
              <Icon name="plus" /> Add Service
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Pricing Model</th>
                  <th>Amount</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: 'Installation',
                    model: 'Per Window',
                    amt: fmt(INSTALL_PER_WINDOW),
                    notes: 'Certified installer',
                  },
                  {
                    name: 'Permit',
                    model: 'Flat (by city)',
                    amt: '$75–$200',
                    notes: 'ZIP-code dependent',
                  },
                  {
                    name: 'General Contractor',
                    model: 'Flat Fee',
                    amt: fmt(GC_FEE),
                    notes: 'Required 5+ windows',
                  },
                  {
                    name: 'Disposal',
                    model: 'Flat Fee',
                    amt: fmt(DISPOSAL_FEE),
                    notes: 'Per project',
                  },
                ].map((s) => (
                  <tr key={s.name}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td>
                      <span className="badge badge-gray">{s.model}</span>
                    </td>
                    <td className="mono" style={{ fontWeight: 600 }}>
                      {s.amt}
                    </td>
                    <td style={{ color: T.textMuted, fontSize: 12 }}>
                      {s.notes}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm">
                          <Icon name="edit" size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CITIES TAB */}
      {tab === 'cities' && (
        <div className="fade-up">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <h3 style={{ fontWeight: 700, fontSize: 18 }}>City Rules</h3>
            <button className="btn btn-primary btn-sm">
              <Icon name="plus" /> Add ZIP
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ZIP</th>
                  <th>City</th>
                  <th>County</th>
                  <th>Permit</th>
                  <th>Hurricane</th>
                  <th>Inspection</th>
                  <th>Permit Cost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(CITY_RULES)
                  .filter(([k]) => k !== 'default')
                  .map(([zip, r]) => (
                    <tr key={zip}>
                      <td className="mono" style={{ fontWeight: 600 }}>
                        {zip}
                      </td>
                      <td style={{ fontWeight: 500 }}>{r.city}</td>
                      <td style={{ color: T.textMuted }}>{r.county}</td>
                      <td>
                        {r.permit ? (
                          <span className="badge badge-red">Yes</span>
                        ) : (
                          <span className="badge badge-gray">No</span>
                        )}
                      </td>
                      <td>
                        {r.hurricane ? (
                          <span className="badge badge-orange">Yes</span>
                        ) : (
                          <span className="badge badge-gray">No</span>
                        )}
                      </td>
                      <td>
                        {r.inspection ? (
                          <span className="badge badge-blue">Yes</span>
                        ) : (
                          <span className="badge badge-gray">No</span>
                        )}
                      </td>
                      <td className="mono">{fmt(r.permitCost)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-secondary btn-sm">
                            <Icon name="edit" size={12} />
                          </button>
                          <button className="btn btn-danger btn-sm">
                            <Icon name="trash" size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION TAB */}
      {tab === 'subscription' && (
        <div className="fade-up" style={{ maxWidth: 640 }}>
          <div className="sub-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 20,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    opacity: 0.6,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  Current Plan
                </div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>Pro Plan</div>
                <div style={{ opacity: 0.7, fontSize: 14 }}>
                  $99/month · Up to 50 quotes
                </div>
              </div>
              <span
                style={{
                  background: 'rgba(52,211,153,0.2)',
                  color: '#34D399',
                  padding: '4px 12px',
                  borderRadius: 100,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Active
              </span>
            </div>
            <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>
              Quotes used this period
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 18 }}>23 / 50</span>
              <span style={{ opacity: 0.6 }}>46%</span>
            </div>
            <div className="usage-bar">
              <div className="usage-fill" style={{ width: '46%' }} />
            </div>
            <div style={{ marginTop: 12, fontSize: 12, opacity: 0.6 }}>
              Period: Mar 1 – Mar 31, 2026 · Resets in 25 days
            </div>
          </div>

          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 16 }}>
              Plan Details
            </div>
            {[
              { label: 'Monthly Quote Limit', value: '50 quotes' },
              { label: 'Quotes Used', value: '23' },
              { label: 'Remaining', value: '27 quotes' },
              { label: 'Overage Price', value: '$2.50 per extra quote' },
              { label: 'Period Start', value: 'March 1, 2026' },
              { label: 'Period End', value: 'March 31, 2026' },
              { label: 'Next Billing', value: 'April 1, 2026 · $99.00' },
            ].map((r) => (
              <div key={r.label} className="price-row">
                <span className="muted">{r.label}</span>
                <span
                  style={{
                    fontWeight: 600,
                    fontFamily: 'DM Mono',
                    fontSize: 13,
                  }}
                >
                  {r.value}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }}>
              Manage Billing
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }}>
              <Icon name="star" /> Upgrade Plan
            </button>
          </div>
        </div>
      )}

      <div style={{ height: 48 }} />
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('wizard'); // "wizard" | "admin"

  return (
    <>
      <style>{css}</style>
      {/* View toggle */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          right: 16,
          z: 100,
          display: 'flex',
          background: T.surface,
          border: `1.5px solid ${T.border}`,
          borderRadius: 10,
          padding: 4,
          gap: 4,
          zIndex: 999,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        }}
      >
        {[
          { id: 'wizard', label: '📱 Wizard' },
          { id: 'admin', label: '🖥 Admin' },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            style={{
              padding: '6px 12px',
              borderRadius: 7,
              border: 'none',
              fontFamily: 'DM Sans',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: view === v.id ? T.text : 'transparent',
              color: view === v.id ? 'white' : T.textMuted,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'wizard' ? <Wizard /> : <AdminPanel />}
    </>
  );
}
