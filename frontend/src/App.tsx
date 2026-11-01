import React, { useState, useEffect } from 'react';
import { Target, Search, ArrowLeft, FileText, ChevronRight, BarChart3, AlertCircle, Building2, Cpu, LogOut, PieChart, TrendingUp, Zap, AlertTriangle, Eye, RefreshCw, Gavel, Users, Clock, CheckCircle, Activity } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'CHECKOUT' | 'LOGIN' | 'CLIENT' | 'SUPERADMIN' | 'DETAIL'>('LANDING');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 🚀 DATOS: VIGENTES VS HISTÓRICOS
  const [nogs, setNogs] = useState<any[]>([]); 
  const [historyNogs, setHistoryNogs] = useState<any[]>([]); 
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNog, setSelectedNog] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ALERTAS' | 'PRESUPUESTOS' | 'RECUPERACION' | 'LABORATORIO'>('DASHBOARD');
  const [filterType, setFilterType] = useState('TODOS');
  const [selectedCategory, setSelectedCategory] = useState('TODAS');
  const [subFilter, setSubFilter] = useState('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtros de Recuperación
  const [targetEntity, setTargetEntity] = useState('TODAS');
  const [targetCategory, setTargetCategory] = useState('TODAS');

  // IA y Simulador
  const [ourCost, setOurCost] = useState('');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{ title: string, content: string } | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  // Módulo de Recuperación
  const [recoveryStrategy, setRecoveryStrategy] = useState<{ id: string, content: string } | null>(null);

  const [countdown, setCountdown] = useState(18000); 

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          generarDatosMasivos();
          return 18000;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentView('CLIENT');
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentView === 'CLIENT') {
      setIsLoading(true);
      setTimeout(() => {
        generarDatosMasivos();
        setIsLoading(false);
      }, 500);
    }
  }, [currentView]);

  // 🚀 GENERADOR MÁSTER: EVENTOS ÚNICOS PARA VIGENTES Y ADJUDICADOS
  const generarDatosMasivos = () => {
    const baseRealNogs = [
      { nog: "15412431", title: "ADQUISICIÓN DE MATERIAL MÉDICO", buyer: "MINISTERIO DE SALUD PÚBLICA Y ASISTENCIA SOCIAL (MSPAS)", procurementType: "CONTRATO ABIERTO", category: "Salud e insumos hospitalarios", product: "Material Médico", winner: "PharmaLatam S.A." },
      { nog: "5623707", title: "SERVICIOS DE COMPUTACIÓN Y REDES", buyer: "SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA (SAT)", procurementType: "LICITACIÓN PÚBLICA", category: "Computación y telecomunicaciones", product: "Servidores", winner: "Tigo Business" },
      { nog: "9597875", title: "COMPRA DE MATERIAL PARA CONSTRUCCIÓN", buyer: "MUNICIPALIDAD DE CANTEL", procurementType: "COTIZACIÓN", category: "Construcción y materiales afines", product: "Obra Gris", winner: "Constructora Quetzal" },
      { nog: "13699512", title: "ADQUISICIÓN DE SERVICIOS GENERALES", buyer: "SECRETARÍA DE SEGURIDAD ALIMENTARIA Y NUTRICIONAL (SESAN)", procurementType: "COMPRA DIRECTA", category: "Servicios Generales", product: "Servicios Generales", winner: "Servicios Integrales" },
      { nog: "20328435", title: "SUMINISTRO DE INSUMOS GENERALES", buyer: "INSTITUTO GUATEMALTECO DE SEGURIDAD SOCIAL (IGSS)", procurementType: "CONTRATO ABIERTO", category: "Salud e insumos hospitalarios", product: "Insumos Médicos", winner: "Agencias J.I. Cohen" },
      { nog: "3706710", title: "RENOVACIÓN DE EQUIPO DE COMPUTACIÓN", buyer: "MINISTERIO DE FINANZAS PÚBLICAS", procurementType: "LICITACIÓN PÚBLICA", category: "Computación y telecomunicaciones", product: "Equipos IT", winner: "Comptech" }
    ];

    const techSubFilters = ["Nube", "Licencias", "Ciberseguridad", "Hardware", "Enlaces"];
    const techReqs = [["Partner Nivel Platinum", "Soporte 24/7 local"], ["ISO 27001 requerida", "Ingenieros certificados"], ["Garantía de 3 años", "SLA 99.9%"]];
    const genReqs = [["3 Constancias de experiencia", "Patente vigente"], ["Muestras físicas", "Fianza 5%"]];
    const regiones = ["Región Central", "Nororiente", "Suroriente", "Sede Departamental", "Fase II", "Lote 3"];

    // 1. Generar Alertas VIGENTES
    const generatedActive = [];
    for (let i = 0; i < 327; i++) {
      const realData = baseRealNogs[i % baseRealNogs.length];
      const simulatedNog = (1000000 + i * 7).toString();
      const isTech = realData.category === "Computación y telecomunicaciones";
      
      const rand = Math.random();
      let tiempoCierre = "Más de 3 Días"; 
      let semaforo = "VERDE";
      if (rand < 0.12) { tiempoCierre = "Cierra Hoy"; semaforo = "ROJO"; }
      else if (rand < 0.30) { tiempoCierre = "Cierra Mañana"; semaforo = "AMARILLO"; }

      generatedActive.push({
        id: `act_${simulatedNog}`,
        nog: simulatedNog,
        title: `${realData.title} - ${regiones[i % regiones.length]}`,
        buyer: realData.buyer,
        procurementType: realData.procurementType,
        category: realData.category,
        specialtyTag: isTech ? techSubFilters[i % techSubFilters.length] : "General",
        detectedRequirements: isTech ? techReqs[i % techReqs.length] : genReqs[i % genReqs.length],
        estimatedBudget: Math.floor(Math.random() * 900000) + 45000.00,
        matchScore: Math.floor(Math.random() * 60) + 40,
        biddersCount: Math.floor(Math.random() * 8) + 1,
        closingTime: tiempoCierre,
        semaforo: semaforo,
        requiresOnSiteVisit: i % 4 === 0,
        onSiteVisitDetails: { date: "Próxima Semana", location: "Sede Central" },
        institutionRisk: { avgPaymentDays: (Math.floor(Math.random() * 30) + 15) + " días", revocationRate: (Math.random() * 3).toFixed(1) + "%", transparencyScore: (Math.floor(Math.random() * 15) + 80) + " / 100" },
        strategyIntelligence: { previousWinner: realData.winner, priceToBeat: Math.floor(Math.random() * 600000) + 30000.00, renewalDate: `Q${(i % 4) + 1} 2026` }
      });
    }
    setNogs(generatedActive);

    // 2. Generar Contratos HISTÓRICOS
    const generatedHistory = [];
    for (let i = 0; i < 120; i++) {
      const realData = baseRealNogs[i % baseRealNogs.length];
      generatedHistory.push({
        id: `hist_${i}`,
        title: `${realData.title} (Contrato Adjudicado ${2023 + (i % 3)})`,
        buyer: realData.buyer,
        category: realData.category,
        strategyIntelligence: { 
          previousWinner: realData.winner, 
          priceToBeat: Math.floor(Math.random() * 800000) + 50000.00, 
          renewalDate: `Q${(i % 4) + 1} 2026` 
        }
      });
    }
    setHistoryNogs(generatedHistory);
  };

  const handleRunSimulation = (priceToBeat: number) => {
    const cost = parseFloat(ourCost);
    if (!cost || isNaN(cost)) return alert("Por favor ingresa un costo base válido.");
    const suggestedBid = priceToBeat * 0.95; 
    const estimatedMargin = ((suggestedBid - cost) / suggestedBid) * 100;
    setSimulationResult({
      suggestedBid: suggestedBid.toFixed(2),
      estimatedMargin: estimatedMargin.toFixed(1),
      winProbability: estimatedMargin > 15 ? 'Alta (78%)' : 'Moderada (52%)'
    });
  };

  const handleAIAction = (actionType: 'CRITERIOS' | 'COMPETIDORES' | 'BASES') => {
    setIsAiProcessing(true);
    setAiAnalysisResult(null);
    setTimeout(() => {
      setIsAiProcessing(false);
      if (actionType === 'CRITERIOS') {
        setAiAnalysisResult({ title: "⚖️ Análisis IA de Criterios de Calificación", content: "1. Precio (40%): El margen será determinante.\n2. Experiencia (30%): Exigen constancias de proyectos similares.\n3. Soporte Local (30%): Gran ventaja comercial para tu equipo. ¡Enfoca la propuesta técnica aquí!" });
      } else if (actionType === 'COMPETIDORES') {
        setAiAnalysisResult({ title: "📊 Predicción IA de Competidores", content: `• ${selectedNog?.strategyIntelligence?.previousWinner} (Alta probabilidad): Ganaron este contrato históricamente.\n• Soluciones Seguras (Media): Suelen ofertar en esta entidad.\n💡 Táctica de Venta: Atacar con el valor de certificaciones avanzadas y soporte 24/7 inmediato.` });
      } else if (actionType === 'BASES') {
        setAiAnalysisResult({ title: "🚨 Puntos Críticos y Alertas de las Bases", content: `⚠️ ATENCIÓN REQUERIDA:\n- Visita Técnica Presencial OBLIGATORIA.\n- Fianza de Sostenimiento exigida: 5%.\n- Cláusula Trampa: Multa del 0.5% por cada día de retraso en la implementación.` });
      }
    }, 1500);
  };

  const handleGenerateRecoveryStrategy = (item: any) => {
    setIsAiProcessing(true);
    setRecoveryStrategy(null);
    setTimeout(() => {
      setIsAiProcessing(false);
      setRecoveryStrategy({
        id: item.id,
        content: `Táctica Sugerida IA para vencer a ${item.strategyIntelligence.previousWinner}:\n1. Ofrecer un 5% de descuento sobre su último precio (Oferta Ideal: Q ${(item.strategyIntelligence.priceToBeat * 0.95).toLocaleString()}).\n2. Destacar tiempos de implementación más rápidos en la propuesta técnica.\n3. Contactar al director de compras 60 días antes de la renovación estipulada (${item.strategyIntelligence.renewalDate}).`
      });
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
  // VISTAS EXTERNAS: LANDING, CHECKOUT, LOGIN
  // ==========================================
  if (currentView === 'LANDING') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <Target size={64} className="text-blue-500 mb-6"/>
        <h1 className="text-5xl font-black mb-4">NOGHunter Pro <span className="text-blue-500">BI</span></h1>
        <p className="text-xl text-slate-400 mb-8">Arquitectura de Inteligencia Comercial para Guatecompras</p>
        <div className="flex gap-4">
          <button onClick={() => setCurrentView('LOGIN')} className="bg-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-600 transition-all">Iniciar Sesión</button>
          <button onClick={() => setCurrentView('CHECKOUT')} className="bg-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition-all">Adquirir Licencia</button>
        </div>
      </div>
    );
  }

  if (currentView === 'CHECKOUT') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
        <button onClick={() => setCurrentView('LANDING')} className="absolute top-6 left-6 text-sm text-slate-500 flex items-center gap-1"><ArrowLeft size={16}/> Volver</button>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">Finalizar Compra</h2>
          <form className="space-y-4">
            <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Nombre de la Empresa" required />
            <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="NIT" required />
            <button onClick={() => setCurrentView('LOGIN')} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg">Pagar Q12,500</button>
          </form>
        </div>
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
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Correo Administrativo" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Contraseña Segura" required />
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg shadow-md">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA INTERNA: DETALLE DEL EVENTO (IA)
  // ==========================================
  if (currentView === 'DETAIL' && selectedNog) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans">
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <button onClick={() => setCurrentView('CLIENT')} className="text-sm font-semibold text-slate-600 flex items-center gap-1 hover:text-blue-600 transition-colors">
            <ArrowLeft size={16}/> Volver al Radar Principal
          </button>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Proceso NOG: {selectedNog.nog}</span>
        </nav>

        <main className="max-w-5xl mx-auto py-8 px-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-6">
                <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-700 rounded uppercase">{selectedNog.procurementType}</span>
                <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded uppercase ml-2">{selectedNog.specialtyTag}</span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">{selectedNog.title}</h2>
                <p className="text-slate-600 font-medium flex items-center gap-2 mt-1"><Building2 size={16}/> {selectedNog.buyer}</p>
                
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Requisitos Técnicos Habilitantes (Extraídos por IA)</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNog.detectedRequirements?.map((req: string, idx: number) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <CheckCircle size={14} className="text-blue-500"/> {req}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedNog.requiresOnSiteVisit && (
                  <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-800 text-sm font-bold shadow-sm">
                    <AlertTriangle size={24} className="text-red-600"/>
                    <div>
                      <span className="block uppercase tracking-wide text-xs">Advertencia Crítica</span>
                      Visita Técnica Presencial Obligatoria: {selectedNog.onSiteVisitDetails.date}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right border-l border-slate-100 pl-6">
                <span className="text-xs text-slate-400 font-bold uppercase">Presupuesto Institucional</span>
                <div className="text-3xl font-black text-emerald-600 mt-1">Q {selectedNog.estimatedBudget?.toLocaleString('es-GT', {minimumFractionDigits: 2})}</div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-600"/> Matriz de Riesgo y Reputación de Pago
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-4 rounded-xl border border-amber-100">
                <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Efectividad Promedio de Pago</span>
                <div className="text-xl font-black text-slate-800">{selectedNog.institutionRisk?.avgPaymentDays}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-amber-100">
                <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Índice de Revocatoria / Desierto</span>
                <div className="text-xl font-black text-emerald-600">{selectedNog.institutionRisk?.revocationRate}</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-amber-100">
                <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Puntaje de Transparencia</span>
                <div className="text-xl font-black text-blue-600">{selectedNog.institutionRisk?.transparencyScore}</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Cpu className="text-blue-400"/> Motor de Análisis Estratégico Integrado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button onClick={() => handleAIAction('BASES')} className="bg-slate-700 hover:bg-blue-600 border border-slate-600 hover:border-blue-500 p-4 rounded-xl flex flex-col items-center gap-2 transition-all">
                <FileText size={24} className="text-amber-400"/>
                <span className="text-sm font-bold text-center">Analizar Bases y Riesgos</span>
              </button>
              <button onClick={() => handleAIAction('CRITERIOS')} className="bg-slate-700 hover:bg-blue-600 border border-slate-600 hover:border-blue-500 p-4 rounded-xl flex flex-col items-center gap-2 transition-all">
                <Gavel size={24} className="text-emerald-400"/>
                <span className="text-sm font-bold text-center">Desglosar Criterios de Calificación</span>
              </button>
              <button onClick={() => handleAIAction('COMPETIDORES')} className="bg-slate-700 hover:bg-blue-600 border border-slate-600 hover:border-blue-500 p-4 rounded-xl flex flex-col items-center gap-2 transition-all">
                <Users size={24} className="text-purple-400"/>
                <span className="text-sm font-bold text-center">Predecir Competidores y Táctica</span>
              </button>
            </div>
            {isAiProcessing && (
              <div className="bg-slate-800 p-6 rounded-xl border border-blue-500/30 flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                <span className="text-sm font-medium text-blue-200">Gemini IA está leyendo e interpretando las bases del evento...</span>
              </div>
            )}
            {aiAnalysisResult && !isAiProcessing && (
              <div className="bg-slate-800 p-6 rounded-xl border border-emerald-500/50 shadow-inner">
                <h4 className="text-lg font-bold text-emerald-400 mb-3">{aiAnalysisResult.title}</h4>
                <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">{aiAnalysisResult.content}</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Zap className="text-amber-400"/> Simulador Predictivo de Oferta Ganadora (IA)</h3>
            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
              <div className="w-full md:flex-1">
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Costo Base / Operativo Interno (Q)</label>
                <input type="number" value={ourCost} onChange={(e) => setOurCost(e.target.value)} placeholder="Ej. 110000" className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500" />
              </div>
              <button onClick={() => handleRunSimulation(selectedNog.strategyIntelligence?.priceToBeat)} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all self-end shadow-md">
                Ejecutar Simulación
              </button>
            </div>
            {simulationResult && (
              <div className="bg-slate-800/90 border border-blue-500/30 p-6 rounded-xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div><span className="text-xs text-slate-400 uppercase tracking-wide block mb-1">Oferta Sugerida IA para Ganar</span><div className="text-3xl font-black text-emerald-400">Q {simulationResult.suggestedBid}</div></div>
                  <div><span className="text-xs text-slate-400 uppercase tracking-wide block mb-1">Margen de Ganancia Estimado</span><div className="text-3xl font-black text-blue-400">{simulationResult.estimatedMargin}%</div></div>
                  <div><span className="text-xs text-slate-400 uppercase tracking-wide block mb-1">Probabilidad de Éxito</span><div className="text-3xl font-black text-amber-400">{simulationResult.winProbability}</div></div>
                </div>
              </div>
            )}
          </div>
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
          <div className="p-6 border-b border-slate-800 flex items-center gap-2 text-white font-black text-xl tracking-tighter">
            <Target className="text-blue-500"/> NOGHunter <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">PRO</span>
          </div>
          <nav className="p-4 space-y-2 text-sm font-medium">
            <button onClick={() => setActiveTab('DASHBOARD')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'DASHBOARD' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <BarChart3 size={18}/> BI Dashboard
            </button>
            <button onClick={() => setActiveTab('ALERTAS')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'ALERTAS' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <AlertCircle size={18}/> Radar Operativo <span className="ml-auto bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">{nogs.length}</span>
            </button>
            <button onClick={() => setActiveTab('RECUPERACION')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'RECUPERACION' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <RefreshCw size={18}/> Competencia
            </button>
            <button onClick={() => setActiveTab('PRESUPUESTOS')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'PRESUPUESTOS' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <PieChart size={18}/> Presupuestos
            </button>
            <button onClick={() => setActiveTab('LABORATORIO')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'LABORATORIO' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <Cpu size={18}/> Motor de Reglas
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 block mb-1 uppercase tracking-wide">Próximo Barrido IA:</span>
            <span className="font-mono font-bold text-emerald-400 text-lg">{formatCountdown(countdown)}</span>
          </div>
          <button onClick={() => setCurrentView('LOGIN')} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-slate-800 text-xs font-bold transition-colors">
            <LogOut size={16}/> Cerrar Sesión Segura
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <nav className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">Panel Ejecutivo B2B</h1>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">En Vivo: Guatecompras</span>
        </nav>

        <main className="p-6 md:p-8 space-y-8 overflow-y-auto">
          
          {/* ======================= MÓDULO 1: DASHBOARD BI ======================= */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-8">
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><PieChart className="text-blue-600"/> MÓDULO 1: Presupuesto y Ejecución</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100"><p className="text-xs font-bold text-slate-500 uppercase">P. Adjudicado (YTD)</p><h3 className="text-3xl font-black text-slate-900 mt-1">Q 41.2M</h3></div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100"><p className="text-xs font-bold text-slate-500 uppercase">P. Devengado</p><h3 className="text-3xl font-black text-blue-600 mt-1">Q 38.5M</h3></div>
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100"><p className="text-xs font-bold text-slate-500 uppercase">Ejecución Global</p><h3 className="text-3xl font-black text-emerald-600 mt-1">93.4%</h3></div>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase">Distribución de Gasto por Institución Top</p>
                  <div><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>MSPAS</span><span>Q 18.2M</span></div><div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-blue-600 h-3 rounded-full" style={{width: '70%'}}></div></div></div>
                  <div><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>SAT</span><span>Q 12.1M</span></div><div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-indigo-500 h-3 rounded-full" style={{width: '45%'}}></div></div></div>
                  <div><div className="flex justify-between text-xs font-bold text-slate-600 mb-1"><span>MUNICIPALIDADES</span><span>Q 8.4M</span></div><div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-emerald-500 h-3 rounded-full" style={{width: '30%'}}></div></div></div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><Users className="text-purple-600"/> MÓDULO 2: Competencia</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center"><p className="text-xs font-bold text-purple-700 uppercase">Promedio Oferentes</p><h3 className="text-3xl font-black text-purple-900 mt-1">3.2</h3></div>
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 text-center"><p className="text-xs font-bold text-rose-700 uppercase">Tasa Desiertos</p><h3 className="text-3xl font-black text-rose-900 mt-1">8.5%</h3></div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-3">Índice Concentración (Top Proveedores)</p>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-700 border-b pb-2 mb-2"><span>1. Tigo Business</span><span className="ml-auto text-blue-600">32% Market</span></div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-700 border-b pb-2 mb-2"><span>2. PharmaLatam</span><span className="ml-auto text-blue-600">25% Market</span></div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-700"><span>3. Comptech</span><span className="ml-auto text-emerald-600">18% Market</span></div>
                  </div>
                </section>

                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><Activity className="text-emerald-600"/> MÓDULO 3: Vigentes (En Vivo)</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center"><p className="text-xs font-bold text-emerald-700 uppercase">Concursos Activos</p><h3 className="text-3xl font-black text-emerald-900 mt-1">{nogs.length}</h3></div>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center"><p className="text-xs font-bold text-amber-700 uppercase">Proyectos en Bases</p><h3 className="text-3xl font-black text-amber-900 mt-1">42</h3></div>
                  </div>
                  <div className="bg-slate-900 p-5 rounded-xl text-white">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Monto Total en Licitación Vigente</p>
                    <h3 className="text-3xl font-black text-emerald-400">Q 125,430,000</h3>
                    <button onClick={() => setActiveTab('ALERTAS')} className="mt-4 w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-sm font-bold">Ver Radar Completo</button>
                  </div>
                </section>
              </div>

              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Clock className="text-rose-600"/> MÓDULO 4: Matriz de Riesgo (<span className="text-rose-600">Semaforización</span>)</h3>
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-md">🔴 Crítico {'<'} 24h ({nogs.filter(n => n.semaforo === 'ROJO').length})</span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md">🟡 Prevención {'<'} 72h ({nogs.filter(n => n.semaforo === 'AMARILLO').length})</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md">🟢 En Tiempo ({nogs.filter(n => n.semaforo === 'VERDE').length})</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                        <th className="p-3 border-b border-slate-200">Estado</th>
                        <th className="p-3 border-b border-slate-200">NOG / Evento</th>
                        <th className="p-3 border-b border-slate-200">Institución</th>
                        <th className="p-3 border-b border-slate-200 text-right">Horas Restantes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nogs.sort((a,b) => a.horasRestantes - b.horasRestantes).slice(0,6).map(op => (
                        <tr key={op.id} className="hover:bg-slate-50 border-b border-slate-100">
                          <td className="p-3"><div className={`w-3 h-3 rounded-full ${op.semaforo === 'ROJO' ? 'bg-rose-500 animate-pulse' : (op.semaforo === 'AMARILLO' ? 'bg-amber-400' : 'bg-emerald-400')}`}></div></td>
                          <td className="p-3"><div className="font-bold text-sm text-slate-800">{op.nog}</div><div className="text-xs text-slate-500 truncate w-48">{op.title}</div></td>
                          <td className="p-3 text-xs font-bold text-slate-600">{op.buyer}</td>
                          <td className={`p-3 text-right font-black text-sm ${op.semaforo === 'ROJO' ? 'text-rose-600' : 'text-slate-700'}`}>{op.horasRestantes}h</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* ======================= MÓDULO: RECUPERACIÓN (COMPETENCIA) ======================= */}
          {activeTab === 'RECUPERACION' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2"><RefreshCw className="text-blue-600"/> Radar de Contratos Adjudicados (Competencia)</h3>
                <p className="text-sm text-slate-500">Analiza el monto adjudicado histórico y adelántate a la fecha de renovación.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">1. Filtrar por Entidad Objetivo</label>
                  <select value={targetEntity} onChange={(e) => setTargetEntity(e.target.value)} className="w-full px-4 py-3 border rounded-xl bg-white text-sm outline-none shadow-sm">
                    <option value="TODAS">Mostrar Todas las Instituciones</option>
                    {uniqueEntitiesHist.map(entity => <option key={entity} value={entity}>{entity}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">2. Filtrar por Sector Comercial</label>
                  <select value={targetCategory} onChange={(e) => setTargetCategory(e.target.value)} className="w-full px-4 py-3 border rounded-xl bg-white text-sm outline-none shadow-sm">
                    <option value="TODAS">Todos los Sectores</option>
                    {uniqueCategoriesHist.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                {filteredHistory.slice(0, 15).map((item) => (
                  <div key={item.id}>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                      <div className="space-y-2 flex-1">
                        <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-1 rounded uppercase tracking-wider">{item.buyer}</span>
                        <h4 className="font-bold text-slate-900 text-lg leading-tight">{item.title}</h4>
                        <div className="flex gap-x-6 text-sm">
                          <p className="text-slate-500">Adjudicado a: <strong className="text-amber-700">{item.strategyIntelligence.previousWinner}</strong></p>
                          <p className="text-slate-500">Monto Histórico: <strong className="text-emerald-700">Q {item.strategyIntelligence.priceToBeat.toLocaleString()}</strong></p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-3 w-full md:w-auto">
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                          <Clock size={16}/> Vencimiento: {item.strategyIntelligence.renewalDate}
                        </div>
                        <button onClick={() => handleGenerateRecoveryStrategy(item)} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-md transition-colors">
                          Analizar Táctica de Ataque (IA)
                        </button>
                      </div>
                    </div>
                    {isAiProcessing && recoveryStrategy?.id !== item.id && (
                      <div className="w-full mt-3 bg-slate-800 p-4 rounded-xl flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                        <span className="text-sm font-medium text-blue-200">Gemini IA calculando estrategia comercial...</span>
                      </div>
                    )}
                    {recoveryStrategy && recoveryStrategy.id === item.id && !isAiProcessing && (
                      <div className="w-full mt-3 bg-slate-800 p-5 rounded-xl border border-emerald-500/50 shadow-inner">
                        <h4 className="text-md font-bold text-emerald-400 mb-2 flex items-center gap-2"><Zap size={16} /> Plan de Recuperación de Cuenta</h4>
                        <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">{recoveryStrategy.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================= OTROS MÓDULOS (ALERTAS, PRESUPUESTOS, REGLAS) ======================= */}
          {activeTab === 'PRESUPUESTOS' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2"><TrendingUp className="text-blue-600"/> Análisis Presupuestario Global</h3>
              <p className="text-sm text-slate-500 mb-8">Monitoreo histórico y proyección de fondos públicos por entidad.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200"><span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ministerio de Finanzas</span><h4 className="text-3xl font-black text-slate-900 mt-2 mb-2">Q 4.5 Millones</h4></div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200"><span className="text-xs font-bold text-slate-500 uppercase tracking-wide">SAT (Superintendencia)</span><h4 className="text-3xl font-black text-slate-900 mt-2 mb-2">Q 8.2 Millones</h4></div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200"><span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ministerio de Salud</span><h4 className="text-3xl font-black text-slate-900 mt-2 mb-2">Q 3.1 Millones</h4></div>
              </div>
            </div>
          )}

          {activeTab === 'LABORATORIO' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Cpu className="text-blue-600"/> Laboratorio y Motor de Reglas (IA)</h3>
                <p className="text-sm text-slate-500">Define qué busca la inteligencia artificial durante el barrido automático.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 shadow-inner">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Términos Comerciales (Keywords)</label>
                <textarea rows={3} defaultValue="Cloud, Ciberseguridad, Medicamentos, Construcción, Licencias, Servidores" className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-blue-600 text-sm shadow-sm"/>
                <div className="flex justify-end"><button onClick={() => alert('Reglas guardadas.')} className="bg-blue-600 text-white text-sm font-bold px-8 py-3 rounded-xl">Guardar Reglas</button></div>
              </div>
            </div>
          )}

          {activeTab === 'ALERTAS' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">1. Categorías Oficiales (Vigentes Hoy)</label>
                  <div className="flex flex-wrap gap-2">
                    {['TODAS', 'Computación y telecomunicaciones', 'Salud e insumos hospitalarios', 'Construcción y materiales afines', 'Alimentos y semillas', 'Servicios Generales'].map((cat) => (
                      <button key={cat} onClick={() => { setSelectedCategory(cat); setSubFilter('TODOS'); }} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{cat}</button>
                    ))}
                  </div>
                </div>
                {selectedCategory === 'Computación y telecomunicaciones' && (
                  <div className="pt-6 border-t border-slate-100">
                    <label className="block text-xs font-black text-indigo-600 uppercase tracking-wider mb-3">2. Sub-Filtro Comercial Especializado</label>
                    <div className="flex flex-wrap gap-3">
                      {['TODOS', 'Nube', 'Licencias', 'Ciberseguridad', 'Hardware', 'Enlaces'].map((sub) => (
                        <button key={sub} onClick={() => setSubFilter(sub)} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all border ${subFilter === sub ? 'bg-indigo-100 border-indigo-600 text-indigo-800 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{sub}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 justify-between items-center">
                <div className="flex items-center gap-3 w-full md:w-auto flex-1">
                  <Search className="text-slate-400" size={22}/>
                  <input type="text" placeholder="Ingresa NOG, dependencia, o palabra clave..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:max-w-lg px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-sm bg-slate-50" />
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  {['TODOS', 'LICITACIÓN PÚBLICA', 'COTIZACIÓN', 'COMPRA DIRECTA'].map((type) => (
                    <button key={type} onClick={() => setFilterType(type)} className={`px-4 py-2 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-colors ${filterType === type ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{type}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredNogs.slice(0, 50).map((op) => ( 
                  <div key={op.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:border-blue-400 hover:shadow-md transition-all">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded uppercase border border-blue-200">NOG: {op.nog}</span>
                        <span className="bg-purple-50 text-purple-700 text-[10px] font-black px-2.5 py-1 rounded uppercase border border-purple-200">{op.procurementType}</span>
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded border border-slate-200">{op.specialtyTag}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{op.title}</h3>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2"><Building2 size={16}/> {op.buyer}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {op.detectedRequirements?.map((req: string, idx: number) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle size={10} className="text-emerald-500"/> {req}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                      {op.requiresOnSiteVisit && (
                        <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg border border-red-100 shadow-sm justify-center">
                          <Eye size={16}/><span className="text-[10px] font-black uppercase tracking-wider">Visita Obligatoria</span>
                        </div>
                      )}
                      <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-4 py-2 rounded-lg flex flex-col items-center justify-center w-full md:w-32">
                        <span className="text-[10px] font-bold uppercase tracking-wider mb-0.5">Match IA</span><span className="text-xl font-black">{op.matchScore}%</span>
                      </div>
                      <button onClick={() => { setSelectedNog(op); setCurrentView('DETAIL'); }} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-4 rounded-xl flex justify-center gap-2 shadow-md">
                        Motor IA de Análisis <ChevronRight size={16}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
