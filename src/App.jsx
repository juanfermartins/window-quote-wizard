import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  bg: "#F8F7F4", surface: "#FFFFFF", surfaceAlt: "#F2F1EE",
  border: "#E4E2DC", borderFocus: "#1A1A1A", text: "#1A1A1A",
  textMuted: "#6B6863", textLight: "#A09C96", accent: "#2563EB",
  accentLight: "#EFF4FF", accentHover: "#1D4ED8", success: "#16A34A",
  successLight: "#F0FDF4", warning: "#D97706", warningLight: "#FFFBEB",
  danger: "#DC2626", dangerLight: "#FEF2F2",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: ${T.bg}; color: ${T.text}; min-height: 100vh; -webkit-font-smoothing: antialiased; }
  .mono { font-family: 'DM Mono', monospace; }
  ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
  .wizard-shell { max-width: 430px; margin: 0 auto; min-height: 100vh; background: ${T.surface}; display: flex; flex-direction: column; box-shadow: 0 0 60px rgba(0,0,0,0.06); }
  .admin-shell { max-width: 1280px; margin: 0 auto; padding: 0 24px; min-height: 100vh; }
  .top-nav { padding: 16px 20px; border-bottom: 1px solid ${T.border}; display: flex; align-items: center; justify-content: space-between; background: ${T.surface}; position: sticky; top: 0; z-index: 50; }
  .logo { font-weight: 700; font-size: 15px; letter-spacing: -0.3px; display: flex; align-items: center; gap: 8px; }
  .logo-icon { width: 28px; height: 28px; background: ${T.text}; border-radius: 7px; display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; }
  .stepper { padding: 20px 20px 0; display: flex; align-items: center; gap: 0; }
  .step-item { display: flex; align-items: center; flex: 1; }
  .step-dot { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; flex-shrink: 0; transition: all 0.25s ease; }
  .step-dot.done { background: ${T.text}; color: white; }
  .step-dot.active { background: ${T.accent}; color: white; box-shadow: 0 0 0 4px ${T.accentLight}; }
  .step-dot.pending { background: ${T.surfaceAlt}; color: ${T.textLight}; border: 1.5px solid ${T.border}; }
  .step-line { flex: 1; height: 2px; background: ${T.border}; margin: 0 4px; transition: background 0.25s; }
  .step-line.done { background: ${T.text}; }
  .step-content { padding: 24px 20px; flex: 1; overflow-y: auto; }
  .step-title { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 4px; }
  .step-subtitle { font-size: 13px; color: ${T.textMuted}; margin-bottom: 24px; }
  .field { margin-bottom: 16px; }
  .label { display: block; font-size: 12px; font-weight: 600; color: ${T.textMuted}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .input { width: 100%; padding: 11px 14px; border: 1.5px solid ${T.border}; border-radius: 10px; font-family: inherit; font-size: 15px; color: ${T.text}; background: ${T.surface}; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
  .input:focus { border-color: ${T.borderFocus}; box-shadow: 0 0 0 3px rgba(0,0,0,0.06); }
  .input::placeholder { color: ${T.textLight}; }
  .input.error { border-color: ${T.danger}; }
  .select { width: 100%; padding: 11px 14px; border: 1.5px solid ${T.border}; border-radius: 10px; font-family: inherit; font-size: 15px; color: ${T.text}; background: ${T.surface}; outline: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B6863' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; cursor: pointer; transition: border-color 0.15s; }
  .select:focus { border-color: ${T.borderFocus}; outline: none; }
  .pill-group { display: flex; flex-wrap: wrap; gap: 8px; }
  .pill { padding: 7px 14px; border: 1.5px solid ${T.border}; border-radius: 100px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; user-select: none; background: ${T.surface}; color: ${T.textMuted}; }
  .pill:hover { border-color: ${T.text}; color: ${T.text}; }
  .pill.selected { background: ${T.text}; border-color: ${T.text}; color: white; }
  .card { background: ${T.surface}; border: 1.5px solid ${T.border}; border-radius: 14px; padding: 16px; margin-bottom: 12px; }
  .card-sm { background: ${T.surfaceAlt}; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 20px; border-radius: 12px; font-family: inherit; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: none; text-decoration: none; }
  .btn-primary { background: ${T.text}; color: white; }
  .btn-primary:hover { background: #333; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  .btn-secondary { background: ${T.surfaceAlt}; color: ${T.text}; border: 1.5px solid ${T.border}; }
  .btn-secondary:hover { background: ${T.border}; }
  .btn-accent { background: ${T.accent}; color: white; }
  .btn-accent:hover { background: ${T.accentHover}; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
  .btn-danger { background: ${T.dangerLight}; color: ${T.danger}; border: 1.5px solid #FCA5A5; }
  .btn-danger:hover { background: #FEE2E2; }
  .btn-success { background: ${T.successLight}; color: ${T.success}; border: 1.5px solid #86EFAC; }
  .btn-sm { padding: 7px 12px; font-size: 13px; border-radius: 8px; }
  .btn-full { width: 100%; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
  .bottom-bar { padding: 16px 20px; border-top: 1px solid ${T.border}; display: flex; gap: 12px; background: ${T.surface}; position: sticky; bottom: 0; }
  .checkbox-row { display: flex; align-items: flex-start; gap: 12px; padding: 14px; border: 1.5px solid ${T.border}; border-radius: 12px; cursor: pointer; transition: all 0.15s; margin-bottom: 10px; user-select: none; }
  .checkbox-row:hover { border-color: ${T.text}; }
  .checkbox-row.checked { border-color: ${T.text}; background: ${T.surfaceAlt}; }
  .checkbox-box { width: 20px; height: 20px; border: 2px solid ${T.border}; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; margin-top: 1px; }
  .checkbox-box.checked { background: ${T.text}; border-color: ${T.text}; }
  .checkbox-label { font-size: 14px; font-weight: 500; }
  .checkbox-desc { font-size: 12px; color: ${T.textMuted}; margin-top: 2px; }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 100px; font-size: 11px; font-weight: 600; letter-spacing: 0.2px; }
  .badge-blue { background: ${T.accentLight}; color: ${T.accent}; }
  .badge-green { background: ${T.successLight}; color: ${T.success}; }
  .badge-orange { background: ${T.warningLight}; color: ${T.warning}; }
  .badge-red { background: ${T.dangerLight}; color: ${T.danger}; }
  .badge-gray { background: ${T.surfaceAlt}; color: ${T.textMuted}; }
  .price-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; font-size: 14px; border-bottom: 1px solid ${T.border}; }
  .price-row:last-child { border-bottom: none; }
  .price-row.total { font-weight: 700; font-size: 17px; padding-top: 14px; }
  .price-row .muted { color: ${T.textMuted}; }
  .admin-header { padding: 20px 0; border-bottom: 1px solid ${T.border}; display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
  .admin-nav { display: flex; gap: 4px; padding: 4px; background: ${T.surfaceAlt}; border-radius: 12px; margin-bottom: 28px; flex-wrap: wrap; }
  .admin-nav-item { padding: 8px 16px; border-radius: 9px; font-size: 13px; font-weight: 500; cursor: pointer; color: ${T.textMuted}; transition: all 0.15s; border: none; background: none; font-family: inherit; }
  .admin-nav-item.active { background: ${T.surface}; color: ${T.text}; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  .admin-nav-item:hover:not(.active) { color: ${T.text}; }
  .table-wrap { overflow-x: auto; border: 1.5px solid ${T.border}; border-radius: 14px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: ${T.textMuted}; background: ${T.surfaceAlt}; border-bottom: 1px solid ${T.border}; }
  td { padding: 13px 16px; border-bottom: 1px solid ${T.border}; color: ${T.text}; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: ${T.surfaceAlt}; }
  .slider { width: 100%; -webkit-appearance: none; height: 4px; border-radius: 2px; background: ${T.border}; outline: none; margin: 12px 0; }
  .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: ${T.text}; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
  .dp-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .dp-option { padding: 14px 8px; border: 1.5px solid ${T.border}; border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.15s; user-select: none; }
  .dp-option:hover { border-color: ${T.text}; }
  .dp-option.selected { border-color: ${T.text}; background: ${T.text}; color: white; }
  .dp-option .dp-pct { font-size: 20px; font-weight: 700; }
  .dp-option .dp-label { font-size: 11px; opacity: 0.7; margin-top: 2px; }
  .progress-bar { height: 3px; background: ${T.border}; border-radius: 2px; margin: 16px 20px 0; }
  .progress-fill { height: 100%; background: ${T.text}; border-radius: 2px; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
  .success-icon { width: 64px; height: 64px; background: ${T.successLight}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 20px; }
  .stripe-card { background: #0A2540; border-radius: 14px; padding: 20px; color: white; margin-bottom: 16px; }
  .window-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border: 1.5px solid ${T.border}; border-radius: 12px; margin-bottom: 8px; background: ${T.surface}; }
  .divider { height: 1px; background: ${T.border}; margin: 20px 0; }
  .row { display: flex; gap: 12px; }
  .col { flex: 1; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .fade-up { animation: fadeUp 0.3s ease forwards; }
  .sig-pad { border: 2px dashed ${T.border}; border-radius: 12px; background: ${T.surfaceAlt}; height: 120px; display: flex; align-items: center; justify-content: center; color: ${T.textLight}; font-size: 13px; cursor: crosshair; position: relative; overflow: hidden; }
  .info-box { background: ${T.accentLight}; border: 1px solid #BFDBFE; border-radius: 10px; padding: 12px 14px; font-size: 13px; color: ${T.accent}; margin-bottom: 16px; display: flex; gap: 8px; align-items: flex-start; }
  .login-shell { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: ${T.bg}; padding: 20px; }
  .login-card { background: white; border-radius: 20px; padding: 40px 36px; width: 100%; max-width: 400px; box-shadow: 0 8px 40px rgba(0,0,0,0.08); border: 1.5px solid ${T.border}; }
  .login-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; }
  .login-logo-icon { width: 40px; height: 40px; background: ${T.text}; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; }
  .avatar { width: 32px; height: 32px; background: ${T.accent}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: 700; flex-shrink: 0; }
  .quote-detail-row { cursor: pointer; }
  .quote-detail-row:hover td { background: ${T.accentLight} !important; }
  .usage-bar { height: 8px; background: rgba(255,255,255,0.15); border-radius: 4px; overflow: hidden; margin-top: 8px; }
  .usage-fill { height: 100%; background: linear-gradient(90deg, #60A5FA, #34D399); border-radius: 4px; transition: width 0.6s ease; }
  .plan-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .plan-card { border: 2px solid ${T.border}; border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.2s; position: relative; }
  .plan-card:hover { border-color: ${T.accent}; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,0.12); }
  .plan-card.current { border-color: ${T.accent}; background: ${T.accentLight}; }
  .plan-card.popular::before { content: 'POPULAR'; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: ${T.accent}; color: white; font-size: 10px; font-weight: 700; padding: 2px 10px; border-radius: 100px; letter-spacing: 0.5px; }
  .plan-name { font-size: 18px; font-weight: 800; margin-bottom: 4px; }
  .plan-price { font-size: 28px; font-weight: 800; font-family: 'DM Mono'; color: ${T.accent}; }
  .plan-price span { font-size: 14px; font-weight: 400; color: ${T.textMuted}; font-family: 'DM Sans'; }
  .quota-bar { height: 6px; background: ${T.border}; border-radius: 3px; overflow: hidden; margin: 8px 0; }
  .quota-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
  .quota-fill.ok { background: linear-gradient(90deg, #34D399, #60A5FA); }
  .quota-fill.warning { background: linear-gradient(90deg, #FBBF24, #F59E0B); }
  .quota-fill.danger { background: linear-gradient(90deg, #F87171, #EF4444); }
  .no-quota-modal { text-align: center; padding: 12px 0; }
  .no-quota-icon { font-size: 48px; margin-bottom: 16px; }
  .sub-stat { background: ${T.surfaceAlt}; border-radius: 12px; padding: 16px; text-align: center; }
  .sub-stat-value { font-size: 28px; font-weight: 800; font-family: 'DM Mono'; color: ${T.text}; }
  .sub-stat-label { font-size: 12px; color: ${T.textMuted}; margin-top: 4px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
  .modal { background: white; border-radius: 16px; padding: 24px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
  .loading { display: flex; align-items: center; justify-content: center; padding: 40px; color: ${T.textMuted}; font-size: 14px; gap: 10px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width: 18px; height: 18px; border: 2px solid ${T.border}; border-top-color: ${T.text}; border-radius: 50%; animation: spin 0.7s linear infinite; }
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: ${T.text}; color: white; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: 500; z-index: 9999; animation: fadeUp 0.3s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
  .toast.success { background: ${T.success}; }
  .toast.error { background: ${T.danger}; }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);

const SIZE_MULT = (w, h) => {
  const area = (w * h) / 144;
  if (area < 6) return 0.9;
  if (area < 10) return 1.0;
  if (area < 15) return 1.12;
  return 1.25;
};

const TAX_RATE = 0.07;

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ message, type = "default", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return <div className={`toast ${type}`}>{message}</div>;
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    check: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M10.5 3.5l2 2L5 13H3v-2L10.5 3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 5h10M6 5V3h4v2M6 8v4M10 8v4M4 5l1 8h6l1-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    window: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1.2"/><line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.2"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    download: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 3v7M5 8l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    arrow_right: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 2l5 2v4c0 3-2.5 5.5-5 6-2.5-.5-5-3-5-6V4l5-2z" stroke="currentColor" strokeWidth="1.3"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
    map: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M5.5 2L2 4v10l3.5-2 5 2L14 12V2L10.5 4l-5-2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M5.5 2v10M10.5 4v10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.8 5.5H15l-4.6 3.3 1.7 5.2L8 12l-4.1 3 1.7-5.2L1 6.5h5.2z"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4"/></svg>,
    save: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 3h8l2 2v8H3V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M6 3v3h5V3M5 13v-4h6v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  };
  return icons[name] || null;
};

const StatusBadge = ({ status }) => {
  const map = { draft: "badge-gray", finalized: "badge-blue", signed: "badge-orange", paid: "badge-green" };
  return <span className={`badge ${map[status] || "badge-gray"}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
      <div className="spinner" style={{ width: 32, height: 32 }} />
      <div style={{ fontSize: 14, color: T.textMuted }}>Loading your data...</div>
    </div>
  );
}

// ─── AUTH HOOK ────────────────────────────────────────────────────────────────
function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("wizard");

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); setProfile(null);
  };

  return { user, profile, loading, signIn, signOut, isAdmin: profile?.role === 'admin', view, setView };
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please enter email and password.'); return; }
    setLoading(true); setError('');
    const err = await onLogin(email, password);
    if (err) setError('Invalid email or password. Please try again.');
    setLoading(false);
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon"><Icon name="window" size={20} /></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>WindowQuote</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>Professional quoting platform</div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 22, letterSpacing: -0.5, marginBottom: 4 }}>Welcome back</div>
          <div style={{ fontSize: 13, color: T.textMuted }}>Sign in to access your account</div>
        </div>

        {error && (
          <div style={{ background: T.dangerLight, border: `1px solid #FCA5A5`, borderRadius: 10, padding: '10px 14px', fontSize: 13, color: T.danger, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div className="field">
          <label className="label">Email</label>
          <input className="input" type="email" placeholder="you@company.com" value={email}
            onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        <div className="field">
          <label className="label">Password</label>
          <input className="input" type="password" placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        <button className="btn btn-primary btn-full" style={{ marginTop: 8 }} disabled={loading} onClick={handleSubmit}>
          {loading ? 'Signing in...' : 'Sign In'} {!loading && <Icon name="arrow_right" />}
        </button>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: T.textLight }}>
          Need access? Contact your administrator.
        </div>
      </div>
    </div>
  );
}

// ─── QUOTE DETAIL MODAL ───────────────────────────────────────────────────────
function QuoteDetailModal({ quote, onClose, onStatusChange }) {
  if (!quote) return null;
  const windows = quote.windows || [];
  const services = quote.services || [];
  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n || 0);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 560 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{quote.customer_name}</div>
            <div style={{ fontSize: 13, color: T.textMuted }}>{quote.customer_email} · {quote.customer_phone}</div>
            <div style={{ fontSize: 13, color: T.textMuted, marginTop: 2 }}>{quote.address}, {quote.zip}</div>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, padding: 4 }} onClick={onClose}>
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <StatusBadge status={quote.status} />
          <span className="badge badge-gray">{new Date(quote.created_at).toLocaleDateString()}</span>
          {quote.created_by_name && <span className="badge badge-blue">👤 {quote.created_by_name}</span>}
        </div>

        {/* Windows */}
        {windows.length > 0 && (
          <div className="card-sm" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px', color: T.textMuted, marginBottom: 10 }}>
              Windows ({windows.length} types)
            </div>
            {windows.map((w, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: i < windows.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                <div>
                  <span style={{ fontWeight: 600 }}>{w.qty}× {w.type}</span>
                  <span style={{ color: T.textMuted }}> · {w.material} · {w.color} · {w.glass}</span>
                </div>
                <span style={{ fontFamily: 'DM Mono', fontWeight: 600 }}>{w.width}"×{w.height}"</span>
              </div>
            ))}
          </div>
        )}

        {/* Services */}
        {services.length > 0 && (
          <div className="card-sm" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px', color: T.textMuted, marginBottom: 10 }}>Services</div>
            {services.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
                <span>{s.label}</span>
                <span style={{ fontFamily: 'DM Mono' }}>{fmt(s.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="card-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 700 }}>Total</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>Down payment: {quote.down_pct}%</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, fontSize: 22, fontFamily: 'DM Mono' }}>{fmt(quote.total)}</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>Down: {fmt(Math.round((quote.total || 0) * (quote.down_pct || 20) / 100))}</div>
          </div>
        </div>

        {/* Status change */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: T.textMuted, whiteSpace: 'nowrap' }}>Change status:</span>
          <select className="select" style={{ fontSize: 13 }} value={quote.status}
            onChange={e => onStatusChange(quote.id, e.target.value)}>
            {['draft','finalized','signed','paid'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

// ─── SUPABASE HOOKS ───────────────────────────────────────────────────────────
function useAppData() {
  const [products, setProducts] = useState([]);
  const [multipliers, setMultipliers] = useState([]);
  const [services, setServices] = useState([]);
  const [cityRules, setCityRules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    const [p, m, s, c] = await Promise.all([
      supabase.from('products').select('*').eq('active', true).order('name'),
      supabase.from('multipliers').select('*').eq('active', true).order('category'),
      supabase.from('services').select('*').eq('active', true),
      supabase.from('city_rules').select('*').order('city'),
    ]);
    if (p.data) setProducts(p.data);
    if (m.data) setMultipliers(m.data);
    if (s.data) setServices(s.data);
    if (c.data) setCityRules(c.data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // Helper maps
  const materialMult = Object.fromEntries(multipliers.filter(m => m.category === 'material').map(m => [m.name, parseFloat(m.value)]));
  const colorMult = Object.fromEntries(multipliers.filter(m => m.category === 'color').map(m => [m.name, parseFloat(m.value)]));
  const glassMult = Object.fromEntries(multipliers.filter(m => m.category === 'glass').map(m => [m.name, parseFloat(m.value)]));
  const cityRulesMap = Object.fromEntries(cityRules.map(r => [r.zip, r]));

  const calcWindowPrice = (w) => {
    const prod = products.find(p => p.name === w.type);
    const base = prod ? prod.base_price : 300;
    const mat = materialMult[w.material] || 1;
    const col = colorMult[w.color] || 1;
    const gl = glassMult[w.glass] || 1;
    const sz = SIZE_MULT(w.width || 36, w.height || 48);
    return Math.round(base * mat * col * gl * sz * (w.qty || 1));
  };

  return { products, multipliers, services, cityRules, cityRulesMap, loading, refetch: fetchAll, calcWindowPrice, materialMult, colorMult, glassMult };
}

// ─── SUBSCRIPTION HOOK ───────────────────────────────────────────────────────
// For demo we use the first active subscription. In production each user has their own.
function useSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [plan, setPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const [subRes, plansRes] = await Promise.all([
      supabase.from('subscriptions').select('*, plans(*)').eq('status', 'active').limit(1).single(),
      supabase.from('plans').select('*').eq('active', true).order('price_monthly'),
    ]);
    if (subRes.data) { setSubscription(subRes.data); setPlan(subRes.data.plans); }
    if (plansRes.data) setPlans(plansRes.data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const consumeQuote = async () => {
    if (!subscription) return { allowed: false, reason: 'No active subscription' };
    const limit = plan?.quote_limit ?? 0;
    const used = subscription.quotes_used ?? 0;
    // -1 = unlimited (Enterprise)
    if (limit !== -1 && used >= limit) {
      return { allowed: false, reason: 'quota_exceeded', used, limit, overage: plan?.overage_price };
    }
    const { error } = await supabase
      .from('subscriptions')
      .update({ quotes_used: used + 1 })
      .eq('id', subscription.id);
    if (error) return { allowed: false, reason: 'error' };
    setSubscription(s => ({ ...s, quotes_used: used + 1 }));
    return { allowed: true, remaining: limit === -1 ? '∞' : limit - used - 1 };
  };

  const changePlan = async (planId) => {
    await supabase.from('subscriptions').update({ plan_id: planId }).eq('id', subscription.id);
    await fetch();
  };

  const pctUsed = () => {
    if (!plan || plan.quote_limit === -1) return 0;
    return Math.min(100, Math.round((subscription?.quotes_used / plan.quote_limit) * 100));
  };

  const quotaColor = () => {
    const p = pctUsed();
    if (p >= 90) return 'danger';
    if (p >= 70) return 'warning';
    return 'ok';
  };

  return { subscription, plan, plans, loading, consumeQuote, changePlan, refetch: fetch, pctUsed, quotaColor };
}

// ─── NO QUOTA MODAL ───────────────────────────────────────────────────────────
function NoQuotaModal({ plan, plans, onUpgrade, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="no-quota-modal">
          <div className="no-quota-icon">🚫</div>
          <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Quote Limit Reached</h2>
          <p style={{ fontSize: 14, color: T.textMuted, marginBottom: 20 }}>
            You've used all <strong>{plan?.quote_limit}</strong> quotes in your <strong>{plan?.name}</strong> plan this period.
          </p>
          {plan?.overage_price > 0 && (
            <div className="info-box" style={{ textAlign: 'left', marginBottom: 20 }}>
              <Icon name="info" size={15} />
              <span>You can continue at <strong>${plan.overage_price}/quote</strong> overage rate, or upgrade your plan.</span>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {plans.filter(p => p.id !== plan?.id && (p.quote_limit === -1 || p.quote_limit > (plan?.quote_limit || 0))).map(p => (
              <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0, cursor: 'pointer' }}
                onClick={() => onUpgrade(p.id)}>
                <div>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>{p.quote_limit === -1 ? 'Unlimited' : p.quote_limit} quotes/mo</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontFamily: 'DM Mono', color: T.accent }}>${p.price_monthly}<span style={{ fontSize: 11, fontWeight: 400, color: T.textMuted }}>/mo</span></div>
                  <span className="badge badge-blue" style={{ marginTop: 4 }}>Upgrade →</span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary btn-full" onClick={onClose}>Maybe Later</button>
        </div>
      </div>
    </div>
  );
}

// ─── SUBSCRIPTION PANEL (for both wizard top bar and admin) ───────────────────
function SubscriptionBadge({ subscription, plan, pctUsed, quotaColor }) {
  if (!subscription || !plan) return null;
  const remaining = plan.quote_limit === -1 ? '∞' : plan.quote_limit - subscription.quotes_used;
  const isLow = pctUsed() >= 80;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: isLow ? T.dangerLight : T.surfaceAlt, borderRadius: 10, border: `1px solid ${isLow ? '#FCA5A5' : T.border}` }}>
      <div style={{ fontSize: 12 }}>
        <span style={{ fontWeight: 700, color: isLow ? T.danger : T.text }}>{remaining}</span>
        <span style={{ color: T.textMuted }}> quotes left</span>
      </div>
      <div style={{ width: 48, height: 4, background: T.border, borderRadius: 2, overflow: 'hidden' }}>
        <div className={`quota-fill ${quotaColor()}`} style={{ width: `${pctUsed()}%`, height: '100%' }} />
      </div>
    </div>
  );
}

// ─── STEP 1 ───────────────────────────────────────────────────────────────────
function Step1({ data, onChange, errors }) {
  const fields = [
    { key: "name", label: "Full Name", placeholder: "Jane Smith", type: "text" },
    { key: "email", label: "Email Address", placeholder: "jane@email.com", type: "email" },
    { key: "phone", label: "Phone Number", placeholder: "(305) 555-0123", type: "tel" },
    { key: "address", label: "Property Address", placeholder: "123 Main Street", type: "text" },
    { key: "zip", label: "ZIP Code", placeholder: "33101", type: "text" },
  ];
  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Your Information</h2>
      <p className="step-subtitle">We'll use this to generate your personalized quote.</p>
      {fields.map(f => (
        <div className="field" key={f.key}>
          <label className="label">{f.label}</label>
          <input className={`input ${errors[f.key] ? 'error' : ''}`} type={f.type} placeholder={f.placeholder}
            value={data[f.key] || ""} onChange={e => onChange(f.key, e.target.value)} />
          {errors[f.key] && <div style={{ fontSize: 11, color: T.danger, marginTop: 4 }}>{errors[f.key]}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── STEP 2 ───────────────────────────────────────────────────────────────────
function Step2({ windows, setWindows, products, materialMult, colorMult, glassMult, calcWindowPrice }) {
  const materials = Object.keys(materialMult);
  const colors = Object.keys(colorMult);
  const glasses = Object.keys(glassMult);
  const empty = { type: products[0]?.name || '', material: materials[0] || 'Vinyl', color: colors[0] || 'White', glass: glasses[0] || 'Standard', width: 36, height: 48, qty: 1 };
  const [form, setForm] = useState(empty);
  const [editIdx, setEditIdx] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (products.length > 0 && !form.type) setForm(f => ({ ...f, type: products[0].name }));
  }, [products]);

  const handleAdd = () => {
    if (editIdx !== null) {
      const updated = [...windows]; updated[editIdx] = form; setWindows(updated); setEditIdx(null);
    } else {
      setWindows([...windows, { ...form, id: Date.now() }]);
    }
    setForm(empty); setShowForm(false);
  };

  const handleEdit = (i) => { setForm(windows[i]); setEditIdx(i); setShowForm(true); };
  const handleDelete = (i) => setWindows(windows.filter((_, idx) => idx !== i));

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Windows</h2>
      <p className="step-subtitle">Configure each window for accurate pricing.</p>
      {windows.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {windows.map((w, i) => (
            <div className="window-item" key={w.id || i}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{w.qty}× {w.type}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{w.material} · {w.color} · {w.glass}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{w.width}"W × {w.height}"H</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <div style={{ fontWeight: 700, fontFamily: 'DM Mono', fontSize: 14 }}>{fmt(calcWindowPrice(w))}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(i)}><Icon name="edit" size={13} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(i)}><Icon name="trash" size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!showForm ? (
        <button className="btn btn-secondary btn-full" onClick={() => setShowForm(true)}><Icon name="plus" /> Add Window</button>
      ) : (
        <div className="card fade-up">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{editIdx !== null ? "Edit Window" : "New Window"}</div>
          <div className="field">
            <label className="label">Window Type</label>
            <div className="pill-group">
              {products.map(p => (
                <div key={p.id} className={`pill ${form.type === p.name ? 'selected' : ''}`} onClick={() => setForm({ ...form, type: p.name })}>{p.name}</div>
              ))}
            </div>
          </div>
          <div className="row">
            <div className="col field">
              <label className="label">Material</label>
              <select className="select" value={form.material} onChange={e => setForm({ ...form, material: e.target.value })}>
                {materials.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="col field">
              <label className="label">Color</label>
              <select className="select" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}>
                {colors.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label className="label">Glass Type</label>
            <select className="select" value={form.glass} onChange={e => setForm({ ...form, glass: e.target.value })}>
              {glasses.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="row">
            <div className="col field">
              <label className="label">Width (in.)</label>
              <input className="input" type="number" value={form.width} min={12} max={120} onChange={e => setForm({ ...form, width: Number(e.target.value) })} />
            </div>
            <div className="col field">
              <label className="label">Height (in.)</label>
              <input className="input" type="number" value={form.height} min={12} max={120} onChange={e => setForm({ ...form, height: Number(e.target.value) })} />
            </div>
            <div className="col field">
              <label className="label">Qty</label>
              <input className="input" type="number" value={form.qty} min={1} max={50} onChange={e => setForm({ ...form, qty: Number(e.target.value) })} />
            </div>
          </div>
          <div style={{ background: T.surfaceAlt, borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: T.textMuted }}>Estimated price</span>
            <span style={{ fontWeight: 700, fontFamily: 'DM Mono' }}>{fmt(calcWindowPrice(form))}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setShowForm(false); setEditIdx(null); setForm(empty); }}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleAdd}>{editIdx !== null ? "Save Changes" : "Add Window"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STEP 3 ───────────────────────────────────────────────────────────────────
function Step3({ selectedServices, setSelectedServices, zip, dbServices, cityRulesMap }) {
  const rules = cityRulesMap[zip] || null;
  const toggle = (id) => setSelectedServices(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const icons = { Installation: "🔧", Permit: "📋", "General Contractor": "👷", Disposal: "♻️" };

  useEffect(() => {
    if (rules?.permit_required) {
      const permitSvc = dbServices.find(s => s.name === 'Permit');
      if (permitSvc && !selectedServices.includes(permitSvc.id)) {
        setSelectedServices(s => [...s, permitSvc.id]);
      }
    }
  }, [zip, rules]);

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Services</h2>
      <p className="step-subtitle">Add any additional services to your project.</p>
      {rules && (
        <div className="card" style={{ background: T.surfaceAlt, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Icon name="map" size={15} />
            <span style={{ fontWeight: 700, fontSize: 13 }}>Rules for {rules.city}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {rules.permit_required && <span className="badge badge-red">⚠ Permit Required</span>}
            {rules.hurricane_zone && <span className="badge badge-orange">🌀 Hurricane Zone</span>}
            {rules.inspection_required && <span className="badge badge-blue">🔍 Inspection Needed</span>}
            {!rules.permit_required && !rules.hurricane_zone && !rules.inspection_required &&
              <span className="badge badge-green">✓ Standard zone</span>}
          </div>
          {rules.permit_cost > 0 && <div style={{ fontSize: 12, color: T.textMuted, marginTop: 8 }}>Permit fee: ${rules.permit_cost}</div>}
        </div>
      )}
      {!rules && zip && zip.length === 5 && (
        <div className="info-box"><Icon name="info" size={15} /><span>ZIP code {zip} not found in city rules. No special requirements applied.</span></div>
      )}
      {dbServices.map(s => {
        const isChecked = selectedServices.includes(s.id);
        const isPermit = s.name === 'Permit';
        const isRequired = isPermit && rules?.permit_required;
        const priceLabel = s.pricing_model === 'per_window' ? `$${s.price}/window` : s.pricing_model === 'flat' && s.price > 0 ? `$${s.price} flat` : isPermit && rules?.permit_cost > 0 ? `$${rules.permit_cost} flat` : 'Included';
        return (
          <div key={s.id} className={`checkbox-row ${isChecked ? 'checked' : ''}`} onClick={() => !isRequired && toggle(s.id)}>
            <div className={`checkbox-box ${isChecked ? 'checked' : ''}`}>{isChecked && <Icon name="check" size={12} />}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="checkbox-label">{icons[s.name] || '🔹'} {s.name}</span>
                {isRequired && <span className="badge badge-red" style={{ fontSize: 10 }}>Required</span>}
              </div>
              <div className="checkbox-desc">{priceLabel} · {s.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── STEP 4 ───────────────────────────────────────────────────────────────────
function Step4({ windows, selectedServices, dbServices, zip, cityRulesMap, downPct, setDownPct, calcWindowPrice }) {
  const rules = cityRulesMap[zip] || null;
  const windowTotal = windows.reduce((sum, w) => sum + calcWindowPrice(w), 0);
  const windowCount = windows.reduce((sum, w) => sum + (w.qty || 1), 0);

  const serviceLines = dbServices.filter(s => selectedServices.includes(s.id)).map(s => {
    let price = s.price;
    if (s.pricing_model === 'per_window') price = s.price * windowCount;
    if (s.name === 'Permit' && rules?.permit_cost > 0) price = rules.permit_cost;
    return { label: s.name, amount: price };
  });

  const servicesTotal = serviceLines.reduce((sum, l) => sum + l.amount, 0);
  const subtotal = windowTotal + servicesTotal;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;
  const downAmt = Math.round(total * (downPct / 100));

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Price Summary</h2>
      <p className="step-subtitle">Review your quote breakdown.</p>
      <div className="card">
        <div className="price-row"><span className="muted">Windows ({windowCount} units)</span><span className="mono">{fmt(windowTotal)}</span></div>
        {serviceLines.map((l, i) => (
          <div key={i} className="price-row"><span className="muted">{l.label}</span><span className="mono">{fmt(l.amount)}</span></div>
        ))}
        <div className="price-row"><span className="muted">Sales Tax ({(TAX_RATE * 100).toFixed(0)}%)</span><span className="mono">{fmt(tax)}</span></div>
        <div className="price-row total"><span>Total</span><span className="mono">{fmt(total)}</span></div>
      </div>
      <div className="divider" />
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Down Payment</div>
      <div className="dp-options">
        {[10, 20, 30].map(pct => (
          <div key={pct} className={`dp-option ${downPct === pct ? 'selected' : ''}`} onClick={() => setDownPct(pct)}>
            <div className="dp-pct">{pct}%</div>
            <div className="dp-label">{fmt(Math.round(total * pct / 100))}</div>
          </div>
        ))}
      </div>
      <div className="info-box" style={{ marginTop: 16 }}>
        <Icon name="info" size={15} />
        <span>Balance of <strong>{fmt(total - downAmt)}</strong> due upon completion.</span>
      </div>
    </div>
  );
}

// ─── STEP 5 ───────────────────────────────────────────────────────────────────
function Step5({ customer, windows, selectedServices, dbServices, zip, cityRulesMap, downPct, calcWindowPrice, onConfirm, currentUser }) {
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const rules = cityRulesMap[zip] || null;
  const windowCount = windows.reduce((sum, w) => sum + (w.qty || 1), 0);
  const windowTotal = windows.reduce((sum, w) => sum + calcWindowPrice(w), 0);
  const serviceLines = dbServices.filter(s => selectedServices.includes(s.id)).map(s => {
    let price = s.price;
    if (s.pricing_model === 'per_window') price = s.price * windowCount;
    if (s.name === 'Permit' && rules?.permit_cost > 0) price = rules.permit_cost;
    return { label: s.name, amount: price };
  });
  const subtotal = windowTotal + serviceLines.reduce((sum, l) => sum + l.amount, 0);
  const total = Math.round(subtotal * (1 + TAX_RATE));

  const handleConfirm = async () => {
    setSaving(true);
    const { error } = await supabase.from('quotes').insert({
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      address: customer.address,
      zip: customer.zip,
      windows: windows,
      services: serviceLines,
      down_pct: downPct,
      total: total,
      status: 'finalized',
      created_by: currentUser?.id || null,
      created_by_name: currentUser?.profile?.full_name || currentUser?.email || 'Unknown',
    });
    setSaving(false);
    if (!error) onConfirm(total);
  };

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Review & Confirm</h2>
      <p className="step-subtitle">Verify everything looks correct before generating your contract.</p>
      <div className="card-sm">
        <div style={{ fontWeight: 600, fontSize: 12, color: T.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</div>
        <div style={{ fontWeight: 600 }}>{customer.name}</div>
        <div style={{ fontSize: 13, color: T.textMuted }}>{customer.email} · {customer.phone}</div>
        <div style={{ fontSize: 13, color: T.textMuted }}>{customer.address}, {customer.zip}</div>
      </div>
      <div className="card-sm">
        <div style={{ fontWeight: 600, fontSize: 12, color: T.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Windows ({windows.length} types)</div>
        {windows.map((w, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
            <span>{w.qty}× {w.type} · {w.material} · {w.glass}</span>
            <span style={{ fontFamily: 'DM Mono', fontWeight: 500 }}>{fmt(calcWindowPrice(w))}</span>
          </div>
        ))}
      </div>
      <div className="card-sm">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600 }}>Total</span>
          <span style={{ fontWeight: 700, fontFamily: 'DM Mono', fontSize: 16 }}>{fmt(total)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 13, color: T.textMuted }}>
          <span>Down payment ({downPct}%)</span>
          <span style={{ fontFamily: 'DM Mono' }}>{fmt(Math.round(total * downPct / 100))}</span>
        </div>
      </div>
      <div className={`checkbox-row ${agreed ? 'checked' : ''}`} onClick={() => setAgreed(!agreed)} style={{ marginTop: 16 }}>
        <div className={`checkbox-box ${agreed ? 'checked' : ''}`}>{agreed && <Icon name="check" size={12} />}</div>
        <div>
          <div className="checkbox-label">I agree to the Terms & Conditions</div>
          <div className="checkbox-desc">By checking this, you accept the service agreement, warranty terms, and payment schedule.</div>
        </div>
      </div>
      <button className="btn btn-primary btn-full" style={{ marginTop: 16 }} disabled={!agreed || saving} onClick={handleConfirm}>
        {saving ? "Saving..." : <><Icon name="arrow_right" /> Generate Contract</>}
      </button>
    </div>
  );
}

// ─── POST-WIZARD SCREENS ──────────────────────────────────────────────────────
function ContractReady({ customer, total, downPct, onSign }) {
  const downAmt = Math.round(total * downPct / 100);
  return (
    <div className="step-content fade-up" style={{ textAlign: 'center', paddingTop: 40 }}>
      <div className="success-icon">📄</div>
      <h2 className="step-title" style={{ textAlign: 'center' }}>Contract Ready</h2>
      <p className="step-subtitle" style={{ textAlign: 'center' }}>Your contract has been generated and is ready for signature.</p>
      <div className="card" style={{ textAlign: 'left', background: '#FAFAFA', fontFamily: 'DM Mono', fontSize: 11, lineHeight: 1.7, color: T.textMuted }}>
        <div style={{ borderBottom: `1px solid ${T.border}`, paddingBottom: 10, marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.text, fontFamily: 'DM Sans' }}>WINDOW INSTALLATION CONTRACT</div>
          <div>{new Date().toLocaleDateString()}</div>
        </div>
        <div>Customer: {customer.name}</div>
        <div>Address: {customer.address}, {customer.zip}</div>
        <div style={{ marginTop: 8 }}>TOTAL CONTRACT VALUE: {fmt(total)}</div>
        <div>DOWN PAYMENT DUE: {fmt(downAmt)} ({downPct}%)</div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }}><Icon name="download" /> PDF</button>
        <button className="btn btn-primary" style={{ flex: 2 }} onClick={onSign}><Icon name="lock" /> Sign Contract</button>
      </div>
    </div>
  );
}

function SignContract({ customer, onPay }) {
  const canvasRef = useRef(null);
  const [signed, setSigned] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const handleMouseDown = () => setDrawing(true);
  const handleMouseUp = () => { setDrawing(false); setSigned(true); };
  const handleMouseMove = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = T.text;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke(); ctx.beginPath(); ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };
  const clear = () => { canvasRef.current.getContext('2d').clearRect(0, 0, 400, 120); setSigned(false); };
  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Sign Contract</h2>
      <p className="step-subtitle">Draw your signature below to legally sign the agreement.</p>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Signature</div>
      <div style={{ position: 'relative', border: `1.5px solid ${T.border}`, borderRadius: 12, overflow: 'hidden', background: T.surfaceAlt }}>
        <canvas ref={canvasRef} width={350} height={120} style={{ display: 'block', cursor: 'crosshair' }}
          onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} />
        {!signed && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textLight, fontSize: 13, pointerEvents: 'none' }}>Draw your signature here</div>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: T.textMuted }}>{customer.name} · {new Date().toLocaleDateString()}</span>
        <button style={{ background: 'none', border: 'none', fontSize: 12, color: T.accent, cursor: 'pointer' }} onClick={clear}>Clear</button>
      </div>
      <button className="btn btn-primary btn-full" disabled={!signed} onClick={onPay}>Confirm Signature → Pay Deposit</button>
    </div>
  );
}

function PayDeposit({ downAmt }) {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const handlePay = () => { setPaying(true); setTimeout(() => { setPaying(false); setPaid(true); }, 2500); };
  if (paid) return (
    <div className="step-content fade-up" style={{ textAlign: 'center', paddingTop: 60 }}>
      <div className="success-icon">✅</div>
      <h2 className="step-title" style={{ textAlign: 'center' }}>Payment Received!</h2>
      <p className="step-subtitle" style={{ textAlign: 'center' }}>Your deposit of <strong>{fmt(downAmt)}</strong> has been processed.</p>
    </div>
  );
  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Pay Deposit</h2>
      <p className="step-subtitle">Secure your project with a deposit payment.</p>
      <div className="stripe-card">
        <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' }}>Powered by Stripe</div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>Card number</div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 14px', fontSize: 15, letterSpacing: 2 }}>4242 4242 4242 4242</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>Expiry</div><div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 14px' }}>12/27</div></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>CVC</div><div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 14px' }}>•••</div></div>
        </div>
      </div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><div style={{ fontWeight: 600 }}>Deposit Amount</div><div style={{ fontSize: 12, color: T.textMuted }}>Charged now</div></div>
        <div style={{ fontWeight: 800, fontSize: 22, fontFamily: 'DM Mono' }}>{fmt(downAmt)}</div>
      </div>
      <button className="btn btn-accent btn-full" onClick={handlePay} disabled={paying}>{paying ? "Processing..." : `Pay ${fmt(downAmt)} Now`}</button>
    </div>
  );
}

// ─── WIZARD ───────────────────────────────────────────────────────────────────
function Wizard({ appData, subData, auth }) {
  const { user, profile, signOut, isAdmin } = auth;
  const { products, multipliers, services: dbServices, cityRulesMap, loading, calcWindowPrice, materialMult, colorMult, glassMult } = appData;
  const { subscription, plan, plans, consumeQuote, changePlan, pctUsed, quotaColor } = subData;
  const [step, setStep] = useState(1);
  const [postStep, setPostStep] = useState(null);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", address: "", zip: "" });
  const [windows, setWindows] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [downPct, setDownPct] = useState(20);
  const [errors, setErrors] = useState({});
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const [showNoQuota, setShowNoQuota] = useState(false);
  const [consuming, setConsuming] = useState(false);

  const validate1 = () => {
    const e = {};
    if (!customer.name.trim()) e.name = "Name is required";
    if (!customer.email.match(/\S+@\S+\.\S+/)) e.email = "Valid email required";
    if (!customer.phone.trim()) e.phone = "Phone is required";
    if (!customer.address.trim()) e.address = "Address is required";
    if (!customer.zip.trim()) e.zip = "ZIP code is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (step === 1 && !validate1()) return;
    if (step === 2) {
      if (windows.length === 0) { alert("Add at least one window."); return; }
      // ── CONSUME QUOTE HERE ──
      setConsuming(true);
      const result = await consumeQuote();
      setConsuming(false);
      if (!result.allowed) {
        setShowNoQuota(true);
        return;
      }
    }
    setStep(s => s + 1);
  };

  if (loading) return <LoadingScreen />;

  if (postStep === "pay") return (
    <div className="wizard-shell">
      <div className="top-nav"><div className="logo"><div className="logo-icon"><Icon name="window" size={14} /></div> WindowQuote</div></div>
      <PayDeposit downAmt={Math.round(confirmedTotal * downPct / 100)} />
    </div>
  );
  if (postStep === "sign") return (
    <div className="wizard-shell">
      <div className="top-nav"><div className="logo"><div className="logo-icon"><Icon name="window" size={14} /></div> WindowQuote</div></div>
      <SignContract customer={customer} onPay={() => setPostStep("pay")} />
    </div>
  );
  if (postStep === "contract") return (
    <div className="wizard-shell">
      <div className="top-nav"><div className="logo"><div className="logo-icon"><Icon name="window" size={14} /></div> WindowQuote</div></div>
      <ContractReady customer={customer} total={confirmedTotal} downPct={downPct} onSign={() => setPostStep("sign")} />
    </div>
  );

  return (
    <div className="wizard-shell">
      {showNoQuota && (
        <NoQuotaModal
          plan={plan} plans={plans}
          onUpgrade={async (planId) => { await changePlan(planId); setShowNoQuota(false); }}
          onClose={() => setShowNoQuota(false)}
        />
      )}
      <div className="top-nav">
        <div className="logo"><div className="logo-icon"><Icon name="window" size={14} /></div> WindowQuote</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SubscriptionBadge subscription={subscription} plan={plan} pctUsed={pctUsed} quotaColor={quotaColor} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="avatar">{(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}</div>
            <button style={{ background: 'none', border: 'none', fontSize: 12, color: T.textMuted, cursor: 'pointer' }} onClick={signOut}>Sign out</button>
          </div>
        </div>
      </div>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }} /></div>
      <div className="stepper">
        {[1,2,3,4,5].map((s, i) => (
          <div key={s} className="step-item">
            <div className={`step-dot ${s < step ? 'done' : s === step ? 'active' : 'pending'}`}>{s < step ? <Icon name="check" size={11} /> : s}</div>
            {i < 4 && <div className={`step-line ${s < step ? 'done' : ''}`} />}
          </div>
        ))}
      </div>
      {step === 1 && <Step1 data={customer} onChange={(k, v) => { setCustomer(c => ({ ...c, [k]: v })); setErrors(e => ({ ...e, [k]: null })); }} errors={errors} />}
      {step === 2 && <Step2 windows={windows} setWindows={setWindows} products={products} materialMult={materialMult} colorMult={colorMult} glassMult={glassMult} calcWindowPrice={calcWindowPrice} />}
      {step === 3 && <Step3 selectedServices={selectedServices} setSelectedServices={setSelectedServices} zip={customer.zip} dbServices={dbServices} cityRulesMap={cityRulesMap} />}
      {step === 4 && <Step4 windows={windows} selectedServices={selectedServices} dbServices={dbServices} zip={customer.zip} cityRulesMap={cityRulesMap} downPct={downPct} setDownPct={setDownPct} calcWindowPrice={calcWindowPrice} />}
      {step === 5 && <Step5 customer={customer} windows={windows} selectedServices={selectedServices} dbServices={dbServices} zip={customer.zip} cityRulesMap={cityRulesMap} downPct={downPct} calcWindowPrice={calcWindowPrice}
        currentUser={{ id: user?.id, email: user?.email, profile }}
        onConfirm={(total) => { setConfirmedTotal(total); setPostStep("contract"); }} />}
      {step < 5 && (
        <div className="bottom-bar">
          {step > 1 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>Back</button>}
          <button className="btn btn-primary" style={{ flex: 1 }} disabled={consuming} onClick={handleNext}>
            {consuming ? "Checking quota..." : step === 4 ? "Review Quote" : "Continue"} {!consuming && <Icon name="arrow_right" />}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ appData, subData, auth }) {
  const { products, multipliers, services, cityRules, loading, refetch, calcWindowPrice } = appData;
  const [tab, setTab] = useState("quotes");
  const [quotes, setQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // { type, data }
  const [saving, setSaving] = useState(false);

  const showToast = (message, type = "default") => setToast({ message, type });

  useEffect(() => {
    if (tab === "quotes") fetchQuotes();
  }, [tab]);

  const [selectedQuote, setSelectedQuote] = useState(null);

  const fetchQuotes = async () => {
    setQuotesLoading(true);
    const { data } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
    if (data) setQuotes(data);
    setQuotesLoading(false);
  };

  // ── PRODUCTS CRUD ──
  const saveProduct = async (form) => {
    setSaving(true);
    if (form.id) {
      await supabase.from('products').update({ name: form.name, base_price: parseInt(form.base_price) }).eq('id', form.id);
    } else {
      await supabase.from('products').insert({ name: form.name, base_price: parseInt(form.base_price) });
    }
    await refetch(); setSaving(false); setModal(null);
    showToast("Product saved ✓", "success");
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from('products').update({ active: false }).eq('id', id);
    await refetch(); showToast("Product deleted", "default");
  };

  // ── MULTIPLIERS CRUD ──
  const saveMultiplier = async (form) => {
    setSaving(true);
    if (form.id) {
      await supabase.from('multipliers').update({ name: form.name, value: parseFloat(form.value) }).eq('id', form.id);
    } else {
      await supabase.from('multipliers').insert({ category: form.category, name: form.name, value: parseFloat(form.value) });
    }
    await refetch(); setSaving(false); setModal(null);
    showToast("Multiplier saved ✓", "success");
  };

  const deleteMultiplier = async (id) => {
    if (!confirm("Delete this multiplier?")) return;
    await supabase.from('multipliers').update({ active: false }).eq('id', id);
    await refetch(); showToast("Multiplier deleted");
  };

  // ── SERVICES CRUD ──
  const saveService = async (form) => {
    setSaving(true);
    if (form.id) {
      await supabase.from('services').update({ name: form.name, description: form.description, pricing_model: form.pricing_model, price: parseInt(form.price) }).eq('id', form.id);
    } else {
      await supabase.from('services').insert({ name: form.name, description: form.description, pricing_model: form.pricing_model, price: parseInt(form.price) });
    }
    await refetch(); setSaving(false); setModal(null);
    showToast("Service saved ✓", "success");
  };

  // ── CITY RULES CRUD ──
  const saveCityRule = async (form) => {
    setSaving(true);
    const payload = { zip: form.zip, city: form.city, county: form.county, permit_required: !!form.permit_required, hurricane_zone: !!form.hurricane_zone, inspection_required: !!form.inspection_required, permit_cost: parseInt(form.permit_cost) || 0 };
    if (form.id) {
      await supabase.from('city_rules').update(payload).eq('id', form.id);
    } else {
      await supabase.from('city_rules').insert(payload);
    }
    await refetch(); setSaving(false); setModal(null);
    showToast("City rule saved ✓", "success");
  };

  const deleteCityRule = async (id) => {
    if (!confirm("Delete this city rule?")) return;
    await supabase.from('city_rules').delete().eq('id', id);
    await refetch(); showToast("City rule deleted");
  };

  // ── QUOTE STATUS UPDATE ──
  const updateQuoteStatus = async (id, status) => {
    await supabase.from('quotes').update({ status }).eq('id', id);
    fetchQuotes(); showToast(`Status updated to ${status}`, "success");
  };

  const filteredQuotes = quotes.filter(q =>
    (statusFilter === "all" || q.status === statusFilter) &&
    (q.customer_name?.toLowerCase().includes(search.toLowerCase()) || q.id?.includes(search))
  );

  const tabs = [
    { id: "quotes", label: "📋 Quotes" },
    { id: "products", label: "🪟 Products" },
    { id: "multipliers", label: "✖ Multipliers" },
    { id: "services", label: "🔧 Services" },
    { id: "cities", label: "🗺 City Rules" },
    { id: "subscription", label: "⭐ Subscription" },
  ];

  if (loading) return <LoadingScreen />;

  return (
    <div className="admin-shell">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="admin-header">
        <div>
          <div className="logo" style={{ fontSize: 17, marginBottom: 4 }}>
            <div className="logo-icon"><Icon name="window" size={15} /></div> WindowQuote Admin
          </div>
          <div style={{ fontSize: 13, color: T.textMuted }}>Manage your quoting system</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="badge badge-green">● Live</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="avatar">{(auth.profile?.full_name || auth.user?.email || 'A').charAt(0).toUpperCase()}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{auth.profile?.full_name || 'Admin'}</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>{auth.user?.email}</div>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={auth.signOut}>Sign out</button>
        </div>
      </div>

      <div className="admin-nav">
        {tabs.map(t => (
          <button key={t.id} className={`admin-nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ── QUOTES ── */}
      {tab === "quotes" && (
        <div className="fade-up">
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <input className="input" style={{ maxWidth: 280 }} placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="select" style={{ maxWidth: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="finalized">Finalized</option>
              <option value="signed">Signed</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          {quotesLoading ? <div className="loading"><div className="spinner" /><span>Loading quotes...</span></div> : (
            <div className="table-wrap">
              <table>
                <thead><tr>
                  <th>Customer</th><th>Quoted by</th><th>Date</th><th>Windows</th><th>Total</th><th>Status</th>
                </tr></thead>
                <tbody>
                  {filteredQuotes.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: T.textMuted, padding: 32 }}>No quotes yet</td></tr>
                  ) : filteredQuotes.map(q => (
                    <tr key={q.id} className="quote-detail-row" onClick={() => setSelectedQuote(q)}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{q.customer_name}</div>
                        <div style={{ fontSize: 11, color: T.textMuted }}>{q.customer_email}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="avatar" style={{ width: 24, height: 24, fontSize: 10 }}>
                            {(q.created_by_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontSize: 13 }}>{q.created_by_name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td style={{ color: T.textMuted }}>{new Date(q.created_at).toLocaleDateString()}</td>
                      <td style={{ color: T.textMuted }}>{(q.windows || []).reduce((s, w) => s + (w.qty || 1), 0)}</td>
                      <td><span className="mono" style={{ fontWeight: 700 }}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(q.total || 0)}</span></td>
                      <td><StatusBadge status={q.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ marginTop: 12, fontSize: 12, color: T.textMuted }}>{filteredQuotes.length} quotes · <span style={{ color: T.accent }}>Click any row to see full details</span></div>
          {selectedQuote && (
            <QuoteDetailModal
              quote={selectedQuote}
              onClose={() => setSelectedQuote(null)}
              onStatusChange={async (id, status) => {
                await updateQuoteStatus(id, status);
                setSelectedQuote(q => ({ ...q, status }));
              }}
            />
          )}
        </div>
      )}

      {/* ── PRODUCTS ── */}
      {tab === "products" && (
        <div className="fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 18 }}>Window Products</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: 'product', data: { name: '', base_price: '' } })}><Icon name="plus" /> Add</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Base Price</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td><span className="mono" style={{ fontWeight: 600 }}>{fmt(p.base_price)}</span></td>
                    <td><div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setModal({ type: 'product', data: { ...p } })}><Icon name="edit" size={12} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p.id)}><Icon name="trash" size={12} /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MULTIPLIERS ── */}
      {tab === "multipliers" && (
        <div className="fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 18 }}>Multipliers</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: 'multiplier', data: { category: 'material', name: '', value: '1.00' } })}><Icon name="plus" /> Add</button>
          </div>
          {['material', 'color', 'glass'].map(cat => (
            <div key={cat} style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 14, textTransform: 'capitalize', marginBottom: 10, color: T.textMuted }}>{cat}</div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Name</th><th>Multiplier</th><th>Actions</th></tr></thead>
                  <tbody>
                    {multipliers.filter(m => m.category === cat).map(m => (
                      <tr key={m.id}>
                        <td style={{ fontWeight: 600 }}>{m.name}</td>
                        <td><span className="mono">{parseFloat(m.value).toFixed(2)}×</span></td>
                        <td><div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => setModal({ type: 'multiplier', data: { ...m, value: parseFloat(m.value).toFixed(2) } })}><Icon name="edit" size={12} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteMultiplier(m.id)}><Icon name="trash" size={12} /></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SERVICES ── */}
      {tab === "services" && (
        <div className="fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 18 }}>Services</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: 'service', data: { name: '', description: '', pricing_model: 'flat', price: '' } })}><Icon name="plus" /> Add</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Service</th><th>Model</th><th>Price</th><th>Notes</th><th>Actions</th></tr></thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td><span className="badge badge-gray">{s.pricing_model}</span></td>
                    <td className="mono" style={{ fontWeight: 600 }}>{fmt(s.price)}</td>
                    <td style={{ color: T.textMuted, fontSize: 12 }}>{s.description}</td>
                    <td><button className="btn btn-secondary btn-sm" onClick={() => setModal({ type: 'service', data: { ...s } })}><Icon name="edit" size={12} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CITIES ── */}
      {tab === "cities" && (
        <div className="fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 18 }}>City Rules</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setModal({ type: 'city', data: { zip: '', city: '', county: '', permit_required: false, hurricane_zone: false, inspection_required: false, permit_cost: 0 } })}><Icon name="plus" /> Add ZIP</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>ZIP</th><th>City</th><th>Permit</th><th>Hurricane</th><th>Inspection</th><th>Permit $</th><th>Actions</th></tr></thead>
              <tbody>
                {cityRules.map(r => (
                  <tr key={r.id}>
                    <td className="mono" style={{ fontWeight: 600 }}>{r.zip}</td>
                    <td style={{ fontWeight: 500 }}>{r.city}</td>
                    <td>{r.permit_required ? <span className="badge badge-red">Yes</span> : <span className="badge badge-gray">No</span>}</td>
                    <td>{r.hurricane_zone ? <span className="badge badge-orange">Yes</span> : <span className="badge badge-gray">No</span>}</td>
                    <td>{r.inspection_required ? <span className="badge badge-blue">Yes</span> : <span className="badge badge-gray">No</span>}</td>
                    <td className="mono">{fmt(r.permit_cost)}</td>
                    <td><div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setModal({ type: 'city', data: { ...r } })}><Icon name="edit" size={12} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteCityRule(r.id)}><Icon name="trash" size={12} /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SUBSCRIPTION ── */}
      {tab === "subscription" && (
        <SubscriptionAdmin subData={subData} />
      )}

      <div style={{ height: 48 }} />

      {/* ── MODALS ── */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            {modal.type === 'product' && <ProductModal data={modal.data} onSave={saveProduct} onClose={() => setModal(null)} saving={saving} />}
            {modal.type === 'multiplier' && <MultiplierModal data={modal.data} onSave={saveMultiplier} onClose={() => setModal(null)} saving={saving} />}
            {modal.type === 'service' && <ServiceModal data={modal.data} onSave={saveService} onClose={() => setModal(null)} saving={saving} />}
            {modal.type === 'city' && <CityModal data={modal.data} onSave={saveCityRule} onClose={() => setModal(null)} saving={saving} />}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SUBSCRIPTION ADMIN ───────────────────────────────────────────────────────
function SubscriptionAdmin({ subData }) {
  const { subscription, plan, plans, loading, changePlan, refetch, pctUsed, quotaColor } = subData;
  const [saving, setSaving] = useState(false);
  const [editQuotes, setEditQuotes] = useState(false);
  const [newUsed, setNewUsed] = useState(0);

  if (loading || !subscription) return <LoadingScreen />;

  const daysLeft = Math.ceil((new Date(subscription.period_end) - new Date()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;
  const remaining = plan?.quote_limit === -1 ? '∞' : Math.max(0, plan.quote_limit - subscription.quotes_used);
  const pct = pctUsed();

  const handleChangePlan = async (planId) => {
    setSaving(true);
    await changePlan(planId);
    setSaving(false);
  };

  const handleEditQuotes = async () => {
    await supabase.from('subscriptions').update({ quotes_used: parseInt(newUsed) }).eq('id', subscription.id);
    await refetch();
    setEditQuotes(false);
  };

  return (
    <div className="fade-up" style={{ maxWidth: 860 }}>
      {/* Current plan hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #1D4ED8 60%, #2563EB 100%)', borderRadius: 20, padding: 28, color: 'white', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Current Plan</div>
            <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1 }}>{plan?.name}</div>
            <div style={{ opacity: 0.8, fontSize: 14, marginTop: 4 }}>${plan?.price_monthly}/month · {plan?.quote_limit === -1 ? 'Unlimited' : plan?.quote_limit} quotes</div>
          </div>
          <span style={{ background: isExpired ? 'rgba(239,68,68,0.3)' : 'rgba(52,211,153,0.25)', color: isExpired ? '#FCA5A5' : '#34D399', padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
            {isExpired ? '⚠ Expired' : '● Active'}
          </span>
        </div>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Quote Limit', value: plan?.quote_limit === -1 ? '∞' : plan?.quote_limit },
            { label: 'Used', value: subscription.quotes_used },
            { label: 'Remaining', value: remaining },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'DM Mono' }}>{s.value}</div>
            </div>
          ))}
        </div>
        {/* Quota bar */}
        {plan?.quote_limit !== -1 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
              <span>Usage this period</span><span>{pct}%</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: pct >= 90 ? '#F87171' : pct >= 70 ? '#FBBF24' : '#34D399', borderRadius: 4, transition: 'width 0.6s ease' }} />
            </div>
          </>
        )}
        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
          Period: {new Date(subscription.period_start).toLocaleDateString()} – {new Date(subscription.period_end).toLocaleDateString()} ·
          {isExpired ? ' Period expired' : ` ${daysLeft} days remaining`}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setNewUsed(subscription.quotes_used); setEditQuotes(true); }}>
          ✏️ Edit Quote Count
        </button>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={async () => {
          const newEnd = new Date(); newEnd.setMonth(newEnd.getMonth() + 1);
          const newStart = new Date();
          await supabase.from('subscriptions').update({ quotes_used: 0, period_start: newStart.toISOString().split('T')[0], period_end: newEnd.toISOString().split('T')[0] }).eq('id', subscription.id);
          await refetch();
        }}>
          🔄 Reset Period
        </button>
      </div>

      {/* Edit quotes modal */}
      {editQuotes && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Edit Quote Count</div>
            <div className="field">
              <label className="label">Quotes Used</label>
              <input className="input" type="number" value={newUsed} min={0} onChange={e => setNewUsed(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditQuotes(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleEditQuotes}><Icon name="save" /> Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Plan selector */}
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Available Plans</div>
      <div className="plan-grid">
        {plans.map(p => (
          <div key={p.id} className={`plan-card ${p.id === subscription.plan_id ? 'current' : ''} ${p.name === 'Silver' ? 'popular' : ''}`}
            onClick={() => p.id !== subscription.plan_id && handleChangePlan(p.id)}>
            {p.id === subscription.plan_id && (
              <span className="badge badge-blue" style={{ marginBottom: 8, display: 'inline-flex' }}>Current Plan</span>
            )}
            <div className="plan-name">{p.name}</div>
            <div className="plan-price">${p.price_monthly}<span>/mo</span></div>
            <div style={{ fontSize: 13, color: T.textMuted, margin: '8px 0' }}>
              {p.quote_limit === -1 ? '♾ Unlimited' : `${p.quote_limit} quotes/mo`}
            </div>
            <div style={{ fontSize: 12, color: T.textMuted }}>
              Overage: {p.overage_price === 0 ? 'N/A' : `$${p.overage_price}/quote`}
            </div>
            {p.id !== subscription.plan_id && (
              <button className="btn btn-accent btn-sm btn-full" style={{ marginTop: 12 }} disabled={saving}>
                {saving ? "..." : "Switch Plan"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Billing details */}
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 16 }}>Billing Details</div>
        {[
          { label: "Company", value: subscription.company_name },
          { label: "Email", value: subscription.email },
          { label: "Overage Rate", value: plan?.overage_price === 0 ? 'Not applicable' : `$${plan?.overage_price} per extra quote` },
          { label: "Period Start", value: new Date(subscription.period_start).toLocaleDateString() },
          { label: "Period End", value: new Date(subscription.period_end).toLocaleDateString() },
          { label: "Status", value: subscription.status },
        ].map(r => (
          <div key={r.label} className="price-row">
            <span className="muted">{r.label}</span>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function ProductModal({ data, onSave, onClose, saving }) {
  const [form, setForm] = useState(data);
  return (
    <>
      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>{form.id ? 'Edit' : 'Add'} Product</div>
      <div className="field"><label className="label">Window Type Name</label>
        <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Double Hung" /></div>
      <div className="field"><label className="label">Base Price ($)</label>
        <input className="input" type="number" value={form.base_price} onChange={e => setForm({ ...form, base_price: e.target.value })} placeholder="280" /></div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ flex: 2 }} disabled={saving} onClick={() => onSave(form)}>{saving ? "Saving..." : <><Icon name="save" /> Save</>}</button>
      </div>
    </>
  );
}

function MultiplierModal({ data, onSave, onClose, saving }) {
  const [form, setForm] = useState(data);
  return (
    <>
      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>{form.id ? 'Edit' : 'Add'} Multiplier</div>
      <div className="field"><label className="label">Category</label>
        <select className="select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          <option value="material">Material</option><option value="color">Color</option><option value="glass">Glass</option>
        </select></div>
      <div className="field"><label className="label">Name</label>
        <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Bronze" /></div>
      <div className="field"><label className="label">Multiplier Value</label>
        <input className="input" type="number" step="0.01" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="1.05" /></div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ flex: 2 }} disabled={saving} onClick={() => onSave(form)}>{saving ? "Saving..." : <><Icon name="save" /> Save</>}</button>
      </div>
    </>
  );
}

function ServiceModal({ data, onSave, onClose, saving }) {
  const [form, setForm] = useState(data);
  return (
    <>
      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>{form.id ? 'Edit' : 'Add'} Service</div>
      <div className="field"><label className="label">Service Name</label>
        <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
      <div className="field"><label className="label">Description</label>
        <input className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
      <div className="field"><label className="label">Pricing Model</label>
        <select className="select" value={form.pricing_model} onChange={e => setForm({ ...form, pricing_model: e.target.value })}>
          <option value="flat">Flat Fee</option><option value="per_window">Per Window</option><option value="percentage">Percentage</option>
        </select></div>
      <div className="field"><label className="label">Price ($)</label>
        <input className="input" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ flex: 2 }} disabled={saving} onClick={() => onSave(form)}>{saving ? "Saving..." : <><Icon name="save" /> Save</>}</button>
      </div>
    </>
  );
}

function CityModal({ data, onSave, onClose, saving }) {
  const [form, setForm] = useState(data);
  return (
    <>
      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>{form.id ? 'Edit' : 'Add'} City Rule</div>
      <div className="row">
        <div className="col field"><label className="label">ZIP Code</label>
          <input className="input" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} placeholder="33101" /></div>
        <div className="col field"><label className="label">City</label>
          <input className="input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Miami" /></div>
      </div>
      <div className="field"><label className="label">County</label>
        <input className="input" value={form.county} onChange={e => setForm({ ...form, county: e.target.value })} placeholder="Miami-Dade" /></div>
      <div className="field"><label className="label">Permit Cost ($)</label>
        <input className="input" type="number" value={form.permit_cost} onChange={e => setForm({ ...form, permit_cost: e.target.value })} /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '12px 0' }}>
        {[['permit_required','Permit Required'],['hurricane_zone','Hurricane Zone'],['inspection_required','Inspection Required']].map(([key, label]) => (
          <div key={key} className={`checkbox-row ${form[key] ? 'checked' : ''}`} onClick={() => setForm({ ...form, [key]: !form[key] })} style={{ marginBottom: 0 }}>
            <div className={`checkbox-box ${form[key] ? 'checked' : ''}`}>{form[key] && <Icon name="check" size={12} />}</div>
            <div className="checkbox-label">{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ flex: 2 }} disabled={saving} onClick={() => onSave(form)}>{saving ? "Saving..." : <><Icon name="save" /> Save</>}</button>
      </div>
    </>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const auth = useAuth();
  const appData = useAppData();
  const subData = useSubscription();

  // Show loading while checking auth
  if (auth.loading) return <LoadingScreen />;

  // Not logged in → show login
  if (!auth.user) return <LoginScreen onLogin={auth.signIn} />;

  // Logged in → show correct view based on role
  return (
    <>
      <style>{css}</style>

      {/* Only admins see the toggle */}
      {auth.isAdmin && (
        <div style={{ position: 'fixed', top: 12, right: 16, display: 'flex', background: '#fff', border: `1.5px solid ${T.border}`, borderRadius: 10, padding: 4, gap: 4, zIndex: 999, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          {[{ id: "wizard", label: "📱 Wizard" }, { id: "admin", label: "🖥 Admin" }].map(v => (
            <button key={v.id} onClick={() => auth.setView(v.id)}
              style={{ padding: '6px 12px', borderRadius: 7, border: 'none', fontFamily: 'DM Sans', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', background: auth.view === v.id ? T.text : 'transparent', color: auth.view === v.id ? 'white' : T.textMuted }}>
              {v.label}
            </button>
          ))}
        </div>
      )}

      {/* Contractors only see the Wizard */}
      {!auth.isAdmin
        ? <Wizard appData={appData} subData={subData} auth={auth} />
        : auth.view === "wizard"
          ? <Wizard appData={appData} subData={subData} auth={auth} />
          : <AdminPanel appData={appData} subData={subData} auth={auth} />
      }
    </>
  );
}
