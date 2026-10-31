import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, XCircle, Search, ArrowLeft, Trophy, FileText, ChevronRight, BarChart3, AlertCircle, Clock, Building2, Filter, Download, Cpu, ShieldCheck, Layers, LogOut, PieChart, TrendingUp, Sliders, Zap, AlertTriangle, Eye, RefreshCw, MessageSquare, Gavel, Users } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'CHECKOUT' | 'LOGIN' | 'CLIENT' | 'SUPERADMIN' | 'DETAIL'>('LANDING');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [nogs, setNogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNog, setSelectedNog] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ALERTAS' | 'PRESUPUESTOS' | 'RECUPERACION' | 'LABORATORIO'>('DASHBOARD');
  const [filterType, setFilterType] = useState('TODOS');
  const [selectedCategory, setSelectedCategory] = useState('TODAS');
  const [subFilter, setSubFilter] = useState('TODOS'); // 🚀 NUEVO: Sub-filtro de especialidad (Nube, Ciberseguridad, etc.)
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para el Simulador IA y Panel de Análisis
  const [ourCost, setOurCost] = useState('');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{ title: string, content: string } | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const [formData, setFormData] = useState({ companyName: '', nit: '', adminName: '', adminEmail: '' });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [companies, setCompanies] = useState<any[]>([]);
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
  const [newCompanyForm, setNewCompanyForm] = useState({ companyName: '', nit: '', adminName: '', adminEmail: '' });
  const [creatingCompany, setCreatingCompany] = useState(false);

  useEffect(() => {
    if (currentView === 'CLIENT') {
      setIsLoading(true);
      fetch('/api/nogs')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setNogs(data);
          else generar327AlertasMasivas();
          setIsLoading(false);
        })
        .catch(() => {
          generar327AlertasMasivas();
          setIsLoading(false);
        });
    }
  }, [currentView]);

  useEffect(() => {
    if (currentView === 'SUPERADMIN') {
      fetch('/api/admin/tenants')
        .then((res) => res.json())
        .then((data) => { if (Array.isArray(data)) setCompanies(data); })
        .catch((err) => console.error('Error cargando empresas:', err));
    }
  }, [currentView]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'haroldocana@comptech.lat' && password === 'Admin123*') {
      setCurrentView('SUPERADMIN');
      setIsLoading(false);
      return; 
    }
    setCurrentView('CLIENT');
    setIsLoading(false);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setTimeout(() => {
      setSuccessMsg('¡Pago exitoso! Revisa tu correo electrónico para obtener tus credenciales.');
      setFormData({ companyName: '', nit: '', adminName: '', adminEmail: '' });
      setCheckoutLoading(false);
    }, 1500);
  };

  const generar327AlertasMasivas = () => {
    const categorias = [
      "Computación y telecomunicaciones",
      "Salud e insumos hospitalarios",
      "Construcción y materiales afines",
      "Alimentos y semillas",
      "Servicios Generales"
    ];
    
    // Sub-etiquetas de especialidad para tecnología
    const techSubFilters = ["Nube", "Ciberseguridad", "Licencias", "Hardware", "Enlaces"];
    const tipos = ["LICITACIÓN PÚBLICA", "COTIZACIÓN", "COMPRA DIRECTA"];
    const entidades = ["MINFIN", "MSPAS", "MINEDUC", "SAT", "MUNI GUATE", "IGSS"];

    const generated = [];
    for (let i = 1; i <= 327; i++) {
      const catIndex = i % categorias.length;
      const typeIndex = i % tipos.length;
      const entIndex = i % entidades.length;
      const subIndex = i % techSubFilters.length;
      const nogNum = 1000000 + i;
      
      const isTech = categorias[catIndex] === "Computación y telecomunicaciones";

      generated.push({
        id: nogNum.toString(),
        nog: nogNum.toString(),
        title: `Proceso #${i}: Suministro de ${isTech ? techSubFilters[subIndex] : categorias[catIndex]}`,
        buyer: entidades[entIndex],
        procurementType: tipos[typeIndex],
        extractedProduct: isTech ? techSubFilters[subIndex] : categorias[catIndex],
        category: categorias[catIndex],
        specialtyTag: isTech ? techSubFilters[subIndex] : "General",
        estimatedBudget: Math.floor(Math.random() * 850000) + 25000.00,
        matchScore: Math.floor(Math.random() * 65) + 35,
        requiresOnSiteVisit: i % 5 === 0,
        onSiteVisitDetails: { date: "15/11/2026", location: "Oficinas Centrales" },
        institutionRisk: { avgPaymentDays: "30 días", revocationRate: "1.0%", transparencyScore: "94 / 100" },
        strategyIntelligence: { priceToBeat: 120000.00 }
      });
    }
    setNogs(generated);
  };

  // 🚀 MOTOR DE ANÁLISIS IA INTERACTIVO
  const handleAIAction = (actionType: 'CRITERIOS' | 'COMPETIDORES' | 'BASES') => {
    setIsAiProcessing(true);
    setAiAnalysisResult(null);
    
    setTimeout(() => {
      setIsAiProcessing(false);
      if (actionType === 'CRITERIOS') {
        setAiAnalysisResult({
          title: "⚖️ Análisis de Criterios de Calificación",
          content: "1. Precio (40%): El margen será determinante.\n2. Experiencia (30%): Exigen 3 constancias de proyectos similares en el sector público.\n3. Soporte Local (30%): Gran ventaja comercial para tu equipo. ¡Enfoca la propuesta técnica aquí!"
        });
      } else if (actionType === 'COMPETIDORES') {
        setAiAnalysisResult({
          title: "📊 Predicción de Competidores",
          content: "• CiberSec S.A. (Alta probabilidad): Ganaron este contrato hace 2 años.\n• Soluciones Seguras (Media): Suelen ofertar en esta entidad.\n💡 Táctica de Venta: Atacar con el valor de las certificaciones de Google Cloud y soporte 24/7 inmediato."
        });
      } else if (actionType === 'BASES') {
        setAiAnalysisResult({
          title: "🚨 Puntos Críticos y Alertas de las Bases",
          content: "⚠️ ATENCIÓN REQUERIDA:\n- Visita Técnica Presencial OBLIGATORIA el 15/11/2026. Si no asistes, descalificación automática.\n- Fianza de Sostenimiento exigida: 5%.\n- Cláusula Trampa: Multa del 0.5% por cada día de retraso en la implementación."
        });
      }
    }, 1500);
  };

  const filteredNogs = nogs.filter(op => {
    const matchesCategory = selectedCategory === 'TODAS' || op.category === selectedCategory;
    const matchesSubFilter = subFilter === 'TODOS' || op.specialtyTag === subFilter;
    const matchesType = filterType === 'TODOS' || op.procurementType === filterType;
    const matchesSearch = searchTerm === '' || 
      op.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      op.nog.includes(searchTerm) || 
      op.extractedProduct.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSubFilter && matchesType && matchesSearch;
  });

  if (currentView === 'LANDING') {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900">
        <header className="flex justify-between items-center py-4 px-8 border-b border-slate-100">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-2"><Target className="text-blue-600"/><span className="text-blue-700">NOGHunter</span><span className="text-slate-900">Pro</span></div>
          <button onClick={() => setCurrentView('LOGIN')} className="text-sm font-semibold text-slate-600 hover:text-blue-700">Iniciar Sesión</button>
        </header>
        <section className="max-w-5xl mx-auto text-center py-20 px-4">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">Guatecompras masticado por IA.<br/><span className="text-blue-600">Extrae, analiza y vende más.</span></h1>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">La plataforma definitiva para directores comerciales.</p>
          <button onClick={() => setCurrentView('CHECKOUT')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg text-lg">Adquirir Licencia Q12,500 / año</button>
        </section>
      </div>
    );
  }

  if (currentView === 'LOGIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
        <button onClick={() => setCurrentView('LANDING')} className="absolute top-6 left-6 text-sm text-slate-500 flex items-center gap-1"><ArrowLeft size={16}/> Volver</button>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center">NOGHunter Pro</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Correo" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Contraseña" required />
            <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA 4.1: DETALLE Y MÓDULO DE ANÁLISIS IA
  // ==========================================
  if (currentView === 'DETAIL' && selectedNog) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans">
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <button onClick={() => setCurrentView('CLIENT')} className="text-sm font-semibold text-slate-600 flex items-center gap-1"><ArrowLeft size={16}/> Volver al Radar</button>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">NOG: {selectedNog.nog}</span>
        </nav>

        <main className="max-w-5xl mx-auto py-8 px-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-700 rounded uppercase">{selectedNog.procurementType}</span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">{selectedNog.title}</h2>
                <p className="text-slate-600 font-medium flex items-center gap-2 mt-1"><Building2 size={16}/> {selectedNog.buyer}</p>
                
                {selectedNog.requiresOnSiteVisit && (
                  <div className="mt-3 bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-2 text-red-800 text-sm font-bold">
                    <AlertTriangle size={18}/> ¡ATENCIÓN! Visita Presencial Obligatoria: {selectedNog.onSiteVisitDetails.date}
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-bold uppercase">Presupuesto Estimado</span>
                <div className="text-2xl font-black text-emerald-600">Q {selectedNog.estimatedBudget?.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* 🚀 NUEVO: PANEL DE INTELIGENCIA ARTIFICIAL (BOTONES DE ACCIÓN) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Cpu className="text-blue-400"/> Motor de Análisis Estratégico IA</h3>
            <p className="text-sm text-slate-400 mb-6">Genera análisis detallados de las bases publicadas para orientar a tu equipo de ventas.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button onClick={() => handleAIAction('BASES')} className="bg-slate-700 hover:bg-blue-600 border border-slate-600 hover:border-blue-500 text-white p-4 rounded-xl flex flex-col items-center gap-2 transition-all">
                <FileText size={24} className="text-amber-400"/>
                <span className="text-sm font-bold text-center">Analizar Bases y Puntos Críticos</span>
              </button>
              <button onClick={() => handleAIAction('CRITERIOS')} className="bg-slate-700 hover:bg-blue-600 border border-slate-600 hover:border-blue-500 text-white p-4 rounded-xl flex flex-col items-center gap-2 transition-all">
                <Gavel size={24} className="text-emerald-400"/>
                <span className="text-sm font-bold text-center">Analizar Criterios de Calificación</span>
              </button>
              <button onClick={() => handleAIAction('COMPETIDORES')} className="bg-slate-700 hover:bg-blue-600 border border-slate-600 hover:border-blue-500 text-white p-4 rounded-xl flex flex-col items-center gap-2 transition-all">
                <Users size={24} className="text-purple-400"/>
                <span className="text-sm font-bold text-center">Predecir Competidores</span>
              </button>
            </div>

            {isAiProcessing && (
              <div className="bg-slate-800 p-6 rounded-xl border border-blue-500/30 flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                <span className="text-sm font-medium text-blue-200">Gemini IA está procesando los documentos del evento...</span>
              </div>
            )}

            {aiAnalysisResult && !isAiProcessing && (
              <div className="bg-slate-800 p-6 rounded-xl border border-emerald-500/50 shadow-inner">
                <h4 className="text-lg font-bold text-emerald-400 mb-3">{aiAnalysisResult.title}</h4>
                <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">{aiAnalysisResult.content}</p>
              </div>
            )}
          </div>

        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex">
      
      {/* BARRA LATERAL */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-2 text-white font-black text-xl tracking-tighter">
            <Target className="text-blue-500"/> NOGHunter <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">PRO</span>
          </div>
          <nav className="p-4 space-y-2 text-sm font-medium">
            <button onClick={() => setActiveTab('ALERTAS')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'ALERTAS' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <AlertCircle size={18}/> Radar de Alertas <span className="ml-auto bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">{nogs.length}</span>
            </button>
            <button onClick={() => setActiveTab('RECUPERACION')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'RECUPERACION' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <RefreshCw size={18}/> Recuperar Proyectos
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setCurrentView('LOGIN')} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-slate-800 text-xs font-bold"><LogOut size={16}/> Cerrar Sesión</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h1 className="text-lg font-bold text-slate-800">Radar de Inteligencia Comercial</h1>
          <span className="text-sm font-bold text-emerald-600">Bolsón IA: 48,500 / 50,000 Tokens</span>
        </nav>

        <main className="p-6 md:p-8 space-y-6 overflow-y-auto">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">1. Categoria Principal</label>
            <div className="flex flex-wrap gap-2">
              {['TODAS', 'Computación y telecomunicaciones', 'Salud e insumos hospitalarios', 'Construcción y materiales afines', 'Servicios Generales'].map((cat) => (
                <button key={cat} onClick={() => { setSelectedCategory(cat); setSubFilter('TODOS'); }} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{cat}</button>
              ))}
            </div>

            {/* 🚀 NUEVO: SUB-FILTRO POR INTERÉS COMERCIAL (Si elige Tecnología) */}
            {selectedCategory === 'Computación y telecomunicaciones' && (
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">2. Filtro de Especialidad (Interés Comercial)</label>
                <div className="flex flex-wrap gap-2">
                  {['TODOS', 'Nube', 'Licencias', 'Ciberseguridad', 'Hardware', 'Enlaces'].map((sub) => (
                    <button key={sub} onClick={() => setSubFilter(sub)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${subFilter === sub ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{sub}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Search className="text-slate-400" size={20}/>
              <input type="text" placeholder="Buscar por NOG, entidad o producto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-96 px-4 py-2 border rounded-xl outline-none focus:border-blue-600 text-sm" />
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {['TODOS', 'LICITACIÓN PÚBLICA', 'COTIZACIÓN', 'COMPRA DIRECTA'].map((type) => (
                <button key={type} onClick={() => setFilterType(type)} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${filterType === type ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>{type}</button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredNogs.map((op) => (
              <div key={op.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row gap-4 justify-between items-center hover:border-blue-400 transition-all">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">NOG: {op.nog}</span>
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">{op.procurementType}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">{op.specialtyTag}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{op.title}</h3>
                  <p className="text-sm text-slate-500 mb-3">{op.buyer}</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  {op.requiresOnSiteVisit && (
                    <div className="flex flex-col items-center bg-red-50 text-red-700 px-3 py-2 rounded-lg border border-red-100">
                      <Eye size={16} className="mb-1"/>
                      <span className="text-[10px] font-bold uppercase text-center">Visita<br/>Técnica</span>
                    </div>
                  )}
                  <button onClick={() => { setSelectedNog(op); setCurrentView('DETAIL'); }} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center gap-2 whitespace-nowrap">
                    Motor IA de Análisis <ChevronRight size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
