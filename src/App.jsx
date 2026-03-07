import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
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
  .login-shell { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: ${T.bg}; padding: 20px; }
  .login-card { background: white; border-radius: 20px; padding: 40px 36px; width: 100%; max-width: 400px; box-shadow: 0 8px 40px rgba(0,0,0,0.08); border: 1.5px solid ${T.border}; }
  .top-nav { padding: 16px 20px; border-bottom: 1px solid ${T.border}; display: flex; align-items: center; justify-content: space-between; background: ${T.surface}; position: sticky; top: 0; z-index: 50; }
  .logo { font-weight: 700; font-size: 15px; letter-spacing: -0.3px; display: flex; align-items: center; gap: 8px; }
  .logo-icon { width: 28px; height: 28px; background: ${T.text}; border-radius: 7px; display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; }
  .admin-header { padding: 20px 0; border-bottom: 1px solid ${T.border}; display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
  .admin-nav { display: flex; gap: 4px; padding: 4px; background: ${T.surfaceAlt}; border-radius: 12px; margin-bottom: 28px; flex-wrap: wrap; }
  .admin-nav-item { padding: 8px 16px; border-radius: 9px; font-size: 13px; font-weight: 500; cursor: pointer; color: ${T.textMuted}; transition: all 0.15s; border: none; background: none; font-family: inherit; }
  .admin-nav-item.active { background: ${T.surface}; color: ${T.text}; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  .stepper { padding: 20px 20px 0; display: flex; align-items: center; }
  .step-item { display: flex; align-items: center; flex: 1; }
  .step-dot { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; flex-shrink: 0; transition: all 0.25s ease; }
  .step-dot.done { background: ${T.text}; color: white; }
  .step-dot.active { background: ${T.accent}; color: white; box-shadow: 0 0 0 4px ${T.accentLight}; }
  .step-dot.pending { background: ${T.surfaceAlt}; color: ${T.textLight}; border: 1.5px solid ${T.border}; }
  .step-line { flex: 1; height: 2px; background: ${T.border}; margin: 0 4px; transition: background 0.25s; }
  .step-line.done { background: ${T.text}; }
  .progress-bar { height: 3px; background: ${T.border}; border-radius: 2px; margin: 16px 20px 0; }
  .progress-fill { height: 100%; background: ${T.text}; border-radius: 2px; transition: width 0.4s cubic-bezier(0.4,0,0.2,1); }
  .step-content { padding: 24px 20px; flex: 1; overflow-y: auto; }
  .step-title { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 4px; }
  .step-subtitle { font-size: 13px; color: ${T.textMuted}; margin-bottom: 24px; }
  .field { margin-bottom: 16px; }
  .label { display: block; font-size: 12px; font-weight: 600; color: ${T.textMuted}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .input { width: 100%; padding: 11px 14px; border: 1.5px solid ${T.border}; border-radius: 10px; font-family: inherit; font-size: 15px; color: ${T.text}; background: ${T.surface}; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
  .input:focus { border-color: ${T.borderFocus}; box-shadow: 0 0 0 3px rgba(0,0,0,0.06); }
  .input::placeholder { color: ${T.textLight}; }
  .input.error { border-color: ${T.danger}; }
  .select { width: 100%; padding: 11px 14px; border: 1.5px solid ${T.border}; border-radius: 10px; font-family: inherit; font-size: 15px; color: ${T.text}; background: ${T.surface}; outline: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B6863' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; cursor: pointer; }
  .select:focus { border-color: ${T.borderFocus}; outline: none; }
  .row { display: flex; gap: 12px; } .col { flex: 1; }
  .pill-group { display: flex; flex-wrap: wrap; gap: 8px; }
  .pill { padding: 7px 14px; border: 1.5px solid ${T.border}; border-radius: 100px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; user-select: none; background: ${T.surface}; color: ${T.textMuted}; }
  .pill:hover { border-color: ${T.text}; color: ${T.text}; }
  .pill.selected { background: ${T.text}; border-color: ${T.text}; color: white; }
  .card { background: ${T.surface}; border: 1.5px solid ${T.border}; border-radius: 14px; padding: 16px; margin-bottom: 12px; }
  .card-sm { background: ${T.surfaceAlt}; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 20px; border-radius: 12px; font-family: inherit; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.15s; border: none; }
  .btn-primary { background: ${T.text}; color: white; }
  .btn-primary:hover { background: #333; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  .btn-secondary { background: ${T.surfaceAlt}; color: ${T.text}; border: 1.5px solid ${T.border}; }
  .btn-secondary:hover { background: ${T.border}; }
  .btn-accent { background: ${T.accent}; color: white; }
  .btn-accent:hover { background: ${T.accentHover}; }
  .btn-danger { background: ${T.dangerLight}; color: ${T.danger}; border: 1.5px solid #FCA5A5; }
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
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 100px; font-size: 11px; font-weight: 600; }
  .badge-blue { background: ${T.accentLight}; color: ${T.accent}; }
  .badge-green { background: ${T.successLight}; color: ${T.success}; }
  .badge-orange { background: ${T.warningLight}; color: ${T.warning}; }
  .badge-red { background: ${T.dangerLight}; color: ${T.danger}; }
  .badge-gray { background: ${T.surfaceAlt}; color: ${T.textMuted}; }
  .badge-purple { background: #F3E8FF; color: #7C3AED; }
  .price-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; font-size: 14px; border-bottom: 1px solid ${T.border}; }
  .price-row:last-child { border-bottom: none; }
  .price-row.total { font-weight: 700; font-size: 17px; padding-top: 14px; }
  .price-row .muted { color: ${T.textMuted}; }
  .dp-options { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
  .dp-option { padding: 14px 8px; border: 1.5px solid ${T.border}; border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.15s; user-select: none; }
  .dp-option:hover { border-color: ${T.text}; }
  .dp-option.selected { border-color: ${T.text}; background: ${T.text}; color: white; }
  .dp-option .dp-pct { font-size: 20px; font-weight: 700; }
  .dp-option .dp-label { font-size: 11px; opacity: 0.7; margin-top: 2px; }
  .window-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border: 1.5px solid ${T.border}; border-radius: 12px; margin-bottom: 8px; }
  .info-box { background: ${T.accentLight}; border: 1px solid #BFDBFE; border-radius: 10px; padding: 12px 14px; font-size: 13px; color: ${T.accent}; margin-bottom: 16px; display: flex; gap: 8px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
  .modal { background: white; border-radius: 16px; padding: 24px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
  .quota-bar { height: 6px; background: ${T.border}; border-radius: 3px; overflow: hidden; margin: 4px 0; }
  .quota-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
  .quota-fill.ok { background: linear-gradient(90deg,#34D399,#60A5FA); }
  .quota-fill.warning { background: linear-gradient(90deg,#FBBF24,#F59E0B); }
  .quota-fill.danger { background: linear-gradient(90deg,#F87171,#EF4444); }
  .company-card { background: white; border: 1.5px solid ${T.border}; border-radius: 16px; padding: 20px; cursor: pointer; transition: all 0.2s; }
  .company-card:hover { border-color: ${T.accent}; box-shadow: 0 4px 20px rgba(37,99,235,0.1); transform: translateY(-2px); }
  .company-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); gap: 16px; margin-bottom: 24px; }
  .company-logo { width: 48px; height: 48px; border-radius: 12px; background: ${T.accent}; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 800; flex-shrink: 0; }
  .avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: 700; flex-shrink: 0; }
  .divider { height: 1px; background: ${T.border}; margin: 20px 0; }
  .success-icon { width: 64px; height: 64px; background: ${T.successLight}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 20px; }
  .stripe-card { background: #0A2540; border-radius: 14px; padding: 20px; color: white; margin-bottom: 16px; }
  .loading { display: flex; align-items: center; justify-content: center; padding: 60px; color: ${T.textMuted}; font-size: 14px; gap: 10px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width: 18px; height: 18px; border: 2px solid ${T.border}; border-top-color: ${T.text}; border-radius: 50%; animation: spin 0.7s linear infinite; }
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: ${T.text}; color: white; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: 500; z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
  .toast.success { background: ${T.success}; }
  .toast.error { background: ${T.danger}; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .fade-up { animation: fadeUp 0.3s ease forwards; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .table-wrap { overflow-x: auto; border: 1.5px solid ${T.border}; border-radius: 14px; }
  th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: ${T.textMuted}; background: ${T.surfaceAlt}; border-bottom: 1px solid ${T.border}; }
  td { padding: 13px 16px; border-bottom: 1px solid ${T.border}; }
  tr:last-child td { border-bottom: none; }
  tr.clickable:hover td { background: ${T.accentLight}; cursor: pointer; }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n || 0);
const TAX = 0.07;
const sizeMult = (w, h) => { const a = (w * h) / 144; if (a < 6) return 0.9; if (a < 10) return 1.0; if (a < 15) return 1.12; return 1.25; };

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    check: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M10.5 3.5l2 2L5 13H3v-2L10.5 3.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 5h10M6 5V3h4v2M6 8v4M10 8v4M4 5l1 8h6l1-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    window: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1.2"/><line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.2"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 5l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    map: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M5.5 2L2 4v10l3.5-2 5 2L14 12V2L10.5 4l-5-2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
    download: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 3v7M5 8l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.4"/></svg>,
    save: <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 3h8l2 2v8H3V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M6 3v3h5V3M5 13v-4h6v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  };
  return icons[name] || null;
};

const StatusBadge = ({ status }) => {
  const map = { draft:"badge-gray", finalized:"badge-blue", signed:"badge-orange", paid:"badge-green" };
  return <span className={`badge ${map[status]||"badge-gray"}`}>{status?.charAt(0).toUpperCase()+status?.slice(1)}</span>;
};
const RoleBadge = ({ role }) => {
  const map = { superadmin:"badge-purple", company_admin:"badge-blue", contractor:"badge-gray" };
  const labels = { superadmin:"Super Admin", company_admin:"Company Admin", contractor:"Contractor" };
  return <span className={`badge ${map[role]||"badge-gray"}`}>{labels[role]||role}</span>;
};

// ─── LOADING / TOAST ──────────────────────────────────────────────────────────
const LoadingScreen = () => <div className="loading"><div className="spinner" style={{width:32,height:32}}/><span>Loading...</span></div>;

function Toast({ message, type="default", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return <div className={`toast ${type}`}>{message}</div>;
}

// ─── AUTH HOOK ────────────────────────────────────────────────────────────────
function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid) => {
    const { data } = await supabase.from('profiles').select('*, companies(*)').eq('id', uid).single();
    if (data) setProfile(data);
    return data;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id).then(() => setLoading(false));
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => { const { error } = await supabase.auth.signInWithPassword({ email, password }); return error; };
  const signOut = async () => { await supabase.auth.signOut(); setUser(null); setProfile(null); };

  return {
    user, profile, loading, signIn, signOut,
    isSuperAdmin: profile?.role === 'superadmin',
    isCompanyAdmin: profile?.role === 'company_admin',
    isContractor: profile?.role === 'contractor',
    companyId: profile?.company_id,
    company: profile?.companies,
  };
}

// ─── APP DATA HOOK ────────────────────────────────────────────────────────────
// companyId: if provided, loads company-specific + global (null) records
// if null, loads ALL records (for superadmin)
function useAppData(companyId = null) {
  const [products, setProducts] = useState([]);
  const [multipliers, setMultipliers] = useState([]);
  const [services, setServices] = useState([]);
  const [cityRules, setCityRules] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // superadmin: all products
  const [allServices, setAllServices] = useState([]); // superadmin: all services
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    // Always load city rules and multipliers globally
    const [mRes, cRes] = await Promise.all([
      supabase.from('multipliers').select('*').eq('active', true),
      supabase.from('city_rules').select('*').order('city'),
    ]);
    if (mRes.data) setMultipliers(mRes.data);
    if (cRes.data) setCityRules(cRes.data);

    if (companyId) {
      // Load company-specific + global products/services
      // Company-specific overrides global when same name exists
      const [pRes, sRes] = await Promise.all([
        supabase.from('products').select('*').eq('active', true)
          .or(`company_id.eq.${companyId},company_id.is.null`).order('name'),
        supabase.from('services').select('*').eq('active', true)
          .or(`company_id.eq.${companyId},company_id.is.null`),
      ]);
      if (pRes.data) {
        // If company has own version of a product, prefer it over global
        const seen = new Set();
        const merged = pRes.data.filter(p => {
          const key = p.name.toLowerCase();
          if (p.company_id && !seen.has(key)) { seen.add(key); return true; }
          if (!p.company_id && !seen.has(key)) { seen.add(key); return true; }
          return false;
        });
        setProducts(merged);
      }
      if (sRes.data) {
        const seen = new Set();
        const merged = sRes.data.filter(s => {
          const key = s.name.toLowerCase();
          if (s.company_id && !seen.has(key)) { seen.add(key); return true; }
          if (!s.company_id && !seen.has(key)) { seen.add(key); return true; }
          return false;
        });
        setServices(merged);
      }
    } else {
      // No companyId = load all (superadmin view)
      const [pRes, sRes] = await Promise.all([
        supabase.from('products').select('*').eq('active', true).order('company_id').order('name'),
        supabase.from('services').select('*').eq('active', true),
      ]);
      if (pRes.data) { setProducts(pRes.data); setAllProducts(pRes.data); }
      if (sRes.data) { setServices(sRes.data); setAllServices(sRes.data); }
    }

    setLoading(false);
  };

  useEffect(() => { load(); }, [companyId]);

  const matMult = Object.fromEntries(multipliers.filter(m=>m.category==='material').map(m=>[m.name,parseFloat(m.value)]));
  const colMult = Object.fromEntries(multipliers.filter(m=>m.category==='color').map(m=>[m.name,parseFloat(m.value)]));
  const glsMult = Object.fromEntries(multipliers.filter(m=>m.category==='glass').map(m=>[m.name,parseFloat(m.value)]));
  const cityMap = Object.fromEntries(cityRules.map(r=>[r.zip,r]));

  const calcPrice = (w) => {
    const prod = products.find(p=>p.name===w.type);
    return Math.round((prod?.base_price||300)*(matMult[w.material]||1)*(colMult[w.color]||1)*(glsMult[w.glass]||1)*sizeMult(w.width||36,w.height||48)*(w.qty||1));
  };

  return { products, multipliers, services, cityRules, cityMap, loading, calcPrice, matMult, colMult, glsMult, allProducts, allServices, reload: load };
}

// ─── SUBSCRIPTION HOOK ────────────────────────────────────────────────────────
function useSubscription(userId) {
  const [sub, setSub] = useState(null);
  const [plan, setPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!userId) { setLoading(false); return; }
    const [sr, pr] = await Promise.all([
      supabase.from('subscriptions').select('*,plans(*)').eq('user_id',userId).eq('status','active').limit(1).single(),
      supabase.from('plans').select('*').eq('active',true).order('price_monthly'),
    ]);
    if (sr.data) { setSub(sr.data); setPlan(sr.data.plans); }
    if (pr.data) setPlans(pr.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [userId]);

  const consume = async () => {
    if (!sub) return { allowed: false, reason: 'no_subscription' };
    const limit = plan?.quote_limit ?? 0;
    const used = sub.quotes_used ?? 0;
    if (limit !== -1 && used >= limit) return { allowed: false, reason: 'quota_exceeded' };
    await supabase.from('subscriptions').update({ quotes_used: used+1 }).eq('id', sub.id);
    setSub(s => ({ ...s, quotes_used: used+1 }));
    return { allowed: true };
  };

  const pct = () => !plan||plan.quote_limit===-1 ? 0 : Math.min(100,Math.round(((sub?.quotes_used||0)/plan.quote_limit)*100));
  const color = () => { const p=pct(); return p>=90?'danger':p>=70?'warning':'ok'; };

  return { sub, plan, plans, loading, consume, reload: load, pct, color };
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email,setEmail] = useState('');
  const [pw,setPw] = useState('');
  const [busy,setBusy] = useState(false);
  const [err,setErr] = useState('');

  const go = async () => {
    if(!email||!pw){setErr('Enter email and password.');return;}
    setBusy(true); setErr('');
    const e = await onLogin(email,pw);
    if(e) setErr('Invalid email or password.');
    setBusy(false);
  };

  return (
    <div className="login-shell">
      <div className="login-card fade-up">
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:32}}>
          <div className="logo-icon" style={{width:40,height:40,fontSize:18}}><Icon name="window" size={20}/></div>
          <div><div style={{fontWeight:800,fontSize:17}}>WindowQuote</div><div style={{fontSize:12,color:T.textMuted}}>Professional quoting platform</div></div>
        </div>
        <div style={{fontWeight:700,fontSize:22,letterSpacing:-0.5,marginBottom:4}}>Welcome back</div>
        <div style={{fontSize:13,color:T.textMuted,marginBottom:24}}>Sign in to access your account</div>
        {err&&<div style={{background:T.dangerLight,border:'1px solid #FCA5A5',borderRadius:10,padding:'10px 14px',fontSize:13,color:T.danger,marginBottom:16}}>{err}</div>}
        <div className="field"><label className="label">Email</label><input className="input" type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()}/></div>
        <div className="field"><label className="label">Password</label><input className="input" type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()}/></div>
        <button className="btn btn-primary btn-full" style={{marginTop:8}} disabled={busy} onClick={go}>{busy?'Signing in...':'Sign In'}</button>
        <div style={{textAlign:'center',marginTop:20,fontSize:12,color:T.textLight}}>Need access? Contact your administrator.</div>
      </div>
    </div>
  );
}

// ─── QUOTA BADGE ──────────────────────────────────────────────────────────────
function QuotaBadge({ sub, plan, pct, color }) {
  if (!sub||!plan) return null;
  const rem = plan.quote_limit===-1?'∞':Math.max(0,plan.quote_limit-(sub.quotes_used||0));
  const low = pct()>=80;
  return (
    <div style={{display:'flex',alignItems:'center',gap:6,padding:'5px 10px',background:low?T.dangerLight:T.surfaceAlt,borderRadius:8,border:`1px solid ${low?'#FCA5A5':T.border}`}}>
      <span style={{fontSize:12,fontWeight:700,color:low?T.danger:T.text}}>{rem}</span>
      <span style={{fontSize:11,color:T.textMuted}}>left</span>
      <div style={{width:32,height:4,background:T.border,borderRadius:2,overflow:'hidden'}}>
        <div className={`quota-fill ${color()}`} style={{width:`${pct()}%`,height:'100%'}}/>
      </div>
    </div>
  );
}

// ─── NO QUOTA MODAL ───────────────────────────────────────────────────────────
function NoQuotaModal({ plan, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal" style={{textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>🚫</div>
        <h2 style={{fontWeight:800,fontSize:20,marginBottom:8}}>Quote Limit Reached</h2>
        <p style={{fontSize:14,color:T.textMuted,marginBottom:20}}>You've used all <strong>{plan?.quote_limit}</strong> quotes in your <strong>{plan?.name}</strong> plan.</p>
        {plan?.overage_price>0&&<div className="info-box"><Icon name="info" size={15}/><span>Overage rate: <strong>${plan.overage_price}/quote</strong>. Contact your admin to upgrade.</span></div>}
        <button className="btn btn-secondary btn-full" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// ─── QUOTE DETAIL MODAL ───────────────────────────────────────────────────────
function QuoteDetailModal({ quote, onClose, onStatusChange }) {
  if (!quote) return null;
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal" style={{maxWidth:560}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
          <div>
            <div style={{fontWeight:800,fontSize:18}}>{quote.customer_name}</div>
            <div style={{fontSize:13,color:T.textMuted}}>{quote.customer_email} · {quote.customer_phone}</div>
            <div style={{fontSize:13,color:T.textMuted}}>{quote.address}, {quote.zip}</div>
          </div>
          <button style={{background:'none',border:'none',cursor:'pointer',color:T.textMuted}} onClick={onClose}><Icon name="x" size={18}/></button>
        </div>
        <div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap'}}>
          <StatusBadge status={quote.status}/>
          <span className="badge badge-gray">{new Date(quote.created_at).toLocaleDateString()}</span>
          {quote.created_by_name&&<span className="badge badge-blue">👤 {quote.created_by_name}</span>}
          {quote.company_name&&<span className="badge badge-purple">🏢 {quote.company_name}</span>}
        </div>
        {(quote.windows||[]).length>0&&(
          <div className="card-sm" style={{marginBottom:10}}>
            <div style={{fontWeight:700,fontSize:11,textTransform:'uppercase',letterSpacing:'0.5px',color:T.textMuted,marginBottom:8}}>Windows</div>
            {quote.windows.map((w,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:13,padding:'5px 0',borderBottom:i<quote.windows.length-1?`1px solid ${T.border}`:'none'}}>
                <span><strong>{w.qty}×</strong> {w.type} · {w.material} · {w.color} · {w.glass}</span>
                <span className="mono">{w.width}"×{w.height}"</span>
              </div>
            ))}
          </div>
        )}
        {(quote.services||[]).length>0&&(
          <div className="card-sm" style={{marginBottom:10}}>
            <div style={{fontWeight:700,fontSize:11,textTransform:'uppercase',letterSpacing:'0.5px',color:T.textMuted,marginBottom:8}}>Services</div>
            {quote.services.map((s,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:13}}><span>{s.label}</span><span className="mono">{fmt(s.amount)}</span></div>
            ))}
          </div>
        )}
        <div className="card-sm" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <div><div style={{fontWeight:700}}>Total</div><div style={{fontSize:12,color:T.textMuted}}>Down: {quote.down_pct}%</div></div>
          <div style={{textAlign:'right'}}>
            <div style={{fontWeight:800,fontSize:22,fontFamily:'DM Mono'}}>{fmt(quote.total)}</div>
            <div style={{fontSize:12,color:T.textMuted}}>{fmt(Math.round((quote.total||0)*(quote.down_pct||20)/100))} due</div>
          </div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <span style={{fontSize:13,color:T.textMuted}}>Status:</span>
          <select className="select" style={{fontSize:13}} value={quote.status} onChange={e=>onStatusChange(quote.id,e.target.value)}>
            {['draft','finalized','signed','paid'].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

// ─── WIZARD STEPS ─────────────────────────────────────────────────────────────
function Step1({ data, onChange, errors }) {
  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Your Information</h2>
      <p className="step-subtitle">We'll use this to generate your personalized quote.</p>
      {[
        {key:"name",label:"Full Name",placeholder:"Jane Smith",type:"text"},
        {key:"email",label:"Email Address",placeholder:"jane@email.com",type:"email"},
        {key:"phone",label:"Phone Number",placeholder:"(305) 555-0123",type:"tel"},
        {key:"address",label:"Property Address",placeholder:"123 Main Street",type:"text"},
        {key:"zip",label:"ZIP Code",placeholder:"33101",type:"text"},
      ].map(f=>(
        <div className="field" key={f.key}>
          <label className="label">{f.label}</label>
          <input className={`input ${errors[f.key]?'error':''}`} type={f.type} placeholder={f.placeholder} value={data[f.key]||""} onChange={e=>onChange(f.key,e.target.value)}/>
          {errors[f.key]&&<div style={{fontSize:11,color:T.danger,marginTop:4}}>{errors[f.key]}</div>}
        </div>
      ))}
    </div>
  );
}

function Step2({ windows, setWindows, products, matMult, colMult, glsMult, calcPrice }) {
  const mats = Object.keys(matMult);
  const cols = Object.keys(colMult);
  const gls = Object.keys(glsMult);
  const empty = {type:products[0]?.name||'',material:mats[0]||'Vinyl',color:cols[0]||'White',glass:gls[0]||'Standard',width:36,height:48,qty:1};
  const [form,setForm] = useState(empty);
  const [editIdx,setEditIdx] = useState(null);
  const [show,setShow] = useState(false);

  const add = () => {
    if(editIdx!==null){const u=[...windows];u[editIdx]=form;setWindows(u);setEditIdx(null);}
    else setWindows([...windows,{...form,id:Date.now()}]);
    setForm(empty);setShow(false);
  };

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Windows</h2>
      <p className="step-subtitle">Configure each window for accurate pricing.</p>
      {windows.map((w,i)=>(
        <div className="window-item" key={w.id||i}>
          <div><div style={{fontWeight:600,fontSize:14}}>{w.qty}× {w.type}</div><div style={{fontSize:12,color:T.textMuted}}>{w.material} · {w.color} · {w.glass} · {w.width}"×{w.height}"</div></div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
            <div style={{fontWeight:700,fontFamily:'DM Mono',fontSize:14}}>{fmt(calcPrice(w))}</div>
            <div style={{display:'flex',gap:6}}>
              <button className="btn btn-secondary btn-sm" onClick={()=>{setForm(windows[i]);setEditIdx(i);setShow(true);}}><Icon name="edit" size={13}/></button>
              <button className="btn btn-danger btn-sm" onClick={()=>setWindows(windows.filter((_,idx)=>idx!==i))}><Icon name="trash" size={13}/></button>
            </div>
          </div>
        </div>
      ))}
      {!show?(
        <button className="btn btn-secondary btn-full" onClick={()=>setShow(true)}><Icon name="plus"/> Add Window</button>
      ):(
        <div className="card fade-up">
          <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>{editIdx!==null?"Edit Window":"New Window"}</div>
          <div className="field"><label className="label">Type</label>
            <div className="pill-group">{products.map(p=><div key={p.id} className={`pill ${form.type===p.name?'selected':''}`} onClick={()=>setForm({...form,type:p.name})}>{p.name}</div>)}</div></div>
          <div className="row">
            <div className="col field"><label className="label">Material</label><select className="select" value={form.material} onChange={e=>setForm({...form,material:e.target.value})}>{mats.map(m=><option key={m}>{m}</option>)}</select></div>
            <div className="col field"><label className="label">Color</label><select className="select" value={form.color} onChange={e=>setForm({...form,color:e.target.value})}>{cols.map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="field"><label className="label">Glass</label><select className="select" value={form.glass} onChange={e=>setForm({...form,glass:e.target.value})}>{gls.map(g=><option key={g}>{g}</option>)}</select></div>
          <div className="row">
            <div className="col field"><label className="label">Width"</label><input className="input" type="number" value={form.width} min={12} max={120} onChange={e=>setForm({...form,width:Number(e.target.value)})}/></div>
            <div className="col field"><label className="label">Height"</label><input className="input" type="number" value={form.height} min={12} max={120} onChange={e=>setForm({...form,height:Number(e.target.value)})}/></div>
            <div className="col field"><label className="label">Qty</label><input className="input" type="number" value={form.qty} min={1} max={50} onChange={e=>setForm({...form,qty:Number(e.target.value)})}/></div>
          </div>
          <div style={{background:T.surfaceAlt,borderRadius:10,padding:'10px 14px',marginBottom:16,display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:13,color:T.textMuted}}>Estimated</span>
            <span style={{fontWeight:700,fontFamily:'DM Mono'}}>{fmt(calcPrice(form))}</span>
          </div>
          <div style={{display:'flex',gap:10}}>
            <button className="btn btn-secondary" style={{flex:1}} onClick={()=>{setShow(false);setEditIdx(null);setForm(empty);}}>Cancel</button>
            <button className="btn btn-primary" style={{flex:2}} onClick={add}>{editIdx!==null?"Save":"Add Window"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Step3({ selected, setSelected, zip, dbServices, cityMap }) {
  const rules = cityMap[zip]||null;
  const icons = {Installation:"🔧",Permit:"📋","General Contractor":"👷",Disposal:"♻️"};
  useEffect(()=>{
    if(rules?.permit_required){const p=dbServices.find(s=>s.name==='Permit');if(p&&!selected.includes(p.id))setSelected(s=>[...s,p.id]);}
  },[zip]);
  return (
    <div className="step-content fade-up">
      <h2 className="step-title">Services</h2>
      <p className="step-subtitle">Add any additional services to your project.</p>
      {rules&&(
        <div className="card" style={{background:T.surfaceAlt,marginBottom:20}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}><Icon name="map" size={14}/><span style={{fontWeight:700,fontSize:13}}>Rules for {rules.city}</span></div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {rules.permit_required&&<span className="badge badge-red">⚠ Permit Required</span>}
            {rules.hurricane_zone&&<span className="badge badge-orange">🌀 Hurricane Zone</span>}
            {rules.inspection_required&&<span className="badge badge-blue">🔍 Inspection Needed</span>}
            {!rules.permit_required&&!rules.hurricane_zone&&!rules.inspection_required&&<span className="badge badge-green">✓ Standard zone</span>}
          </div>
        </div>
      )}
      {dbServices.map(s=>{
        const checked=selected.includes(s.id);
        const req=s.name==='Permit'&&rules?.permit_required;
        const price=s.pricing_model==='per_window'?`$${s.price}/window`:s.price>0?`$${s.price} flat`:'Included';
        return(
          <div key={s.id} className={`checkbox-row ${checked?'checked':''}`} onClick={()=>!req&&setSelected(sel=>sel.includes(s.id)?sel.filter(x=>x!==s.id):[...sel,s.id])}>
            <div className={`checkbox-box ${checked?'checked':''}`}>{checked&&<Icon name="check" size={12}/>}</div>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <span className="checkbox-label">{icons[s.name]||'🔹'} {s.name}</span>
                {req&&<span className="badge badge-red" style={{fontSize:10}}>Required</span>}
              </div>
              <div className="checkbox-desc">{price} · {s.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Step4({ windows, selected, dbServices, zip, cityMap, downPct, setDownPct, calcPrice }) {
  const rules=cityMap[zip]||null;
  const count=windows.reduce((s,w)=>s+(w.qty||1),0);
  const winTotal=windows.reduce((s,w)=>s+calcPrice(w),0);
  const lines=dbServices.filter(s=>selected.includes(s.id)).map(s=>{
    let p=s.price;
    if(s.pricing_model==='per_window')p=s.price*count;
    if(s.name==='Permit'&&rules?.permit_cost>0)p=rules.permit_cost;
    return{label:s.name,amount:p};
  });
  const sub=winTotal+lines.reduce((s,l)=>s+l.amount,0);
  const tax=Math.round(sub*TAX);
  const total=sub+tax;
  return(
    <div className="step-content fade-up">
      <h2 className="step-title">Price Summary</h2>
      <p className="step-subtitle">Review your quote breakdown.</p>
      <div className="card">
        <div className="price-row"><span className="muted">Windows ({count})</span><span className="mono">{fmt(winTotal)}</span></div>
        {lines.map((l,i)=><div key={i} className="price-row"><span className="muted">{l.label}</span><span className="mono">{fmt(l.amount)}</span></div>)}
        <div className="price-row"><span className="muted">Tax ({(TAX*100).toFixed(0)}%)</span><span className="mono">{fmt(tax)}</span></div>
        <div className="price-row total"><span>Total</span><span className="mono">{fmt(total)}</span></div>
      </div>
      <div className="divider"/>
      <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>Down Payment</div>
      <div className="dp-options">
        {[10,20,30].map(p=>(
          <div key={p} className={`dp-option ${downPct===p?'selected':''}`} onClick={()=>setDownPct(p)}>
            <div className="dp-pct">{p}%</div>
            <div className="dp-label">{fmt(Math.round(total*p/100))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step5({ customer, windows, selected, dbServices, zip, cityMap, downPct, calcPrice, onConfirm, currentUser }) {
  const [agreed,setAgreed]=useState(false);
  const [saving,setSaving]=useState(false);
  const rules=cityMap[zip]||null;
  const count=windows.reduce((s,w)=>s+(w.qty||1),0);
  const winTotal=windows.reduce((s,w)=>s+calcPrice(w),0);
  const lines=dbServices.filter(s=>selected.includes(s.id)).map(s=>{
    let p=s.price;
    if(s.pricing_model==='per_window')p=s.price*count;
    if(s.name==='Permit'&&rules?.permit_cost>0)p=rules.permit_cost;
    return{label:s.name,amount:p};
  });
  const total=Math.round((winTotal+lines.reduce((s,l)=>s+l.amount,0))*(1+TAX));

  const confirm=async()=>{
    setSaving(true);
    await supabase.from('quotes').insert({
      customer_name:customer.name,customer_email:customer.email,customer_phone:customer.phone,
      address:customer.address,zip:customer.zip,windows,services:lines,down_pct:downPct,total,
      status:'finalized',
      created_by:currentUser?.id||null,
      created_by_name:currentUser?.full_name||currentUser?.email||'Unknown',
      company_id:currentUser?.company_id||null,
      company_name:currentUser?.company_name||null,
    });
    setSaving(false);
    onConfirm(total);
  };

  return(
    <div className="step-content fade-up">
      <h2 className="step-title">Review & Confirm</h2>
      <p className="step-subtitle">Verify everything looks correct.</p>
      <div className="card-sm">
        <div style={{fontWeight:600,fontSize:12,color:T.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px'}}>Customer</div>
        <div style={{fontWeight:600}}>{customer.name}</div>
        <div style={{fontSize:13,color:T.textMuted}}>{customer.email} · {customer.phone}</div>
        <div style={{fontSize:13,color:T.textMuted}}>{customer.address}, {customer.zip}</div>
      </div>
      <div className="card-sm">
        <div style={{fontWeight:600,fontSize:12,color:T.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px'}}>Windows</div>
        {windows.map((w,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4}}><span>{w.qty}× {w.type} · {w.material}</span><span className="mono">{fmt(calcPrice(w))}</span></div>)}
      </div>
      <div className="card-sm" style={{display:'flex',justifyContent:'space-between'}}>
        <span style={{fontWeight:600}}>Total</span>
        <span style={{fontWeight:800,fontFamily:'DM Mono',fontSize:18}}>{fmt(total)}</span>
      </div>
      <div className={`checkbox-row ${agreed?'checked':''}`} onClick={()=>setAgreed(!agreed)} style={{marginTop:16}}>
        <div className={`checkbox-box ${agreed?'checked':''}`}>{agreed&&<Icon name="check" size={12}/>}</div>
        <div><div className="checkbox-label">I agree to the Terms & Conditions</div><div className="checkbox-desc">Accept service agreement, warranty, and payment schedule.</div></div>
      </div>
      <button className="btn btn-primary btn-full" style={{marginTop:16}} disabled={!agreed||saving} onClick={confirm}>
        {saving?"Saving...":<><Icon name="arrow" /> Generate Contract</>}
      </button>
    </div>
  );
}

// ─── POST-WIZARD ──────────────────────────────────────────────────────────────
function ContractReady({ customer, total, downPct, onSign }) {
  return(
    <div className="step-content fade-up" style={{textAlign:'center',paddingTop:40}}>
      <div className="success-icon">📄</div>
      <h2 className="step-title" style={{textAlign:'center'}}>Contract Ready</h2>
      <p className="step-subtitle" style={{textAlign:'center'}}>Ready for signature.</p>
      <div className="card" style={{textAlign:'left',fontFamily:'DM Mono',fontSize:11,lineHeight:1.7,color:T.textMuted}}>
        <div style={{fontWeight:700,fontSize:14,color:T.text,fontFamily:'DM Sans',marginBottom:8}}>WINDOW INSTALLATION CONTRACT</div>
        <div>Customer: {customer.name}</div>
        <div>Total: {fmt(total)} · Down: {fmt(Math.round(total*downPct/100))} ({downPct}%)</div>
      </div>
      <div style={{display:'flex',gap:10,marginTop:8}}>
        <button className="btn btn-secondary" style={{flex:1}}><Icon name="download"/> PDF</button>
        <button className="btn btn-primary" style={{flex:2}} onClick={onSign}><Icon name="lock"/> Sign</button>
      </div>
    </div>
  );
}

function SignContract({ customer, onPay }) {
  const ref=useRef(null);
  const [signed,setSigned]=useState(false);
  const [drawing,setDrawing]=useState(false);
  const draw=(e)=>{
    if(!drawing)return;
    const c=ref.current;const ctx=c.getContext('2d');const r=c.getBoundingClientRect();
    ctx.lineWidth=2;ctx.lineCap='round';ctx.strokeStyle=T.text;
    ctx.lineTo(e.clientX-r.left,e.clientY-r.top);ctx.stroke();ctx.beginPath();ctx.moveTo(e.clientX-r.left,e.clientY-r.top);
  };
  return(
    <div className="step-content fade-up">
      <h2 className="step-title">Sign Contract</h2>
      <p className="step-subtitle">Draw your signature below.</p>
      <div style={{border:`1.5px solid ${T.border}`,borderRadius:12,overflow:'hidden',background:T.surfaceAlt,position:'relative'}}>
        <canvas ref={ref} width={350} height={120} style={{display:'block',cursor:'crosshair'}}
          onMouseDown={()=>setDrawing(true)} onMouseUp={()=>{setDrawing(false);setSigned(true);}} onMouseMove={draw}/>
        {!signed&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',color:T.textLight,fontSize:13,pointerEvents:'none'}}>Draw here</div>}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:8,marginBottom:20}}>
        <span style={{fontSize:12,color:T.textMuted}}>{customer.name} · {new Date().toLocaleDateString()}</span>
        <button style={{background:'none',border:'none',fontSize:12,color:T.accent,cursor:'pointer'}} onClick={()=>{ref.current.getContext('2d').clearRect(0,0,400,120);setSigned(false);}}>Clear</button>
      </div>
      <button className="btn btn-primary btn-full" disabled={!signed} onClick={onPay}>Confirm → Pay Deposit</button>
    </div>
  );
}

function PayDeposit({ downAmt }) {
  const [paying,setPaying]=useState(false);
  const [paid,setPaid]=useState(false);
  if(paid)return(
    <div className="step-content fade-up" style={{textAlign:'center',paddingTop:60}}>
      <div className="success-icon">✅</div>
      <h2 className="step-title" style={{textAlign:'center'}}>Payment Received!</h2>
      <p className="step-subtitle" style={{textAlign:'center'}}>Deposit of <strong>{fmt(downAmt)}</strong> processed.</p>
    </div>
  );
  return(
    <div className="step-content fade-up">
      <h2 className="step-title">Pay Deposit</h2>
      <div className="stripe-card">
        <div style={{fontSize:11,opacity:0.6,marginBottom:12,letterSpacing:1,textTransform:'uppercase'}}>Powered by Stripe</div>
        <div style={{background:'rgba(255,255,255,0.1)',borderRadius:8,padding:'12px 14px',marginBottom:10,letterSpacing:2}}>4242 4242 4242 4242</div>
        <div style={{display:'flex',gap:10}}>
          <div style={{flex:1,background:'rgba(255,255,255,0.1)',borderRadius:8,padding:'10px 12px'}}>12/27</div>
          <div style={{flex:1,background:'rgba(255,255,255,0.1)',borderRadius:8,padding:'10px 12px'}}>•••</div>
        </div>
      </div>
      <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><div style={{fontWeight:600}}>Deposit</div><div style={{fontSize:12,color:T.textMuted}}>Due now</div></div>
        <div style={{fontWeight:800,fontSize:22,fontFamily:'DM Mono'}}>{fmt(downAmt)}</div>
      </div>
      <button className="btn btn-accent btn-full" disabled={paying} onClick={()=>{setPaying(true);setTimeout(()=>{setPaying(false);setPaid(true);},2500);}}>
        {paying?"Processing...":`Pay ${fmt(downAmt)}`}
      </button>
    </div>
  );
}

// ─── WIZARD ───────────────────────────────────────────────────────────────────
function Wizard({ appData, auth }) {
  const { products, services: dbServices, cityMap, loading, calcPrice, matMult, colMult, glsMult } = appData;
  const subData = useSubscription(auth.user?.id);
  const { sub, plan, consume, pct, color } = subData;
  const [step,setStep]=useState(1);
  const [post,setPost]=useState(null);
  const [customer,setCustomer]=useState({name:"",email:"",phone:"",address:"",zip:""});
  const [windows,setWindows]=useState([]);
  const [selected,setSelected]=useState([]);
  const [downPct,setDownPct]=useState(20);
  const [errors,setErrors]=useState({});
  const [total,setTotal]=useState(0);
  const [noQuota,setNoQuota]=useState(false);
  const [checking,setChecking]=useState(false);

  const validate=()=>{
    const e={};
    if(!customer.name.trim())e.name="Required";
    if(!customer.email.match(/\S+@\S+\.\S+/))e.email="Valid email required";
    if(!customer.phone.trim())e.phone="Required";
    if(!customer.address.trim())e.address="Required";
    if(!customer.zip.trim())e.zip="Required";
    setErrors(e);return Object.keys(e).length===0;
  };

  const next=async()=>{
    if(step===1&&!validate())return;
    if(step===2){
      if(windows.length===0){alert("Add at least one window.");return;}
      setChecking(true);
      const r=await consume();
      setChecking(false);
      if(!r.allowed){setNoQuota(true);return;}
    }
    setStep(s=>s+1);
  };

  if(loading)return <LoadingScreen/>;
  const cu={id:auth.user?.id,email:auth.user?.email,full_name:auth.profile?.full_name,company_id:auth.companyId,company_name:auth.company?.name};

  if(post==="pay")return<div className="wizard-shell"><div className="top-nav"><div className="logo"><div className="logo-icon"><Icon name="window" size={14}/></div>{auth.company?.name||"WindowQuote"}</div></div><PayDeposit downAmt={Math.round(total*downPct/100)}/></div>;
  if(post==="sign")return<div className="wizard-shell"><div className="top-nav"><div className="logo"><div className="logo-icon"><Icon name="window" size={14}/></div>{auth.company?.name||"WindowQuote"}</div></div><SignContract customer={customer} onPay={()=>setPost("pay")}/></div>;
  if(post==="contract")return<div className="wizard-shell"><div className="top-nav"><div className="logo"><div className="logo-icon"><Icon name="window" size={14}/></div>{auth.company?.name||"WindowQuote"}</div></div><ContractReady customer={customer} total={total} downPct={downPct} onSign={()=>setPost("sign")}/></div>;

  return(
    <div className="wizard-shell">
      {noQuota&&<NoQuotaModal plan={plan} onClose={()=>setNoQuota(false)}/>}
      <div className="top-nav">
        <div className="logo"><div className="logo-icon"><Icon name="window" size={14}/></div>{auth.company?.name||"WindowQuote"}</div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <QuotaBadge sub={sub} plan={plan} pct={pct} color={color}/>
          <div className="avatar" style={{background:T.accent,width:28,height:28,fontSize:11}}>{(auth.profile?.full_name||auth.user?.email||'U').charAt(0).toUpperCase()}</div>
          <button style={{background:'none',border:'none',fontSize:12,color:T.textMuted,cursor:'pointer'}} onClick={auth.signOut}>Out</button>
        </div>
      </div>
      <div className="progress-bar"><div className="progress-fill" style={{width:`${(step/5)*100}%`}}/></div>
      <div className="stepper">
        {[1,2,3,4,5].map((s,i)=>(
          <div key={s} className="step-item">
            <div className={`step-dot ${s<step?'done':s===step?'active':'pending'}`}>{s<step?<Icon name="check" size={11}/>:s}</div>
            {i<4&&<div className={`step-line ${s<step?'done':''}`}/>}
          </div>
        ))}
      </div>
      {step===1&&<Step1 data={customer} onChange={(k,v)=>{setCustomer(c=>({...c,[k]:v}));setErrors(e=>({...e,[k]:null}));}} errors={errors}/>}
      {step===2&&<Step2 windows={windows} setWindows={setWindows} products={products} matMult={matMult} colMult={colMult} glsMult={glsMult} calcPrice={calcPrice}/>}
      {step===3&&<Step3 selected={selected} setSelected={setSelected} zip={customer.zip} dbServices={dbServices} cityMap={cityMap}/>}
      {step===4&&<Step4 windows={windows} selected={selected} dbServices={dbServices} zip={customer.zip} cityMap={cityMap} downPct={downPct} setDownPct={setDownPct} calcPrice={calcPrice}/>}
      {step===5&&<Step5 customer={customer} windows={windows} selected={selected} dbServices={dbServices} zip={customer.zip} cityMap={cityMap} downPct={downPct} calcPrice={calcPrice} currentUser={cu} onConfirm={t=>{setTotal(t);setPost("contract");}}/>}
      {step<5&&(
        <div className="bottom-bar">
          {step>1&&<button className="btn btn-secondary" onClick={()=>setStep(s=>s-1)}>Back</button>}
          <button className="btn btn-primary" style={{flex:1}} disabled={checking} onClick={next}>
            {checking?"Checking...":step===4?"Review Quote":"Continue"} {!checking&&<Icon name="arrow"/>}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── PLAN SELECTOR ────────────────────────────────────────────────────────────
function PlanSelector({ userId, companyId, currentPlanId, onSave }) {
  const [plans,setPlans]=useState([]);
  useEffect(()=>{supabase.from('plans').select('*').eq('active',true).order('price_monthly').then(({data})=>{if(data)setPlans(data);});}, []);
  return(
    <select className="select" style={{fontSize:12,padding:'5px 28px 5px 8px',width:'auto'}} value={currentPlanId||''} onChange={e=>onSave(userId,e.target.value,companyId)}>
      <option value="">No plan</option>
      {plans.map(p=><option key={p.id} value={p.id}>{p.name} ({p.quote_limit===-1?'∞':p.quote_limit} quotes)</option>)}
    </select>
  );
}

// ─── SUPER ADMIN PANEL ────────────────────────────────────────────────────────
function SuperAdminPanel({ appData, auth }) {
  const [tab,setTab]=useState("companies");
  const [companies,setCompanies]=useState([]);
  const [allQuotes,setAllQuotes]=useState([]);
  const [allUsers,setAllUsers]=useState([]);
  const [selCompany,setSelCompany]=useState(null);
  const [selQuote,setSelQuote]=useState(null);
  const [modal,setModal]=useState(null);
  const [toast,setToast]=useState(null);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);

  const showToast=(msg,type="success")=>setToast({message:msg,type});

  useEffect(()=>{fetchAll();},[]);

  const fetchAll=async()=>{
    setLoading(true);
    const [co,qu,us]=await Promise.all([
      supabase.from('companies').select('*').eq('active',true).order('name'),
      supabase.from('quotes').select('*').order('created_at',{ascending:false}),
      supabase.from('profiles').select('*,companies(name),subscriptions(*,plans(*))').order('created_at',{ascending:false}),
    ]);
    if(co.data)setCompanies(co.data);
    if(qu.data)setAllQuotes(qu.data);
    if(us.data)setAllUsers(us.data);
    setLoading(false);
  };

  const saveCompany=async(form)=>{
    setSaving(true);
    if(form.id)await supabase.from('companies').update({name:form.name,phone:form.phone,address:form.address}).eq('id',form.id);
    else await supabase.from('companies').insert({name:form.name,phone:form.phone,address:form.address});
    await fetchAll();setSaving(false);setModal(null);showToast("Company saved ✓");
  };

  const updateQuoteStatus=async(id,status)=>{
    await supabase.from('quotes').update({status}).eq('id',id);
    setAllQuotes(q=>q.map(x=>x.id===id?{...x,status}:x));
    showToast("Status updated ✓");
  };

  const updateUserPlan=async(userId,planId,companyId)=>{
    if(!planId)return;
    const today=new Date().toISOString().split('T')[0];
    const end=new Date();end.setMonth(end.getMonth()+1);
    const existing=allUsers.find(u=>u.id===userId)?.subscriptions?.[0];
    if(existing)await supabase.from('subscriptions').update({plan_id:planId}).eq('id',existing.id);
    else await supabase.from('subscriptions').insert({user_id:userId,company_id:companyId,plan_id:planId,quotes_used:0,period_start:today,period_end:end.toISOString().split('T')[0],status:'active'});
    await fetchAll();showToast("Plan updated ✓");
  };

  if(loading)return <div className="admin-shell"><LoadingScreen/></div>;

  const visQuotes=selCompany?allQuotes.filter(q=>q.company_id===selCompany.id):allQuotes;
  const visUsers=selCompany?allUsers.filter(u=>u.company_id===selCompany.id):allUsers;

  return(
    <div className="admin-shell">
      {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
      <div className="admin-header">
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
            <div className="logo-icon"><Icon name="window" size={15}/></div>
            <span style={{fontWeight:800,fontSize:18}}>WindowQuote</span>
            <RoleBadge role="superadmin"/>
          </div>
          <div style={{fontSize:13,color:T.textMuted}}>Super Admin — full system access</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <div style={{display:'flex',gap:10}}>
            {[{label:"Companies",value:companies.length},{label:"Contractors",value:allUsers.filter(u=>u.role==='contractor').length},{label:"Quotes",value:allQuotes.length}].map(s=>(
              <div key={s.label} style={{textAlign:'center',padding:'8px 14px',background:T.surfaceAlt,borderRadius:10,border:`1px solid ${T.border}`}}>
                <div style={{fontWeight:800,fontSize:18,fontFamily:'DM Mono'}}>{s.value}</div>
                <div style={{fontSize:11,color:T.textMuted}}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div className="avatar" style={{background:'#7C3AED'}}>{(auth.profile?.full_name||'S').charAt(0)}</div>
            <button className="btn btn-secondary btn-sm" onClick={auth.signOut}>Sign out</button>
          </div>
        </div>
      </div>

      {selCompany&&(
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20,padding:'10px 14px',background:T.accentLight,borderRadius:12,border:`1px solid #BFDBFE`}}>
          <span style={{fontSize:13,color:T.accent}}>Viewing: <strong>{selCompany.name}</strong></span>
          <button style={{background:'none',border:'none',cursor:'pointer',color:T.accent,fontSize:12}} onClick={()=>setSelCompany(null)}>✕ Show all</button>
        </div>
      )}

      <div className="admin-nav">
        {[{id:"companies",label:"🏢 Companies"},{id:"contractors",label:"👥 Contractors"},{id:"quotes",label:"📋 Quotes"},{id:"billing",label:"💰 Billing"},{id:"products",label:"🪟 Products"},{id:"cities",label:"🗺 Cities"}].map(t=>(
          <button key={t.id} className={`admin-nav-item ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* COMPANIES */}
      {tab==="companies"&&(
        <div className="fade-up">
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
            <h3 style={{fontWeight:700,fontSize:18}}>Companies</h3>
            <button className="btn btn-primary btn-sm" onClick={()=>setModal({type:'company',data:{name:'',phone:'',address:''}})}><Icon name="plus"/> Add</button>
          </div>
          <div className="company-grid">
            {companies.map(c=>{
              const cu=allUsers.filter(u=>u.company_id===c.id);
              const cq=allQuotes.filter(q=>q.company_id===c.id);
              const rev=cq.filter(q=>q.status==='paid').reduce((s,q)=>s+(q.total||0),0);
              return(
                <div key={c.id} className="company-card" onClick={()=>{setSelCompany(c);setTab('contractors');}}>
                  <div style={{display:'flex',gap:14,alignItems:'flex-start',marginBottom:14}}>
                    <div className="company-logo">{c.name.charAt(0)}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:15}}>{c.name}</div>
                      <div style={{fontSize:12,color:T.textMuted}}>{c.phone}</div>
                      <div style={{fontSize:12,color:T.textMuted}}>{c.address}</div>
                    </div>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-secondary btn-sm" onClick={e=>{e.stopPropagation();setModal({type:'company',data:{...c}});}}><Icon name="edit" size={12}/></button>
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                    {[{label:"Contractors",value:cu.filter(u=>u.role==='contractor').length},{label:"Quotes",value:cq.length},{label:"Revenue",value:fmt(rev)}].map(s=>(
                      <div key={s.label} style={{background:T.surfaceAlt,borderRadius:8,padding:'8px 10px',textAlign:'center'}}>
                        <div style={{fontWeight:700,fontSize:14,fontFamily:'DM Mono'}}>{s.value}</div>
                        <div style={{fontSize:10,color:T.textMuted}}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {companies.length===0&&<div style={{color:T.textMuted,fontSize:14}}>No companies yet. Add your first client.</div>}
          </div>
        </div>
      )}

      {/* CONTRACTORS */}
      {tab==="contractors"&&(
        <div className="fade-up">
          <h3 style={{fontWeight:700,fontSize:18,marginBottom:20}}>{selCompany?`${selCompany.name} — Contractors`:'All Contractors'}</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Company</th><th>Role</th><th>Plan</th><th>Used</th><th>Remaining</th><th>Assign Plan</th></tr></thead>
              <tbody>
                {visUsers.map(u=>{
                  const s=u.subscriptions?.[0];const p=s?.plans;
                  const used=s?.quotes_used||0;const limit=p?.quote_limit??null;
                  const rem=limit===null?'—':limit===-1?'∞':Math.max(0,limit-used);
                  const pct=limit&&limit!==-1?Math.min(100,Math.round((used/limit)*100)):0;
                  const col=pct>=90?'danger':pct>=70?'warning':'ok';
                  return(
                    <tr key={u.id}>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <div className="avatar" style={{background:T.accent,width:28,height:28,fontSize:11}}>{(u.full_name||'U').charAt(0).toUpperCase()}</div>
                          <div style={{fontWeight:600}}>{u.full_name||'No name'}</div>
                        </div>
                      </td>
                      <td style={{color:T.textMuted,fontSize:13}}>{u.companies?.name||'—'}</td>
                      <td><RoleBadge role={u.role}/></td>
                      <td>{p?<span className="badge badge-blue">{p.name}</span>:<span className="badge badge-gray">No plan</span>}</td>
                      <td>
                        <span className="mono" style={{fontWeight:600}}>{used}</span>
                        {limit&&limit!==-1&&<span style={{color:T.textMuted}}> /{limit}</span>}
                        {limit&&limit!==-1&&<div className="quota-bar" style={{width:80}}><div className={`quota-fill ${col}`} style={{width:`${pct}%`}}/></div>}
                      </td>
                      <td><span className="mono" style={{fontWeight:700,color:rem===0?T.danger:T.success}}>{rem}</span></td>
                      <td><PlanSelector userId={u.id} companyId={u.company_id} currentPlanId={p?.id} onSave={updateUserPlan}/></td>
                    </tr>
                  );
                })}
                {visUsers.length===0&&<tr><td colSpan={7} style={{textAlign:'center',color:T.textMuted,padding:32}}>No contractors yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUOTES */}
      {tab==="quotes"&&(
        <div className="fade-up">
          <h3 style={{fontWeight:700,fontSize:18,marginBottom:20}}>{selCompany?`${selCompany.name} — Quotes`:'All Quotes'}</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Customer</th><th>Contractor</th><th>Company</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {visQuotes.map(q=>(
                  <tr key={q.id} className="clickable" onClick={()=>setSelQuote(q)}>
                    <td><div style={{fontWeight:600}}>{q.customer_name}</div><div style={{fontSize:11,color:T.textMuted}}>{q.customer_email}</div></td>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <div className="avatar" style={{background:T.accent,width:24,height:24,fontSize:10}}>{(q.created_by_name||'U').charAt(0).toUpperCase()}</div>
                        <span style={{fontSize:13}}>{q.created_by_name||'Unknown'}</span>
                      </div>
                    </td>
                    <td style={{color:T.textMuted,fontSize:13}}>{q.company_name||'—'}</td>
                    <td style={{color:T.textMuted}}>{new Date(q.created_at).toLocaleDateString()}</td>
                    <td><span className="mono" style={{fontWeight:700}}>{fmt(q.total)}</span></td>
                    <td><StatusBadge status={q.status}/></td>
                  </tr>
                ))}
                {visQuotes.length===0&&<tr><td colSpan={6} style={{textAlign:'center',color:T.textMuted,padding:32}}>No quotes yet</td></tr>}
              </tbody>
            </table>
          </div>
          <div style={{marginTop:10,fontSize:12,color:T.accent}}>Click any row to see full details</div>
          {selQuote&&<QuoteDetailModal quote={selQuote} onClose={()=>setSelQuote(null)} onStatusChange={async(id,status)=>{await updateQuoteStatus(id,status);setSelQuote(q=>({...q,status}));}}/>}
        </div>
      )}

      {/* BILLING — Super Admin sees ALL transactions */}
      {tab==="billing"&&<SuperBillingPanel companyFilter={selCompany}/>}

      {/* PRODUCTS */}
      {tab==="products"&&<ProductsAdmin appData={appData} showToast={showToast} companies={companies}/>}

      {/* CITIES */}
      {tab==="cities"&&<CitiesAdmin appData={appData} showToast={showToast}/>}

      {/* Company modal */}
      {modal?.type==='company'&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal">
            <div style={{fontWeight:700,fontSize:17,marginBottom:20}}>{modal.data.id?'Edit':'Add'} Company</div>
            <CompanyForm data={modal.data} onSave={saveCompany} onClose={()=>setModal(null)} saving={saving}/>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ADD QUOTES MODAL ─────────────────────────────────────────────────────────
function AddQuotesModal({ contractor, companyId, companyName, adminId, onClose, onSuccess }) {
  const [mode, setMode] = useState(contractor._forceMode || 'pack');
  const [packs, setPacks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState('choose');       // 'choose' | 'confirm' | 'done'

  const sub = contractor.subscriptions?.[0];
  const currentPlan = sub?.plans;

  useEffect(() => {
    Promise.all([
      supabase.from('quote_packs').select('*').eq('active', true).order('quotes'),
      supabase.from('plans').select('*').eq('active', true).order('price_monthly'),
    ]).then(([pk, pl]) => {
      if (pk.data) { setPacks(pk.data); setSelectedPack(pk.data[1] || pk.data[0]); }
      if (pl.data) {
        // Only show plans higher than current
        const higher = pl.data.filter(p => (p.price_monthly > (currentPlan?.price_monthly || 0)));
        setPlans(higher);
        if (higher.length > 0) setSelectedPlan(higher[0]);
      }
    });
  }, []);

  const currentUsed = sub?.quotes_used || 0;
  const currentLimit = currentPlan?.quote_limit || 0;
  const remaining = currentLimit === -1 ? '∞' : Math.max(0, currentLimit - currentUsed);

  const handleConfirm = async () => {
    setProcessing(true);
    try {
      if (mode === 'pack' && selectedPack) {
        // Add quotes: increase the subscription limit by pack amount
        const newLimit = currentLimit === -1 ? -1 : currentLimit + selectedPack.quotes;
        await supabase.from('subscriptions').update({ quote_limit_override: newLimit }).eq('id', sub.id);
        // If no override column, just bump quotes_used down (subtract from used)
        // Safer: add an extra_quotes field or reduce quotes_used
        const newUsed = Math.max(0, currentUsed - selectedPack.quotes);
        await supabase.from('subscriptions').update({ quotes_used: newUsed }).eq('id', sub.id);

        // Log billing transaction
        await supabase.from('billing_transactions').insert({
          company_id: companyId,
          company_name: companyName,
          contractor_id: contractor.id,
          contractor_name: contractor.full_name,
          type: 'quote_pack',
          description: `${selectedPack.name} — ${selectedPack.quotes} quotes added for ${contractor.full_name}`,
          amount: selectedPack.price,
          quotes_added: selectedPack.quotes,
          status: 'paid',        // mock: instantly "paid"
          payment_method: 'mock',
          paid_at: new Date().toISOString(),
          created_by: adminId,
        });

      } else if (mode === 'upgrade' && selectedPlan) {
        const today = new Date().toISOString().split('T')[0];
        const end = new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0];

        if (sub) {
          // Has existing subscription — update it
          await supabase.from('subscriptions').update({
            plan_id: selectedPlan.id,
            quotes_used: 0,
            period_start: today,
            period_end: end,
          }).eq('id', sub.id);
        } else {
          // No subscription yet — create one
          await supabase.from('subscriptions').insert({
            user_id: contractor.id,
            company_id: companyId,
            plan_id: selectedPlan.id,
            quotes_used: 0,
            period_start: today,
            period_end: end,
            status: 'active',
          });
        }

        const upgradeCost = selectedPlan.price_monthly - (currentPlan?.price_monthly || 0);
        await supabase.from('billing_transactions').insert({
          company_id: companyId,
          company_name: companyName,
          contractor_id: contractor.id,
          contractor_name: contractor.full_name,
          type: 'plan_upgrade',
          description: `Upgrade ${currentPlan?.name || 'No Plan'} → ${selectedPlan.name} for ${contractor.full_name}`,
          amount: Math.max(0, upgradeCost),
          quotes_added: selectedPlan.quote_limit === -1 ? 9999 : selectedPlan.quote_limit,
          old_plan_id: currentPlan?.id || null,
          new_plan_id: selectedPlan.id,
          status: 'paid',
          payment_method: 'mock',
          paid_at: new Date().toISOString(),
          created_by: adminId,
        });
      }
      setStep('done');
    } catch (e) {
      console.error(e);
    }
    setProcessing(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 500 }}>

        {/* DONE STATE */}
        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>
              {mode === 'pack' ? `${selectedPack?.quotes} Quotes Added!` : `Plan Upgraded!`}
            </div>
            <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 8 }}>
              {contractor.full_name} can now create more quotes.
            </div>
            <div style={{ background: T.warningLight, border: `1px solid #FDE68A`, borderRadius: 10, padding: '10px 14px', fontSize: 12, color: T.warning, marginBottom: 20 }}>
              💳 <strong>Mock payment</strong> — ${mode === 'pack' ? selectedPack?.price : Math.max(0, (selectedPlan?.price_monthly||0)-(currentPlan?.price_monthly||0))} recorded. Connect Stripe to charge real cards.
            </div>
            <button className="btn btn-primary btn-full" onClick={() => { onSuccess(); onClose(); }}>Done</button>
          </div>
        )}

        {/* CHOOSE STATE */}
        {step === 'choose' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17 }}>Add Quotes for</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <div className="avatar" style={{ background: T.accent, width: 28, height: 28, fontSize: 11 }}>{(contractor.full_name||'U').charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{contractor.full_name}</div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>
                      {currentPlan?.name || 'No plan'} · {remaining} quotes left
                    </div>
                  </div>
                </div>
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted }} onClick={onClose}><Icon name="x" size={18} /></button>
            </div>

            {/* Mode toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, padding: 4, background: T.surfaceAlt, borderRadius: 10 }}>
              {[{id:'pack',label:'🎁 Buy Quote Pack'},{id:'upgrade',label:'⬆️ Upgrade Plan'}].map(m => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                    background: mode === m.id ? T.surface : 'transparent',
                    color: mode === m.id ? T.text : T.textMuted,
                    boxShadow: mode === m.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                  {m.label}
                </button>
              ))}
            </div>

            {/* PACK MODE */}
            {mode === 'pack' && (
              <>
                <div style={{ fontWeight: 600, fontSize: 13, color: T.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Choose a Pack</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                  {packs.map(pk => (
                    <div key={pk.id} onClick={() => setSelectedPack(pk)}
                      style={{ border: `2px solid ${selectedPack?.id === pk.id ? T.accent : T.border}`, borderRadius: 12, padding: '14px 12px', cursor: 'pointer', background: selectedPack?.id === pk.id ? T.accentLight : T.surface, transition: 'all 0.15s' }}>
                      <div style={{ fontWeight: 800, fontSize: 22, fontFamily: 'DM Mono', color: selectedPack?.id === pk.id ? T.accent : T.text }}>{pk.quotes}</div>
                      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8 }}>quotes</div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{fmt(pk.price)}</div>
                      <div style={{ fontSize: 11, color: T.textMuted }}>{fmt(pk.price / pk.quotes)}/quote</div>
                      {selectedPack?.id === pk.id && <div style={{ fontSize: 10, color: T.accent, marginTop: 6, fontWeight: 700 }}>✓ SELECTED</div>}
                    </div>
                  ))}
                </div>
                {selectedPack && (
                  <div style={{ background: T.successLight, border: `1px solid #BBF7D0`, borderRadius: 10, padding: '12px 14px', fontSize: 13, marginBottom: 16 }}>
                    Adding <strong>{selectedPack.quotes} quotes</strong> to {contractor.full_name?.split(' ')[0]}'s account will reset their counter and give them <strong>{(remaining === '∞' ? '∞' : Number(remaining) + selectedPack.quotes)} total remaining</strong>.
                  </div>
                )}
              </>
            )}

            {/* UPGRADE MODE */}
            {mode === 'upgrade' && (
              <>
                <div style={{ fontWeight: 600, fontSize: 13, color: T.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Upgrade To</div>
                {plans.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 32, color: T.textMuted, fontSize: 13 }}>
                    {currentPlan?.quote_limit === -1 ? '✓ Already on the highest plan (Enterprise)' : 'No higher plans available.'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                    {plans.map(pl => {
                      const diff = (pl.price_monthly - (currentPlan?.price_monthly || 0));
                      return (
                        <div key={pl.id} onClick={() => setSelectedPlan(pl)}
                          style={{ border: `2px solid ${selectedPlan?.id === pl.id ? T.accent : T.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', background: selectedPlan?.id === pl.id ? T.accentLight : T.surface, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s' }}>
                          <div>
                            <div style={{ fontWeight: 700 }}>{pl.name}</div>
                            <div style={{ fontSize: 12, color: T.textMuted }}>{pl.quote_limit === -1 ? 'Unlimited' : pl.quote_limit} quotes/month</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, fontFamily: 'DM Mono' }}>{fmt(pl.price_monthly)}/mo</div>
                            <div style={{ fontSize: 11, color: T.success }}>+{fmt(diff)} upgrade</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {selectedPlan && plans.length > 0 && (
                  <div style={{ background: T.accentLight, border: `1px solid #BFDBFE`, borderRadius: 10, padding: '12px 14px', fontSize: 13, marginBottom: 16 }}>
                    <strong>Plan resets immediately.</strong> {contractor.full_name?.split(' ')[0]}'s counter resets to 0 and they get <strong>{selectedPlan.quote_limit === -1 ? 'unlimited' : selectedPlan.quote_limit} quotes</strong> starting today.
                  </div>
                )}
              </>
            )}

            <button className="btn btn-primary btn-full"
              disabled={processing || (mode === 'pack' && !selectedPack) || (mode === 'upgrade' && (!selectedPlan || plans.length === 0))}
              onClick={() => setStep('confirm')}>
              Review & Confirm →
            </button>
          </>
        )}

        {/* CONFIRM STATE */}
        {step === 'confirm' && (
          <>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 20 }}>Confirm Purchase</div>
            <div style={{ background: T.surfaceAlt, borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: T.textMuted }}>Contractor</span>
                <span style={{ fontWeight: 600 }}>{contractor.full_name}</span>
              </div>
              {mode === 'pack' ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ color: T.textMuted }}>Pack</span>
                    <span style={{ fontWeight: 600 }}>{selectedPack?.name} ({selectedPack?.quotes} quotes)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <span style={{ fontWeight: 800, fontFamily: 'DM Mono', fontSize: 18 }}>{fmt(selectedPack?.price)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ color: T.textMuted }}>From</span>
                    <span style={{ fontWeight: 600 }}>{currentPlan?.name || 'No plan'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ color: T.textMuted }}>To</span>
                    <span style={{ fontWeight: 600 }}>{selectedPlan?.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <span style={{ fontWeight: 800, fontFamily: 'DM Mono', fontSize: 18 }}>{fmt(selectedPlan?.price_monthly)}/mo</span>
                  </div>
                </>
              )}
            </div>
            <div style={{ background: T.warningLight, border: `1px solid #FDE68A`, borderRadius: 10, padding: '10px 14px', fontSize: 12, color: T.warning, marginBottom: 16 }}>
              💳 <strong>Mock mode</strong> — no real charge. This transaction will be recorded for when Stripe is connected.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep('choose')}>Back</button>
              <button className="btn btn-accent" style={{ flex: 2 }} disabled={processing} onClick={handleConfirm}>
                {processing ? 'Processing...' : `Confirm ${mode === 'pack' ? fmt(selectedPack?.price) : fmt(selectedPlan?.price_monthly)+'/mo'}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── COMPANY ADMIN PANEL ──────────────────────────────────────────────────────
function CompanyAdminPanel({ appData, auth }) {
  const [tab, setTab] = useState("team");
  const [contractors, setContractors] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selQuote, setSelQuote] = useState(null);
  const [addQuotesFor, setAddQuotesFor] = useState(null); // contractor object
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [us, qu, tx] = await Promise.all([
      supabase.from('profiles')
        .select('*')
        .eq('company_id', auth.companyId)
        .eq('role', 'contractor'),
      supabase.from('quotes').select('*').eq('company_id', auth.companyId).order('created_at', { ascending: false }),
      supabase.from('billing_transactions').select('*').eq('company_id', auth.companyId).order('created_at', { ascending: false }),
    ]);
    if (qu.data) setQuotes(qu.data);
    if (tx.data) setTransactions(tx.data);
    if (us.data && us.data.length > 0) {
      const userIds = us.data.map(u => u.id);
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('*, plans(*)')
        .in('user_id', userIds)
        .eq('status', 'active');
      const merged = us.data.map(u => ({
        ...u,
        subscriptions: subs ? subs.filter(s => s.user_id === u.id) : [],
      }));
      setContractors(merged);
    } else {
      setContractors([]);
    }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await supabase.from('quotes').update({ status }).eq('id', id);
    setQuotes(q => q.map(x => x.id === id ? { ...x, status } : x));
    setToast({ message: "Status updated ✓", type: "success" });
  };

  if (loading) return <div className="admin-shell"><LoadingScreen /></div>;

  const rev = quotes.filter(q => q.status === 'paid').reduce((s, q) => s + (q.total || 0), 0);
  const billingTotal = transactions.reduce((s, t) => s + (t.amount || 0), 0);

  return (
    <div className="admin-shell">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {addQuotesFor && (
        <AddQuotesModal
          contractor={addQuotesFor}
          companyId={auth.companyId}
          companyName={auth.company?.name}
          adminId={auth.user?.id}
          onClose={() => setAddQuotesFor(null)}
          onSuccess={() => { fetchAll(); setToast({ message: "Quotes updated ✓", type: "success" }); }}
        />
      )}

      <div className="admin-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div className="company-logo" style={{ width: 36, height: 36, fontSize: 16 }}>{auth.company?.name?.charAt(0)}</div>
            <div><div style={{ fontWeight: 800, fontSize: 18 }}>{auth.company?.name}</div><RoleBadge role="company_admin" /></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { label: "Contractors", value: contractors.length },
            { label: "Quotes", value: quotes.length },
            { label: "Revenue", value: fmt(rev) },
            { label: "Billing", value: fmt(billingTotal), highlight: true },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '8px 12px', background: s.highlight ? T.accentLight : T.surfaceAlt, borderRadius: 10, border: `1px solid ${s.highlight ? '#BFDBFE' : T.border}` }}>
              <div style={{ fontWeight: 800, fontSize: 16, fontFamily: 'DM Mono', color: s.highlight ? T.accent : T.text }}>{s.value}</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>{s.label}</div>
            </div>
          ))}
          <button className="btn btn-secondary btn-sm" onClick={auth.signOut}>Sign out</button>
        </div>
      </div>

      <div className="admin-nav">
        {[{ id: "team", label: "👥 My Team" }, { id: "quotes", label: "📋 Quotes" }, { id: "billing", label: "💳 Billing" }, { id: "catalog", label: "🪟 My Catalog" }].map(t => (
          <button key={t.id} className={`admin-nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* TEAM TAB */}
      {tab === "team" && (
        <div className="fade-up">
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>My Team</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Contractor</th><th>Plan</th><th>Quotes Used</th><th>Remaining</th><th>Last Activity</th><th>Actions</th></tr></thead>
              <tbody>
                {contractors.map(u => {
                  const s = u.subscriptions?.[0]; const p = s?.plans;
                  const hasPlan = !!p;
                  const used = s?.quotes_used || 0; const limit = p?.quote_limit ?? null;
                  const rem = limit === null ? '—' : limit === -1 ? '∞' : Math.max(0, limit - used);
                  const pct = limit && limit !== -1 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
                  const col = pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : 'ok';
                  const last = quotes.filter(q => q.created_by === u.id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
                  const isLow = hasPlan && rem !== '∞' && rem !== '—' && Number(rem) <= 3;
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="avatar" style={{ background: hasPlan ? T.accent : T.textLight }}>
                            {(u.full_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{u.full_name || 'No name'}</div>
                            {!hasPlan && <div style={{ fontSize: 11, color: T.danger }}>⚠ No plan — can't create quotes</div>}
                            {isLow && <div style={{ fontSize: 11, color: T.warning }}>⚠ Low on quotes</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        {hasPlan
                          ? <span className="badge badge-blue">{p.name}</span>
                          : <span className="badge badge-red">No Plan</span>
                        }
                      </td>
                      <td>
                        {hasPlan ? (
                          <>
                            <span className="mono" style={{ fontWeight: 600 }}>{used}</span>
                            {limit && limit !== -1 && <span style={{ color: T.textMuted }}> /{limit}</span>}
                            {limit && limit !== -1 && <div className="quota-bar" style={{ width: 80, marginTop: 4 }}><div className={`quota-fill ${col}`} style={{ width: `${pct}%` }} /></div>}
                          </>
                        ) : <span style={{ color: T.textMuted, fontSize: 13 }}>—</span>}
                      </td>
                      <td>
                        {hasPlan
                          ? <span className="mono" style={{ fontWeight: 700, color: rem === 0 ? T.danger : T.success }}>{rem}</span>
                          : <span style={{ color: T.textMuted }}>—</span>
                        }
                      </td>
                      <td style={{ color: T.textMuted, fontSize: 12 }}>
                        {last ? new Date(last.created_at).toLocaleDateString() : 'No activity'}
                      </td>
                      <td>
                        {!hasPlan ? (
                          // No plan → Assign Plan button (opens modal in upgrade mode)
                          <button className="btn btn-primary btn-sm" onClick={() => setAddQuotesFor({ ...u, _forceMode: 'upgrade' })}
                            style={{ fontSize: 12 }}>
                            🚀 Assign Plan
                          </button>
                        ) : (
                          // Has plan → Add Quotes button
                          <button className="btn btn-accent btn-sm" onClick={() => setAddQuotesFor(u)}
                            style={{ fontSize: 12 }}>
                            + Add Quotes
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {contractors.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: T.textMuted, padding: 32 }}>
                    No contractors yet. Ask your admin to add team members.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUOTES TAB */}
      {tab === "quotes" && (
        <div className="fade-up">
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>All Quotes</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Customer</th><th>Contractor</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {quotes.map(q => (
                  <tr key={q.id} className="clickable" onClick={() => setSelQuote(q)}>
                    <td><div style={{ fontWeight: 600 }}>{q.customer_name}</div><div style={{ fontSize: 11, color: T.textMuted }}>{q.customer_email}</div></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="avatar" style={{ background: T.accent, width: 24, height: 24, fontSize: 10 }}>{(q.created_by_name || 'U').charAt(0).toUpperCase()}</div>
                        <span style={{ fontSize: 13 }}>{q.created_by_name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td style={{ color: T.textMuted }}>{new Date(q.created_at).toLocaleDateString()}</td>
                    <td><span className="mono" style={{ fontWeight: 700 }}>{fmt(q.total)}</span></td>
                    <td><StatusBadge status={q.status} /></td>
                  </tr>
                ))}
                {quotes.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: T.textMuted, padding: 32 }}>No quotes yet</td></tr>}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: T.accent }}>Click any row to see full details</div>
          {selQuote && <QuoteDetailModal quote={selQuote} onClose={() => setSelQuote(null)} onStatusChange={async (id, status) => { await updateStatus(id, status); setSelQuote(q => ({ ...q, status })); }} />}
        </div>
      )}

      {/* BILLING TAB */}
      {tab === "billing" && (
        <div className="fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 18 }}>Billing History</h3>
            <div style={{ background: T.accentLight, border: `1px solid #BFDBFE`, borderRadius: 10, padding: '8px 14px' }}>
              <span style={{ fontSize: 12, color: T.textMuted }}>Total spent: </span>
              <span style={{ fontWeight: 800, fontFamily: 'DM Mono', color: T.accent }}>{fmt(billingTotal)}</span>
            </div>
          </div>
          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: T.textMuted }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>💳</div>
              <div style={{ fontWeight: 600 }}>No transactions yet</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Purchases will appear here</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Contractor</th><th>Type</th><th>Description</th><th>Quotes</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id}>
                      <td style={{ color: T.textMuted, fontSize: 12 }}>{new Date(t.created_at).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 600, fontSize: 13 }}>{t.contractor_name}</td>
                      <td>
                        <span className={`badge ${t.type === 'plan_upgrade' ? 'badge-purple' : 'badge-blue'}`}>
                          {t.type === 'plan_upgrade' ? '⬆️ Upgrade' : '🎁 Pack'}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: T.textMuted, maxWidth: 200 }}>{t.description}</td>
                      <td><span className="mono" style={{ fontWeight: 700, color: T.success }}>+{t.quotes_added}</span></td>
                      <td><span className="mono" style={{ fontWeight: 700 }}>{fmt(t.amount)}</span></td>
                      <td>
                        <span className={`badge ${t.status === 'paid' ? 'badge-green' : t.status === 'pending' ? 'badge-orange' : 'badge-red'}`}>
                          {t.payment_method === 'mock' ? '🔸 Mock' : t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="info-box" style={{ marginTop: 16 }}>
            <Icon name="info" size={14} />
            <span>Transactions marked <strong>🔸 Mock</strong> will be real Stripe charges once payments are connected.</span>
          </div>
        </div>
      )}

      {/* CATALOG TAB */}
      {tab === "catalog" && (
        <div className="fade-up">
          <div className="info-box" style={{ marginBottom: 20 }}>
            <Icon name="info" size={14} />
            <div><strong>Your custom catalog</strong> — products you add here override global products of the same name for your contractors only.</div>
          </div>
          <ProductsAdmin appData={appData} showToast={t => setToast({ message: t, type: "success" })} companyId={auth.companyId} companies={[]} />
        </div>
      )}
    </div>
  );
}

// ─── SUPER BILLING PANEL ──────────────────────────────────────────────────────
function SuperBillingPanel({ companyFilter }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let q = supabase.from('billing_transactions').select('*').order('created_at', { ascending: false });
      if (companyFilter) q = q.eq('company_id', companyFilter.id);
      const { data } = await q;
      if (data) setTransactions(data);
      setLoading(false);
    };
    fetch();
  }, [companyFilter?.id]);

  if (loading) return <LoadingScreen />;

  const totalRevenue = transactions.reduce((s, t) => s + (t.amount || 0), 0);
  const mockCount = transactions.filter(t => t.payment_method === 'mock').length;
  const realCount = transactions.filter(t => t.payment_method === 'stripe').length;

  // Group by company for summary
  const byCompany = transactions.reduce((acc, t) => {
    const key = t.company_name || 'Unknown';
    if (!acc[key]) acc[key] = { name: key, total: 0, count: 0 };
    acc[key].total += t.amount || 0;
    acc[key].count++;
    return acc;
  }, {});

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 18 }}>
          {companyFilter ? `${companyFilter.name} — Billing` : 'All Billing Transactions'}
        </h3>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Revenue', value: fmt(totalRevenue), color: T.accent, bg: T.accentLight },
          { label: 'Transactions', value: transactions.length, color: T.text, bg: T.surfaceAlt },
          { label: 'Mock (pending Stripe)', value: mockCount, color: T.warning, bg: T.warningLight },
          { label: 'Real Payments', value: realCount, color: T.success, bg: T.successLight },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '16px', border: `1px solid ${T.border}` }}>
            <div style={{ fontWeight: 800, fontSize: 24, fontFamily: 'DM Mono', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Company breakdown (only when not filtered) */}
      {!companyFilter && Object.keys(byCompany).length > 1 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>By Company</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {Object.values(byCompany).sort((a, b) => b.total - a.total).map(c => (
              <div key={c.name} style={{ background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: '10px 14px', minWidth: 140 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                <div style={{ fontWeight: 800, fontFamily: 'DM Mono', color: T.accent }}>{fmt(c.total)}</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{c.count} transactions</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: T.textMuted }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>💰</div>
          <div style={{ fontWeight: 600 }}>No transactions yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>They'll appear here as companies purchase quotes</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Company</th><th>Contractor</th><th>Type</th><th>Description</th><th>Quotes</th><th>Amount</th><th>Payment</th></tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td style={{ color: T.textMuted, fontSize: 12 }}>{new Date(t.created_at).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{t.company_name || '—'}</td>
                  <td style={{ fontSize: 13 }}>{t.contractor_name || '—'}</td>
                  <td><span className={`badge ${t.type === 'plan_upgrade' ? 'badge-purple' : 'badge-blue'}`}>{t.type === 'plan_upgrade' ? '⬆️ Upgrade' : '🎁 Pack'}</span></td>
                  <td style={{ fontSize: 12, color: T.textMuted, maxWidth: 200 }}>{t.description}</td>
                  <td><span className="mono" style={{ fontWeight: 700, color: T.success }}>+{t.quotes_added}</span></td>
                  <td><span className="mono" style={{ fontWeight: 800 }}>{fmt(t.amount)}</span></td>
                  <td>
                    <span className={`badge ${t.payment_method === 'stripe' ? 'badge-green' : 'badge-orange'}`}>
                      {t.payment_method === 'stripe' ? '✓ Stripe' : '🔸 Mock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mockCount > 0 && (
        <div className="info-box" style={{ marginTop: 16 }}>
          <Icon name="info" size={14} />
          <span><strong>{mockCount} mock transaction{mockCount > 1 ? 's' : ''}</strong> recorded. Once Stripe is connected, these will become real charges automatically.</span>
        </div>
      )}
    </div>
  );
}

// ─── PRODUCTS ADMIN ───────────────────────────────────────────────────────────
// companyId: if set, this admin can only manage their company's products
// companies: list of all companies (superadmin only, for the scope dropdown)
function ProductsAdmin({ appData, showToast, companyId = null, companies = [] }) {
  const { products, reload } = appData;
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'global' | company uuid

  const save = async (form) => {
    setSaving(true);
    const payload = {
      name: form.name,
      base_price: parseInt(form.base_price),
      // company_id: null = global; uuid = company-specific
      company_id: form.scope === 'global' ? null : (form.scope || companyId || null),
    };
    if (form.id) await supabase.from('products').update(payload).eq('id', form.id);
    else await supabase.from('products').insert({ ...payload, active: true });
    setSaving(false); setModal(null); showToast("Product saved ✓");
    if (reload) reload();
  };

  const deactivate = async (id) => {
    if (!confirm("Deactivate this product?")) return;
    await supabase.from('products').update({ active: false }).eq('id', id);
    showToast("Product deactivated");
    if (reload) reload();
  };

  // Filter display
  const visible = products.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'global') return !p.company_id;
    return p.company_id === filter;
  });

  const scopeLabel = (p) => {
    if (!p.company_id) return <span className="badge badge-gray">🌐 Global</span>;
    const co = companies.find(c => c.id === p.company_id);
    return <span className="badge badge-blue">🏢 {co?.name || 'Company'}</span>;
  };

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 18 }}>Products</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setModal({ name: '', base_price: '', scope: companyId || 'global' })}>
          <Icon name="plus" /> Add Product
        </button>
      </div>

      {/* Filter bar — only shown to superadmin (when companies list is passed) */}
      {companies.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {[{ id: 'all', label: 'All' }, { id: 'global', label: '🌐 Global' }, ...companies.map(c => ({ id: c.id, label: `🏢 ${c.name}` }))].map(f => (
            <button key={f.id} className={`pill ${filter === f.id ? 'selected' : ''}`} onClick={() => setFilter(f.id)} style={{ fontSize: 12, padding: '5px 12px' }}>
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Base Price</th>
              {companies.length > 0 && <th>Scope</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td><span className="mono">{fmt(p.base_price)}</span></td>
                {companies.length > 0 && <td>{scopeLabel(p)}</td>}
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setModal({ ...p, scope: p.company_id || 'global' })}>
                      <Icon name="edit" size={12} />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deactivate(p.id)}>
                      <Icon name="trash" size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: T.textMuted, padding: 32 }}>No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Info box explaining global vs company */}
      {companies.length > 0 && (
        <div className="info-box" style={{ marginTop: 16 }}>
          <Icon name="info" size={14} />
          <span><strong>Global</strong> products appear in every company's Wizard. <strong>Company</strong> products override globals of the same name for that company only.</span>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>{modal.id ? 'Edit' : 'Add'} Product</div>

            <div className="field">
              <label className="label">Product Name</label>
              <input className="input" placeholder="e.g. Triple Pane Premium" value={modal.name} onChange={e => setModal({ ...modal, name: e.target.value })} />
            </div>

            <div className="field">
              <label className="label">Base Price ($)</label>
              <input className="input" type="number" placeholder="350" value={modal.base_price} onChange={e => setModal({ ...modal, base_price: e.target.value })} />
            </div>

            {/* Scope selector — only for superadmin */}
            {companies.length > 0 && (
              <div className="field">
                <label className="label">Assign To</label>
                <select className="select" value={modal.scope || 'global'} onChange={e => setModal({ ...modal, scope: e.target.value })}>
                  <option value="global">🌐 Global (all companies)</option>
                  {companies.map(c => <option key={c.id} value={c.id}>🏢 {c.name}</option>)}
                </select>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>Global products appear for everyone. Company products only appear for that company's contractors.</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} disabled={saving || !modal.name || !modal.base_price} onClick={() => save(modal)}>
                {saving ? "Saving..." : <><Icon name="save" /> Save Product</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CITIES ADMIN ─────────────────────────────────────────────────────────────
function CitiesAdmin({ appData, showToast }) {
  const {cityRules}=appData;
  const [modal,setModal]=useState(null);const [saving,setSaving]=useState(false);
  const save=async(form)=>{
    setSaving(true);
    const payload={zip:form.zip,city:form.city,county:form.county,permit_required:!!form.permit_required,hurricane_zone:!!form.hurricane_zone,inspection_required:!!form.inspection_required,permit_cost:parseInt(form.permit_cost)||0};
    if(form.id)await supabase.from('city_rules').update(payload).eq('id',form.id);
    else await supabase.from('city_rules').insert(payload);
    setSaving(false);setModal(null);showToast("Saved ✓");
  };
  return(
    <div className="fade-up">
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
        <h3 style={{fontWeight:700,fontSize:18}}>City Rules</h3>
        <button className="btn btn-primary btn-sm" onClick={()=>setModal({zip:'',city:'',county:'',permit_required:false,hurricane_zone:false,inspection_required:false,permit_cost:0})}><Icon name="plus"/> Add ZIP</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ZIP</th><th>City</th><th>Permit</th><th>Hurricane</th><th>Permit $</th><th>Actions</th></tr></thead>
          <tbody>{cityRules.map(r=>(
            <tr key={r.id}>
              <td className="mono" style={{fontWeight:600}}>{r.zip}</td><td style={{fontWeight:500}}>{r.city}</td>
              <td>{r.permit_required?<span className="badge badge-red">Yes</span>:<span className="badge badge-gray">No</span>}</td>
              <td>{r.hurricane_zone?<span className="badge badge-orange">Yes</span>:<span className="badge badge-gray">No</span>}</td>
              <td className="mono">{fmt(r.permit_cost)}</td>
              <td><button className="btn btn-secondary btn-sm" onClick={()=>setModal({...r})}><Icon name="edit" size={12}/></button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal">
            <div style={{fontWeight:700,fontSize:17,marginBottom:16}}>{modal.id?'Edit':'Add'} City Rule</div>
            <div className="row">
              <div className="col field"><label className="label">ZIP</label><input className="input" value={modal.zip} onChange={e=>setModal({...modal,zip:e.target.value})}/></div>
              <div className="col field"><label className="label">City</label><input className="input" value={modal.city} onChange={e=>setModal({...modal,city:e.target.value})}/></div>
            </div>
            <div className="field"><label className="label">County</label><input className="input" value={modal.county||''} onChange={e=>setModal({...modal,county:e.target.value})}/></div>
            <div className="field"><label className="label">Permit Cost ($)</label><input className="input" type="number" value={modal.permit_cost} onChange={e=>setModal({...modal,permit_cost:e.target.value})}/></div>
            {[['permit_required','Permit Required'],['hurricane_zone','Hurricane Zone'],['inspection_required','Inspection Required']].map(([key,label])=>(
              <div key={key} className={`checkbox-row ${modal[key]?'checked':''}`} onClick={()=>setModal({...modal,[key]:!modal[key]})} style={{marginBottom:8}}>
                <div className={`checkbox-box ${modal[key]?'checked':''}`}>{modal[key]&&<Icon name="check" size={12}/>}</div>
                <div className="checkbox-label">{label}</div>
              </div>
            ))}
            <div style={{display:'flex',gap:10,marginTop:8}}>
              <button className="btn btn-secondary" style={{flex:1}} onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{flex:2}} disabled={saving} onClick={()=>save(modal)}>{saving?"...":<><Icon name="save"/> Save</>}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMPANY FORM ─────────────────────────────────────────────────────────────
function CompanyForm({ data, onSave, onClose, saving }) {
  const [form,setForm]=useState(data);
  return(
    <>
      <div className="field"><label className="label">Company Name</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="ABC Windows Inc."/></div>
      <div className="field"><label className="label">Phone</label><input className="input" value={form.phone||''} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="(305) 555-0100"/></div>
      <div className="field"><label className="label">Address</label><input className="input" value={form.address||''} onChange={e=>setForm({...form,address:e.target.value})} placeholder="123 Main St, Miami FL"/></div>
      <div style={{display:'flex',gap:10,marginTop:8}}>
        <button className="btn btn-secondary" style={{flex:1}} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{flex:2}} disabled={saving} onClick={()=>onSave(form)}>{saving?"...":<><Icon name="save"/> Save</>}</button>
      </div>
    </>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const auth = useAuth();
  // Contractors & company admins get filtered data; superadmin gets all
  const appData = useAppData(auth.isSuperAdmin ? null : auth.companyId);

  if (auth.loading) return <><style>{css}</style><LoadingScreen/></>;
  if (!auth.user) return <><style>{css}</style><LoginScreen onLogin={auth.signIn}/></>;

  if (auth.isContractor) return <><style>{css}</style><Wizard appData={appData} auth={auth}/></>;
  if (auth.isCompanyAdmin) return <><style>{css}</style><CompanyAdminPanel appData={appData} auth={auth}/></>;
  if (auth.isSuperAdmin) return <><style>{css}</style><SuperAdminPanel appData={appData} auth={auth}/></>;

  return <><style>{css}</style><Wizard appData={appData} auth={auth}/></>;
}
