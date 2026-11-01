import React, { useState, useEffect } from 'react';
import { Target, Search, ArrowLeft, FileText, ChevronRight, BarChart3, AlertCircle, Building2, Cpu, LogOut, PieChart, TrendingUp, Zap, AlertTriangle, Eye, RefreshCw, Gavel, Users, Clock, CheckCircle, Brain, History, FileSearch, Scale, UserPlus, Settings, FileDigit, Fingerprint, ShieldAlert, Crosshair, CreditCard, Mail, Database, Briefcase, FileOutput, Key } from 'lucide-react';

export const GUATECOMPRAS_CATEGORIAS = [
  { id: 'a', name: "Construcción y materiales afines" },
  { id: 'b', name: "Papelería y artículos de librería" },
  { id: 'c', name: "Computación y telecomunicaciones" },
  { id: 'd', name: "Alimentos y semillas" },
  { id: 'e', name: "Vehículos y repuestos" },
  { id: 'f', name: "Limpieza, fumigación y artículos afines" },
  { id: 'g', name: "Publicidad, imprenta y afines" },
  { id: 'h', name: "Seguros y fianzas" },
  { id: 'i', name: "Transporte, fletes y almacenaje" },
  { id: 'j', name: "Ropa, textiles y calzado" },
  { id: 'k', name: "Salud e insumos hospitalarios" },
  { id: 'l', name: "Seguridad y armamento" },
  { id: 'm', name: "Maquinaria y equipo" },
  { id: 'n', name: "Educación, cultura y deportes" },
  { id: 'o', name: "Combustibles y lubricantes" },
  { id: 'p', name: "Mobiliario y equipo de oficina" },
  { id: 'q', name: "Otros servicios y adquisiciones" }
];

export const TODAS_LAS_MODALIDADES = [
  "Adquisición Directa por Ausencia de Oferta",
  "Adquisiciones con proveedor único (Art.43 inciso c)",
  "Arrendamiento o Adquisición de Bienes Inmuebles",
  "Arrendamientos por Cotización",
  "Arrendamientos por Licitación Pública",
  "Bienes y Suministros Importados (Art. 5 LCE)",
  "Compra Competitiva con Oferta Electrónica",
  "Compra de Baja Cuantía (Art.43 inciso a)",
  "Compra Directa con Oferta Electrónica",
  "Compra Directa Oferta Electrónica COVID19",
  "Contrato Abierto (Art. 46 LCE)",
  "Contrato Abierto de Salud",
  "Convenios y Tratados Internacionales",
  "Cotización (Art. 38 LCE)",
  "Donaciones",
  "Dragados",
  "Enajenación y Transferencia de Bienes Inmuebles",
  "Licitación de proyectos APP",
  "Licitación Pública (Art. 17 LCE)",
  "Negociaciones entre Entidades Públicas",
  "Precalificación de Proyectos APP",
  "Subasta Electrónica Inversa (Art. 54Bis)",
  "Fase de Precalificación",
  "Concesiones (Art. 95 LCE)",
  "Casos de Excepción (Art. 44 LCE)",
  "Subasta Pública (Art. 89 LCE)",
  "Vinculaciones Acuerdo Ministerial 65-2011",
  "Sin Modalidad"
];

const EMPRESAS_COMPRADORAS = [
  { entidad: "INSTITUTO GUATEMALTECO DE SEGURIDAD SOCIAL -IGSS-", unidad: "HOSPITAL DE COATEPEQUE, QUETZALTENANGO" },
  { entidad: "MINISTERIO DE SALUD PÚBLICA Y ASISTENCIA SOCIAL", unidad: "HOSPITAL ROOSEVELT" },
  { entidad: "SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA", unidad: "GERENCIA DE INFORMÁTICA" },
  { entidad: "MINISTERIO DE EDUCACIÓN (MINEDUC)", unidad: "DIRECCIÓN DEPARTAMENTAL GUATEMALA" }
];

export default function App() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'CHECKOUT' | 'LOGIN' | 'CLIENT' | 'SUPERADMIN'>('LANDING');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [nogs, setNogs] = useState<any[]>([]); 
  const [historyNogs, setHistoryNogs] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ANALIZADOR' | 'ALERTAS' | 'RECUPERACION' | 'WORKSPACE' | 'LABORATORIO'>('DASHBOARD');
  const [detailSubTab, setDetailSubTab] = useState<'RESUMEN' | 'HISTORIAL' | 'CRITERIOS' | 'COMPETENCIA' | 'OPERACION'>('RESUMEN');

  const [filterModalidad, setFilterModalidad] = useState('TODAS');
  const [selectedCategory, setSelectedCategory] = useState('TODAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCustomCat, setNewCustomCat] = useState('');

  const [nogSearchInput, setNogSearchInput] = useState('');
  const [analyzedNog, setAnalyzedNog] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ourCost, setOurCost] = useState('');
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // 🚀 ARQUITECTURA MULTI-TENANT (SaaS)
  const [tokenPool, setTokenPool] = useState(48500);
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Cropa DSV', nit: '123456-7', adminEmail: 'admin@cropa.com', activeUsers: 3, plan: 'PRO Anual', tokens: 50000, expires: '2027-11-01', gatewayId: 'cus_xyz123', status: 'Activo' }
  ]);
  const [newTenantForm, setNewTenantForm] = useState({ companyName: '', nit: '', adminEmail: '' });
  const [checkoutMode, setCheckoutMode] = useState<'LICENSE' | 'TOKENS'>('LICENSE');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (currentView === 'CLIENT') {
      setIsLoading(true);
      setTimeout(() => { generarDatosMasivos(); setIsLoading(false); }, 500);
    }
  }, [currentView]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (email === 'haroldocana@comptech.lat' && password === 'Admin123*') setCurrentView('SUPERADMIN');
      else setCurrentView('CLIENT');
      setIsLoading(false);
    }, 800);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Pago procesado. Enviando credenciales e instrucciones al Master Admin...');
      setTimeout(() => setCurrentView('LOGIN'), 3500);
    }, 2000);
  };

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    setTenants([...tenants, { id: Date.now(), name: newTenantForm.companyName, adminEmail: newTenantForm.adminEmail, activeUsers: 1, plan: 'PRO Anual', tokens: 50000, expires: '2027-11-15', gatewayId: `cus_${Math.floor(Math.random()*10000)}`, status: 'Activo' }]);
    setNewTenantForm({ companyName: '', nit: '', adminEmail: '' });
    alert("Empresa cliente creada con éxito.");
  };

  // 🚀 GENERADOR MÁSTER CON TODAS LAS VARIABLES TÉCNICAS
  const generarDatosMasivos = () => {
    const generatedActive = [];
    for (let i = 0; i < 327; i++) {
      const randCat = GUATECOMPRAS_CATEGORIAS[Math.floor(Math.random() * GUATECOMPRAS_CATEGORIAS.length)].name;
      const randEntity = EMPRESAS_COMPRADORAS[i % EMPRESAS_COMPRADORAS.length];
      const randModalidad = TODAS_LAS_MODALIDADES[Math.floor(Math.random() * TODAS_LAS_MODALIDADES.length)];
      const simulatedNog = (32560500 + i * 7).toString();
      
      const isTech = randCat === "Computación y telecomunicaciones";
      const previousPrice = Math.floor(Math.random() * 800000) + 50000;
      
      let tiempoCierre = "Más de 3 Días"; let semaforo = "VERDE"; let horasRestantes = Math.floor(Math.random() * 120) + 73; 
      const rand = Math.random();
      if (rand < 0.12) { tiempoCierre = "Cierra Hoy"; semaforo = "ROJO"; horasRestantes = Math.floor(Math.random() * 24) + 1; }
      else if (rand < 0.30) { tiempoCierre = "Cierra Mañana"; semaforo = "AMARILLO"; horasRestantes = Math.floor(Math.random() * 48) + 25; }

      generatedActive.push({
        id: `act_${simulatedNog}`, 
        nog: simulatedNog,
        title: `ADQUISICIÓN DE ${randCat.split(' ')[0].toUpperCase()} - EJERCICIO 2026`,
        description: `Servicios y suministros para la unidad compradora según bases vigentes.`,
        buyer: randEntity.entidad, 
        unidadCompradora: randEntity.unidad,
        procurementType: randModalidad, 
        category: randCat,
        // 🚀 EXTRACCIÓN DE FIANZAS EXACTAS
        fianzaSostenimiento: randModalidad.includes("Baja Cuantía") || randModalidad.includes("Directa") ? "0.00%" : "2.00%",
        fianzaCumplimiento: randModalidad.includes("Baja Cuantía") || randModalidad.includes("Directa") ? "0.00%" : "10.00%",
        beneficiarioFianza: randEntity.entidad, 
        specialtyTag: isTech ? "Tecnología" : "General",
        detectedRequirements: ["Solvencia Fiscal", "Constancia RGAE", "Muestras Físicas", "Certificación Técnica ISO"],
        qualificationCriteria: [{ name: "Precio", weight: 60 }, { name: "Calidad Técnica", weight: 30 }, { name: "Tiempo de Entrega", weight: 10 }],
        estimatedBudget: previousPrice * 1.15,
        horasRestantes: horasRestantes,
        requiresOnSiteVisit: i % 3 === 0, 
        onSiteVisitDetails: { date: "15/11/2026 09:00 AM", location: randEntity.unidad },
        actionHistory: [{ action: "CREACIÓN", description: `Publicación inicial estructurada. NOG ${simulatedNog}.`, documents: [`Especificaciones_Tecnicas.pdf`, `Bases_Administrativas.docx`] }],
        // 🚀 EXTRACCIÓN IA DE PRODUCTOS
        aiProductExtraction: {
          tipo: isTech ? "Equipamiento de Redes/Servidores" : "Insumos e Inventario",
          marcasAceptadas: isTech ? ["Dell", "HP", "Cisco", "Fortinet"] : ["Certificadas", "Nacionales"],
          modeloBase: isTech ? "Especificaciones equivalentes a R740" : "Sujeto a muestras",
          servicioIncluido: "Soporte Técnico Especializado 36 meses"
        },
        // 🚀 CRUCE DE COMPETITIVIDAD A 3 AÑOS
        historicalCompetition: { 
          hasHistory: true, previousWinner: "Competidor S.A.", 
          similarityScore: Math.floor(Math.random() * 20) + 75, 
          previousPrice: previousPrice, yearsAgo: Math.floor(Math.random()*3)+1,
          previousNog: (parseInt(simulatedNog) - 120000).toString()
        }
      });
    }
    setNogs(generatedActive);

    const generatedHistory = [];
    for (let i = 0; i < 120; i++) {
      const randCat = GUATECOMPRAS_CATEGORIAS[Math.floor(Math.random() * GUATECOMPRAS_CATEGORIAS.length)].name;
      generatedHistory.push({
        id: `hist_${i}`, title: `SUMINISTRO DE ${randCat.toUpperCase()} (Adjudicado)`, 
        buyer: EMPRESAS_COMPRADORAS[i % EMPRESAS_COMPRADORAS.length].entidad, category: randCat,
        strategyIntelligence: { previousWinner: "Proveedor Histórico", priceToBeat: Math.floor(Math.random() * 800000) + 50000, renewalDate: `Q${(i % 4) + 1} 2026`, biddersCount: Math.floor(Math.random()*5)+2 }
      });
    }
    setHistoryNogs(generatedHistory);
  };

  const handleAnalyzeNog = (e: React.FormEvent) => {
    e.preventDefault();
    if(!nogSearchInput) return;
    setIsAnalyzing(true);
    setAnalyzedNog(null);
    setTokenPool(prev => prev - 25); 
    setTimeout(() => {
      const found = nogs.find(n => n.nog === nogSearchInput.trim()) || nogs[0];
      setAnalyzedNog(found);
      setIsAnalyzing(false);
      setDetailSubTab('RESUMEN');
    }, 2000);
  };

  const handleRunSimulation = (priceToBeat: number) => {
    const cost = parseFloat(ourCost);
    if (!cost || isNaN(cost)) return alert("Ingresa un costo base válido.");
    const suggestedBid = priceToBeat * 0.95; 
    const estimatedMargin = ((suggestedBid - cost) / suggestedBid) * 100;
    setSimulationResult({ suggestedBid: suggestedBid.toFixed(2), estimatedMargin: estimatedMargin.toFixed(1), winProbability: estimatedMargin > 15 ? 'Alta (78%)' : 'Moderada (52%)' });
  };

  // ==========================================
  // VISTAS EXTERNAS: LANDING, CHECKOUT, LOGIN
  // ==========================================
  if (currentView === 'LANDING') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="relative flex items-center justify-center w-24 h-24 bg-blue-600 rounded-3xl shadow-[0_0_40px_rgba(37,99,235,0.5)] mb-8"><Brain size={48} strokeWidth={1.5}/></div>
        <h1 className="text-6xl font-black mb-4 tracking-tighter">NOG<span className="text-blue-500">Hunter</span> Pro</h1>
        <p className="text-xl text-slate-400 mb-10 font-medium max-w-3xl text-center">Motor IA para extracción de bases, análisis de competencia y gestión operativa de las 30 modalidades de compra en Guatecompras.</p>
        <div className="flex gap-4">
          <button onClick={() => setCurrentView('LOGIN')} className="bg-slate-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-700 transition-all border border-slate-700">Client Login</button>
          <button onClick={() => {setCheckoutMode('LICENSE'); setCurrentView('CHECKOUT');}} className="bg-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50">Adquirir Licencia B2B</button>
        </div>
      </div>
    );
  }

  if (currentView === 'CHECKOUT') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
        <button onClick={() => setCurrentView('LANDING')} className="absolute top-6 left-6 text-sm text-slate-500 font-bold flex items-center gap-1"><ArrowLeft size={16}/> Volver</button>
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-slate-900">{checkoutMode === 'LICENSE' ? 'Suscripción Tenant' : 'Recarga de Tokens IA'}</h2>
            <div className="text-4xl font-black text-blue-600 mt-2">{checkoutMode === 'LICENSE' ? 'Q 12,500' : 'Q 1,500'} <span className="text-sm text-slate-400 font-medium">{checkoutMode === 'LICENSE' ? '/ año' : '/ 50k Tokens'}</span></div>
            <p className="text-xs text-slate-500 mt-2">{checkoutMode === 'LICENSE' ? 'Licencia Master, usuarios configurables y 50,000 tokens iniciales.' : 'Bolsón adicional para análisis profundo de competencia y extracción DOCX.'}</p>
          </div>
          {successMsg ? (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-center font-bold text-sm"><CheckCircle className="inline mb-1" size={24}/><br/>{successMsg}</div>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <input type="text" className="w-full px-4 py-3 border rounded-xl bg-slate-50" placeholder="Razón Social / Empresa" required />
              <input type="text" className="w-full px-4 py-3 border rounded-xl bg-slate-50" placeholder="NIT" required />
              <input type="email" className="w-full px-4 py-3 border rounded-xl bg-slate-50" placeholder="Correo Master (Recepción de Acceso)" required />
              <div className="border-t border-slate-100 pt-4 mt-2">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-2"><CreditCard size={16}/> Pasarela de Pago Segura</div>
                <input type="text" className="w-full px-4 py-3 border rounded-xl bg-slate-50 mb-2" placeholder="Número de Tarjeta" required />
                <div className="flex gap-2">
                  <input type="text" className="w-1/2 px-4 py-3 border rounded-xl bg-slate-50" placeholder="MM/YY" required />
                  <input type="text" className="w-1/2 px-4 py-3 border rounded-xl bg-slate-50" placeholder="CVC" required />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-md transition-all">Procesar Pago</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'LOGIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
        <button onClick={() => setCurrentView('LANDING')} className="absolute top-6 left-6 text-sm text-slate-500 font-bold flex items-center gap-1"><ArrowLeft size={16}/> Volver</button>
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <div className="flex justify-center mb-2"><div className="bg-blue-600 p-4 rounded-2xl"><Brain size={32} className="text-white"/></div></div>
          <h1 className="text-3xl font-black text-center tracking-tight text-slate-900">NOGHunter Pro</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-xl bg-slate-50" placeholder="Usuario / Correo Administrativo" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-xl bg-slate-50" placeholder="Contraseña Segura" required />
            <button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-md transition-all">Autenticar Panel</button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA SUPERADMIN (GESTIÓN DE LICENCIAS Y USUARIOS)
  // ==========================================
  if (currentView === 'SUPERADMIN') {
    return (
      <div className="min-h-screen bg-slate-100 font-sans flex">
        <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
          <div>
            <div className="p-6 border-b border-slate-800 font-black text-xl flex items-center gap-2"><Key className="text-blue-500"/> Master Admin</div>
            <nav className="p-4 space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white shadow-lg"><Database size={18}/> Tenants (Empresas)</button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400"><CreditCard size={18}/> Pasarela & Pagos</button>
            </nav>
          </div>
          <div className="p-4 border-t border-slate-800"><button onClick={() => setCurrentView('LOGIN')} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-slate-800 text-xs font-bold transition-colors"><LogOut size={16}/> Cerrar Sesión</button></div>
        </aside>
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-black text-slate-800">Control de Entorno Multi-Tenant</h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-4 py-2 rounded-lg border border-blue-200">Facturación Anual Proyectada: Q {(tenants.length * 12500).toLocaleString()}</span>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><UserPlus size={18} className="text-blue-600"/> Aprovisionar Tenant Manualmente</h3>
            <form onSubmit={handleAddTenant} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Razón Social</label><input type="text" value={newTenantForm.companyName} onChange={e => setNewTenantForm({...newTenantForm, companyName: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required/></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">NIT</label><input type="text" value={newTenantForm.nit} onChange={e => setNewTenantForm({...newTenantForm, nit: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required/></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Correo Master (Envío Auth)</label><input type="email" value={newTenantForm.adminEmail} onChange={e => setNewTenantForm({...newTenantForm, adminEmail: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required/></div>
              <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-all">Crear e Informar</button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                <tr><th className="p-4">Tenant (Empresa)</th><th className="p-4">Gateway ID</th><th className="p-4">Admin Email</th><th className="p-4">Vencimiento</th><th className="p-4 text-center">Gestión</th></tr>
              </thead>
              <tbody>
                {tenants.map(t => (
                  <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-800">{t.name} <span className="block text-xs text-slate-400 font-normal">NIT: {t.nit} | {t.activeUsers} Usuarios</span></td>
                    <td className="p-4 text-xs font-mono text-slate-500">{t.gatewayId}</td>
                    <td className="p-4 text-sm text-blue-600 font-medium">{t.adminEmail}</td>
                    <td className="p-4 text-sm font-bold text-slate-700">{t.expires}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button onClick={() => alert(`Reenviando credenciales a ${t.adminEmail}`)} className="bg-slate-200 p-2 rounded text-slate-700 hover:bg-slate-300"><Mail size={14}/></button>
                      <button onClick={() => alert(`Forzando recarga de 50k tokens vía Gateway ${t.gatewayId}`)} className="bg-emerald-100 p-2 rounded text-emerald-700 hover:bg-emerald-200"><Database size={14}/></button>
                      <button onClick={() => alert(`Bloqueando tenant ${t.id}`)} className="bg-rose-100 p-2 rounded text-rose-700 hover:bg-rose-200"><AlertTriangle size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA CLIENTE: APLICACIÓN PRINCIPAL B2B
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-100 font-sans flex">
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-3 text-white font-black text-xl tracking-tighter">
            <div className="bg-blue-600 p-1.5 rounded-lg"><Brain size={20} className="text-white"/></div>
            NOGHunter <span className="text-[10px] bg-white text-blue-900 px-1.5 py-0.5 rounded uppercase">PRO</span>
          </div>
          <nav className="p-4 space-y-1.5 text-sm font-medium">
            <button onClick={() => {setActiveTab('DASHBOARD'); setAnalyzedNog(null);}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'DASHBOARD' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}><BarChart3 size={18}/> BI Dashboard</button>
            <button onClick={() => {setActiveTab('ANALIZADOR'); setAnalyzedNog(null);}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${(activeTab === 'ANALIZADOR' && !analyzedNog) ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}><Fingerprint size={18}/> Analizador Profundo NOG</button>
            <button onClick={() => {setActiveTab('ALERTAS'); setAnalyzedNog(null);}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'ALERTAS' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}><Target size={18}/> Buscador (30 Mod.)</button>
            <button onClick={() => {setActiveTab('WORKSPACE'); setAnalyzedNog(null);}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'WORKSPACE' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}><Briefcase size={18}/> Workspace de Operación</button>
            <button onClick={() => {setActiveTab('LABORATORIO'); setAnalyzedNog(null);}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'LABORATORIO' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}><Cpu size={18}/> Categorías Propias</button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Bolsón Tenant (IA)</span>
              <button onClick={() => {setCheckoutMode('TOKENS'); setCurrentView('CHECKOUT');}} className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold hover:bg-emerald-500">Recargar</button>
            </div>
            <div className="font-mono font-black text-emerald-400 text-lg">{tokenPool.toLocaleString()} <span className="text-xs text-slate-500">TKN</span></div>
          </div>
          <button onClick={() => setCurrentView('LOGIN')} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-slate-800 text-xs font-bold transition-colors"><LogOut size={16}/> Cerrar Sesión</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <nav className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">{analyzedNog ? `Dossier NOG: ${analyzedNog.nog}` : 'Centro de Inteligencia Comercial B2B'}</h1>
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> En Vivo: Guatecompras</span>
        </nav>

        <main className="p-6 md:p-8 space-y-8 overflow-y-auto">
          
          {/* MÓDULO 1: ANALIZADOR PROFUNDO NOG (DOSSIER) */}
          {(activeTab === 'ANALIZADOR' || analyzedNog) && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {!analyzedNog ? (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
                  <div className="flex justify-center mb-4"><Fingerprint size={64} className="text-blue-600"/></div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Analizador Profundo de Eventos (NOG)</h2>
                  <p className="text-sm text-slate-500 mb-8 max-w-xl mx-auto">El motor IA escaneará la base de Guatecompras, extraerá bases, identificará fianzas exactas, visitas técnicas, cruzará competidores con {'>'}70% de similitud y desglosará el producto.</p>
                  
                  <form onSubmit={handleAnalyzeNog} className="flex max-w-2xl mx-auto gap-4">
                    <input type="text" value={nogSearchInput} onChange={(e)=>setNogSearchInput(e.target.value)} placeholder="Ej. 32560508" className="flex-1 px-6 py-4 rounded-xl border border-slate-300 focus:border-blue-600 outline-none font-bold text-lg bg-slate-50" required/>
                    <button type="submit" disabled={isAnalyzing} className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-xl shadow-md transition-all flex items-center gap-2">
                      {isAnalyzing ? <RefreshCw className="animate-spin" size={20}/> : <Cpu size={20}/>} {isAnalyzing ? 'Analizando (-25 TKN)' : 'Ejecutar Análisis IA'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                  {/* SUB-NAVEGACIÓN DEL DOSSIER */}
                  <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                    <button onClick={() => setDetailSubTab('RESUMEN')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${detailSubTab === 'RESUMEN' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Ficha Oficial y Fianzas</button>
                    <button onClick={() => setDetailSubTab('CRITERIOS')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${detailSubTab === 'CRITERIOS' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Scale size={16}/> Extracción IA (Producto / Requisitos)</button>
                    <button onClick={() => setDetailSubTab('COMPETENCIA')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${detailSubTab === 'COMPETENCIA' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Crosshair size={16}/> Similitud Competitiva (3 Años)</button>
                    <button onClick={() => setDetailSubTab('OPERACION')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${detailSubTab === 'OPERACION' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><FileOutput size={16}/> Creador de Oferta (DOCX)</button>
                  </div>

                  {detailSubTab === 'RESUMEN' && (
                    <div className="bg-white rounded-2xl p-8 shadow-md border-t-4 border-t-blue-600">
                      <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
                        <div>
                          <span className="bg-blue-100 text-blue-800 text-xs font-black px-3 py-1 rounded-md border border-blue-200 mb-3 inline-block">NOG: {analyzedNog.nog}</span>
                          <h2 className="text-2xl font-black text-slate-900">{analyzedNog.title}</h2>
                          <p className="text-slate-600 mt-2 text-sm max-w-2xl">{analyzedNog.description}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-black px-4 py-2 rounded-md border inline-block ${analyzedNog.semaforo === 'ROJO' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>CIERRA EN {analyzedNog.horasRestantes}h</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <div className="grid grid-cols-3 border-b border-slate-50 py-2"><span className="font-bold text-slate-500">Entidad:</span><span className="col-span-2 font-bold text-slate-900">{analyzedNog.buyer}</span></div>
                        <div className="grid grid-cols-3 border-b border-slate-50 py-2"><span className="font-bold text-slate-500">Unidad Compradora:</span><span className="col-span-2 font-bold text-slate-900">{analyzedNog.unidadCompradora}</span></div>
                        <div className="grid grid-cols-3 border-b border-slate-50 py-2"><span className="font-bold text-slate-500">Modalidad Exacta:</span><span className="col-span-2 font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded w-max">{analyzedNog.procurementType}</span></div>
                        <div className="grid grid-cols-3 border-b border-slate-50 py-2"><span className="font-bold text-slate-500">Categoría Oficial:</span><span className="col-span-2 font-bold text-slate-900">{analyzedNog.category}</span></div>
                        <div className="grid grid-cols-3 border-b border-slate-50 py-2"><span className="font-bold text-slate-500">Presupuesto Ref.:</span><span className="col-span-2 font-black text-emerald-600">Q {analyzedNog.estimatedBudget?.toLocaleString()}</span></div>
                      </div>

                      <div className="mt-8 bg-amber-50 p-6 rounded-xl border border-amber-200">
                        <h4 className="text-sm font-black text-amber-900 uppercase tracking-wide mb-4">Estructura de Fianzas Exigida</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div><span className="block text-xs font-bold text-amber-700 mb-1">Sostenimiento Oferta:</span><span className="text-2xl font-black text-slate-900">{analyzedNog.fianzaSostenimiento}</span></div>
                          <div><span className="block text-xs font-bold text-amber-700 mb-1">Cumplimiento / Calidad:</span><span className="text-2xl font-black text-slate-900">{analyzedNog.fianzaCumplimiento}</span></div>
                          <div><span className="block text-xs font-bold text-amber-700 mb-1">Beneficiario Institucional:</span><span className="text-sm font-bold text-slate-700 leading-tight">{analyzedNog.beneficiarioFianza}</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {detailSubTab === 'CRITERIOS' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-900 rounded-2xl p-8 shadow-md text-white">
                        <h3 className="text-lg font-black mb-6 flex items-center gap-2"><Cpu className="text-blue-400"/> Requisitos y Visitas (Scan IA)</h3>
                        <div className="space-y-6">
                          <div>
                            <span className="text-xs text-slate-400 uppercase font-bold block mb-3">Requisitos Habilitantes (Bases)</span>
                            <div className="flex flex-wrap gap-2">
                              {analyzedNog.detectedRequirements.map((req: string, idx: number) => (
                                <span key={idx} className="bg-slate-800 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2"><CheckCircle size={14}/> {req}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 uppercase font-bold block mb-3">Ponderación de Calificación</span>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
                              {analyzedNog.qualificationCriteria.map((crit: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm"><span className="text-slate-200">{crit.name}</span><span className="font-black text-emerald-400">{crit.weight} Pts</span></div>
                              ))}
                            </div>
                          </div>
                          {analyzedNog.requiresOnSiteVisit && (
                            <div className="bg-rose-900/40 border border-rose-500/50 p-4 rounded-xl flex items-start gap-3">
                              <ShieldAlert className="text-rose-400 shrink-0"/>
                              <div><span className="text-xs font-black text-rose-300 uppercase block mb-1">Visita Técnica Obligatoria</span><span className="text-sm text-rose-100">{analyzedNog.onSiteVisitDetails.date} en {analyzedNog.onSiteVisitDetails.location}</span></div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200">
                        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><Search className="text-purple-600"/> Análisis IA de Producto</h3>
                        <div className="space-y-4">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tipo de Bien Solicitado</span>
                            <span className="text-lg font-black text-slate-800">{analyzedNog.aiProductExtraction.tipo}</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Marcas / Especificación Aceptada</span>
                            <div className="flex gap-2">
                              {analyzedNog.aiProductExtraction.marcasAceptadas.map((m:string, i:number)=>(<span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold">{m}</span>))}
                            </div>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Modelo o Equivalencia Base</span>
                            <span className="text-sm font-bold text-slate-700">{analyzedNog.aiProductExtraction.modeloBase}</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Servicios Agregados Exigidos</span>
                            <span className="text-sm font-bold text-slate-700">{analyzedNog.aiProductExtraction.servicioIncluido}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {detailSubTab === 'COMPETENCIA' && (
                    <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200">
                      <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><Crosshair className="text-purple-600"/> Similitud Competitiva (Últimos 3 Años)</h3>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8 flex items-start gap-4">
                        <Brain className="text-purple-600 flex-shrink-0" size={32}/>
                        <div>
                          <h4 className="font-black text-purple-900 mb-1 text-lg">Coincidencia de Rubros > 70%</h4>
                          <p className="text-sm text-purple-800 leading-relaxed">El motor cruzó el requerimiento técnico de este NOG con el historial de compras de <strong>{analyzedNog.unidadCompradora}</strong> y encontró un evento pasado con un <strong>{analyzedNog.historicalCompetition.similarityScore}% de similitud técnica</strong>.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                          <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Proveedor Adjudicado (Histórico)</span>
                          <div className="text-xl font-black text-slate-800">{analyzedNog.historicalCompetition.previousWinner}</div>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded mt-3 inline-block border border-slate-200">Ref NOG Antiguo: {analyzedNog.historicalCompetition.previousNog}</span>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                          <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Precio Adjudicado (Hace {analyzedNog.historicalCompetition.yearsAgo} años)</span>
                          <div className="text-2xl font-black text-emerald-600">Q {analyzedNog.historicalCompetition.previousPrice.toLocaleString()}</div>
                          <span className="text-xs font-bold text-rose-500 block mt-2">{analyzedNog.historicalCompetition.trend}</span>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-xl shadow-lg flex flex-col justify-center">
                          <span className="text-xs font-bold text-blue-400 uppercase block mb-2">Simulador de Ataque Directo</span>
                          <div className="flex gap-2 mb-3">
                            <input type="number" value={ourCost} onChange={(e) => setOurCost(e.target.value)} placeholder="Tu Costo (Q)" className="w-full px-3 py-2 border rounded-lg bg-slate-800 border-slate-700 text-white text-sm font-bold outline-none" />
                            <button onClick={() => handleRunSimulation(analyzedNog.historicalCompetition.previousPrice * 1.05)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-bold">Cruzar</button>
                          </div>
                          {simulationResult && (
                            <div className="bg-slate-800 text-white p-3 rounded-lg text-xs font-medium border border-slate-700">
                              Oferta Ganadora: <span className="font-black text-emerald-400 block text-lg mb-1">Q {simulationResult.suggestedBid}</span>
                              Margen de Venta: <span className="text-blue-400 font-bold">{simulationResult.estimatedMargin}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {detailSubTab === 'OPERACION' && (
                    <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200 text-center py-16">
                      <FileOutput size={48} className="text-blue-600 mx-auto mb-4"/>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">Generador Operativo de Licitación</h3>
                      <p className="text-sm text-slate-500 mb-8 max-w-lg mx-auto">Exporta el análisis profundo a documentos editables (Word) para que tu equipo comercial documente la oferta sin perder tiempo copiando y pegando bases.</p>
                      
                      <div className="flex flex-col md:flex-row justify-center gap-6">
                        <button onClick={() => alert("Generando DOCX con Checklist de Requisitos Habilitantes, Fianzas y Fechas Técnicas...")} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-3">
                          <FileText size={20}/> Descargar Checklist Completo (DOC)
                        </button>
                        <button onClick={() => alert("Generando DOCX con el Índice Sugerido de la Oferta Técnica y Económica...")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-3">
                          <FileText size={20}/> Generar Índice de Oferta (DOC)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* DASHBOARD EJECUTIVO */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><p className="text-xs font-bold text-slate-400 uppercase">Alertas (Vigentes)</p><h3 className="text-4xl font-black text-slate-900 mt-2">{nogs.length}</h3></div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><p className="text-xs font-bold text-slate-400 uppercase">Oportunidades Viables</p><h3 className="text-4xl font-black text-emerald-600 mt-2">16</h3></div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><p className="text-xs font-bold text-slate-400 uppercase">Eventos en Seguimiento</p><h3 className="text-4xl font-black text-amber-500 mt-2">42</h3></div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><p className="text-xs font-bold text-slate-400 uppercase">Contratos a Arrebatar</p><h3 className="text-4xl font-black text-slate-900 mt-2">{historyNogs.length}</h3></div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-base font-black text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2"><Clock size={20} className="text-rose-600"/> Cierre de Oportunidades (Matriz de Riesgo)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-rose-50 border border-rose-200 p-6 rounded-xl text-center shadow-inner"><span className="text-xs font-bold text-rose-800 uppercase">🔴 Cierran Hoy (Crítico)</span><div className="text-4xl font-black text-rose-700 mt-2">{nogs.filter(n => n.semaforo === 'ROJO').length}</div></div>
                  <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl text-center shadow-inner"><span className="text-xs font-bold text-amber-800 uppercase">🟡 Mañana (Prevención)</span><div className="text-4xl font-black text-amber-700 mt-2">{nogs.filter(n => n.semaforo === 'AMARILLO').length}</div></div>
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center shadow-inner"><span className="text-xs font-bold text-emerald-800 uppercase">🟢 Más de 3 Días (A Tiempo)</span><div className="text-4xl font-black text-emerald-700 mt-2">{nogs.filter(n => n.semaforo === 'VERDE').length}</div></div>
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO 2: RADAR DE BÚSQUEDA Y LAS 30 MODALIDADES */}
          {activeTab === 'ALERTAS' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">1. Filtrar por Modalidad de Compra Oficial</label>
                  <select value={filterModalidad} onChange={(e) => setFilterModalidad(e.target.value)} className="w-full md:max-w-xl px-4 py-3 border rounded-xl bg-slate-50 font-bold text-sm outline-none focus:border-blue-600 cursor-pointer">
                    <option value="TODAS">TODAS LAS MODALIDADES (BARREDO COMPLETO)</option>
                    {TODAS_LAS_MODALIDADES.map(mod => <option key={mod} value={mod}>{mod.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">2. Filtrar por Categoría Guatecompras / Custom</label>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedCategory('TODAS')} className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${selectedCategory === 'TODAS' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>TODAS LAS CATEGORÍAS</button>
                    {GUATECOMPRAS_CATEGORIAS.map((cat) => (
                      <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${selectedCategory === cat.name ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{cat.name.toUpperCase()}</button>
                    ))}
                    {customCategories.map((cat, i) => (
                      <button key={i} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${selectedCategory === cat ? 'bg-purple-100 border-purple-600 text-purple-800' : 'bg-white border-purple-200 text-purple-600 hover:bg-purple-50'}`}>{cat.toUpperCase()} (CUSTOM)</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 justify-between items-center">
                <div className="flex items-center gap-3 w-full flex-1">
                  <Search className="text-slate-400" size={22}/>
                  <input type="text" placeholder="Ingresa NOG, Entidad compradora o palabra clave..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-sm font-bold bg-slate-50" />
                </div>
              </div>

              <div className="space-y-4">
                {filteredNogs.slice(0, 50).map((op) => ( 
                  <div key={op.id} className={`bg-white rounded-2xl shadow-sm border-l-4 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition-all ${op.semaforo === 'ROJO' ? 'border-l-rose-500' : (op.semaforo === 'AMARILLO' ? 'border-l-amber-400' : 'border-l-emerald-500 border-y border-r border-slate-200')}`}>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded uppercase border border-blue-200">NOG: {op.nog}</span>
                        <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2.5 py-1 rounded uppercase border border-purple-200 truncate max-w-xs">{op.procurementType}</span>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded uppercase border ${op.semaforo === 'ROJO' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>Cierra en {op.horasRestantes}h</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 leading-tight mb-1">{op.title}</h3>
                        <p className="text-sm font-bold text-slate-500 flex items-center gap-2"><Building2 size={16}/> {op.buyer}</p>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                      <button onClick={() => { setNogSearchInput(op.nog); setActiveTab('ANALIZADOR'); handleAnalyzeNog({preventDefault: () => {}} as any); }} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors w-full md:w-auto whitespace-nowrap">
                        <FileDigit size={16}/> Extraer Dossier NOG (IA)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MÓDULO: CREACIÓN DE CATEGORÍAS CUSTOM (LABORATORIO) */}
          {activeTab === 'LABORATORIO' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><Cpu className="text-blue-600"/> Laboratorio de Algoritmos (Categorías Custom)</h3>
                <p className="text-sm text-slate-500 mt-2">Crea segmentos propios para que la IA agrupe eventos que beneficien tu estrategia, sin depender solo de Guatecompras.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Definir Nueva Categoría (Ej. 'Software Médico')</label>
                <div className="flex gap-4">
                  <input type="text" value={newCustomCat} onChange={e => setNewCustomCat(e.target.value)} placeholder="Nombre de la categoría..." className="flex-1 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-blue-600 text-sm" />
                  <button onClick={() => { if(newCustomCat) { setCustomCategories([...customCategories, newCustomCat]); setNewCustomCat(''); alert('Categoría algorítmica creada e integrada al buscador.'); } }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-8 py-3 rounded-xl shadow-md">Crear Segmento</button>
                </div>
              </div>
              {customCategories.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Tus Segmentos Activos:</h4>
                  <div className="flex flex-wrap gap-2">
                    {customCategories.map((c, i) => <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-purple-200">{c}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MÓDULO: WORKSPACE OPERATIVO */}
          {activeTab === 'WORKSPACE' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center py-20">
              <Briefcase size={64} className="text-slate-300 mx-auto mb-4"/>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Gestor Operativo de Licitaciones</h3>
              <p className="text-sm text-slate-500 max-w-lg mx-auto">Este módulo te permitirá llevar el control Kanban (To-Do, In Progress, Done) de los NOGs que decidiste operar y participar desde el Analizador Profundo.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
