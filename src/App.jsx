import { useState, useEffect, useRef, createContext, useContext } from "react";
import { supabase } from "./supabase";

// ─── i18n ─────────────────────────────────────────────────────────────────────
const LangContext = createContext({ lang: 'en', setLang: () => {} });
const useLang = () => useContext(LangContext);

const T18N = {
  signIn:           { en: 'Sign In',            es: 'Entrar' },
  signOut:          { en: 'Sign out',            es: 'Salir' },
  signingIn:        { en: 'Signing in...',       es: 'Entrando...' },
  out:              { en: 'Out',                 es: 'Salir' },
  cancel:           { en: 'Cancel',              es: 'Cancelar' },
  save:             { en: 'Save',                es: 'Guardar' },
  saving:           { en: 'Saving...',           es: 'Guardando...' },
  add:              { en: 'Add',                 es: 'Agregar' },
  edit:             { en: 'Edit',                es: 'Editar' },
  done:             { en: 'Done',                es: 'Listo' },
  back:             { en: 'Back',                es: 'Atrás' },
  continue:         { en: 'Continue',            es: 'Continuar' },
  loading:          { en: 'Loading...',          es: 'Cargando...' },
  noActivity:       { en: 'No activity',         es: 'Sin actividad' },
  actions:          { en: 'Actions',             es: 'Acciones' },
  status:           { en: 'Status',              es: 'Estado' },
  date:             { en: 'Date',                es: 'Fecha' },
  total:            { en: 'Total',               es: 'Total' },
  name:             { en: 'Name',                es: 'Nombre' },
  company:          { en: 'Company',             es: 'Empresa' },
  contractor:       { en: 'Contractor',          es: 'Contratista' },
  contractors:      { en: 'Contractors',         es: 'Contratistas' },
  language:         { en: 'Language',            es: 'Idioma' },
  required:         { en: 'Required',            es: 'Requerido' },
  noDataYet:        { en: 'No data yet',         es: 'Sin datos aún' },
  clickRow:         { en: 'Click any row to see full details', es: 'Haz clic en cualquier fila para ver detalles' },
  welcomeBack:      { en: 'Welcome back',        es: 'Bienvenido' },
  signInDesc:       { en: 'Sign in to access your account', es: 'Inicia sesión para acceder a tu cuenta' },
  email:            { en: 'Email',               es: 'Correo' },
  emailPH:          { en: 'you@company.com',     es: 'tu@empresa.com' },
  password:         { en: 'Password',            es: 'Contraseña' },
  invalidCreds:     { en: 'Invalid email or password.', es: 'Correo o contraseña incorrectos.' },
  enterCreds:       { en: 'Enter email and password.', es: 'Ingresa correo y contraseña.' },
  needAccess:       { en: 'Need access? Contact your administrator.', es: '¿Necesitas acceso? Contacta a tu administrador.' },
  step1Title:       { en: 'Your Information',    es: 'Tu Información' },
  step1Sub:         { en: "We'll use this to generate your personalized quote.", es: 'Usaremos esto para generar tu cotización personalizada.' },
  fullName:         { en: 'Full Name',           es: 'Nombre Completo' },
  fullNamePH:       { en: 'Jane Smith',          es: 'Ana García' },
  emailAddress:     { en: 'Email Address',       es: 'Correo Electrónico' },
  phoneNumber:      { en: 'Phone Number',        es: 'Teléfono' },
  phonePH:          { en: '(305) 555-0123',      es: '(305) 555-0123' },
  propertyAddr:     { en: 'Property Address',    es: 'Dirección del Inmueble' },
  addrPH:           { en: '123 Main Street',     es: 'Calle Principal 123' },
  zipCode:          { en: 'ZIP Code',            es: 'Código Postal' },
  step2Title:       { en: 'Windows',             es: 'Ventanas' },
  step2Sub:         { en: 'Configure each window for accurate pricing.', es: 'Configura cada ventana para un precio exacto.' },
  addWindow:        { en: 'Add Window',          es: 'Agregar Ventana' },
  scanPhoto:        { en: '📷 Scan Photo',        es: '📷 Escanear Foto' },
  analyzing:        { en: '🔍 Analyzing...',      es: '🔍 Analizando...' },
  scan:             { en: '📷 Scan',             es: '📷 Escanear' },
  aiDetected:       { en: '📷 AI detected:',     es: '📷 IA detectó:' },
  aiNoMatch:        { en: '⚠️ No exact match found', es: '⚠️ Sin coincidencia exacta' },
  aiNoMatchSub:     { en: 'AI detected', es: 'IA detectó' },
  aiNoMatchSub2:    { en: 'but no product matches. Choose the closest or set a custom price:', es: 'pero ningún producto coincide. Elige el más cercano o ingresa precio manual:' },
  aiSuggested:      { en: '✨ AI Suggested:', es: '✨ IA Sugirió:' },
  aiSuggestedBadge: { en: 'AI match', es: 'Match IA' },
  customPrice:      { en: 'Custom price ($)', es: 'Precio manual ($)' },
  customPriceHint:  { en: 'Enter a fixed price for this window', es: 'Ingresa un precio fijo para esta ventana' },
  customPriceActive:{ en: '✏️ Custom price active', es: '✏️ Precio manual activo' },
  aiNotes:          { en: '🤖 AI Scan Details', es: '🤖 Detalles del Escaneo IA' },
  aiRawDesc:        { en: 'AI description:', es: 'Descripción IA:' },
  aiScanned:        { en: '📷 AI Scanned', es: '📷 Escaneado por IA' },
  measureTip:       { en: '💡 Tip: place a dollar bill flat against the window frame before shooting for precise measurements.', es: '💡 Tip: coloca un billete de dólar plano sobre el marco antes de tomar la foto para medidas precisas.' },
  photo1Label:      { en: '📷 Photo 1 — Full Window', es: '📷 Foto 1 — Ventana Completa' },
  photo1Hint:       { en: 'Take a photo of the entire window from a distance.', es: 'Toma una foto de la ventana completa desde lejos.' },
  photo1Done:       { en: '✅ Window photo captured', es: '✅ Foto de ventana capturada' },
  photo2Label:      { en: '📏 Photo 2 — Close-up with Card', es: '📏 Foto 2 — Acercamiento con Tarjeta' },
  photo2Hint:       { en: 'Place a credit card flat against the frame and take a close-up. This lets AI calculate exact measurements.', es: 'Coloca una tarjeta de crédito plana sobre el marco y toma un acercamiento. Esto permite que la IA calcule medidas exactas.' },
  photo2Done:       { en: '✅ Reference photo captured — calculating precise measurements...', es: '✅ Foto de referencia capturada — calculando medidas precisas...' },
  photo2Skip:       { en: 'Skip — use estimate', es: 'Omitir — usar estimado' },
  takingPhoto2:     { en: '📏 Take close-up with card', es: '📏 Tomar acercamiento con tarjeta' },
  measuringPrecise: { en: '📐 Calculating precise measurements...', es: '📐 Calculando medidas precisas...' },
  preciseMeasured:  { en: '✅ Precise measurements calculated!', es: '✅ ¡Medidas precisas calculadas!' },
  refUsed:          { en: '📏 Measured using:', es: '📏 Medido usando:' },
  refEstimate:      { en: '📐 Estimated (no reference)', es: '📐 Estimado (sin referencia)' },
  confidence:       { en: 'Confidence:',         es: 'Confianza:' },
  windowType:       { en: 'Type',                es: 'Tipo' },
  material:         { en: 'Material',            es: 'Material' },
  color:            { en: 'Color',               es: 'Color' },
  glass:            { en: 'Glass',               es: 'Vidrio' },
  widthIn:          { en: 'Width"',              es: 'Ancho"' },
  heightIn:         { en: 'Height"',             es: 'Alto"' },
  qty:              { en: 'Qty',                 es: 'Cant.' },
  estimated:        { en: 'Estimated',           es: 'Estimado' },
  editWindow:       { en: 'Edit Window',         es: 'Editar Ventana' },
  newWindow:        { en: 'New Window',          es: 'Nueva Ventana' },
  addAtLeastOne:    { en: 'Add at least one window.', es: 'Agrega al menos una ventana.' },
  step3Title:       { en: 'Services',            es: 'Servicios' },
  step3Sub:         { en: 'Add any additional services to your project.', es: 'Agrega servicios adicionales a tu proyecto.' },
  rulesFor:         { en: 'Rules for',           es: 'Reglas para' },
  permitReq:        { en: '⚠ Permit Required',   es: '⚠ Permiso Requerido' },
  hurricaneZone:    { en: '🌀 Hurricane Zone',    es: '🌀 Zona de Huracanes' },
  inspectionNeeded: { en: '🔍 Inspection Needed', es: '🔍 Inspección Requerida' },
  standardZone:     { en: '✓ Standard zone',     es: '✓ Zona estándar' },
  perWindow:        { en: '/window',             es: '/ventana' },
  flat:             { en: 'flat',                es: 'fijo' },
  included:         { en: 'Included',            es: 'Incluido' },
  step4Title:       { en: 'Price Summary',       es: 'Resumen de Precio' },
  step4Sub:         { en: 'Review your quote breakdown.', es: 'Revisa el desglose de tu cotización.' },
  windows:          { en: 'Windows',             es: 'Ventanas' },
  tax:              { en: 'Tax',                 es: 'Impuesto' },
  downPayment:      { en: 'Down Payment',        es: 'Pago Inicial' },
  reviewQuote:      { en: 'Review Quote',        es: 'Revisar Cotización' },
  step5Title:       { en: 'Review & Confirm',    es: 'Revisar y Confirmar' },
  step5Sub:         { en: 'Verify everything looks correct.', es: 'Verifica que todo esté correcto.' },
  customer:         { en: 'Customer',            es: 'Cliente' },
  termsCheck:       { en: 'I agree to the Terms & Conditions', es: 'Acepto los Términos y Condiciones' },
  termsDesc:        { en: 'Accept service agreement, warranty, and payment schedule.', es: 'Acepto el contrato de servicio, garantía y calendario de pagos.' },
  generateContract: { en: 'Generate Contract',   es: 'Generar Contrato' },
  checking:         { en: 'Checking...',         es: 'Verificando...' },
  reviewContract:   { en: 'Review Contract',     es: 'Revisar Contrato' },
  reviewContractSub:{ en: 'Read carefully before signing.', es: 'Lee con atención antes de firmar.' },
  windowsUnits:     { en: 'units',               es: 'unidades' },
  services:         { en: 'Services',            es: 'Servicios' },
  contractTotal:    { en: 'Contract Total',      es: 'Total del Contrato' },
  balanceDue:       { en: 'Balance Due on Completion', es: 'Saldo al Terminar la Obra' },
  termsNote:        { en: 'By signing below, customer agrees to the terms of this installation contract, authorizes the down payment, and acknowledges the scope of work described above.', es: 'Al firmar, el cliente acepta los términos de este contrato de instalación, autoriza el pago inicial y reconoce el alcance del trabajo descrito.' },
  signContract:     { en: '✍️ Sign Contract',    es: '✍️ Firmar Contrato' },
  signTitle:        { en: 'Sign Contract',       es: 'Firmar Contrato' },
  signSub:          { en: 'Draw your signature to authorize the contract and deposit of', es: 'Dibuja tu firma para autorizar el contrato y depósito de' },
  signHint:         { en: 'Sign here with finger or mouse', es: 'Firma aquí con el dedo o el ratón' },
  clear:            { en: 'Clear',               es: 'Limpiar' },
  sigCaptured:      { en: '✅ Signature captured — proceed to payment', es: '✅ Firma capturada — procede al pago' },
  proceedPayment:   { en: 'Proceed to Payment →', es: 'Proceder al Pago →' },
  payDeposit:       { en: 'Pay Deposit',         es: 'Pagar Depósito' },
  payDepositSub:    { en: 'Contract signed ✅ — complete the down payment to confirm the project.', es: 'Contrato firmado ✅ — completa el pago inicial para confirmar el proyecto.' },
  confirmPayment:   { en: 'Confirm Payment',     es: 'Confirmar Pago' },
  processing:       { en: 'Processing...',       es: 'Procesando...' },
  paymentConfirmedTitle: { en: 'Payment Confirmed!', es: '¡Pago Confirmado!' },
  depositOf:        { en: 'Deposit of',          es: 'Depósito de' },
  received:         { en: 'received.',           es: 'recibido.' },
  paymentReceipt:   { en: 'PAYMENT RECEIPT',     es: 'RECIBO DE PAGO' },
  reference:        { en: 'Reference',           es: 'Referencia' },
  balanceDueComp:   { en: 'Balance Due on Completion', es: 'Saldo al Terminar' },
  customerSig:      { en: 'Customer Signature',  es: 'Firma del Cliente' },
  contractSentTo:   { en: 'Contract sent to',    es: 'Contrato enviado a' },
  pdf:              { en: 'PDF',                 es: 'PDF' },
  emailBtn:         { en: 'Email',               es: 'Email' },
  sending:          { en: '📤 Sending...',        es: '📤 Enviando...' },
  sent:             { en: '✅ Sent',             es: '✅ Enviado' },
  newQuote:         { en: '＋ New Quote',         es: '＋ Nueva Cotización' },
  failedSend:       { en: 'Failed to send. Check Resend configuration.', es: 'Error al enviar. Revisa la configuración de Resend.' },
  left:             { en: 'left',                es: 'restantes' },
  quoteLimitTitle:  { en: 'Quote Limit Reached', es: 'Límite de Cotizaciones Alcanzado' },
  quoteLimitMsg:    { en: "You've used all",     es: 'Has usado todas las' },
  quoteLimitMsg2:   { en: 'quotes in your',      es: 'cotizaciones de tu plan' },
  quoteLimitMsg3:   { en: 'plan.',               es: '.' },
  overageRate:      { en: 'Overage rate:',       es: 'Tarifa adicional:' },
  overageContact:   { en: 'Contact your admin to upgrade.', es: 'Contacta a tu admin para mejorar el plan.' },
  close:            { en: 'Close',               es: 'Cerrar' },
  quotes:           { en: 'Quotes',              es: 'Cotizaciones' },
  revenue:          { en: 'Revenue',             es: 'Ingresos' },
  billing:          { en: 'Billing',             es: 'Facturación' },
  plan:             { en: 'Plan',                es: 'Plan' },
  used:             { en: 'Used',                es: 'Usadas' },
  remaining:        { en: 'Remaining',           es: 'Restantes' },
  lastActivity:     { en: 'Last Activity',       es: 'Última Actividad' },
  noPlan:           { en: 'No Plan',             es: 'Sin Plan' },
  noPlanWarn:       { en: "⚠ No plan — can't create quotes", es: '⚠ Sin plan — no puede cotizar' },
  lowQuotes:        { en: '⚠ Low on quotes',     es: '⚠ Pocas cotizaciones' },
  assignPlan:       { en: '🚀 Assign Plan',       es: '🚀 Asignar Plan' },
  addQuotes:        { en: '+ Add Quotes',         es: '+ Agregar Cotizaciones' },
  resetPW:          { en: '🔑 Reset PW',          es: '🔑 Reset PW' },
  myTeam:           { en: '👥 My Team',           es: '👥 Mi Equipo' },
  allQuotesTab:     { en: '📋 Quotes',            es: '📋 Cotizaciones' },
  billingTab:       { en: '💳 Billing',           es: '💳 Facturación' },
  catalogTab:       { en: '🪟 My Catalog',        es: '🪟 Mi Catálogo' },
  dashboardTab:     { en: '📊 Dashboard',         es: '📊 Dashboard' },
  allQuotesTitle:   { en: 'All Quotes',           es: 'Todas las Cotizaciones' },
  billingHistory:   { en: 'Billing History',      es: 'Historial de Facturación' },
  totalSpent:       { en: 'Total spent:',         es: 'Total gastado:' },
  noTransactions:   { en: 'No transactions yet',  es: 'Sin transacciones aún' },
  purchasesHere:    { en: 'Purchases will appear here', es: 'Las compras aparecerán aquí' },
  mockWarning2:     { en: 'will be real Stripe charges once payments are connected.', es: 'serán cobros reales de Stripe cuando se conecte.' },
  customCatalog:    { en: 'Your custom catalog',  es: 'Tu catálogo personalizado' },
  customCatalogDesc:{ en: '— products you add here override global products of the same name for your contractors only.', es: '— los productos que agregues aquí reemplazan los globales del mismo nombre solo para tus contratistas.' },
  noContractors:    { en: 'No contractors yet. Ask your admin to add team members.', es: 'Sin contratistas aún. Pide a tu admin que agregue miembros.' },
  companies:        { en: 'Companies',           es: 'Empresas' },
  companiesTab:     { en: '🏢 Companies',         es: '🏢 Empresas' },
  contractorsTab:   { en: '👥 Contractors',       es: '👥 Contratistas' },
  quotesTab:        { en: '📋 Quotes',            es: '📋 Cotizaciones' },
  superBillingTab:  { en: '💰 Billing',           es: '💰 Facturación' },
  productsTab:      { en: '🪟 Products',          es: '🪟 Productos' },
  citiesTab:        { en: '🗺 Cities',            es: '🗺 Ciudades' },
  superAdminDesc:   { en: 'Super Admin — full system access', es: 'Super Admin — acceso total al sistema' },
  viewing:          { en: 'Viewing:',             es: 'Viendo:' },
  showAll:          { en: '✕ Show all',           es: '✕ Ver todo' },
  noCompanies:      { en: 'No companies yet. Add your first client.', es: 'Sin empresas aún. Agrega tu primer cliente.' },
  noContractorsYet: { en: 'No contractors yet',   es: 'Sin contratistas aún' },
  noQuotesYet:      { en: 'No quotes yet',        es: 'Sin cotizaciones aún' },
  addCompany:       { en: 'Add Company',          es: 'Agregar Empresa' },
  editCompany:      { en: 'Edit Company',         es: 'Editar Empresa' },
  companyName:      { en: 'Company Name',         es: 'Nombre de la Empresa' },
  phone:            { en: 'Phone',                es: 'Teléfono' },
  address:          { en: 'Address',              es: 'Dirección' },
  allContractors:   { en: 'All Contractors',      es: 'Todos los Contratistas' },
  role:             { en: 'Role',                 es: 'Rol' },
  assignPlanCol:    { en: 'Assign Plan',          es: 'Asignar Plan' },
  totalQuotes:      { en: 'Total Quotes',         es: 'Total Cotizaciones' },
  revenuePaid:      { en: 'Revenue (Paid)',        es: 'Ingresos (Pagadas)' },
  closeRate:        { en: 'Close Rate',           es: 'Tasa de Cierre' },
  avgQuoteValue:    { en: 'Avg Quote Value',       es: 'Valor Prom. Cotización' },
  activeContractors:{ en: 'Active Contractors',   es: 'Contratistas Activos' },
  monthlyTrend:     { en: '📅 Quotes per month (last 6 months)', es: '📅 Cotizaciones por mes (últimos 6 meses)' },
  contractorPerf:   { en: '👷 Performance by contractor', es: '👷 Rendimiento por contratista' },
  ranking:          { en: '🏆 Contractor Ranking', es: '🏆 Ranking de Contratistas' },
  signed:           { en: 'Signed',               es: 'Firmadas' },
  paid:             { en: 'Paid',                 es: 'Pagadas' },
  avgTicket:        { en: 'Avg Ticket',           es: 'Ticket Prom.' },
  avgTimeSign:      { en: 'Avg Time to Sign',     es: 'Tiempo Prom. a Firma' },
  noName:           { en: 'No name',              es: 'Sin nombre' },
  days:             { en: 'days',                 es: 'días' },
  detailQuotes:     { en: '📋 Quote Detail',       es: '📋 Detalle de Cotizaciones' },
  allContractorsF:  { en: '👷 All contractors',    es: '👷 Todos los contratistas' },
  allStatuses:      { en: '🏷 All statuses',       es: '🏷 Todos los estados' },
  allMonths:        { en: '📅 All months',         es: '📅 Todos los meses' },
  newestFirst:      { en: '↓ Newest',             es: '↓ Más reciente' },
  oldestFirst:      { en: '↑ Oldest',             es: '↑ Más antiguo' },
  highestValue:     { en: '↓ Highest value',       es: '↓ Mayor valor' },
  lowestValue:      { en: '↑ Lowest value',        es: '↑ Menor valor' },
  deposit:          { en: 'Deposit',              es: 'Depósito' },
  daysSinceCol:     { en: 'Days since quote',     es: 'Días desde cotiz.' },
  noQuotesFilter:   { en: 'No quotes match these filters', es: 'Sin cotizaciones con estos filtros' },
  quotesCount:      { en: 'quotes · Total:',      es: 'cotizaciones · Total:' },
  resetPWTitle:     { en: '🔑 Reset Password',    es: '🔑 Restablecer Contraseña' },
  resetPWMsg:       { en: 'A password reset email will be sent to', es: 'Se enviará un correo de restablecimiento a' },
  resetPWMsg2:      { en: 'The contractor will receive a link to set a new password.', es: 'El contratista recibirá un enlace para establecer una nueva contraseña.' },
  resetEmailSent:   { en: '✅ Reset email sent to', es: '✅ Correo enviado a' },
  sendResetEmail:   { en: '📧 Send Reset Email',   es: '📧 Enviar Correo de Reset' },
  sending2:         { en: 'Sending...',            es: 'Enviando...' },
  editNameTitle:    { en: 'Edit Contractor Name',  es: 'Editar Nombre del Contratista' },
  products:         { en: 'Products',             es: 'Productos' },
  addProduct:       { en: 'Add Product',          es: 'Agregar Producto' },
  productName:      { en: 'Product Name',         es: 'Nombre del Producto' },
  basePrice:        { en: 'Base Price ($)',        es: 'Precio Base ($)' },
  scopeLabel:       { en: 'Assign To',            es: 'Asignar A' },
  globalScope:      { en: '🌐 Global (all companies)', es: '🌐 Global (todas las empresas)' },
  deactivateConfirm:{ en: 'Deactivate this product?', es: '¿Desactivar este producto?' },
  noProducts:       { en: 'No products found',    es: 'Sin productos' },
  globalDesc:       { en: "Global products appear in every company's Wizard. Company products override globals of the same name for that company only.", es: 'Los productos globales aparecen en el Wizard de todas las empresas. Los de empresa reemplazan los globales del mismo nombre solo para esa empresa.' },
  editProduct:      { en: 'Edit Product',         es: 'Editar Producto' },
  scopeHint:        { en: "Global products appear for everyone. Company products only appear for that company's contractors.", es: 'Los productos globales aparecen para todos. Los de empresa solo para los contratistas de esa empresa.' },
  cityRules:        { en: 'City Rules',           es: 'Reglas de Ciudad' },
  addZip:           { en: 'Add ZIP',              es: 'Agregar ZIP' },
  zip:              { en: 'ZIP',                  es: 'ZIP' },
  city:             { en: 'City',                 es: 'Ciudad' },
  permit:           { en: 'Permit',               es: 'Permiso' },
  hurricane:        { en: 'Hurricane',            es: 'Huracán' },
  permitCost:       { en: 'Permit $',             es: 'Costo Permiso $' },
  county:           { en: 'County',               es: 'Condado' },
  permitRequired:   { en: 'Permit Required',      es: 'Permiso Requerido' },
  hurricaneZoneChk: { en: 'Hurricane Zone',       es: 'Zona de Huracanes' },
  inspectionReq:    { en: 'Inspection Required',  es: 'Inspección Requerida' },
  editCityRule:     { en: 'Edit City Rule',        es: 'Editar Regla de Ciudad' },
  addCityRule:      { en: 'Add City Rule',         es: 'Agregar Regla de Ciudad' },
  totalRevenue:     { en: 'Total Revenue',         es: 'Ingresos Totales' },
  transactions:     { en: 'Transactions',          es: 'Transacciones' },
  mockPending:      { en: 'Mock (pending Stripe)', es: 'Mock (pendiente Stripe)' },
  realPayments:     { en: 'Real Payments',         es: 'Pagos Reales' },
  byCompany:        { en: 'By Company',            es: 'Por Empresa' },
  theyAppear:       { en: "They'll appear here as companies purchase quotes", es: 'Aparecerán aquí cuando las empresas compren cotizaciones' },
  mockOnce:         { en: 'recorded. Once Stripe is connected, these will become real charges automatically.', es: 'registradas. Cuando Stripe esté conectado, se convertirán en cobros reales automáticamente.' },
  mockCount:        { en: 'mock transaction',  es: 'transacción mock' },
  mockCountP:       { en: 'mock transactions', es: 'transacciones mock' },
  addQuotesFor:     { en: 'Add Quotes for',        es: 'Agregar Cotizaciones para' },
  buyPack:          { en: '🎁 Buy Quote Pack',      es: '🎁 Comprar Paquete' },
  upgradePlan:      { en: '⬆️ Upgrade Plan',        es: '⬆️ Mejorar Plan' },
  choosePack:       { en: 'Choose a Pack',          es: 'Elige un Paquete' },
  quotesWord:       { en: 'quotes',                 es: 'cotizaciones' },
  upgradeTo:        { en: 'Upgrade To',             es: 'Mejorar A' },
  alreadyHighest:   { en: '✓ Already on the highest plan (Enterprise)', es: '✓ Ya está en el plan más alto (Enterprise)' },
  noHigherPlans:    { en: 'No higher plans available.', es: 'No hay planes superiores disponibles.' },
  unlimited:        { en: 'Unlimited',              es: 'Ilimitadas' },
  reviewConfirm:    { en: 'Review & Confirm →',     es: 'Revisar y Confirmar →' },
  confirmPurchase:  { en: 'Confirm Purchase',        es: 'Confirmar Compra' },
  from:             { en: 'From',                   es: 'Desde' },
  to:               { en: 'To',                     es: 'Hasta' },
  mockMode:         { en: '💳 Mock mode — no real charge. This transaction will be recorded for when Stripe is connected.', es: '💳 Modo mock — sin cobro real. Esta transacción se registrará para cuando Stripe esté conectado.' },
  packAdded:        { en: 'Quotes Added!',           es: '¡Cotizaciones Agregadas!' },
  planUpgraded:     { en: 'Plan Upgraded!',          es: '¡Plan Mejorado!' },
  canCreateMore:    { en: 'can now create more quotes.', es: 'ahora puede crear más cotizaciones.' },
  mockPayment:      { en: '💳 Mock payment',          es: '💳 Pago mock' },
  recorded:         { en: 'recorded. Connect Stripe to charge real cards.', es: 'registrado. Conecta Stripe para cobrar tarjetas reales.' },
};

const t = (key, lang) => T18N[key]?.[lang] ?? T18N[key]?.en ?? key;


// ─── CONFIG ───────────────────────────────────────────────────────────────────
const RESEND_KEY = import.meta.env.VITE_RESEND_KEY;
const RESEND_FROM = "WindowQuote <onboarding@resend.dev>";
const ANTHROPIC_MODEL = "claude-opus-4-20250514";

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
  const map = {
    draft: "badge-gray", finalized: "badge-blue",
    pending: "badge-orange", sent: "badge-blue",
    signed: "badge-purple", paid: "badge-green", cancelled: "badge-red"
  };
  return <span className={`badge ${map[status]||"badge-gray"}`}>{status?.charAt(0).toUpperCase()+status?.slice(1)}</span>;
};
const RoleBadge = ({ role }) => {
  const map = { superadmin:"badge-purple", company_admin:"badge-blue", contractor:"badge-gray" };
  const labels = { superadmin:"Super Admin", company_admin:"Company Admin", contractor:"Contractor" };
  return <span className={`badge ${map[role]||"badge-gray"}`}>{labels[role]||role}</span>;
};

// ─── LOADING / TOAST ──────────────────────────────────────────────────────────
const LoadingScreen = () => { const { lang } = useLang(); return <div className="loading"><div className="spinner" style={{width:32,height:32}}/><span>{t('loading', lang)}</span></div>; };

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
    // If contractor set a custom price (manual override after AI no-match)
    if (w._customPrice && Number(w._customPrice) > 0) return Math.round(Number(w._customPrice) * (w.qty || 1));
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
      supabase.from('subscriptions').select('*,plans(*)').eq('user_id',userId).eq('status','active').limit(1).maybeSingle(),
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

// ─── LANG TOGGLE ─────────────────────────────────────────────────────────────
function LangToggle({ style = {} }) {
  const { lang, setLang } = useLang();
  return (
    <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.06)', borderRadius: 20, padding: 3, gap: 2, ...style }}>
      {['en', 'es'].map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          padding: '4px 12px', borderRadius: 16, border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
          background: lang === l ? '#1A1A1A' : 'transparent',
          color: lang === l ? 'white' : '#6B6863',
          transition: 'all 0.15s',
        }}>
          {l === 'en' ? '🇺🇸 EN' : '🇪🇸 ES'}
        </button>
      ))}
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const { lang } = useLang();
  const [email,setEmail] = useState('');
  const [pw,setPw] = useState('');
  const [busy,setBusy] = useState(false);
  const [err,setErr] = useState('');

  const go = async () => {
    if(!email||!pw){setErr(t('enterCreds',lang));return;}
    setBusy(true); setErr('');
    const e = await onLogin(email,pw);
    if(e) setErr(t('invalidCreds',lang));
    setBusy(false);
  };

  return (
    <div className="login-shell">
      <div className="login-card fade-up">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div className="logo-icon" style={{width:40,height:40,fontSize:18}}><Icon name="window" size={20}/></div>
            <div><div style={{fontWeight:800,fontSize:17}}>WindowQuote</div><div style={{fontSize:12,color:T.textMuted}}>Professional quoting platform</div></div>
          </div>
          <LangToggle/>
        </div>
        <div style={{fontWeight:700,fontSize:22,letterSpacing:-0.5,marginBottom:4}}>{t('welcomeBack',lang)}</div>
        <div style={{fontSize:13,color:T.textMuted,marginBottom:24}}>{t('signInDesc',lang)}</div>
        {err&&<div style={{background:T.dangerLight,border:'1px solid #FCA5A5',borderRadius:10,padding:'10px 14px',fontSize:13,color:T.danger,marginBottom:16}}>{err}</div>}
        <div className="field"><label className="label">{t('email',lang)}</label><input className="input" type="email" placeholder={t('emailPH',lang)} value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()}/></div>
        <div className="field"><label className="label">{t('password',lang)}</label><input className="input" type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()}/></div>
        <button className="btn btn-primary btn-full" style={{marginTop:8}} disabled={busy} onClick={go}>{busy?t('signingIn',lang):t('signIn',lang)}</button>
        <div style={{textAlign:'center',marginTop:20,fontSize:12,color:T.textLight}}>{t('needAccess',lang)}</div>
      </div>
    </div>
  );
}

// ─── QUOTA BADGE ──────────────────────────────────────────────────────────────
function QuotaBadge({ sub, plan, pct, color }) {
  const { lang } = useLang();
  if (!sub||!plan) return null;
  const rem = plan.quote_limit===-1?'∞':Math.max(0,plan.quote_limit-(sub.quotes_used||0));
  const low = pct()>=80;
  return (
    <div style={{display:'flex',alignItems:'center',gap:6,padding:'5px 10px',background:low?T.dangerLight:T.surfaceAlt,borderRadius:8,border:`1px solid ${low?'#FCA5A5':T.border}`}}>
      <span style={{fontSize:12,fontWeight:700,color:low?T.danger:T.text}}>{rem}</span>
      <span style={{fontSize:11,color:T.textMuted}}>{t('left',lang)}</span>
      <div style={{width:32,height:4,background:T.border,borderRadius:2,overflow:'hidden'}}>
        <div className={`quota-fill ${color()}`} style={{width:`${pct()}%`,height:'100%'}}/>
      </div>
    </div>
  );
}

// ─── NO QUOTA MODAL ───────────────────────────────────────────────────────────
function NoQuotaModal({ plan, onClose }) {
  const { lang } = useLang();
  return (
    <div className="modal-overlay">
      <div className="modal" style={{textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>🚫</div>
        <h2 style={{fontWeight:800,fontSize:20,marginBottom:8}}>{t('quoteLimitTitle',lang)}</h2>
        <p style={{fontSize:14,color:T.textMuted,marginBottom:20}}>{t('quoteLimitMsg',lang)} <strong>{plan?.quote_limit}</strong> {t('quoteLimitMsg2',lang)} <strong>{plan?.name}</strong>{t('quoteLimitMsg3',lang)}</p>
        {plan?.overage_price>0&&<div className="info-box"><Icon name="info" size={15}/><span>{t('overageRate',lang)} <strong>${plan.overage_price}/quote</strong>. {t('overageContact',lang)}</span></div>}
        <button className="btn btn-secondary btn-full" onClick={onClose}>{t('close',lang)}</button>
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
        {/* ── AI Scan Notes (admin only) ── */}
        {(quote.ai_notes?.length > 0) && (
          <div className="card-sm" style={{marginBottom:10,background:'#EFF6FF',border:'1px solid #BFDBFE'}}>
            <div style={{fontWeight:700,fontSize:11,textTransform:'uppercase',letterSpacing:'0.5px',color:'#1D4ED8',marginBottom:8}}>🤖 AI Scan Details</div>
            {quote.ai_notes.map((a,i)=>(
              <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'8px 0',borderBottom:i<quote.ai_notes.length-1?`1px solid #BFDBFE`:'none'}}>
                {a.photo_url ? (
                  <a href={a.photo_url} target="_blank" rel="noopener noreferrer" title="View full photo">
                    <img
                      src={a.photo_url}
                      alt={`Window ${i+1} scan`}
                      style={{width:64,height:64,objectFit:'cover',borderRadius:8,flexShrink:0,border:'2px solid #BFDBFE',cursor:'pointer',transition:'opacity 0.15s'}}
                      onMouseOver={e=>e.target.style.opacity='0.8'}
                      onMouseOut={e=>e.target.style.opacity='1'}
                    />
                  </a>
                ) : (
                  <div style={{width:64,height:64,borderRadius:8,background:'#DBEAFE',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>📷</div>
                )}
                <div style={{flex:1,fontSize:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginBottom:4}}>
                    <span style={{fontWeight:700,color:'#1D4ED8'}}>Window {i+1}</span>
                    {a.confidence && <span className="badge badge-blue" style={{fontSize:10}}>confidence: {a.confidence}</span>}
                    {a.measured_with_reference && <span className="badge badge-green" style={{fontSize:10}}>📏 {a.reference_object}</span>}
                    {a.measured_with_reference === false && <span className="badge badge-gray" style={{fontSize:10}}>📐 estimated</span>}
                    {a.no_match && <span className="badge badge-red" style={{fontSize:10}}>⚠ No match</span>}
                    {a.custom_price && <span className="badge badge-orange" style={{fontSize:10}}>✏ Manual: ${a.custom_price}</span>}
                    {!a.no_match && <span className="badge badge-green" style={{fontSize:10}}>✓ Matched → {a.window_type_selected}</span>}
                  </div>
                  <div style={{color:'#1D4ED8',marginBottom:2}}>AI detected: <strong>"{a.ai_detected}"</strong></div>
                  {a.notes && <div style={{color:'#6B7280',fontStyle:'italic'}}>"{a.notes}"</div>}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <span style={{fontSize:13,color:T.textMuted}}>Status:</span>
          <select className="select" style={{fontSize:13}} value={quote.status} onChange={e=>onStatusChange(quote.id,e.target.value)}>
            {['draft','pending','sent','finalized','signed','paid','cancelled'].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

// ─── WIZARD STEPS ─────────────────────────────────────────────────────────────
function Step1({ data, onChange, errors }) {
  const { lang } = useLang();
  const fields = [
    {key:"name",   label:t('fullName',lang),    placeholder:t('fullNamePH',lang), type:"text"},
    {key:"email",  label:t('emailAddress',lang), placeholder:t('emailPH',lang),   type:"email"},
    {key:"phone",  label:t('phoneNumber',lang),  placeholder:t('phonePH',lang),   type:"tel"},
    {key:"address",label:t('propertyAddr',lang), placeholder:t('addrPH',lang),    type:"text"},
    {key:"zip",    label:t('zipCode',lang),       placeholder:"33101",             type:"text"},
  ];
  return (
    <div className="step-content fade-up">
      <h2 className="step-title">{t('step1Title',lang)}</h2>
      <p className="step-subtitle">{t('step1Sub',lang)}</p>
      {fields.map(f=>(
        <div className="field" key={f.key}>
          <label className="label">{f.label}</label>
          <input className={`input ${errors[f.key]?'error':''}`} type={f.type} placeholder={f.placeholder} value={data[f.key]||""} onChange={e=>onChange(f.key,e.target.value)}/>
          {errors[f.key]&&<div style={{fontSize:11,color:T.danger,marginTop:4}}>{t('required',lang)}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── AI WINDOW SCANNER ───────────────────────────────────────────────────────
const EDGE_URL = "https://sjffssxyieeearvoiqjz.supabase.co/functions/v1/window-ai";
const EDGE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZmZzc3h5aWVlZWFydm9pcWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NTI0OTUsImV4cCI6MjA1NzIyODQ5NX0.LPKs_mwFMnMfDdQHMSuNbdCl1bOHRTaFWfNxHPZzabk";

async function analyzeWindowPhoto(base64Image, products) {
  try {
    const response = await fetch(EDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${EDGE_ANON}` },
      body: JSON.stringify({ action: "scan", image: base64Image, products: products.map(p => p.name) }),
    });
    const text = await response.text();
    console.log("Edge scan response:", response.status, text);
    if (!response.ok) return null;
    return JSON.parse(text);
  } catch(e) { console.error("Edge scan error:", e); return null; }
}


// ─── FUZZY PRODUCT MATCH ─────────────────────────────────────────────────────
// Returns { exact, best, score } where score 0-1 (1=perfect)
function fuzzyMatch(aiType, products) {
  if (!aiType || !products.length) return { exact: null, best: products[0], score: 0 };
  const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const q = normalize(aiType);
  let best = null, bestScore = 0;
  for (const p of products) {
    const n = normalize(p.name);
    // Exact match
    if (n === q) return { exact: p, best: p, score: 1 };
    // Contains match (either direction)
    let score = 0;
    if (n.includes(q) || q.includes(n)) score = 0.85;
    // Token overlap
    const qTokens = q.split('');
    const nTokens = n.split('');
    const overlap = qTokens.filter(tok => tok.length > 2 && nTokens.some(nt => nt.includes(tok) || tok.includes(nt)));
    if (overlap.length > 0) score = Math.max(score, 0.5 + (overlap.length / Math.max(qTokens.length, nTokens.length)) * 0.4);
    if (score > bestScore) { bestScore = score; best = p; }
  }
  // Threshold: >=0.5 is a usable suggestion, <0.5 = no confident match
  return { exact: bestScore === 1 ? best : null, best, score: bestScore };
}


// ─── PHOTO COMPRESSION + UPLOAD ──────────────────────────────────────────────
// Compress image to max 800px wide, JPEG 72% quality → ~150-250KB
async function compressPhoto(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 800;
      let w = img.width, h = img.height;
      if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.72);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

// Upload compressed photo to Supabase Storage, return public URL
async function uploadScanPhoto(file, quoteRef) {
  try {
    const compressed = await compressPhoto(file);
    if (!compressed) return null;
    const path = `scans/${quoteRef}_${Date.now()}.jpg`;
    const { error } = await supabase.storage
      .from('quote-photos')
      .upload(path, compressed, { contentType: 'image/jpeg', upsert: false });
    if (error) { console.error('Upload error:', error); return null; }
    const { data } = supabase.storage.from('quote-photos').getPublicUrl(path);
    return data.publicUrl;
  } catch(e) { console.error('Photo upload failed:', e); return null; }
}

// ─── PDF GENERATOR ────────────────────────────────────────────────────────────
function generateContractHTML({ customer, windows, serviceLines, total, downPct, company, contractorName, date, signatureData, paymentConfirmed, paymentRef, paymentAmt }) {
  const downAmt = paymentAmt || Math.round(total * downPct / 100);
  const balance = total - downAmt;
  const windowRows = windows.map(w => `
    <tr>
      <td>${w.qty}x ${w.type}</td>
      <td>${w.material} / ${w.color} / ${w.glass}</td>
      <td>${w.width}" × ${w.height}"</td>
    </tr>`).join('');
  const serviceRows = serviceLines.map(s => `
    <tr><td>${s.label}</td><td style="text-align:right">$${s.amount.toLocaleString()}</td></tr>`).join('');

  const paymentBanner = paymentConfirmed ? `
  <div style="background:#f0fdf4;border:2px solid #16a34a;border-radius:8px;padding:16px 20px;margin:24px 0;">
    <div style="font-size:15px;font-weight:800;color:#16a34a;margin-bottom:8px">✅ PAYMENT CONFIRMED</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;">
      <div><span style="color:#666">Reference:</span> <strong style="font-family:monospace">${paymentRef}</strong></div>
      <div><span style="color:#666">Date:</span> <strong>${date}</strong></div>
      <div><span style="color:#666">Amount Paid:</span> <strong style="color:#16a34a">$${downAmt.toLocaleString()} (${downPct}% down)</strong></div>
      <div><span style="color:#666">Balance Due:</span> <strong>$${balance.toLocaleString()}</strong></div>
    </div>
  </div>` : '';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; font-size: 13px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #1a1a1a; }
  .company-name { font-size: 22px; font-weight: 800; }
  .company-info { font-size: 12px; color: #666; margin-top: 4px; }
  .contract-title { font-size: 18px; font-weight: 700; text-align: right; }
  .contract-date { font-size: 12px; color: #666; text-align: right; margin-top: 4px; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .info-item label { font-size: 11px; color: #888; display: block; }
  .info-item span { font-weight: 600; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #f5f5f5; padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 8px 10px; border-bottom: 1px solid #eee; }
  .totals { margin-left: auto; width: 260px; margin-top: 16px; }
  .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
  .total-row.grand { font-weight: 800; font-size: 16px; border-top: 2px solid #1a1a1a; padding-top: 10px; margin-top: 4px; }
  .total-row.down { color: #16a34a; font-weight: 700; }
  .signature-section { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
  .sig-line { border-top: 1px solid #1a1a1a; padding-top: 8px; font-size: 11px; color: #666; margin-top: 8px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company-name">${company?.name || 'WindowQuote'}</div>
      <div class="company-info">${company?.phone || ''} ${company?.address ? '· ' + company.address : ''}</div>
      <div class="company-info">Prepared by: ${contractorName}</div>
    </div>
    <div>
      <div class="contract-title">INSTALLATION CONTRACT</div>
      <div class="contract-date">Date: ${date}</div>
      <div class="contract-date">Contract #: WQ-${Date.now().toString().slice(-6)}</div>
    </div>
  </div>

  ${paymentBanner}

  <div class="section">
    <div class="section-title">Customer Information</div>
    <div class="info-grid">
      <div class="info-item"><label>Name</label><span>${customer.name}</span></div>
      <div class="info-item"><label>Email</label><span>${customer.email}</span></div>
      <div class="info-item"><label>Phone</label><span>${customer.phone}</span></div>
      <div class="info-item"><label>Property Address</label><span>${customer.address}, ${customer.zip}</span></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Window Specifications</div>
    <table>
      <thead><tr><th>Type</th><th>Specs</th><th>Dimensions</th></tr></thead>
      <tbody>${windowRows}</tbody>
    </table>
  </div>

  ${serviceLines.length > 0 ? `
  <div class="section">
    <div class="section-title">Services</div>
    <table><tbody>${serviceRows}</tbody></table>
  </div>` : ''}

  <div class="totals">
    <div class="total-row grand"><span>Contract Total</span><span>$${total.toLocaleString()}</span></div>
    <div class="total-row down"><span>Down Payment (${downPct}%)</span><span>$${downAmt.toLocaleString()}</span></div>
    <div class="total-row"><span>Balance Due on Completion</span><span>$${balance.toLocaleString()}</span></div>
  </div>

  <div class="signature-section">
    <div>
      ${signatureData ? `<img src="${signatureData}" style="max-width:220px;max-height:70px;display:block"/>` : '<div style="height:70px"></div>'}
      <div class="sig-line">Customer: ${customer.name} · ${date}</div>
    </div>
    <div>
      <div style="height:70px"></div>
      <div class="sig-line">Contractor: ${contractorName}</div>
    </div>
  </div>

  <div class="footer">
    This contract is binding upon signature. Work commences upon receipt of down payment.<br>
    Generated by WindowQuote · ${company?.name || ''}
  </div>
</body>
</html>`;
}

// ─── EMAIL SENDER ─────────────────────────────────────────────────────────────
async function sendContractEmail({ to, customerName, contractHTML, company }) {
  try {
    const response = await fetch(EDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${EDGE_ANON}` },
      body: JSON.stringify({ action: "email", to, customerName, contractHTML, companyName: company?.name || 'WindowQuote' }),
    });
    const text = await response.text();
    console.log("Edge email response:", response.status, text);
    if (!response.ok) return false;
    return JSON.parse(text).ok === true;
  } catch(e) { console.error("Edge email error:", e); return false; }
}

// ─── RESET PASSWORD MODAL ─────────────────────────────────────────────────────
function ResetPasswordModal({ contractor, onClose, onSuccess }) {
  const { lang } = useLang();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const email = contractor.email || contractor.user_email || '';

  const send = async () => {
    setSending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setSending(false);
    if (!error) { setSent(true); setTimeout(() => { onSuccess(); onClose(); }, 1500); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth:360}}>
        <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>{t('resetPWTitle',lang)}</div>
        <p style={{fontSize:13,color:T.textMuted,marginBottom:16}}>
          {t('resetPWMsg',lang)} <strong>{email}</strong>.<br/>
          {t('resetPWMsg2',lang)}
        </p>
        {sent && (
          <div style={{background:T.successLight,border:`1px solid #BBF7D0`,borderRadius:10,padding:'10px 14px',marginBottom:12,fontSize:13,color:T.success}}>
            {t('resetEmailSent',lang)} {email}
          </div>
        )}
        <div style={{display:'flex',gap:10}}>
          <button className="btn btn-secondary" style={{flex:1}} onClick={onClose}>{t('cancel',lang)}</button>
          <button className="btn btn-primary" style={{flex:2}} disabled={sending||sent} onClick={send}>
            {sending ? t('sending2',lang) : sent ? t('sent',lang) : t('sendResetEmail',lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EDIT CONTRACTOR NAME MODAL ───────────────────────────────────────────────
function EditNameModal({ contractor, onClose, onSave }) {
  const { lang } = useLang();
  const [name, setName] = useState(contractor.full_name || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await supabase.from('profiles').update({ full_name: name.trim() }).eq('id', contractor.id);
    setSaving(false);
    onSave(contractor.id, name.trim());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 360 }}>
        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>{t('editNameTitle',lang)}</div>
        <div className="field">
          <label className="label">Full Name</label>
          <input className="input" value={name} onChange={e => setName(e.target.value)}
            placeholder="John Smith" onKeyDown={e => e.key === 'Enter' && save()} autoFocus />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>{t('cancel',lang)}</button>
          <button className="btn btn-primary" style={{ flex: 2 }} disabled={saving || !name.trim()} onClick={save}>
            {saving ? t('saving',lang) : <><Icon name="save" /> {t('save',lang)}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
function Step2({ windows, setWindows, products, matMult, colMult, glsMult, calcPrice }) {
  const { lang } = useLang();
  const mats = Object.keys(matMult);
  const cols = Object.keys(colMult);
  const gls = Object.keys(glsMult);
  const empty = {type:products[0]?.name||'',material:mats[0]||'Vinyl',color:cols[0]||'White',glass:gls[0]||'Standard',width:36,height:48,qty:1};
  const [form,setForm] = useState(empty);
  const [editIdx,setEditIdx] = useState(null);
  const [show,setShow] = useState(false);
  const [scanning,setScanning] = useState(false);
  const [scanResult,setScanResult] = useState(null);
  const [scanNoMatch,setScanNoMatch] = useState(false);
  const [scanPhotoUrl,setScanPhotoUrl] = useState(null);
  const [uploading,setUploading] = useState(false);
  const fileRef = useRef(null);

  const add = () => {
    if(!form.type) return;
    // Persist AI scan metadata so admin can see what IA detected vs what was selected
    const aiMeta = (form._aiRawType || (scanResult && scanResult.type)) ? {
      ai_raw_type: form._aiRawType || scanResult?.type,
      ai_confidence: form._aiConfidence || scanResult?.confidence,
      ai_notes: scanResult?.notes || null,
      ai_no_match: !!form._aiNoMatch,
      ai_custom_price: form._customPrice ? Number(form._customPrice) : null,
      ai_photo_url: form._photoUrl || scanPhotoUrl || null,
      ai_measured_with_ref: scanResult?.measured_with_reference || false,
      ai_reference_object: scanResult?.reference_object || null,
    } : {};
    const windowData = {...form, ...aiMeta, id: form.id || Date.now()};
    if(editIdx!==null){const u=[...windows];u[editIdx]=windowData;setWindows(u);setEditIdx(null);}
    else setWindows([...windows, windowData]);
    setForm(empty);setShow(false);setScanResult(null);setScanNoMatch(false);
  };

  const handleScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true); setScanResult(null); setScanPhotoUrl(null);
    try {
      const base64Promise = new Promise((res,rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result.split(',')[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const tempRef = `tmp_${Date.now()}`;
      const [base64, photoUrl] = await Promise.all([
        base64Promise,
        uploadScanPhoto(file, tempRef).catch(() => null),
      ]);
      if (photoUrl) setScanPhotoUrl(photoUrl);
      const result = await analyzeWindowPhoto(base64, products);
      if (result) {
        setScanResult(result);
        const { exact, best, score } = fuzzyMatch(result.type, products);
        if (exact) {
          setForm(f => ({ ...f, type: exact.name, width: result.width||36, height: result.height||48, _aiNoMatch: false, _aiRawType: result.type, _photoUrl: photoUrl }));
          setScanNoMatch(false);
        } else if (best && score >= 0.5) {
          setForm(f => ({ ...f, type: best.name, width: result.width||36, height: result.height||48, _aiNoMatch: true, _aiRawType: result.type, _aiScore: score, _customPrice: '', _photoUrl: photoUrl }));
          setScanNoMatch(true);
        } else {
          setForm(f => ({ ...f, type: products[0]?.name||'', width: result.width||36, height: result.height||48, _aiNoMatch: true, _aiRawType: result.type, _aiScore: score, _customPrice: '', _photoUrl: photoUrl }));
          setScanNoMatch(true);
        }
        setShow(true);
      }
    } catch(err) { console.error('Scan error:', err); }
    setScanning(false);
    e.target.value = '';
  };

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">{t('step2Title',lang)}</h2>
      <p className="step-subtitle">{t('step2Sub',lang)}</p>

      {/* AI Scan Result Banner */}
      {scanResult && !scanNoMatch && (
        <div style={{background:T.successLight,border:`1px solid #BBF7D0`,borderRadius:10,padding:'10px 14px',marginBottom:16,fontSize:13,display:'flex',gap:10,alignItems:'flex-start'}}>
          {scanPhotoUrl && (
            <img src={scanPhotoUrl} alt="scan" style={{width:52,height:52,objectFit:'cover',borderRadius:8,flexShrink:0,border:'2px solid #BBF7D0'}}/>
          )}
          <div style={{flex:1}}>
            <strong>{t('aiDetected',lang)}</strong> {scanResult.type} · {scanResult.width}"×{scanResult.height}" · {t('confidence',lang)} {scanResult.confidence}
            {scanResult.measured_with_reference && scanResult.reference_object && (
              <div style={{marginTop:4,fontSize:11,color:'#059669',fontWeight:600}}>
                {t('refUsed',lang)} {scanResult.reference_object}
              </div>
            )}
            {scanResult.measured_with_reference === false && (
              <div style={{marginTop:4,fontSize:11,color:T.textMuted}}>
                {t('refEstimate',lang)}
              </div>
            )}
            {scanResult.notes && <div style={{color:T.textMuted,marginTop:2,fontSize:12}}>{scanResult.notes}</div>}
          </div>
        </div>
      )}
      {scanResult && scanNoMatch && (
        <div style={{background:'#FFF7ED',border:`1px solid #FED7AA`,borderRadius:10,padding:'12px 14px',marginBottom:16,fontSize:13,display:'flex',gap:10,alignItems:'flex-start'}}>
          {scanPhotoUrl && (
            <img src={scanPhotoUrl} alt="scan" style={{width:52,height:52,objectFit:'cover',borderRadius:8,flexShrink:0,border:'2px solid #FED7AA'}}/>
          )}
          <div style={{flex:1}}>
            <div style={{fontWeight:700,color:'#C2410C',marginBottom:4}}>{t('aiNoMatch',lang)}</div>
            <div style={{color:T.textMuted,marginBottom:6}}>{t('aiNoMatchSub',lang)}: <strong>"{scanResult.type}"</strong> {t('aiNoMatchSub2',lang)}</div>
            {scanResult.measured_with_reference && scanResult.reference_object && (
              <div style={{marginBottom:4,fontSize:11,color:'#059669',fontWeight:600}}>
                {t('refUsed',lang)} {scanResult.reference_object}
              </div>
            )}
            {scanResult.measured_with_reference === false && (
              <div style={{marginBottom:4,fontSize:11,color:T.textMuted}}>
                {t('refEstimate',lang)}
              </div>
            )}
            {scanResult.notes && <div style={{fontSize:12,color:T.textMuted,fontStyle:'italic',marginTop:4}}>"{scanResult.notes}"</div>}
          </div>
        </div>
      )}

      {windows.map((w,i)=>(
        <div className="window-item" key={w.id||i}>
          <div>
            <div style={{fontWeight:600,fontSize:14,display:'flex',alignItems:'center',gap:6}}>
              {w.qty}× {w.type}
              {w.ai_raw_type && <span style={{fontSize:9,background:'#3B82F6',color:'white',borderRadius:8,padding:'1px 6px',fontWeight:700}}>📷 AI</span>}
              {w.ai_no_match && w._customPrice && <span style={{fontSize:9,background:'#F97316',color:'white',borderRadius:8,padding:'1px 6px',fontWeight:700}}>✏️</span>}
            </div>
            <div style={{fontSize:12,color:T.textMuted}}>{w.material} · {w.color} · {w.glass} · {w.width}"×{w.height}"</div>
            {w.ai_no_match && w.ai_raw_type && (
              <div style={{fontSize:11,color:'#C2410C',marginTop:2}}>AI: "{w.ai_raw_type}" → {w._customPrice>0?`$${w._customPrice} custom`:w.type}</div>
            )}
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
            <div style={{fontWeight:700,fontFamily:'DM Mono',fontSize:14}}>{fmt(calcPrice(w))}</div>
            <div style={{display:'flex',gap:6}}>
              <button className="btn btn-secondary btn-sm" onClick={()=>{setForm(windows[i]);setEditIdx(i);setShow(true);}}><Icon name="edit" size={13}/></button>
              <button className="btn btn-danger btn-sm" onClick={()=>setWindows(windows.filter((_,idx)=>idx!==i))}><Icon name="trash" size={13}/></button>
            </div>
          </div>
        </div>
      ))}

      {/* file input always in DOM */}
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
        style={{display:'none'}} onChange={handleScan}/>

      {!show && (
        <>
          <div style={{display:'flex',gap:10,marginBottom:8}}>
            <button className="btn btn-secondary" style={{flex:1}} onClick={()=>setShow(true)}>
              <Icon name="plus"/> {t('addWindow',lang)}
            </button>
            <button className="btn btn-secondary" style={{flex:1,color:T.accent,borderColor:T.accent}}
              onClick={()=>fileRef.current?.click()} disabled={scanning}>
              {scanning ? t('analyzing',lang) : t('scanPhoto',lang)}
            </button>
          </div>
          <div style={{background:'#F0F9FF',border:'1px solid #BAE6FD',borderRadius:8,padding:'7px 10px',fontSize:11,color:'#0369A1',marginBottom:4}}>
            {t('measureTip',lang)}
          </div>
        </>
      )}
      {show && (
        <div className="card fade-up">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:15}}>{editIdx!==null?t('editWindow',lang):t('newWindow',lang)}</div>
            <button className="btn btn-secondary btn-sm" style={{color:T.accent,borderColor:T.accent,fontSize:12}}
              onClick={()=>fileRef.current?.click()} disabled={scanning}>
              {scanning ? t('analyzing',lang) : t('scan',lang)}
            </button>
          </div>
          <div className="field"><label className="label">{t('windowType',lang)}</label>
            <div className="pill-group">{products.map(p=>(
              <div key={p.id} className={`pill ${form.type===p.name?'selected':''}`} onClick={()=>setForm({...form,type:p.name})}>
                {p.name}
                {form._aiNoMatch && form._aiRawType && (() => {
                  const { best } = fuzzyMatch(form._aiRawType, products);
                  return best?.name === p.name ? <span style={{fontSize:9,background:'#F97316',color:'white',borderRadius:8,padding:'1px 5px',marginLeft:4,fontWeight:700}}>{t('aiSuggestedBadge',lang)}</span> : null;
                })()}
              </div>
            ))}</div>
          </div>
          {form._aiNoMatch && (
            <div style={{background:'#FFF7ED',border:'1px solid #FED7AA',borderRadius:10,padding:'10px 12px',marginBottom:12,fontSize:12}}>
              <div style={{fontWeight:600,color:'#C2410C',marginBottom:6}}>
                {t('aiSuggested',lang)} {form._aiRawType}
              </div>
              <div style={{color:T.textMuted,marginBottom:8}}>{t('customPriceHint',lang)}:</div>
              <input
                className="input"
                type="number"
                placeholder={t('customPrice',lang)}
                value={form._customPrice||''}
                min={0}
                onChange={e=>setForm({...form, _customPrice: e.target.value})}
                style={{marginBottom:0}}
              />
              {form._customPrice>0 && (
                <div style={{marginTop:6,fontSize:11,color:'#C2410C',fontWeight:600}}>{t('customPriceActive',lang)}: ${Number(form._customPrice).toLocaleString()}</div>
              )}
            </div>
          )}
          <div className="row">
            <div className="col field"><label className="label">{t('material',lang)}</label><select className="select" value={form.material} onChange={e=>setForm({...form,material:e.target.value})}>{mats.map(m=><option key={m}>{m}</option>)}</select></div>
            <div className="col field"><label className="label">{t('color',lang)}</label><select className="select" value={form.color} onChange={e=>setForm({...form,color:e.target.value})}>{cols.map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="field"><label className="label">{t('glass',lang)}</label><select className="select" value={form.glass} onChange={e=>setForm({...form,glass:e.target.value})}>{gls.map(g=><option key={g}>{g}</option>)}</select></div>
          <div className="row">
            <div className="col field"><label className="label">{t('widthIn',lang)}</label><input className="input" type="number" value={form.width} min={12} max={120} onChange={e=>setForm({...form,width:Number(e.target.value)})}/></div>
            <div className="col field"><label className="label">{t('heightIn',lang)}</label><input className="input" type="number" value={form.height} min={12} max={120} onChange={e=>setForm({...form,height:Number(e.target.value)})}/></div>
            <div className="col field"><label className="label">{t('qty',lang)}</label><input className="input" type="number" value={form.qty} min={1} max={50} onChange={e=>setForm({...form,qty:Number(e.target.value)})}/></div>
          </div>
          <div style={{background:T.surfaceAlt,borderRadius:10,padding:'10px 14px',marginBottom:16,display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:13,color:T.textMuted}}>{t('estimated',lang)}</span>
            <span style={{fontWeight:700,fontFamily:'DM Mono'}}>{fmt(calcPrice(form))}</span>
          </div>
          <div style={{display:'flex',gap:10}}>
            <button className="btn btn-secondary" style={{flex:1}} onClick={()=>{setShow(false);setEditIdx(null);setForm(empty);setScanNoMatch(false);setScanResult(null);}}>{t('cancel',lang)}</button>
            <button className="btn btn-primary" style={{flex:2}} onClick={add}>{editIdx!==null?t('save',lang):t('addWindow',lang)}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Step3({ selected, setSelected, zip, dbServices, cityMap }) {
  const { lang } = useLang();
  const rules = cityMap[zip]||null;
  const icons = {Installation:"🔧",Permit:"📋","General Contractor":"👷",Disposal:"♻️"};
  useEffect(()=>{
    if(rules?.permit_required){const p=dbServices.find(s=>s.name==='Permit');if(p&&!selected.includes(p.id))setSelected(s=>[...s,p.id]);}
  },[zip]);
  return (
    <div className="step-content fade-up">
      <h2 className="step-title">{t('step3Title',lang)}</h2>
      <p className="step-subtitle">{t('step3Sub',lang)}</p>
      {rules&&(
        <div className="card" style={{background:T.surfaceAlt,marginBottom:20}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}><Icon name="map" size={14}/><span style={{fontWeight:700,fontSize:13}}>{t('rulesFor',lang)} {rules.city}</span></div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {rules.permit_required&&<span className="badge badge-red">{t('permitReq',lang)}</span>}
            {rules.hurricane_zone&&<span className="badge badge-orange">{t('hurricaneZone',lang)}</span>}
            {rules.inspection_required&&<span className="badge badge-blue">{t('inspectionNeeded',lang)}</span>}
            {!rules.permit_required&&!rules.hurricane_zone&&!rules.inspection_required&&<span className="badge badge-green">{t('standardZone',lang)}</span>}
          </div>
        </div>
      )}
      {dbServices.map(s=>{
        const checked=selected.includes(s.id);
        const req=s.name==='Permit'&&rules?.permit_required;
        const price=s.pricing_model==='per_window'?`$${s.price}${t('perWindow',lang)}`:s.price>0?`$${s.price} ${t('flat',lang)}`:t('included',lang);
        return(
          <div key={s.id} className={`checkbox-row ${checked?'checked':''}`} onClick={()=>!req&&setSelected(sel=>sel.includes(s.id)?sel.filter(x=>x!==s.id):[...sel,s.id])}>
            <div className={`checkbox-box ${checked?'checked':''}`}>{checked&&<Icon name="check" size={12}/>}</div>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <span className="checkbox-label">{icons[s.name]||'🔹'} {s.name}</span>
                {req&&<span className="badge badge-red" style={{fontSize:10}}>{t('required',lang)}</span>}
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
  const { lang } = useLang();
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
      <h2 className="step-title">{t('step4Title',lang)}</h2>
      <p className="step-subtitle">{t('step4Sub',lang)}</p>
      <div className="card">
        <div className="price-row"><span className="muted">{t('windows',lang)} ({count})</span><span className="mono">{fmt(winTotal)}</span></div>
        {lines.map((l,i)=><div key={i} className="price-row"><span className="muted">{l.label}</span><span className="mono">{fmt(l.amount)}</span></div>)}
        <div className="price-row"><span className="muted">{t('tax',lang)} ({(TAX*100).toFixed(0)}%)</span><span className="mono">{fmt(tax)}</span></div>
        <div className="price-row total"><span>{t('total',lang)}</span><span className="mono">{fmt(total)}</span></div>
      </div>
      <div className="divider"/>
      <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>{t('downPayment',lang)}</div>
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
  const { lang } = useLang();
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
    // Collect AI scan notes from windows for admin visibility
    const aiScans = windows
      .filter(w => w.ai_raw_type)
      .map(w => ({
        window_type_selected: w.type,
        ai_detected: w.ai_raw_type,
        confidence: w.ai_confidence,
        notes: w.ai_notes,
        no_match: w.ai_no_match,
        custom_price: w.ai_custom_price,
        photo_url: w.ai_photo_url || null,
        measured_with_reference: w.ai_measured_with_ref || false,
        reference_object: w.ai_reference_object || null,
      }));

    await supabase.from('quotes').insert({
      customer_name:customer.name,customer_email:customer.email,customer_phone:customer.phone,
      address:customer.address,zip:customer.zip,windows,services:lines,down_pct:downPct,total,
      status:'finalized',
      created_by:currentUser?.id||null,
      created_by_name:currentUser?.full_name||currentUser?.email||'Unknown',
      company_id:currentUser?.company_id||null,
      company_name:currentUser?.company_name||null,
      ai_notes: aiScans.length > 0 ? aiScans : null,
    });
    setSaving(false);
    onConfirm(total);
  };

  return(
    <div className="step-content fade-up">
      <h2 className="step-title">{t('step5Title',lang)}</h2>
      <p className="step-subtitle">{t('step5Sub',lang)}</p>
      <div className="card-sm">
        <div style={{fontWeight:600,fontSize:12,color:T.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px'}}>{t('customer',lang)}</div>
        <div style={{fontWeight:600}}>{customer.name}</div>
        <div style={{fontSize:13,color:T.textMuted}}>{customer.email} · {customer.phone}</div>
        <div style={{fontSize:13,color:T.textMuted}}>{customer.address}, {customer.zip}</div>
      </div>
      <div className="card-sm">
        <div style={{fontWeight:600,fontSize:12,color:T.textMuted,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px'}}>{t('windows',lang)}</div>
        {windows.map((w,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4}}><span>{w.qty}× {w.type} · {w.material}</span><span className="mono">{fmt(calcPrice(w))}</span></div>)}
      </div>
      <div className="card-sm" style={{display:'flex',justifyContent:'space-between'}}>
        <span style={{fontWeight:600}}>{t('total',lang)}</span>
        <span style={{fontWeight:800,fontFamily:'DM Mono',fontSize:18}}>{fmt(total)}</span>
      </div>
      <div className={`checkbox-row ${agreed?'checked':''}`} onClick={()=>setAgreed(!agreed)} style={{marginTop:16}}>
        <div className={`checkbox-box ${agreed?'checked':''}`}>{agreed&&<Icon name="check" size={12}/>}</div>
        <div><div className="checkbox-label">{t('termsCheck',lang)}</div><div className="checkbox-desc">{t('termsDesc',lang)}</div></div>
      </div>
      <button className="btn btn-primary btn-full" style={{marginTop:16}} disabled={!agreed||saving} onClick={confirm}>
        {saving?t('saving',lang):<><Icon name="arrow" /> {t('generateContract',lang)}</>}
      </button>
    </div>
  );
}

// ─── POST-WIZARD ──────────────────────────────────────────────────────────────

// STEP A: Ver contrato (solo lectura) → firmar
function ContractView({ customer, total, downPct, windows, serviceLines, company, contractorName, onSign }) {
  const { lang } = useLang();
  const downAmt = Math.round(total * downPct / 100);
  const balance = total - downAmt;
  const count = windows.reduce((s,w)=>s+(w.qty||1),0);

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">{t('reviewContract',lang)}</h2>
      <p className="step-subtitle">{t('reviewContractSub',lang)}</p>

      {/* Company header */}
      <div style={{background:T.surfaceAlt,borderRadius:12,padding:'14px 16px',marginBottom:12}}>
        <div style={{fontWeight:800,fontSize:15}}>{company?.name||'WindowQuote'}</div>
        {company?.phone&&<div style={{fontSize:12,color:T.textMuted}}>{company.phone}</div>}
        {company?.address&&<div style={{fontSize:12,color:T.textMuted}}>{company.address}</div>}
      </div>

      {/* Customer */}
      <div className="card-sm" style={{marginBottom:10}}>
        <div style={{fontWeight:600,fontSize:11,color:T.textMuted,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:6}}>{t('customer',lang)}</div>
        <div style={{fontWeight:600}}>{customer.name}</div>
        <div style={{fontSize:13,color:T.textMuted}}>{customer.email} · {customer.phone}</div>
        <div style={{fontSize:13,color:T.textMuted}}>{customer.address}, {customer.zip}</div>
      </div>

      {/* Windows */}
      <div className="card-sm" style={{marginBottom:10}}>
        <div style={{fontWeight:600,fontSize:11,color:T.textMuted,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:6}}>{t('windows',lang)} ({count} {t('windowsUnits',lang)})</div>
        {windows.map((w,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:13,padding:'4px 0',borderBottom:`1px solid ${T.border}`}}>
            <span>{w.qty}× {w.type} · {w.material} · {w.width}"×{w.height}"</span>
          </div>
        ))}
      </div>

      {/* Services */}
      {serviceLines.length>0&&(
        <div className="card-sm" style={{marginBottom:10}}>
          <div style={{fontWeight:600,fontSize:11,color:T.textMuted,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:6}}>{t('services',lang)}</div>
          {serviceLines.map((s,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:13,padding:'4px 0'}}>
              <span>{s.label}</span><span className="mono">{fmt(s.amount)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Totals */}
      <div className="card-sm" style={{marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
          <span style={{color:T.textMuted}}>{t('contractTotal',lang)}</span>
          <span style={{fontWeight:800,fontFamily:'DM Mono',fontSize:16}}>{fmt(total)}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
          <span style={{color:T.success,fontWeight:600}}>{t('downPayment',lang)} ({downPct}%)</span>
          <span style={{fontWeight:700,color:T.success,fontFamily:'DM Mono'}}>{fmt(downAmt)}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:13}}>
          <span style={{color:T.textMuted}}>{t('balanceDue',lang)}</span>
          <span style={{fontFamily:'DM Mono'}}>{fmt(balance)}</span>
        </div>
      </div>

      <div style={{fontSize:11,color:T.textMuted,marginBottom:16,lineHeight:1.6,padding:'0 4px'}}>
{t('termsNote',lang)}
      </div>

      <button className="btn btn-primary btn-full" onClick={onSign}>
        {t('signContract',lang)}
      </button>
    </div>
  );
}

// STEP B: Firmar
function SignContract({ customer, total, downPct, onPay }) {
  const { lang } = useLang();
  const ref = useRef(null);
  const [signed, setSigned] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const downAmt = Math.round(total * downPct / 100);

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    if (e.touches) return { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const startDraw = (e) => { e.preventDefault(); setDrawing(true); const c=ref.current; const ctx=c.getContext('2d'); const p=getPos(e,c); ctx.beginPath(); ctx.moveTo(p.x,p.y); };
  const draw = (e) => {
    if(!drawing) return; e.preventDefault();
    const c=ref.current; const ctx=c.getContext('2d'); const p=getPos(e,c);
    ctx.lineWidth=2.5; ctx.lineCap='round'; ctx.strokeStyle=T.text;
    ctx.lineTo(p.x,p.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x,p.y);
  };
  const endDraw = (e) => { e.preventDefault(); setDrawing(false); setSigned(true); };
  const clear = () => { ref.current.getContext('2d').clearRect(0,0,400,150); setSigned(false); };

  const handlePay = () => {
    const sigData = ref.current?.toDataURL('image/png');
    onPay(sigData);
  };

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">{t('signTitle',lang)}</h2>
      <p className="step-subtitle">{t('signSub',lang)} <strong>{fmt(downAmt)}</strong>.</p>

      <div style={{border:`2px solid ${signed?T.success:T.border}`,borderRadius:12,overflow:'hidden',background:'#FAFAF9',position:'relative',marginBottom:8,transition:'border-color 0.2s'}}>
        <canvas ref={ref} width={350} height={150}
          style={{display:'block',cursor:'crosshair',touchAction:'none',width:'100%'}}
          onMouseDown={startDraw} onMouseUp={endDraw} onMouseMove={draw}
          onTouchStart={startDraw} onTouchEnd={endDraw} onTouchMove={draw}
        />
        {!signed&&<div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:T.textLight,fontSize:13,pointerEvents:'none',gap:4}}>
          <span style={{fontSize:24}}>✍️</span>
          <span>{t('signHint',lang)}</span>
        </div>}
      </div>

      <div style={{display:'flex',justifyContent:'space-between',marginBottom:20,alignItems:'center'}}>
        <span style={{fontSize:12,color:T.textMuted}}>{customer.name} · {new Date().toLocaleDateString()}</span>
        <button style={{background:'none',border:'none',fontSize:12,color:T.accent,cursor:'pointer'}} onClick={clear}>{t('clear',lang)}</button>
      </div>

      {signed&&<div style={{background:T.successLight,border:`1px solid #BBF7D0`,borderRadius:10,padding:'10px 14px',marginBottom:16,fontSize:13,color:T.success,textAlign:'center'}}>
{t('sigCaptured',lang)}
      </div>}

      <button className="btn btn-primary btn-full" disabled={!signed} onClick={handlePay}>
        💳 {t('proceedPayment',lang)} {fmt(downAmt)}
      </button>
    </div>
  );
}

// STEP C: Pagar depósito → genera PDF con firma + confirmación
function PayDeposit({ customer, total, downPct, windows, serviceLines, company, contractorName, signature, onNewQuote }) {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const downAmt = Math.round(total * downPct / 100);
  const balance = total - downAmt;
  // Stable values — must not change across re-renders
  const paymentRef = useRef(`PAY-${Date.now().toString().slice(-6)}`).current;
  const paymentDate = useRef(new Date().toLocaleDateString()).current;

  const buildHTML = (isConfirmed) => generateContractHTML({
    customer, windows, serviceLines, total, downPct,
    company, contractorName,
    date: paymentDate,
    signatureData: signature,
    paymentConfirmed: isConfirmed,
    paymentRef,
    paymentAmt: downAmt,
  });

  const downloadPDF = () => {
    const win = window.open('', '_blank');
    win.document.write(buildHTML(paid));
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  const sendEmail = async () => {
    setSending(true); setEmailError(null);
    const ok = await sendContractEmail({ to: customer.email, customerName: customer.name, contractHTML: buildHTML(true), company });
    setSending(false);
    if (ok) setSent(true);
    else setEmailError("Failed to send. Check Resend configuration.");
  };

  const { lang } = useLang();
  if (paid) return (
    <div className="step-content fade-up" style={{textAlign:'center',paddingTop:24}}>
      <div className="success-icon" style={{width:72,height:72,fontSize:32}}>✅</div>
      <h2 className="step-title" style={{textAlign:'center'}}>{t('paymentConfirmedTitle',lang)}</h2>
      <p className="step-subtitle" style={{textAlign:'center'}}>{t('depositOf',lang)} <strong>{fmt(downAmt)}</strong> {t('received',lang)}</p>

      {/* Payment receipt card */}
      <div style={{background:T.successLight,border:`1.5px solid #BBF7D0`,borderRadius:14,padding:'16px',marginBottom:16,textAlign:'left'}}>
        <div style={{fontWeight:700,fontSize:13,marginBottom:10,color:T.success}}>{t('paymentReceipt',lang)}</div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4}}>
          <span style={{color:T.textMuted}}>{t('reference',lang)}</span><span style={{fontWeight:600,fontFamily:'DM Mono'}}>{paymentRef}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4}}>
          <span style={{color:T.textMuted}}>{t('date',lang)}</span><span>{paymentDate}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4}}>
          <span style={{color:T.textMuted}}>{t('customer',lang)}</span><span style={{fontWeight:600}}>{customer.name}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4}}>
          <span style={{color:T.textMuted}}>{t('downPayment',lang)} ({downPct}%)</span>
          <span style={{fontWeight:800,fontFamily:'DM Mono',color:T.success}}>{fmt(downAmt)}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:13,paddingTop:8,borderTop:`1px solid #BBF7D0`}}>
          <span style={{color:T.textMuted}}>{t('balanceDueComp',lang)}</span>
          <span style={{fontFamily:'DM Mono'}}>{fmt(balance)}</span>
        </div>
      </div>

      {/* Signature preview */}
      {signature && (
        <div style={{border:`1px solid ${T.border}`,borderRadius:10,padding:'10px',marginBottom:16,background:T.surfaceAlt}}>
          <div style={{fontSize:11,color:T.textMuted,marginBottom:6}}>{t('customerSig',lang)}</div>
          <img src={signature} style={{maxHeight:60,maxWidth:'100%'}} alt="signature"/>
          <div style={{fontSize:11,color:T.textMuted,marginTop:4}}>{customer.name} · {paymentDate}</div>
        </div>
      )}

      {sent&&<div style={{background:T.successLight,border:`1px solid #BBF7D0`,borderRadius:10,padding:'10px 14px',marginBottom:12,fontSize:13,color:T.success}}>✅ {t('contractSentTo',lang)} {customer.email}</div>}
      {emailError&&<div style={{background:T.dangerLight,border:`1px solid #FECACA`,borderRadius:10,padding:'10px 14px',marginBottom:12,fontSize:13,color:T.danger}}>⚠ {t('failedSend',lang)}</div>}

      <div style={{display:'flex',gap:10,marginBottom:10}}>
        <button className="btn btn-secondary" style={{flex:1}} onClick={downloadPDF}><Icon name="download"/> {t('pdf',lang)}</button>
        <button className="btn btn-secondary" style={{flex:1,color:T.accent,borderColor:T.accent}} onClick={sendEmail} disabled={sending||sent}>
          {sending?t('sending',lang):sent?t('sent',lang):`📧 ${t('emailBtn',lang)}`}
        </button>
      </div>
      <button className="btn btn-primary btn-full" onClick={onNewQuote}>{t('newQuote',lang)}</button>
    </div>
  );

  return (
    <div className="step-content fade-up">
      <h2 className="step-title">{t('payDeposit',lang)}</h2>
      <p className="step-subtitle">{t('payDepositSub',lang)}</p>

      <div className="stripe-card">
        <div style={{fontSize:11,opacity:0.6,marginBottom:12,letterSpacing:1,textTransform:'uppercase'}}>Powered by Stripe</div>
        <div style={{background:'rgba(255,255,255,0.1)',borderRadius:8,padding:'12px 14px',marginBottom:10,letterSpacing:2}}>4242 4242 4242 4242</div>
        <div style={{display:'flex',gap:10}}>
          <div style={{flex:1,background:'rgba(255,255,255,0.1)',borderRadius:8,padding:'10px 12px'}}>12/27</div>
          <div style={{flex:1,background:'rgba(255,255,255,0.1)',borderRadius:8,padding:'10px 12px'}}>•••</div>
        </div>
      </div>

      <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div>
          <div style={{fontWeight:600}}>{t('downPayment',lang)}</div>
          <div style={{fontSize:12,color:T.textMuted}}>{downPct}% of {fmt(total)}</div>
        </div>
        <div style={{fontWeight:800,fontSize:22,fontFamily:'DM Mono'}}>{fmt(downAmt)}</div>
      </div>

      <button className="btn btn-accent btn-full" disabled={paying}
        onClick={()=>{setPaying(true);setTimeout(()=>{setPaying(false);setPaid(true);},2500);}}>
        {paying?t('processing',lang):`${t('confirmPayment',lang)} ${fmt(downAmt)}`}
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
  const [signature,setSignature]=useState(null);

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

  const { lang } = useLang();
  const resetWizard = () => { setPost(null);setStep(1);setCustomer({name:"",email:"",phone:"",address:"",zip:""});setWindows([]);setSelected([]);setSignature(null);setTotal(0); };

  const navBar = (
    <div className="top-nav">
      <div className="logo"><div className="logo-icon"><Icon name="window" size={14}/></div>{auth.company?.name||"WindowQuote"}</div>
    </div>
  );

  if (post === "contract" || post === "sign" || post === "pay") {
    const count = windows.reduce((s,w)=>s+(w.qty||1),0);
    const serviceLines = dbServices.filter(s=>selected.includes(s.id)).map(s=>({
      label: s.name,
      amount: s.pricing_model==='per_window' ? s.price*count : s.price
    }));
    const sharedProps = { customer, total, downPct, windows, serviceLines, company: auth.company, contractorName: auth.profile?.full_name||auth.user?.email };

    return (
      <div className="wizard-shell">
        {navBar}
        {post==="contract" && <ContractView {...sharedProps} onSign={()=>setPost("sign")}/>}
        {post==="sign"     && <SignContract {...sharedProps} onPay={(sig)=>{setSignature(sig);setPost("pay");}}/>}
        {post==="pay"      && <PayDeposit  {...sharedProps} signature={signature} onNewQuote={resetWizard}/>}
      </div>
    );
  }

  return(
    <div className="wizard-shell">
      {noQuota&&<NoQuotaModal plan={plan} onClose={()=>setNoQuota(false)}/>}
      <div className="top-nav">
        <div className="logo"><div className="logo-icon"><Icon name="window" size={14}/></div>{auth.company?.name||"WindowQuote"}</div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <QuotaBadge sub={sub} plan={plan} pct={pct} color={color}/>
          <div className="avatar" style={{background:T.accent,width:28,height:28,fontSize:11}}>{(auth.profile?.full_name||auth.user?.email||'U').charAt(0).toUpperCase()}</div>
          <LangToggle style={{marginRight:4}}/>
          <button style={{background:'none',border:'none',fontSize:12,color:T.textMuted,cursor:'pointer'}} onClick={auth.signOut}>{t('out',lang)}</button>
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
  const { lang } = useLang();
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
          <div style={{fontSize:13,color:T.textMuted}}>{t('superAdminDesc',lang)}</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <div style={{display:'flex',gap:10}}>
            {[{label:t('companies',lang),value:companies.length},{label:t('contractors',lang),value:allUsers.filter(u=>u.role==='contractor').length},{label:t('quotes',lang),value:allQuotes.length}].map(s=>(
              <div key={s.label} style={{textAlign:'center',padding:'8px 14px',background:T.surfaceAlt,borderRadius:10,border:`1px solid ${T.border}`}}>
                <div style={{fontWeight:800,fontSize:18,fontFamily:'DM Mono'}}>{s.value}</div>
                <div style={{fontSize:11,color:T.textMuted}}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div className="avatar" style={{background:'#7C3AED'}}>{(auth.profile?.full_name||'S').charAt(0)}</div>
            <LangToggle style={{marginRight:4}}/>
          <button className="btn btn-secondary btn-sm" onClick={auth.signOut}>{t('signOut',lang)}</button>
          </div>
        </div>
      </div>

      {selCompany&&(
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20,padding:'10px 14px',background:T.accentLight,borderRadius:12,border:`1px solid #BFDBFE`}}>
          <span style={{fontSize:13,color:T.accent}}>{t('viewing',lang)} <strong>{selCompany.name}</strong></span>
          <button style={{background:'none',border:'none',cursor:'pointer',color:T.accent,fontSize:12}} onClick={()=>setSelCompany(null)}>{t('showAll',lang)}</button>
        </div>
      )}

      <div className="admin-nav">
        {[{id:"companies",label:t('companiesTab',lang)},{id:"contractors",label:t('contractorsTab',lang)},{id:"quotes",label:t('quotesTab',lang)},{id:"billing",label:t('superBillingTab',lang)},{id:"products",label:t('productsTab',lang)},{id:"cities",label:t('citiesTab',lang)}].map(tb=>(
          <button key={tb.id} className={`admin-nav-item ${tab===tb.id?'active':''}`} onClick={()=>setTab(tb.id)}>{tb.label}</button>
        ))}
      </div>

      {/* COMPANIES */}
      {tab==="companies"&&(
        <div className="fade-up">
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
            <h3 style={{fontWeight:700,fontSize:18}}>{t('companies',lang)}</h3>
            <button className="btn btn-primary btn-sm" onClick={()=>setModal({type:'company',data:{name:'',phone:'',address:''}})}><Icon name="plus"/> {t('add',lang)}</button>
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
                    {[{label:t('contractors',lang),value:cu.filter(u=>u.role==='contractor').length},{label:t('quotes',lang),value:cq.length},{label:t('revenue',lang),value:fmt(rev)}].map(s=>(
                      <div key={s.label} style={{background:T.surfaceAlt,borderRadius:8,padding:'8px 10px',textAlign:'center'}}>
                        <div style={{fontWeight:700,fontSize:14,fontFamily:'DM Mono'}}>{s.value}</div>
                        <div style={{fontSize:10,color:T.textMuted}}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {companies.length===0&&<div style={{color:T.textMuted,fontSize:14}}>{t('noCompanies',lang)}</div>}
          </div>
        </div>
      )}

      {/* CONTRACTORS */}
      {tab==="contractors"&&(
        <div className="fade-up">
          <h3 style={{fontWeight:700,fontSize:18,marginBottom:20}}>{selCompany?`${selCompany.name} — ${t('contractors',lang)}`:t('allContractors',lang)}</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>{t('name',lang)}</th><th>{t('company',lang)}</th><th>{t('role',lang)}</th><th>{t('plan',lang)}</th><th>{t('used',lang)}</th><th>{t('remaining',lang)}</th><th>{t('assignPlanCol',lang)}</th></tr></thead>
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
                      <td>{p?<span className="badge badge-blue">{p.name}</span>:<span className="badge badge-gray">{t('noPlan',lang)}</span>}</td>
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
                {visUsers.length===0&&<tr><td colSpan={7} style={{textAlign:'center',color:T.textMuted,padding:32}}>{t('noContractorsYet',lang)}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUOTES */}
      {tab==="quotes"&&(
        <div className="fade-up">
          <h3 style={{fontWeight:700,fontSize:18,marginBottom:20}}>{selCompany?`${selCompany.name} — ${t('quotes',lang)}`:t('allQuotesTitle',lang)}</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>{t('customer',lang)}</th><th>{t('contractor',lang)}</th><th>{t('company',lang)}</th><th>{t('date',lang)}</th><th>{t('total',lang)}</th><th>{t('status',lang)}</th></tr></thead>
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
                {visQuotes.length===0&&<tr><td colSpan={6} style={{textAlign:'center',color:T.textMuted,padding:32}}>{t('noQuotesYet',lang)}</td></tr>}
              </tbody>
            </table>
          </div>
          <div style={{marginTop:10,fontSize:12,color:T.accent}}>{t('clickRow',lang)}</div>
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
            <div style={{fontWeight:700,fontSize:17,marginBottom:20}}>{modal.data.id?t('editCompany',lang):t('addCompany',lang)}</div>
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

  const { lang } = useLang();
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
              {mode === 'pack' ? `${selectedPack?.quotes} ${t('packAdded',lang)}` : t('planUpgraded',lang)}
            </div>
            <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 8 }}>
              {contractor.full_name} {t('canCreateMore',lang)}
            </div>
            <div style={{ background: T.warningLight, border: `1px solid #FDE68A`, borderRadius: 10, padding: '10px 14px', fontSize: 12, color: T.warning, marginBottom: 20 }}>
              {t('mockPayment',lang)} — ${mode === 'pack' ? selectedPack?.price : Math.max(0, (selectedPlan?.price_monthly||0)-(currentPlan?.price_monthly||0))} {t('recorded',lang)}
            </div>
            <button className="btn btn-primary btn-full" onClick={() => { onSuccess(); onClose(); }}>{t('done',lang)}</button>
          </div>
        )}

        {/* CHOOSE STATE */}
        {step === 'choose' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17 }}>{t('addQuotesFor',lang)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <div className="avatar" style={{ background: T.accent, width: 28, height: 28, fontSize: 11 }}>{(contractor.full_name||'U').charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{contractor.full_name}</div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>
        {currentPlan?.name || t('noPlan',lang)} · {remaining} {t('quotesWord',lang)}
                    </div>
                  </div>
                </div>
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted }} onClick={onClose}><Icon name="x" size={18} /></button>
            </div>

            {/* Mode toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, padding: 4, background: T.surfaceAlt, borderRadius: 10 }}>
              {[{id:'pack',label:t('buyPack',lang)},{id:'upgrade',label:t('upgradePlan',lang)}].map(m => (
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
                <div style={{ fontWeight: 600, fontSize: 13, color: T.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('choosePack',lang)}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                  {packs.map(pk => (
                    <div key={pk.id} onClick={() => setSelectedPack(pk)}
                      style={{ border: `2px solid ${selectedPack?.id === pk.id ? T.accent : T.border}`, borderRadius: 12, padding: '14px 12px', cursor: 'pointer', background: selectedPack?.id === pk.id ? T.accentLight : T.surface, transition: 'all 0.15s' }}>
                      <div style={{ fontWeight: 800, fontSize: 22, fontFamily: 'DM Mono', color: selectedPack?.id === pk.id ? T.accent : T.text }}>{pk.quotes}</div>
                      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8 }}>{t('quotesWord',lang)}</div>
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
                <div style={{ fontWeight: 600, fontSize: 13, color: T.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('upgradeTo',lang)}</div>
                {plans.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 32, color: T.textMuted, fontSize: 13 }}>
                    {currentPlan?.quote_limit === -1 ? t('alreadyHighest',lang) : t('noHigherPlans',lang)}
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
                            <div style={{ fontSize: 12, color: T.textMuted }}>{pl.quote_limit === -1 ? t('unlimited',lang) : pl.quote_limit} {t('quotesWord',lang)}/mo</div>
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
              {t('reviewConfirm',lang)}
            </button>
          </>
        )}

        {/* CONFIRM STATE */}
        {step === 'confirm' && (
          <>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 20 }}>{t('confirmPurchase',lang)}</div>
            <div style={{ background: T.surfaceAlt, borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: T.textMuted }}>{t('contractor',lang)}</span>
                <span style={{ fontWeight: 600 }}>{contractor.full_name}</span>
              </div>
              {mode === 'pack' ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ color: T.textMuted }}>{t('choosePack',lang)}</span>
                    <span style={{ fontWeight: 600 }}>{selectedPack?.name} ({selectedPack?.quotes} quotes)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                    <span style={{ fontWeight: 700 }}>{t('total',lang)}</span>
                    <span style={{ fontWeight: 800, fontFamily: 'DM Mono', fontSize: 18 }}>{fmt(selectedPack?.price)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ color: T.textMuted }}>{t('from',lang)}</span>
                    <span style={{ fontWeight: 600 }}>{currentPlan?.name || 'No plan'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ color: T.textMuted }}>{t('to',lang)}</span>
                    <span style={{ fontWeight: 600 }}>{selectedPlan?.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                    <span style={{ fontWeight: 700 }}>{t('total',lang)}</span>
                    <span style={{ fontWeight: 800, fontFamily: 'DM Mono', fontSize: 18 }}>{fmt(selectedPlan?.price_monthly)}/mo</span>
                  </div>
                </>
              )}
            </div>
            <div style={{ background: T.warningLight, border: `1px solid #FDE68A`, borderRadius: 10, padding: '10px 14px', fontSize: 12, color: T.warning, marginBottom: 16 }}>
              {t('mockMode',lang)}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep('choose')}>{t('back',lang)}</button>
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

// ─── TEAM DASHBOARD ───────────────────────────────────────────────────────────
function TeamDashboard({ quotes, contractors }) {
  const { lang } = useLang();
  const [filterContractor, setFilterContractor] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  // ── derived data ──
  const statuses = ["pending", "sent", "signed", "paid", "cancelled"];

  // Per-contractor stats
  const contractorStats = contractors.map(c => {
    const cq = quotes.filter(q => q.created_by === c.id);
    const paid = cq.filter(q => q.status === "paid");
    const signed = cq.filter(q => q.status === "signed" || q.status === "paid");
    const totalRev = paid.reduce((s, q) => s + (q.total || 0), 0);
    const closeRate = cq.length > 0 ? Math.round((signed.length / cq.length) * 100) : 0;

    // avg days from creation to today for signed/paid quotes (quote age at close)
    // Since there's no signed_at column, we measure how old quotes are when signed
    // This is a reasonable proxy for time-to-close
    const avgDays = signed.length > 0
      ? Math.round(signed.reduce((s, q) => {
          const created = new Date(q.created_at);
          const now = new Date();
          return s + (now - created) / (1000 * 60 * 60 * 24);
        }, 0) / signed.length)
      : null;

    return { ...c, cq, totalRev, closeRate, avgDays, signedCount: signed.length, paidCount: paid.length };
  });

  // Monthly trend (last 6 months)
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString('default', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth(),
    };
  });

  const monthlyData = months.map(m => {
    const mq = quotes.filter(q => {
      const d = new Date(q.created_at);
      return d.getFullYear() === m.year && d.getMonth() === m.month;
    });
    return {
      ...m,
      total: mq.length,
      paid: mq.filter(q => q.status === 'paid').length,
      revenue: mq.filter(q => q.status === 'paid').reduce((s, q) => s + (q.total || 0), 0),
    };
  });

  const maxMonthly = Math.max(...monthlyData.map(m => m.total), 1);

  // Available months for filter
  const availableMonths = [...new Set(quotes.map(q => {
    const d = new Date(q.created_at);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }))].sort().reverse();

  // Filtered quotes for detail table
  const filtered = quotes.filter(q => {
    const monthKey = `${new Date(q.created_at).getFullYear()}-${String(new Date(q.created_at).getMonth() + 1).padStart(2, '0')}`;
    return (
      (filterContractor === "all" || q.created_by === filterContractor) &&
      (filterStatus === "all" || q.status === filterStatus) &&
      (filterMonth === "all" || monthKey === filterMonth)
    );
  }).sort((a, b) => {
    if (sortBy === "date_desc") return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === "date_asc") return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === "total_desc") return (b.total || 0) - (a.total || 0);
    if (sortBy === "total_asc") return (a.total || 0) - (b.total || 0);
    return 0;
  });

  // Global KPIs
  const totalRevenue = quotes.filter(q => q.status === 'paid').reduce((s, q) => s + (q.total || 0), 0);
  const totalSigned = quotes.filter(q => q.status === 'signed' || q.status === 'paid').length;
  const overallClose = quotes.length > 0 ? Math.round((totalSigned / quotes.length) * 100) : 0;
  const avgQuoteValue = quotes.length > 0 ? quotes.reduce((s, q) => s + (q.total || 0), 0) / quotes.length : 0;

  const statusColors = {
    pending: T.warning,
    sent: T.accent,
    signed: "#7C3AED",
    paid: T.success,
    cancelled: T.textLight,
  };

  return (
    <div className="fade-up">
      {/* ── Global KPI cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { label: "Total Quotes", value: quotes.length, icon: "📋", color: T.accent, bg: T.accentLight },
          { label: "Revenue (Paid)", value: fmt(totalRevenue), icon: "💰", color: T.success, bg: T.successLight },
          { label: "Close Rate", value: `${overallClose}%`, icon: "🎯", color: "#7C3AED", bg: "#F5F3FF" },
          { label: "Avg Quote Value", value: fmt(avgQuoteValue), icon: "📈", color: T.warning, bg: T.warningLight },
          { label: "Active Contractors", value: contractors.length, icon: "👷", color: T.text, bg: T.surfaceAlt },
        ].map(k => (
          <div key={k.label} style={{ background: k.bg, borderRadius: 14, padding: '16px 14px', border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{k.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 20, fontFamily: 'DM Mono', color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* ── Monthly trend chart ── */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '20px' }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: T.text }}>{t('monthlyTrend',lang)}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 100 }}>
            {monthlyData.map(m => (
              <div key={m.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 10, color: T.textMuted, fontFamily: 'DM Mono', fontWeight: 700 }}>{m.total || ''}</div>
                <div style={{ width: '100%', position: 'relative', height: 70, display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{
                    width: '100%',
                    height: `${Math.max(4, (m.total / maxMonthly) * 70)}px`,
                    background: `linear-gradient(180deg, ${T.accent} 0%, ${T.accentLight} 100%)`,
                    borderRadius: '4px 4px 0 0',
                    position: 'relative',
                  }}>
                    {m.paid > 0 && (
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: `${(m.paid / Math.max(m.total, 1)) * 100}%`,
                        background: T.success, borderRadius: '4px 4px 0 0', opacity: 0.8,
                      }} />
                    )}
                  </div>
                </div>
                <div style={{ fontSize: 10, color: T.textMuted }}>{m.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: T.textMuted }}>
              <div style={{ width: 10, height: 10, background: T.accent, borderRadius: 2 }} /> {t("quotes",lang)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: T.textMuted }}>
              <div style={{ width: 10, height: 10, background: T.success, borderRadius: 2 }} /> {t("paid",lang)}
            </div>
          </div>
        </div>

        {/* ── Per-contractor cards ── */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '20px' }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: T.text }}>{t('contractorPerf',lang)}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 200, overflowY: 'auto' }}>
            {contractorStats.length === 0 && (
              <div style={{ color: T.textMuted, fontSize: 13, textAlign: 'center', padding: 20 }}>{t('noContractorsYet',lang)}</div>
            )}
            {contractorStats.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: T.surfaceAlt, borderRadius: 10 }}>
                <div className="avatar" style={{ background: T.accent, width: 30, height: 30, fontSize: 12, flexShrink: 0 }}>
                  {(c.full_name || 'U').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.full_name || t('noName',lang)}
                  </div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>{c.cq.length} {t('quotesWord',lang)} · {c.closeRate}% {t('closeRate',lang)}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 700, fontFamily: 'DM Mono', fontSize: 13, color: T.success }}>{fmt(c.totalRev)}</div>
                  {c.avgDays !== null && (
                    <div style={{ fontSize: 10, color: T.textMuted }}>~{c.avgDays}{lang==='es'?' días para firmar':'d to sign'}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contractor ranking table ── */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '20px', marginBottom: 28 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>{t('ranking',lang)}</div>
        <div className="table-wrap" style={{ margin: 0 }}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>{t('contractor',lang)}</th>
                <th>{t('quotes',lang)}</th>
                <th>{t('signed',lang)}</th>
                <th>{t('paid',lang)}</th>
                <th>{t('closeRate',lang)}</th>
                <th>{t('revenue',lang)}</th>
                <th>{t('avgTicket',lang)}</th>
                <th>{t('avgTimeSign',lang)}</th>
              </tr>
            </thead>
            <tbody>
              {[...contractorStats].sort((a, b) => b.totalRev - a.totalRev).map((c, i) => (
                <tr key={c.id}>
                  <td>
                    <span style={{ fontWeight: 800, color: i === 0 ? '#D97706' : i === 1 ? T.textMuted : T.textLight }}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="avatar" style={{ background: T.accent, width: 26, height: 26, fontSize: 11 }}>
                        {(c.full_name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{c.full_name || t('noName',lang)}</span>
                    </div>
                  </td>
                  <td><span className="mono" style={{ fontWeight: 700 }}>{c.cq.length}</span></td>
                  <td><span className="mono" style={{ color: '#7C3AED', fontWeight: 600 }}>{c.signedCount}</span></td>
                  <td><span className="mono" style={{ color: T.success, fontWeight: 600 }}>{c.paidCount}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 50, height: 6, background: T.surfaceAlt, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${c.closeRate}%`, height: '100%', background: c.closeRate >= 60 ? T.success : c.closeRate >= 30 ? T.warning : T.danger, borderRadius: 3 }} />
                      </div>
                      <span className="mono" style={{ fontSize: 12 }}>{c.closeRate}%</span>
                    </div>
                  </td>
                  <td><span className="mono" style={{ fontWeight: 700, color: T.success }}>{fmt(c.totalRev)}</span></td>
                  <td><span className="mono" style={{ fontSize: 13 }}>{c.paidCount > 0 ? fmt(c.totalRev / c.paidCount) : '—'}</span></td>
                  <td style={{ color: T.textMuted, fontSize: 12 }}>{c.avgDays !== null ? `${c.avgDays} ${t('days',lang)}` : '—'}</td>
                </tr>
              ))}
              {contractorStats.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: T.textMuted, padding: 32 }}>{t('noDataYet',lang)}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detailed quote list with filters ── */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{t('detailQuotes',lang)} ({filtered.length})</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <select value={filterContractor} onChange={e => setFilterContractor(e.target.value)}
              style={{ fontSize: 12, padding: '5px 8px', border: `1px solid ${T.border}`, borderRadius: 8, background: T.surfaceAlt, color: T.text, cursor: 'pointer' }}>
              <option value="all">{t('allContractorsF',lang)}</option>
              {contractors.map(c => <option key={c.id} value={c.id}>{c.full_name || t('noName',lang)}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ fontSize: 12, padding: '5px 8px', border: `1px solid ${T.border}`, borderRadius: 8, background: T.surfaceAlt, color: T.text, cursor: 'pointer' }}>
              <option value="all">{t('allStatuses',lang)}</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
              style={{ fontSize: 12, padding: '5px 8px', border: `1px solid ${T.border}`, borderRadius: 8, background: T.surfaceAlt, color: T.text, cursor: 'pointer' }}>
              <option value="all">{t('allMonths',lang)}</option>
              {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ fontSize: 12, padding: '5px 8px', border: `1px solid ${T.border}`, borderRadius: 8, background: T.surfaceAlt, color: T.text, cursor: 'pointer' }}>
              <option value="date_desc">{t('newestFirst',lang)}</option>
              <option value="date_asc">{t('oldestFirst',lang)}</option>
              <option value="total_desc">{t('highestValue',lang)}</option>
              <option value="total_asc">{t('lowestValue',lang)}</option>
            </select>
          </div>
        </div>
        <div className="table-wrap" style={{ margin: 0 }}>
          <table>
            <thead>
              <tr>
                <th>{t('customer',lang)}</th>
                <th>{t('contractor',lang)}</th>
                <th>{t('date',lang)}</th>
                <th>{t('windows',lang)}</th>
                <th>{t('total',lang)}</th>
                <th>{t('deposit',lang)}</th>
                <th>{t('status',lang)}</th>
                <th>{t('daysSinceCol',lang)}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => {
                const daysSince = Math.floor((new Date() - new Date(q.created_at)) / (1000 * 60 * 60 * 24));
                const deposit = Math.round((q.total || 0) * (q.down_pct || 20) / 100);
                const windowCount = Array.isArray(q.windows) ? q.windows.reduce((s, w) => s + (w.qty || 1), 0) : (q.windows?.length || 0);
                return (
                  <tr key={q.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{q.customer_name}</div>
                      <div style={{ fontSize: 11, color: T.textMuted }}>{q.address || q.zip}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="avatar" style={{ background: T.accent, width: 22, height: 22, fontSize: 9 }}>
                          {(q.created_by_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: 12 }}>{q.created_by_name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td style={{ color: T.textMuted, fontSize: 12, whiteSpace: 'nowrap' }}>
                      {new Date(q.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="mono" style={{ fontSize: 13 }}>{windowCount || '—'}</span>
                    </td>
                    <td><span className="mono" style={{ fontWeight: 700 }}>{fmt(q.total)}</span></td>
                    <td><span className="mono" style={{ fontSize: 12, color: T.accent }}>{fmt(deposit)}</span></td>
                    <td>
                      <span style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                        background: `${statusColors[q.status]}20`,
                        color: statusColors[q.status] || T.textMuted,
                        border: `1px solid ${statusColors[q.status]}40`,
                      }}>
                        {q.status}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: 12, fontFamily: 'DM Mono',
                        color: daysSince > 30 ? T.danger : daysSince > 14 ? T.warning : T.success,
                      }}>
                        {daysSince}d
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: T.textMuted, padding: 32 }}>
                  {t('noQuotesFilter',lang)}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: T.textMuted, padding: '0 4px' }}>
            <span>{filtered.length} {t('quotesCount',lang)} <strong style={{ color: T.text, fontFamily: 'DM Mono' }}>{fmt(filtered.reduce((s, q) => s + (q.total || 0), 0))}</strong></span>
            <span>{t('paid',lang)}: <strong style={{ color: T.success, fontFamily: 'DM Mono' }}>{fmt(filtered.filter(q => q.status === 'paid').reduce((s, q) => s + (q.total || 0), 0))}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── COMPANY ADMIN PANEL ──────────────────────────────────────────────────────
function CompanyAdminPanel({ appData, auth }) {
  const { lang } = useLang();
  const [tab, setTab] = useState("dashboard");
  const [contractors, setContractors] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selQuote, setSelQuote] = useState(null);
  const [addQuotesFor, setAddQuotesFor] = useState(null);
  const [editNameFor, setEditNameFor] = useState(null);
  const [resetPwFor, setResetPwFor] = useState(null);
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
      {editNameFor && (
        <EditNameModal
          contractor={editNameFor}
          onClose={() => setEditNameFor(null)}
          onSave={(id, name) => {
            setContractors(cs => cs.map(c => c.id === id ? { ...c, full_name: name } : c));
            setToast({ message: "Name updated ✓", type: "success" });
          }}
        />
      )}
      {resetPwFor && (
        <ResetPasswordModal
          contractor={resetPwFor}
          onClose={() => setResetPwFor(null)}
          onSuccess={() => setToast({ message: "Password reset email sent ✓", type: "success" })}
        />
      )}
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
            { label: t("contractors",lang), value: contractors.length },
            { label: t("quotes",lang), value: quotes.length },
            { label: t("revenue",lang), value: fmt(rev) },
            { label: t("billing",lang), value: fmt(billingTotal), highlight: true },
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
        {[{ id: "dashboard", label: t('dashboardTab',lang) }, { id: "team", label: t('myTeam',lang) }, { id: "quotes", label: t('allQuotesTab',lang) }, { id: "billing", label: t('billingTab',lang) }, { id: "catalog", label: t('catalogTab',lang) }].map(tb => (
          <button key={tb.id} className={`admin-nav-item ${tab === tb.id ? 'active' : ''}`} onClick={() => setTab(tb.id)}>{tb.label}</button>
        ))}
      </div>

      {/* DASHBOARD TAB */}
      {tab === "dashboard" && (
        <TeamDashboard quotes={quotes} contractors={contractors} />
      )}

      {/* TEAM TAB */}
      {tab === "team" && (
        <div className="fade-up">
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>{t('myTeam',lang)}</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>{t('contractor',lang)}</th><th>{t('plan',lang)}</th><th>{t('used',lang)}</th><th>{t('remaining',lang)}</th><th>{t('lastActivity',lang)}</th><th>{t('actions',lang)}</th></tr></thead>
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ fontWeight: 600 }}>{u.full_name || 'No name'}</div>
                            <button onClick={() => setEditNameFor(u)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, padding: '2px 4px', borderRadius: 4, lineHeight: 1 }}
                              title="Edit name">
                              ✏️
                            </button>
                          </div>
                            {!hasPlan && <div style={{ fontSize: 11, color: T.danger }}>{t('noPlanWarn',lang)}</div>}
                            {isLow && <div style={{ fontSize: 11, color: T.warning }}>{t('lowQuotes',lang)}</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        {hasPlan
                          ? <span className="badge badge-blue">{p.name}</span>
                          : <span className="badge badge-red">{t('noPlan',lang)}</span>
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
                        {last ? new Date(last.created_at).toLocaleDateString() : t('noActivity',lang)}
                      </td>
                      <td>
                        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                          {!hasPlan ? (
                            <button className="btn btn-primary btn-sm" onClick={() => setAddQuotesFor({ ...u, _forceMode: 'upgrade' })}
                              style={{ fontSize: 12 }}>
                              {t('assignPlan',lang)}
                            </button>
                          ) : (
                            <button className="btn btn-accent btn-sm" onClick={() => setAddQuotesFor(u)}
                              style={{ fontSize: 12 }}>
                              {t('addQuotes',lang)}
                            </button>
                          )}
                          <button className="btn btn-secondary btn-sm" onClick={() => setResetPwFor(u)}
                            style={{ fontSize: 12 }} title="Send password reset email">
                            {t('resetPW',lang)}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {contractors.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: T.textMuted, padding: 32 }}>
  {t('noContractors',lang)}
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
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>{t('allQuotesTitle',lang)}</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>{t('customer',lang)}</th><th>{t('contractor',lang)}</th><th>{t('date',lang)}</th><th>{t('total',lang)}</th><th>{t('status',lang)}</th></tr></thead>
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
                {quotes.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: T.textMuted, padding: 32 }}>{t('noQuotesYet',lang)}</td></tr>}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: T.accent }}>{t('clickRow',lang)}</div>
          {selQuote && <QuoteDetailModal quote={selQuote} onClose={() => setSelQuote(null)} onStatusChange={async (id, status) => { await updateStatus(id, status); setSelQuote(q => ({ ...q, status })); }} />}
        </div>
      )}

      {/* BILLING TAB */}
      {tab === "billing" && (
        <div className="fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 18 }}>{t('billingHistory',lang)}</h3>
            <div style={{ background: T.accentLight, border: `1px solid #BFDBFE`, borderRadius: 10, padding: '8px 14px' }}>
              <span style={{ fontSize: 12, color: T.textMuted }}>{t('totalSpent',lang)} </span>
              <span style={{ fontWeight: 800, fontFamily: 'DM Mono', color: T.accent }}>{fmt(billingTotal)}</span>
            </div>
          </div>
          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: T.textMuted }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>💳</div>
              <div style={{ fontWeight: 600 }}>{t('noTransactions',lang)}</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{t('purchasesHere',lang)}</div>
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
            <span>{t('mockWarning2',lang)}</span>
          </div>
        </div>
      )}

      {/* CATALOG TAB */}
      {tab === "catalog" && (
        <div className="fade-up">
          <div className="info-box" style={{ marginBottom: 20 }}>
            <Icon name="info" size={14} />
            <div><strong>{t('customCatalog',lang)}</strong> {t('customCatalogDesc',lang)}</div>
          </div>
          <ProductsAdmin appData={appData} showToast={t => setToast({ message: t, type: "success" })} companyId={auth.companyId} companies={[]} />
        </div>
      )}
    </div>
  );
}

// ─── SUPER BILLING PANEL ──────────────────────────────────────────────────────
function SuperBillingPanel({ companyFilter }) {
  const { lang } = useLang();
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
          { label: t('totalRevenue',lang), value: fmt(totalRevenue), color: T.accent, bg: T.accentLight },
          { label: t('transactions',lang), value: transactions.length, color: T.text, bg: T.surfaceAlt },
          { label: t('mockPending',lang), value: mockCount, color: T.warning, bg: T.warningLight },
          { label: t('realPayments',lang), value: realCount, color: T.success, bg: T.successLight },
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
          <div style={{ fontWeight: 700, fontSize: 13, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>{t('byCompany',lang)}</div>
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
          <div style={{ fontWeight: 600 }}>{t('noTransactions',lang)}</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>{t('theyAppear',lang)}</div>
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
          <span><strong>{mockCount} {mockCount > 1 ? t('mockCountP',lang) : t('mockCount',lang)}</strong> {t('mockOnce',lang)}</span>
        </div>
      )}
    </div>
  );
}

// ─── PRODUCTS ADMIN ───────────────────────────────────────────────────────────
// companyId: if set, this admin can only manage their company's products
// companies: list of all companies (superadmin only, for the scope dropdown)
function ProductsAdmin({ appData, showToast, companyId = null, companies = [] }) {
  const { lang } = useLang();
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
    if (!confirm(t('deactivateConfirm',lang))) return;
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
        <h3 style={{ fontWeight: 700, fontSize: 18 }}>{t('products',lang)}</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setModal({ name: '', base_price: '', scope: companyId || 'global' })}>
          <Icon name="plus" /> {t('addProduct',lang)}
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
              <th>{t('productName',lang)}</th>
              <th>{t('basePrice',lang)}</th>
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
          <span>{t('globalDesc',lang)}</span>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>{modal.id ? t('editProduct',lang) : t('addProduct',lang)}</div>

            <div className="field">
              <label className="label">{t('productName',lang)}</label>
              <input className="input" placeholder="e.g. Triple Pane Premium" value={modal.name} onChange={e => setModal({ ...modal, name: e.target.value })} />
            </div>

            <div className="field">
              <label className="label">{t('basePrice',lang)}</label>
              <input className="input" type="number" placeholder="350" value={modal.base_price} onChange={e => setModal({ ...modal, base_price: e.target.value })} />
            </div>

            {/* Scope selector — only for superadmin */}
            {companies.length > 0 && (
              <div className="field">
                <label className="label">{t('scopeLabel',lang)}</label>
                <select className="select" value={modal.scope || 'global'} onChange={e => setModal({ ...modal, scope: e.target.value })}>
                  <option value="global">{t('globalScope',lang)}</option>
                  {companies.map(c => <option key={c.id} value={c.id}>🏢 {c.name}</option>)}
                </select>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>{t('scopeHint',lang)}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setModal(null)}>{t('cancel',lang)}</button>
              <button className="btn btn-primary" style={{ flex: 2 }} disabled={saving || !modal.name || !modal.base_price} onClick={() => save(modal)}>
                {saving ? t('saving',lang) : <><Icon name="save" /> {t('save',lang)}</>}
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
  const { lang } = useLang();
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
        <h3 style={{fontWeight:700,fontSize:18}}>{t('cityRules',lang)}</h3>
        <button className="btn btn-primary btn-sm" onClick={()=>setModal({zip:'',city:'',county:'',permit_required:false,hurricane_zone:false,inspection_required:false,permit_cost:0})}><Icon name="plus"/> {t('addZip',lang)}</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>{t('zip',lang)}</th><th>{t('city',lang)}</th><th>{t('permit',lang)}</th><th>{t('hurricane',lang)}</th><th>{t('permitCost',lang)}</th><th>{t('actions',lang)}</th></tr></thead>
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
            <div style={{fontWeight:700,fontSize:17,marginBottom:16}}>{modal.id?t('editCityRule',lang):t('addCityRule',lang)}</div>
            <div className="row">
              <div className="col field"><label className="label">{t('zip',lang)}</label><input className="input" value={modal.zip} onChange={e=>setModal({...modal,zip:e.target.value})}/></div>
              <div className="col field"><label className="label">{t('city',lang)}</label><input className="input" value={modal.city} onChange={e=>setModal({...modal,city:e.target.value})}/></div>
            </div>
            <div className="field"><label className="label">{t('county',lang)}</label><input className="input" value={modal.county||''} onChange={e=>setModal({...modal,county:e.target.value})}/></div>
            <div className="field"><label className="label">{t('permitCost',lang)}</label><input className="input" type="number" value={modal.permit_cost} onChange={e=>setModal({...modal,permit_cost:e.target.value})}/></div>
            {[[`permit_required`,t('permitRequired',lang)],[`hurricane_zone`,t('hurricaneZoneChk',lang)],[`inspection_required`,t('inspectionReq',lang)]].map(([key,label])=>(
              <div key={key} className={`checkbox-row ${modal[key]?'checked':''}`} onClick={()=>setModal({...modal,[key]:!modal[key]})} style={{marginBottom:8}}>
                <div className={`checkbox-box ${modal[key]?'checked':''}`}>{modal[key]&&<Icon name="check" size={12}/>}</div>
                <div className="checkbox-label">{label}</div>
              </div>
            ))}
            <div style={{display:'flex',gap:10,marginTop:8}}>
              <button className="btn btn-secondary" style={{flex:1}} onClick={()=>setModal(null)}>{t('cancel',lang)}</button>
              <button className="btn btn-primary" style={{flex:2}} disabled={saving} onClick={()=>save(modal)}>{saving?'...':<><Icon name="save"/> {t('save',lang)}</>}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMPANY FORM ─────────────────────────────────────────────────────────────
function CompanyForm({ data, onSave, onClose, saving }) {
  const { lang } = useLang();
  const [form,setForm]=useState(data);
  return(
    <>
      <div className="field"><label className="label">{t('companyName',lang)}</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="ABC Windows Inc."/></div>
      <div className="field"><label className="label">{t('phone',lang)}</label><input className="input" value={form.phone||''} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="(305) 555-0100"/></div>
      <div className="field"><label className="label">{t('address',lang)}</label><input className="input" value={form.address||''} onChange={e=>setForm({...form,address:e.target.value})} placeholder="123 Main St, Miami FL"/></div>
      <div style={{display:'flex',gap:10,marginTop:8}}>
        <button className="btn btn-secondary" style={{flex:1}} onClick={onClose}>{t('cancel',lang)}</button>
        <button className="btn btn-primary" style={{flex:2}} disabled={saving} onClick={()=>onSave(form)}>{saving?'...':<><Icon name="save"/> {t('save',lang)}</>}</button>
      </div>
    </>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const auth = useAuth();
  const [lang, setLang] = useState(() => localStorage.getItem('wq_lang') || 'en');
  const changeLang = (l) => { setLang(l); localStorage.setItem('wq_lang', l); };
  const appData = useAppData(auth.isSuperAdmin ? null : auth.companyId);

  if (auth.loading) return <LangContext.Provider value={{ lang, setLang: changeLang }}><style>{css}</style><LoadingScreen/></LangContext.Provider>;
  if (!auth.user) return <LangContext.Provider value={{ lang, setLang: changeLang }}><style>{css}</style><LoginScreen onLogin={auth.signIn}/></LangContext.Provider>;

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang }}>
      <style>{css}</style>
      {auth.isContractor && <Wizard appData={appData} auth={auth}/>}
      {auth.isCompanyAdmin && <CompanyAdminPanel appData={appData} auth={auth}/>}
      {auth.isSuperAdmin && <SuperAdminPanel appData={appData} auth={auth}/>}
      {!auth.isContractor && !auth.isCompanyAdmin && !auth.isSuperAdmin && <Wizard appData={appData} auth={auth}/>}
    </LangContext.Provider>
  );
}
