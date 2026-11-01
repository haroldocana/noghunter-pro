import React, { useState, useEffect } from 'react';
import { Target, Search, ArrowLeft, FileText, ChevronRight, BarChart3, AlertCircle, Building2, Cpu, LogOut, PieChart, TrendingUp, Zap, AlertTriangle, Eye, RefreshCw, Gavel, Users, Clock, CheckCircle, Brain, History, FileSearch, Scale, UserPlus, Settings } from 'lucide-react';

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

export default function App() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'CHECKOUT' | 'LOGIN' | 'CLIENT' | 'SUPERADMIN' | 'DETAIL'>('LANDING');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [nogs, setNogs] = useState<any[]>([]); 
  const [historyNogs, setHistoryNogs] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNog, setSelectedNog] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ALERTAS' | 'PRESUPUESTOS' | 'RECUPERACION' | 'LABORATORIO'>('DASHBOARD');
  const [detailSubTab, setDetailSubTab] = useState<'RESUMEN' | 'HISTORIAL_ACCIONES' | 'CRITERIOS' | 'COMPETENCIA'>('RESUMEN');

  const [filterType, setFilterType] = useState('TODOS');
  const [selectedCategory, setSelectedCategory] = useState('TODAS');
  const [subFilter, setSubFilter] = useState('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  const [targetEntity, setTargetEntity] = useState('TODAS');
  const [targetCategory, setTargetCategory] = useState('TODAS');

  const [ourCost, setOurCost] = useState('');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{ title: string, content: string } | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [recoveryStrategy, setRecoveryStrategy] = useState<{ id: string, content: string } | null>(null);

  const [tenants, setTenants] = useState([
    { id: 1, name: 'Cropa DSV', adminEmail: 'admin@cropa.com', activeUsers: 3, plan: 'PRO Anual', status: 'Activo' },
    { id: 2, name: 'Cementos Progreso', adminEmail: 'cmezzano@cempro.com', activeUsers: 5, plan: 'ENTERPRISE', status: 'Activo' }
  ]);
  const [newTenantForm, setNewTenantForm] = useState({ companyName: '', nit: '', adminEmail: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(18000); 

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { generarDatosMasivos(); return 18000; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m ${seconds % 60}s`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (email.toLowerCase() === 'haroldocana@comptech.lat' && password === 'Admin123*') {
      setCurrentView('SUPERADMIN');
    } else {
      setCurrentView('CLIENT');
      setTimeout(() => { generarDatosMasivos(); }, 500);
    }
    setIsLoading(false);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('¡Pago exitoso! Se ha enviado la factura y credenciales a su correo.');
      setTimeout(() => setCurrentView('LOGIN'), 3000);
    }, 2000);
  };

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    setTenants([...tenants, { id: Date.now(), name: newTenantForm.companyName, adminEmail: newTenantForm.adminEmail, activeUsers: 1, plan: 'PRO Anual', status: 'Activo' }]);
    setNewTenantForm({ companyName: '', nit: '', adminEmail: '' });
    alert("Empresa cliente creada con éxito.");
  };

  const generarDatosMasivos = () => {
    const baseRealNogs = [
      { nog: "15412431", title: "ADQUISICIÓN DE MATERIAL MÉDICO", buyer: "MSPAS", procurementType: "CONTRATO ABIERTO", category: "Salud e insumos hospitalarios", winner: "PharmaLatam S.A." },
      { nog: "5623707", title: "SERVICIOS DE COMPUTACIÓN", buyer: "SAT", procurementType: "LICITACIÓN PÚBLICA", category: "Computación y telecomunicaciones", winner: "Tigo Business" },
      { nog: "9597875", title: "COMPRA DE MATERIAL ADOQUIN", buyer: "MUNICIPALIDAD DE CANTEL", procurementType: "COTIZACIÓN", category: "Construcción y materiales afines", winner: "Constructora Quetzal" },
      { nog: "13699512", title: "SERVICIOS GENERALES", buyer: "SESAN", procurementType: "COMPRA DIRECTA", category: "Servicios Generales", winner: "Servicios Integrales" }
    ];

    const generatedActive = [];
    for (let i = 0; i < 327; i++) {
      const realData = baseRealNogs[i % baseRealNogs.length];
      const randomCategory = i % 2 === 0 ? realData.category : GUATECOMPRAS_CATEGORIAS[i % GUATECOMPRAS_CATEGORIAS.length].name;
      const simulatedNog = (32560500 + i * 7).toString();
      
      let tiempoCierre = "Más de 3 Días"; let semaforo = "VERDE"; let horasRestantes = Math.floor(Math.random() * 120) + 73; 
      const rand = Math.random();
      if (rand < 0.12) { tiempoCierre = "Cierra Hoy"; semaforo = "ROJO"; horasRestantes = Math.floor(Math.random() * 24) + 1; }
      else if (rand < 0.30) { tiempoCierre = "Cierra Mañana"; semaforo = "AMARILLO"; horasRestantes = Math.floor(Math.random() * 48) + 25; }

      const previousPrice = Math.floor(Math.random() * 800000) + 50000;
      
      generatedActive.push({
        id: `act_${simulatedNog}`, nog: simulatedNog,
        title: `${realData.title.split(' ')[0]} DE ${randomCategory.toUpperCase()}`,
        buyer: realData.buyer, procurementType: realData.procurementType, category: randomCategory,
        specialtyTag: randomCategory === "Computación y telecomunicaciones" ? "Tecnología" : "General",
        detectedRequirements: ["3 Constancias de experiencia", "Fianza 5%"],
        estimatedBudget: previousPrice * 1.15,
        matchScore: Math.floor(Math.random() * 60) + 40,
        biddersCount: Math.floor(Math.random() * 8) + 1,
        closingTime: tiempoCierre, semaforo: semaforo, horasRestantes: horasRestantes,
        requiresOnSiteVisit: i % 4 === 0, onSiteVisitDetails: { date: "15/11/2026 10:00 AM", location: "Sede Central" },
        actionHistory: [
          { no: 1, action: "CREACIÓN", description: `Publicación exitosa. NOG ${simulatedNog}.`, documents: [`Solicitud_Requerimiento_${simulatedNog}.pdf`, `Bases_Concurso_${simulatedNog}.docx`] }
        ],
        historicalCompetition: { hasHistory: true, yearsAgo: Math.floor(Math.random() * 3) + 1, previousNog: (parseInt(simulatedNog) - 1500000).toString(), previousWinner: realData.winner, previousPrice: previousPrice, trend: "+5.2% Inflación esperada" },
        qualificationCriteria: [{ name: "Precio", weight: 40 }, { name: "Calidad Técnica", weight: 30 }, { name: "Experiencia", weight: 30 }]
      });
    }
    setNogs(generatedActive);

    const generatedHistory = [];
    for (let i = 0; i < 120; i++) {
      const realData = baseRealNogs[i % baseRealNogs.length];
      const randomCategory = GUATECOMPRAS_CATEGORIAS[i % GUATECOMPRAS_CATEGORIAS.length].name;
      generatedHistory.push({
        id: `hist_${i}`, title: `SUMINISTRO DE ${randomCategory.toUpperCase()} (Adjudicado ${2023 + (i % 3)})`, 
        buyer: realData.buyer, category: randomCategory,
        strategyIntelligence: { previousWinner: realData.winner, priceToBeat: Math.floor(Math.random() * 800000) + 50000, renewalDate: `Q${(i % 4) + 1} 2026` }
      });
    }
    setHistoryNogs(generatedHistory);
  };

  const handleRunSimulation = (priceToBeat: number) => {
    const cost = parseFloat(ourCost);
    if (!cost || isNaN(cost)) return alert("Ingresa un costo base válido.");
    const suggestedBid = priceToBeat * 0.95; 
    const estimatedMargin = ((suggestedBid - cost) / suggestedBid) * 100;
    setSimulationResult({ suggestedBid: suggestedBid.toFixed(2), estimatedMargin: estimatedMargin.toFixed(1), winProbability: estimatedMargin > 15 ? 'Alta (78%)' : 'Moderada (52%)' });
  };

  const handleAIAction = (actionType: 'CRITERIOS' | 'COMPETIDORES' | 'BASES') => {
    setIsAiProcessing(true);
    setAiAnalysisResult(null);
    setTimeout(() => {
      setIsAiProcessing(false);
      if (actionType === 'CRITERIOS') setAiAnalysisResult({ title: "⚖️ Criterios Analizados", content: "1. Precio (40%)\n2. Experiencia (30%)\n3. Soporte (30%)" });
      else if (actionType === 'COMPETIDORES') setAiAnalysisResult({ title: "📊 Competidores", content: `• ${selectedNog?.historicalCompetition?.previousWinner || 'Tigo Business'} (Alta probabilidad)\n💡 Táctica: Resaltar soporte 24/7.` });
      else if (actionType === 'BASES') setAiAnalysisResult({ title: "🚨 Alertas", content: `⚠️ Visita Técnica Presencial OBLIGATORIA.\n- Fianza: 5%.` });
    }, 1500);
  };

  const handleGenerateRecoveryStrategy = (item: any) => {
    setIsAiProcessing(true);
    setRecoveryStrategy(null);
    setTimeout(() => {
      setIsAiProcessing(false);
      setRecoveryStrategy({ id: item.id, content: `Táctica Sugerida IA para vencer a ${item.strategyIntelligence.previousWinner}:\n1. Ofrecer un 5% de descuento (Oferta Ideal: Q ${(item.strategyIntelligence.priceToBeat * 0.95).toLocaleString()}).\n2. Destacar tiempos de implementación más rápidos.\n3. Contactar 60 días antes de renovación (${item.strategyIntelligence.renewalDate}).` });
    }, 1500);
  };

  const uniqueEntitiesHist = Array.from(new Set(historyNogs.map(h => h.buyer))).sort();
  const uniqueCategoriesHist = Array.from(new Set(historyNogs.map(h => h.category))).sort();

  const filteredNogs = nogs.filter(op => {
    const matchesCategory = selectedCategory === 'TODAS' || op.category === selectedCategory;
    const matchesSubFilter = subFilter === 'TODOS' || op.specialtyTag === subFilter;
    const matchesType = filterType === 'TODOS' || op.procurementType === filterType;
    const matchesSearch = searchTerm === '' || op.title.toLowerCase().includes(searchTerm.toLowerCase()) || op.nog.includes(searchTerm);
    return matchesCategory && matchesSubFilter && matchesType && matchesSearch;
  });

  const filteredHistory = historyNogs.filter(op => {
    const matchesEntity = targetEntity === 'TODAS' || op.buyer === targetEntity;
    const matchesCategory = targetCategory === 'TODAS' || op.category === targetCategory;
    return matchesEntity && matchesCategory;
  });

  // ==========================================
  // VISTAS EXTERNAS: LANDING, CHECKOUT, LOGIN, SUPERADMIN
  // ==========================================
  if (currentView === 'LANDING') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="relative flex items-center justify-center w-24 h-24 bg-blue-600 rounded-3xl shadow-[0_0_40px_rgba(37,99,235,0.5)] mb-8">
          <Brain className="text-white" size={48} strokeWidth={1.5}/>
        </div>
        <h1 className="text-6xl font-black mb-4 tracking-tighter">NOG<span className="text-blue-500">Hunter</span> Pro</h1>
        <p className="text-xl text-slate-400 mb-10 font-medium max-w-2xl text-center">Inteligencia Artificial y Analítica B2B para dominar las ventas en Guatecompras.</p>
        <div className="flex gap-4">
          <button onClick={() => setCurrentView('LOGIN')} className="bg-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-600 transition-all">Iniciar Sesión</button>
          <button onClick={() => setCurrentView('CHECKOUT')} className="bg-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50 flex items-center gap-2">Adquirir Licencia <ChevronRight/></button>
        </div>
      </div>
    );
  }

  if (currentView === 'CHECKOUT') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
        <button onClick={() => setCurrentView('LANDING')} className="absolute top-6 left-6 text-sm text-slate-500 font-bold flex items-center gap-1"><ArrowLeft size={16}/> Volver</button>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-slate-900">Suscripción Anual</h2>
            <div className="text-4xl font-black text-blue-600 mt-2">Q 12,500 <span className="text-sm text-slate-400 font-medium">/ año</span></div>
            <p className="text-xs text-slate-500 mt-2">Incluye usuarios ilimitados, IA predictiva y soporte.</p>
          </div>
          {successMsg ? (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-center font-bold">{successMsg}</div>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <input type="text" className="w-full px-4 py-3 border rounded-xl bg-slate-50" placeholder="Nombre de la Empresa Comercial" required />
              <input type="text" className="w-full px-4 py-3 border rounded-xl bg-slate-50" placeholder="NIT" required />
              <input type="email" className="w-full px-4 py-3 border rounded-xl bg-slate-50" placeholder="Correo del Administrador" required />
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-md transition-all">Pagar Suscripción</button>
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
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-xl bg-slate-50" placeholder="Correo Administrativo" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-xl bg-slate-50" placeholder="Contraseña Segura" required />
            <button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-md transition-all">Autenticar Panel</button>
          </form>
        </div>
      </div>
    );
  }

  if (currentView === 'SUPERADMIN') {
    return (
      <div className="min-h-screen bg-slate-100 font-sans flex">
        <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
          <div>
            <div className="p-6 border-b border-slate-800 font-black text-xl flex items-center gap-2"><Settings className="text-blue-500"/> SuperAdmin</div>
            <nav className="p-4"><button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white shadow-lg"><Building2 size={18}/> Gestión de Clientes</button></nav>
          </div>
          <div className="p-4 border-t border-slate-800"><button onClick={() => setCurrentView('LOGIN')} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-slate-800 text-xs font-bold transition-colors"><LogOut size={16}/> Cerrar Sesión</button></div>
        </aside>
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-black text-slate-800">Administración de Empresas (Tenants)</h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">Licencias Activas: {tenants.length}</span>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><UserPlus size={18} className="text-blue-600"/> Registrar Nuevo Cliente B2B</h3>
            <form onSubmit={handleAddTenant} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Razón Social</label><input type="text" value={newTenantForm.companyName} onChange={e => setNewTenantForm({...newTenantForm, companyName: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required/></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">NIT</label><input type="text" value={newTenantForm.nit} onChange={e => setNewTenantForm({...newTenantForm, nit: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required/></div>
              <div><label className="block text-xs font-bold text-slate-500 mb-1">Admin Email</label><input type="email" value={newTenantForm.adminEmail} onChange={e => setNewTenantForm({...newTenantForm, adminEmail: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required/></div>
              <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-all">Crear Licencia</button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                <tr><th className="p-4">Empresa</th><th className="p-4">Administrador</th><th className="p-4">Plan Activo</th><th className="p-4 text-center">Usuarios Qty</th><th className="p-4 text-center">Estado</th></tr>
              </thead>
              <tbody>
                {tenants.map(t => (
                  <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-800">{t.name}</td>
                    <td className="p-4 text-sm text-slate-600">{t.adminEmail}</td>
                    <td className="p-4 text-xs font-bold text-purple-700 bg-purple-50 inline-block mt-3 px-2 py-1 rounded border border-purple-200">{t.plan}</td>
                    <td className="p-4 text-center font-black text-slate-700">{t.activeUsers}</td>
                    <td className="p-4 text-center"><span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">{t.status}</span></td>
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
  // VISTA INTERNA: DETALLE DEL EVENTO
  // ==========================================
  if (currentView === 'DETAIL' && selectedNog) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans">
        <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <button onClick={() => setCurrentView('CLIENT')} className="text-sm font-bold text-slate-600 flex items-center gap-2 hover:text-blue-600 transition-colors"><ArrowLeft size={16}/> Volver al Radar</button>
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-black px-3 py-1 rounded-md border border-blue-200">NOG: {selectedNog.nog}</span>
            <span className={`text-xs font-black px-3 py-1 rounded-md border ${selectedNog.semaforo === 'ROJO' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>Cierra en {selectedNog.horasRestantes}h</span>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto py-8 px-4 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedNog.title}</h2>
            <p className="text-slate-600 font-medium flex items-center gap-2 mb-6"><Building2 size={18}/> {selectedNog.buyer}</p>
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              <button onClick={() => setDetailSubTab('RESUMEN')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${detailSubTab === 'RESUMEN' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Simulador AI</button>
              <button onClick={() => setDetailSubTab('HISTORIAL_ACCIONES')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${detailSubTab === 'HISTORIAL_ACCIONES' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><History size={16}/> Historial Acciones (Docs)</button>
              <button onClick={() => setDetailSubTab('CRITERIOS')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${detailSubTab === 'CRITERIOS' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Scale size={16}/> Criterios Calificación</button>
              <button onClick={() => setDetailSubTab('COMPETENCIA')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${detailSubTab === 'COMPETENCIA' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><FileSearch size={16}/> Inteligencia Competencia</button>
            </div>
          </div>

          {detailSubTab === 'HISTORIAL_ACCIONES' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><History className="text-blue-600"/> Historial de Acciones y Extracción</h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
                    <tr><th className="p-4 w-16">No</th><th className="p-4 w-48">Acción</th><th className="p-4">Descripción y Archivos</th></tr>
                  </thead>
                  <tbody>
                    {selectedNog.actionHistory?.map((hist: any, index: number) => (
                      <tr key={index} className="border-b border-slate-100 last:border-0">
                        <td className="p-4 text-sm font-bold text-slate-600">{hist.no}</td><td className="p-4 text-sm font-black text-slate-800 uppercase">{hist.action}</td>
                        <td className="p-4">
                          <p className="text-xs text-slate-600 mb-3">{hist.description}</p>
                          <div className="space-y-2">
                            {hist.documents.map((doc: string, dIdx: number) => (
                              <div key={dIdx} className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-100"><FileText size={14} className="text-blue-600"/><span className="text-xs font-bold text-blue-900">{doc}</span></div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {detailSubTab === 'CRITERIOS' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><Scale className="text-emerald-600"/> Criterios Extraídos IA</h3>
              <div className="space-y-4 max-w-2xl">
                {selectedNog.qualificationCriteria?.map((crit: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm">{crit.name}</span>
                    <div className="flex items-center gap-4"><div className="w-48 bg-slate-200 h-2.5 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full" style={{ width: `${crit.weight}%` }}></div></div><span className="font-black text-emerald-700 w-12 text-right">{crit.weight} Pts</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detailSubTab === 'COMPETENCIA' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><FileSearch className="text-purple-600"/> Análisis de Competencia (3 Años)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><span className="text-xs font-bold text-slate-400 uppercase block mb-2">Ganador Anterior</span><div className="text-xl font-black text-slate-800">{selectedNog.historicalCompetition?.previousWinner}</div></div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><span className="text-xs font-bold text-slate-400 uppercase block mb-2">Precio Histórico Adjudicado</span><div className="text-2xl font-black text-emerald-600">Q {selectedNog.historicalCompetition?.previousPrice?.toLocaleString()}</div></div>
                <div className="bg-slate-900 p-6 rounded-xl shadow-lg"><span className="text-xs font-bold text-blue-400 uppercase block mb-2">Estrategia Ofensiva IA</span><p className="text-sm text-white">Oferta objetivo recomendada: <strong className="text-emerald-400">Q {(selectedNog.historicalCompetition?.previousPrice * 1.05)?.toLocaleString()}</strong>.</p></div>
              </div>
            </div>
          )}

          {detailSubTab === 'RESUMEN' && (
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-black mb-2 flex items-center gap-2"><Zap className="text-amber-400"/> Simulador de Oferta Ganadora</h3>
              <div className="flex flex-col md:flex-row gap-4 items-center mb-8 mt-6">
                <div className="w-full md:flex-1"><label className="block text-xs font-bold text-slate-400 uppercase mb-2">Costo Base Interno (Q)</label><input type="number" value={ourCost} onChange={(e) => setOurCost(e.target.value)} placeholder="Ej. 110000" className="w-full px-5 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none font-black text-lg" /></div>
                <button onClick={() => handleRunSimulation(selectedNog.historicalCompetition?.previousPrice * 1.05)} className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black px-10 py-4 rounded-xl self-end">Generar Estrategia Económica</button>
              </div>
              {simulationResult && (
                <div className="bg-slate-800/80 border border-blue-500/30 p-6 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div><span className="text-xs text-slate-400 uppercase tracking-wide block mb-1">Oferta Sugerida (Ganar)</span><div className="text-4xl font-black text-emerald-400">Q {simulationResult.suggestedBid}</div></div>
                  <div className="md:border-l md:border-slate-700 md:pl-6"><span className="text-xs text-slate-400 uppercase tracking-wide block mb-1">Margen Comercial Bruto</span><div className="text-4xl font-black text-blue-400">{simulationResult.estimatedMargin}%</div></div>
                  <div className="md:border-l md:border-slate-700 md:pl-6"><span className="text-xs text-slate-400 uppercase tracking-wide block mb-1">Probabilidad Algorítmica</span><div className="text-4xl font-black text-amber-400">{simulationResult.winProbability}</div></div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ==========================================
  // VISTA PRINCIPAL (DASHBOARD DEL CLIENTE)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-100 font-sans flex">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-3 text-white font-black text-xl tracking-tighter">
            <div className="bg-blue-600 p-1.5 rounded-lg"><Brain size={20} className="text-white"/></div>
            NOGHunter <span className="text-[10px] bg-white text-blue-900 px-1.5 py-0.5 rounded uppercase">PRO</span>
          </div>
          <nav className="p-4 space-y-2 text-sm font-medium">
            <button onClick={() => setActiveTab('DASHBOARD')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'DASHBOARD' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}><BarChart3 size={18}/> BI Dashboard</button>
            <button onClick={() => setActiveTab('ALERTAS')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'ALERTAS' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}><AlertCircle size={18}/> Radar Activo <span className="ml-auto bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-black">{nogs.length}</span></button>
            <button onClick={() => setActiveTab('RECUPERACION')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'RECUPERACION' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}><RefreshCw size={18}/> Inteligencia Competitiva</button>
            <button onClick={() => setActiveTab('PRESUPUESTOS')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'PRESUPUESTOS' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}><PieChart size={18}/> Presupuestos</button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-xs"><span className="text-slate-400 block mb-1 uppercase tracking-wide">Actualización de Motor:</span><span className="font-mono font-black text-blue-400 text-lg">{formatCountdown(countdown)}</span></div>
          <button onClick={() => setCurrentView('LOGIN')} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-slate-800 text-xs font-bold transition-colors"><LogOut size={16}/> Cerrar Sesión</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <nav className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">Centro de Inteligencia Comercial B2B</h1>
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> En Vivo: Guatecompras</span>
        </nav>

        <main className="p-6 md:p-8 space-y-8 overflow-y-auto">
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

          {/* PRESUPUESTOS Y EJECUCION */}
          {activeTab === 'PRESUPUESTOS' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2"><TrendingUp className="text-blue-600"/> Análisis Presupuestario Global (YTD)</h3>
              <p className="text-sm text-slate-500 mb-8">Monitoreo de fondos ejecutados por institución.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200"><span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ministerio de Finanzas</span><h4 className="text-3xl font-black text-slate-900 mt-2 mb-2">Q 4.5 Millones</h4></div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200"><span className="text-xs font-bold text-slate-500 uppercase tracking-wide">SAT (Superintendencia)</span><h4 className="text-3xl font-black text-slate-900 mt-2 mb-2">Q 8.2 Millones</h4></div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200"><span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ministerio de Salud</span><h4 className="text-3xl font-black text-slate-900 mt-2 mb-2">Q 3.1 Millones</h4></div>
              </div>
            </div>
          )}

          {/* RECUPERACIÓN / COMPETENCIA HISTORICA */}
          {activeTab === 'RECUPERACION' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2"><FileSearch className="text-purple-600"/> Inteligencia de Competencia (Contratos Históricos)</h3>
                <p className="text-sm text-slate-500">Revisa qué se adjudicó en los últimos 3 años para preparar tu táctica ofensiva antes de la renovación.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">1. Filtrar por Entidad Objetivo</label>
                  <select value={targetEntity} onChange={(e) => setTargetEntity(e.target.value)} className="w-full px-4 py-3 border rounded-xl bg-white text-sm font-bold outline-none shadow-sm">
                    <option value="TODAS">Mostrar Todas las Instituciones</option>
                    {uniqueEntitiesHist.map(entity => <option key={entity} value={entity}>{entity}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                {filteredHistory.slice(0, 15).map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:border-purple-300 transition-colors">
                    <div className="space-y-2 flex-1">
                      <span className="text-[10px] font-black bg-purple-100 text-purple-800 px-2 py-1 rounded uppercase tracking-wider">{item.buyer}</span>
                      <h4 className="font-black text-slate-900 text-lg leading-tight">{item.title}</h4>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <p className="text-slate-500">Ganador Histórico: <strong className="text-purple-700">{item.strategyIntelligence.previousWinner}</strong></p>
                        <p className="text-slate-500">Monto: <strong className="text-emerald-700">Q {item.strategyIntelligence.priceToBeat.toLocaleString()}</strong></p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-3 w-full md:w-auto">
                      <div className="bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                        <Clock size={14}/> Renueva en: {item.strategyIntelligence.renewalDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RADAR VIGENTE Y BUSCADOR */}
          {activeTab === 'ALERTAS' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">1. Buscar en Categorías Oficiales (Guatecompras)</label>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => { setSelectedCategory('TODAS'); setSubFilter('TODOS'); }} className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${selectedCategory === 'TODAS' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>TODAS LAS CATEGORÍAS</button>
                    {GUATECOMPRAS_CATEGORIAS.map((cat) => (
                      <button key={cat.id} onClick={() => { setSelectedCategory(cat.name); setSubFilter('TODOS'); }} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${selectedCategory === cat.name ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {cat.name.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 justify-between items-center">
                <div className="flex items-center gap-3 w-full md:w-auto flex-1">
                  <Search className="text-slate-400" size={22}/>
                  <input type="text" placeholder="Ingresa NOG o palabra clave..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:max-w-lg px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-sm font-bold bg-slate-50" />
                </div>
              </div>

              <div className="space-y-4">
                {filteredNogs.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                    <Target size={48} className="text-slate-200 mx-auto mb-4"/>
                    <h3 className="text-lg font-bold text-slate-700">Sin resultados activos</h3>
                  </div>
                ) : (
                  filteredNogs.slice(0, 50).map((op) => ( 
                    <div key={op.id} className={`bg-white rounded-2xl shadow-sm border-l-4 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition-all ${op.semaforo === 'ROJO' ? 'border-l-rose-500' : (op.semaforo === 'AMARILLO' ? 'border-l-amber-400' : 'border-l-emerald-500 border-y border-r border-slate-200')}`}>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded uppercase border border-blue-200">NOG: {op.nog}</span>
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded uppercase border ${op.semaforo === 'ROJO' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>Cierra en {op.horasRestantes}h</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-900 leading-tight mb-1">{op.title}</h3>
                          <p className="text-sm font-bold text-slate-500 flex items-center gap-2"><Building2 size={16}/> {op.buyer}</p>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                        <button onClick={() => { setSelectedNog(op); setCurrentView('DETAIL'); setDetailSubTab('COMPETENCIA'); }} className="bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-200 text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors w-full md:w-auto whitespace-nowrap">
                          <FileSearch size={14}/> Ver Competencia y Criterios
                        </button>
                        <button onClick={() => { setSelectedNog(op); setCurrentView('DETAIL'); setDetailSubTab('HISTORIAL_ACCIONES'); }} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors w-full md:w-auto whitespace-nowrap">
                          Analizar con IA <ChevronRight size={16}/>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
