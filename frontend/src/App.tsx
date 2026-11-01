import React, { useState, useEffect } from 'react';
import { Target, Search, ArrowLeft, FileText, ChevronRight, BarChart3, AlertCircle, Building2, Cpu, LogOut, PieChart, TrendingUp, Zap, AlertTriangle, Eye, RefreshCw, Gavel, Users, Clock, CheckCircle, Brain, History, FileSearch, Scale, UserPlus, Settings, FileDigit, Fingerprint, ShieldAlert, Crosshair, CreditCard, Mail, Database, Briefcase, FileOutput, Key, Layout, BookOpen, Percent, Calendar, UserCheck, TableProperties } from 'lucide-react';

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
  "Adquisiciones con proveedor único",
  "Arrendamiento o Adquisición de Bienes Inmuebles",
  "Arrendamientos por Cotización",
  "Arrendamientos por Licitación Pública",
  "Bienes y Suministros Importados (Art. 5 LCE)",
  "Compra Competitiva con Oferta Electrónica",
  "Compra de Baja Cuantía",
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
  { entidad: "INSTITUTO GUATEMALTECO DE SEGURIDAD SOCIAL -IGSS-", tipo: "Entidades Descentralizadas" },
  { entidad: "MINISTERIO DE SALUD PÚBLICA Y ASISTENCIA SOCIAL", tipo: "Administración Central" },
  { entidad: "SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA", tipo: "Entidades Descentralizadas" },
  { entidad: "MINISTERIO DE FINANZAS PÚBLICAS", tipo: "Administración Central" },
  { entidad: "MUNICIPALIDAD DE GUATEMALA", tipo: "Municipalidades" }
];

export default function App() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'CHECKOUT' | 'LOGIN' | 'CLIENT' | 'SUPERADMIN'>('LANDING');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [nogs, setNogs] = useState<any[]>([]); 
  const [historyNogs, setHistoryNogs] = useState<any[]>([]); 
  const [proyectosBases, setProyectosBases] = useState<any[]>([]); 
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingBases, setIsSearchingBases] = useState(false); 

  // 🚀 ACTUALIZADO: NUEVA PESTAÑA 'PROVEEDORES'
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ANALIZADOR' | 'ALERTAS' | 'PROYECTOS_BASES' | 'PROVEEDORES' | 'WORKSPACE' | 'LABORATORIO'>('DASHBOARD');
  const [detailSubTab, setDetailSubTab] = useState<'RESUMEN' | 'HISTORIAL' | 'CRITERIOS' | 'COMPETENCIA' | 'OPERACION'>('RESUMEN');

  // Filtros Generales Radar
  const [filterModalidad, setFilterModalidad] = useState('TODAS');
  const [selectedCategory, setSelectedCategory] = useState('TODAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCustomCat, setNewCustomCat] = useState('');

  // Estados Analizador NOG
  const [nogSearchInput, setNogSearchInput] = useState('');
  const [analyzedNog, setAnalyzedNog] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ourCost, setOurCost] = useState('');
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // Estados Buscador Proyectos de Bases
  const [pbFilterEntidad, setPbFilterEntidad] = useState('TODAS');
  const [pbFilterCategoria, setPbFilterCategoria] = useState('TODAS');
  const [pbFilterModalidad, setPbFilterModalidad] = useState('TODAS');
  const [pbFilterEstatus, setPbFilterEstatus] = useState('TODOS');
  const [pbFechaInicio, setPbFechaInicio] = useState('2025-11-01');
  const [pbFechaFin, setPbFechaFin] = useState('2026-11-01');
  const [baseProductsInput, setBaseProductsInput] = useState<Record<string, string>>({});
  const [baseAnalysisResult, setBaseAnalysisResult] = useState<Record<string, any>>({});
  const [isAnalyzingBaseId, setIsAnalyzingBaseId] = useState<string | null>(null);

  // 🚀 ESTADOS NUEVOS: BUSCADOR DE PROVEEDORES
  const [proveedorSearchType, setProveedorSearchType] = useState('NIT'); // NIT, CUI, NOMBRE
  const [proveedorSearchTerm, setProveedorSearchTerm] = useState('');
  const [isSearchingProveedor, setIsSearchingProveedor] = useState(false);
  const [analyzedProveedor, setAnalyzedProveedor] = useState<any>(null);

  // Arquitectura SaaS
  const [tokenPool, setTokenPool] = useState(48500);
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Cropa DSV', nit: '123456-7', adminEmail: 'admin@cropa.com', activeUsers: 3, plan: 'PRO Anual', tokens: 50000, expires: '2027-11-01', gatewayId: 'cus_xyz123', status: 'Activo' }
  ]);
  const [newTenantForm, setNewTenantForm] = useState({ companyName: '', nit: '', adminEmail: '' });
  const [checkoutMode, setCheckoutMode] = useState<'LICENSE' | 'TOKENS'>('LICENSE');
  const [successMsg, setSuccessMsg] = useState('');

  // Workspace Kanban
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: 1, title: 'Servidores PowerEdge', nog: '32560500', buyer: 'SAT', status: 'TODO' },
    { id: 2, title: 'Insumos Médicos IGSS', nog: '32560507', buyer: 'IGSS', status: 'IN_PROGRESS' }
  ]);

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
    setTimeout(() => {
      if (email === 'haroldocana@comptech.lat' && password === 'Admin123*') setCurrentView('SUPERADMIN');
      else {
        setCurrentView('CLIENT');
        generarDatosMasivos(); 
      }
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

  const generarDatosMasivos = () => {
    const generatedActive = [];
    for (let i = 0; i < 327; i++) {
      const randCat = GUATECOMPRAS_CATEGORIAS[Math.floor(Math.random() * GUATECOMPRAS_CATEGORIAS.length)].name;
      const randEntity = EMPRESAS_COMPRADORAS[i % EMPRESAS_COMPRADORAS.length];
      const randModalidad = TODAS_LAS_MODALIDADES[Math.floor(Math.random() * TODAS_LAS_MODALIDADES.length)];
      const simulatedNog = (32560500 + i * 7).toString();
      const previousPrice = Math.floor(Math.random() * 800000) + 50000;
      
      let tiempoCierre = "Más de 3 Días"; let semaforo = "VERDE"; let horasRestantes = Math.floor(Math.random() * 120) + 73; 
      const rand = Math.random();
      if (rand < 0.12) { tiempoCierre = "Cierra Hoy"; semaforo = "ROJO"; horasRestantes = Math.floor(Math.random() * 24) + 1; }
      else if (rand < 0.30) { tiempoCierre = "Cierra Mañana"; semaforo = "AMARILLO"; horasRestantes = Math.floor(Math.random() * 48) + 25; }

      generatedActive.push({
        id: `act_${simulatedNog}`, nog: simulatedNog, title: `ADQUISICIÓN DE ${randCat.split(' ')[0].toUpperCase()} - EJERCICIO 2026`, buyer: randEntity.entidad,
        unidadCompradora: "DIRECCIÓN DE ADQUISICIONES", procurementType: randModalidad, category: randCat,
        fianzaSostenimiento: randModalidad.includes("Baja") || randModalidad.includes("Directa") ? "0.00%" : "2.00%",
        fianzaCumplimiento: randModalidad.includes("Baja") || randModalidad.includes("Directa") ? "0.00%" : "10.00%",
        beneficiarioFianza: randEntity.entidad, detectedRequirements: ["Solvencia Fiscal", "Constancia RGAE", "Fianza"],
        qualificationCriteria: [{ name: "Precio", weight: 60 }, { name: "Calidad Técnica", weight: 30 }, { name: "Tiempo Entrega", weight: 10 }],
        estimatedBudget: previousPrice * 1.15, horasRestantes: horasRestantes, semaforo: semaforo, requiresOnSiteVisit: i % 3 === 0,
        onSiteVisitDetails: { date: "15/11/2026", location: "Sede Central" },
        actionHistory: [{ action: "CREACIÓN", description: `Publicación inicial. NOG ${simulatedNog}.`, documents: [`Bases.pdf`, `Anexos.docx`] }],
        aiProductExtraction: { tipo: "Bienes Generales", marcasAceptadas: ["Certificadas"], modeloBase: "Según requerimiento", servicioIncluido: "Garantía estándar" },
        historicalCompetition: { hasHistory: true, previousWinner: "Competidor S.A.", similarityScore: 82, previousPrice: previousPrice, yearsAgo: Math.floor(Math.random()*3)+1 }
      });
    }
    setNogs(generatedActive);

    const generatedHistory = [];
    for (let i = 0; i < 120; i++) {
      const randCat = GUATECOMPRAS_CATEGORIAS[Math.floor(Math.random() * GUATECOMPRAS_CATEGORIAS.length)].name;
      generatedHistory.push({
        id: `hist_${i}`, title: `SUMINISTRO DE ${randCat.toUpperCase()}`, buyer: EMPRESAS_COMPRADORAS[i % EMPRESAS_COMPRADORAS.length].entidad, category: randCat,
        strategyIntelligence: { previousWinner: "Proveedor Histórico", priceToBeat: Math.floor(Math.random() * 800000) + 50000, renewalDate: `Q${(i % 4) + 1} 2026` }
      });
    }
    setHistoryNogs(generatedHistory);

    const generatedBases = [];
    const today = new Date('2026-11-01T00:00:00'); 
    for (let i = 0; i < 55; i++) {
      const randCat = GUATECOMPRAS_CATEGORIAS[Math.floor(Math.random() * GUATECOMPRAS_CATEGORIAS.length)].name;
      const daysAgo = Math.floor(Math.random() * 365);
      const pubDate = new Date(today); pubDate.setDate(pubDate.getDate() - daysAgo);
      const expDate = new Date(pubDate); expDate.setDate(expDate.getDate() + 10);
      const isVigente = expDate >= today;

      generatedBases.push({
        id: `pb_${i}`, nog: `PB-${5260000 + i}`, title: `PROYECTO DE BASES: ADQUISICIÓN DE ${randCat.split(' ')[0].toUpperCase()}`,
        buyer: EMPRESAS_COMPRADORAS[i % EMPRESAS_COMPRADORAS.length].entidad, category: randCat, procurementType: "Licitación Pública",
        status: isVigente ? 'VIGENTE' : 'VENCIDO', publicationDateRaw: pubDate.toISOString(), publicationDateStr: pubDate.toLocaleDateString('es-GT'),
        expirationDateStr: expDate.toLocaleDateString('es-GT'), horasRestantes: isVigente ? 120 : 0, publishedInfo: `Borrador técnico para observaciones.`,
        keyProductsRequested: "Insumos, Lotes de Inventario"
      });
    }
    generatedBases.sort((a, b) => new Date(b.publicationDateRaw).getTime() - new Date(a.publicationDateRaw).getTime());
    setProyectosBases(generatedBases);
  };

  const analyzeSpecificNogDirectly = (nogId: string) => {
    setActiveTab('ANALIZADOR');
    setNogSearchInput(nogId);
    setIsAnalyzing(true);
    setAnalyzedNog(null);
    setTokenPool(prev => prev - 25);
    setTimeout(() => {
      const found = nogs.find(n => n.nog === nogId) || nogs[0];
      setAnalyzedNog(found);
      setIsAnalyzing(false);
      setDetailSubTab('RESUMEN');
    }, 2000);
  };

  const handleAnalyzeNogForm = (e: React.FormEvent) => {
    e.preventDefault();
    if(!nogSearchInput) return;
    analyzeSpecificNogDirectly(nogSearchInput.trim());
  };

  const handleRunSimulation = (priceToBeat: number) => {
    const cost = parseFloat(ourCost);
    if (!cost || isNaN(cost)) return alert("Ingresa un costo base válido.");
    const suggestedBid = priceToBeat * 0.95; 
    const estimatedMargin = ((suggestedBid - cost) / suggestedBid) * 100;
    setSimulationResult({ suggestedBid: suggestedBid.toFixed(2), estimatedMargin: estimatedMargin.toFixed(1), winProbability: estimatedMargin > 15 ? 'Alta (78%)' : 'Moderada (52%)' });
  };

  // 🚀 IA: ANÁLISIS DE VIABILIDAD PROYECTO DE BASES
  const handleAnalyzeProyectoBase = (baseId: string) => {
    const input = baseProductsInput[baseId];
    if(!input || input.trim() === '') { alert("Ingresa los productos o servicios."); return; }
    setIsAnalyzingBaseId(baseId);
    setTokenPool(prev => prev - 15); 
    setTimeout(() => {
      const matchScore = Math.floor(Math.random() * 40) + 55; 
      setBaseAnalysisResult(prev => ({
        ...prev,
        [baseId]: {
          match: matchScore,
          viability: matchScore > 75 ? "Alta probabilidad." : "Coincidencia parcial. Sugerimos objeción técnica.",
          missing: matchScore > 75 ? ["Carta Distribuidor"] : ["Ficha Técnica Equivalente"]
        }
      }));
      setIsAnalyzingBaseId(null);
    }, 1500);
  };

  // 🚀 LÓGICA: BUSCADOR DE PROVEEDORES (NUEVO MÓDULO)
  const handleBuscarProveedor = (e: React.FormEvent) => {
    e.preventDefault();
    if(!proveedorSearchTerm) return;
    setIsSearchingProveedor(true);
    setAnalyzedProveedor(null);
    setTokenPool(prev => prev - 20); // Cobro IA por extracción
    
    setTimeout(() => {
      // Mock Data basado en las imágenes de Guatecompras
      setAnalyzedProveedor({
        nit: proveedorSearchType === 'NIT' ? proveedorSearchTerm : "70154856",
        nombre: proveedorSearchType === 'NOMBRE' ? proveedorSearchTerm.toUpperCase() : "ESOURCE CAPITAL GUATEMALA, SOCIEDAD ANONIMA",
        tipo: "SOCIEDAD ANÓNIMA",
        rgae: "Sociedades (PRECALIFICADO)",
        adjudicado: "ADJUDICADO",
        contratoAbierto: "NO PARTICIPA (no tiene productos en el catálogo)",
        mipyme: "Mediana",
        representante: "LAVARREDA, ESTRADA, CRISTIAN EDUARDO",
        history: [
          { year: 2026, adjQty: 30, adjMonto: 2237214.64, npgQty: 39, npgMonto: 509541.14 },
          { year: 2025, adjQty: 33, adjMonto: 5292682.52, npgQty: 31, npgMonto: 449235.94 },
          { year: 2024, adjQty: 38, adjMonto: 4600838.81, npgQty: 20, npgMonto: 209713.62 },
          { year: 2023, adjQty: 23, adjMonto: 2705020.59, npgQty: 17, npgMonto: 164062.20 },
          { year: 2022, adjQty: 26, adjMonto: 3192595.33, npgQty: 30, npgMonto: 369263.85 },
          { year: 2021, adjQty: 27, adjMonto: 2001276.05, npgQty: 17, npgMonto: 172992.44 }
        ]
      });
      setIsSearchingProveedor(false);
    }, 1800);
  };

  // Filtros
  const filteredNogs = nogs.filter(op => {
    const matchesCategory = selectedCategory === 'TODAS' || op.category === selectedCategory;
    const matchesModality = filterModalidad === 'TODAS' || op.procurementType.includes(filterModalidad);
    const matchesSearch = searchTerm === '' || op.title.toLowerCase().includes(searchTerm.toLowerCase()) || op.nog.includes(searchTerm) || op.buyer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesModality && matchesSearch;
  });

  const filteredBases = proyectosBases.filter(pb => {
    const mEntidad = pbFilterEntidad === 'TODAS' || pb.buyer === pbFilterEntidad;
    const mCat = pbFilterCategoria === 'TODAS' || pb.category === pbFilterCategoria;
    const mMod = pbFilterModalidad === 'TODAS' || pb.procurementType === pbFilterModalidad;
    const mEstatus = pbFilterEstatus === 'TODOS' || pb.status === pbFilterEstatus;
    return mEntidad && mCat && mMod && mEstatus;
  });

  // ==========================================
  // VISTAS EXTERNAS: LANDING, CHECKOUT, LOGIN
  // ==========================================
  if (currentView === 'LANDING') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="relative flex items-center justify-center w-24 h-24 bg-blue-600 rounded-3xl shadow-[0_0_40px_rgba(37,99,235,0.5)] mb-8"><Brain size={48} strokeWidth={1.5}/></div>
        <h1 className="text-6xl font-black mb-4 tracking-tighter">NOG<span className="text-blue-500">Hunter</span> Pro</h1>
        <p className="text-xl text-slate-400 mb-10 font-medium max-w-3xl text-center">Motor IA para extracción de bases, evaluación de proyectos, espionaje de proveedores y gestión comercial B2B.</p>
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
            <p className="text-xs text-slate-500 mt-2">{checkoutMode === 'LICENSE' ? 'Licencia Master, usuarios configurables y 50,000 tokens iniciales.' : 'Bolsón adicional para análisis IA y match de bases.'}</p>
          </div>
          {successMsg ? (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-center font-bold text-sm"><CheckCircle className="inline mb-1" size={24}/><br/>{successMsg}</div>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <input type="text" className="w-full px-4 py-3 border rounded-xl bg-slate-50" placeholder="Razón Social / Empresa" required />
              <input type="text" className="w-full px-4 py-3 border rounded-xl bg-slate-50" placeholder="NIT" required />
              <input type="email" className="w-full px-4 py-3 border rounded-xl bg-slate-50" placeholder="Correo Master (Recepción de Accessos)" required />
              <div className="border-t border-slate-100 pt-4 mt-2">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-2"><CreditCard size={16}/> Pasarela de Pago Segura</div>
                <input type="text" className="w-full px-4 py-3 border rounded-xl bg-slate-50 mb-2" placeholder="Número de Tarjeta" required />
                <div className="flex gap-2">
                  <input type="text" className="w-1/2 px-4 py-3 border rounded-xl bg-slate-50" placeholder="MM/YY" required />
                  <input type="text" className="w-1/2 px-4 py-3 border rounded-xl bg-slate-50" placeholder="CVC" required />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-md transition-all">Procesar Pago Seguro</button>
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
            <button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-md transition-all">Autenticar Sistema</button>
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
  // VISTA CLIENTE PRINCIPAL
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-100 font-sans flex">
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col justify-between hidden md:flex sticky top-0 h-screen overflow-y-auto">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-3 text-white font-black text-xl tracking-tighter">
            <div className="bg-blue-600 p-1.5 rounded-lg"><Brain size={20} className="text-white"/></div>
            NOGHunter <span className="text-[10px] bg-white text-blue-900 px-1.5 py-0.5 rounded uppercase">PRO</span>
          </div>
          <nav className="p-4 space-y-1.5 text-sm font-medium">
            <button onClick={() => {setActiveTab('DASHBOARD'); setAnalyzedNog(null);}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'DASHBOARD' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}><BarChart3 size={18}/> BI Dashboard</button>
            <button onClick={() => {setActiveTab('ANALIZADOR'); setAnalyzedNog(null);}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${(activeTab === 'ANALIZADOR' && !analyzedNog) ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}><Fingerprint size={18}/> Analizador Profundo NOG</button>
            <button onClick={() => {setActiveTab('ALERTAS'); setAnalyzedNog(null);}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'ALERTAS' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}><Target size={18}/> Buscador (30 Mod.)</button>
            <button onClick={() => {setActiveTab('PROYECTOS_BASES'); setAnalyzedNog(null);}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'PROYECTOS_BASES' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}><BookOpen size={18}/> Proyectos de Bases</button>
            
            {/* 🚀 NUEVA PESTAÑA: ESPIONAJE DE PROVEEDORES */}
            <button onClick={() => {setActiveTab('PROVEEDORES'); setAnalyzedNog(null);}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'PROVEEDORES' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}><UserCheck size={18}/> Directorio Proveedores</button>

            <button onClick={() => {setActiveTab('WORKSPACE'); setAnalyzedNog(null);}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'WORKSPACE' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}><Layout size={18}/> Workspace Kanban</button>
            <button onClick={() => {setActiveTab('LABORATORIO'); setAnalyzedNog(null);}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'LABORATORIO' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}><Cpu size={18}/> Algoritmos Custom</button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Bolsón Tenant (IA)</span>
              <button onClick={() => {setCheckoutMode('TOKENS'); setCurrentView('CHECKOUT');}} className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold hover:bg-emerald-500 transition-colors">Recargar</button>
            </div>
            <div className="font-mono font-black text-emerald-400 text-lg">{tokenPool.toLocaleString()} <span className="text-xs text-slate-500">TKN</span></div>
          </div>
          <button onClick={() => setCurrentView('LOGIN')} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-slate-800 text-xs font-bold transition-colors"><LogOut size={16}/> Cerrar Sesión</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <nav className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">{analyzedNog ? `Operación NOG: ${analyzedNog.nog}` : 'Centro de Inteligencia Comercial B2B'}</h1>
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Sincronizado: Base de Datos API</span>
        </nav>

        <main className="p-6 md:p-8 space-y-8 overflow-y-auto">
          
          {/* ========================================================= */}
          {/* 🚀 NUEVO MÓDULO: ESPIONAJE DE PROVEEDORES                 */}
          {/* ========================================================= */}
          {activeTab === 'PROVEEDORES' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {!analyzedProveedor ? (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
                  <div className="flex justify-center mb-4"><Users size={64} className="text-blue-600"/></div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Espionaje de Proveedores (Guatecompras)</h2>
                  <p className="text-sm text-slate-500 mb-8 max-w-xl mx-auto">Busca a cualquier competidor o persona jurídica que opere con el Estado. Obtendrás su información legal (RGAE, MIPYME, Representante) y su tabla histórica de adjudicaciones cruzada año por año.</p>
                  
                  <form onSubmit={handleBuscarProveedor} className="flex flex-col md:flex-row max-w-3xl mx-auto gap-4">
                    <select value={proveedorSearchType} onChange={e => setProveedorSearchType(e.target.value)} className="px-6 py-4 rounded-xl border border-slate-300 outline-none font-bold text-sm bg-white text-slate-700">
                      <option value="NIT">Buscar por NIT</option>
                      <option value="CUI">Buscar por CUI</option>
                      <option value="NOMBRE">Buscar por NOMBRE</option>
                    </select>
                    <input type="text" value={proveedorSearchTerm} onChange={(e)=>setProveedorSearchTerm(e.target.value)} placeholder={`Ingresa el ${proveedorSearchType}...`} className="flex-1 px-6 py-4 rounded-xl border border-slate-300 focus:border-blue-600 outline-none font-bold text-lg bg-slate-50" required/>
                    <button type="submit" disabled={isSearchingProveedor} className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                      {isSearchingProveedor ? <RefreshCw className="animate-spin" size={20}/> : <Search size={20}/>} {isSearchingProveedor ? 'Extrayendo...' : 'Buscar'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                  {/* Ficha General del Proveedor */}
                  <div className="bg-white rounded-2xl p-8 shadow-md border-t-4 border-t-purple-600">
                    <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
                      <div>
                        <span className="bg-purple-100 text-purple-800 text-xs font-black px-3 py-1 rounded-md border border-purple-200 mb-3 inline-block">PROVEEDOR ESTATAL</span>
                        <h2 className="text-3xl font-black text-slate-900">{analyzedProveedor.nombre}</h2>
                      </div>
                      <button onClick={() => setAnalyzedProveedor(null)} className="text-slate-400 hover:text-blue-600 text-sm font-bold flex items-center gap-1 transition-colors"><Search size={14}/> Nueva Búsqueda</button>
                    </div>
                    
                    <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2"><FileText size={18} className="text-purple-600"/> Información General y Legal</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <div className="flex flex-col border-b border-slate-200 pb-2"><span className="font-bold text-slate-500 text-xs uppercase mb-1">NIT / CUI:</span><span className="font-black text-slate-900 text-lg">{analyzedProveedor.nit}</span></div>
                      <div className="flex flex-col border-b border-slate-200 pb-2"><span className="font-bold text-slate-500 text-xs uppercase mb-1">Tipo de Organización:</span><span className="font-bold text-slate-900">{analyzedProveedor.tipo}</span></div>
                      <div className="flex flex-col border-b border-slate-200 pb-2"><span className="font-bold text-slate-500 text-xs uppercase mb-1">Estado RGAE:</span><span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-max border border-emerald-100">{analyzedProveedor.rgae}</span></div>
                      <div className="flex flex-col border-b border-slate-200 pb-2"><span className="font-bold text-slate-500 text-xs uppercase mb-1">Estatus Histórico:</span><span className="font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded w-max border border-blue-200">{analyzedProveedor.adjudicado}</span></div>
                      <div className="flex flex-col border-b md:border-b-0 border-slate-200 pb-2"><span className="font-bold text-slate-500 text-xs uppercase mb-1">Contrato Abierto:</span><span className="font-bold text-slate-600">{analyzedProveedor.contratoAbierto}</span></div>
                      <div className="flex flex-col"><span className="font-bold text-slate-500 text-xs uppercase mb-1">Clasificación MIPYME:</span><span className="font-bold text-slate-900">{analyzedProveedor.mipyme}</span></div>
                    </div>

                    <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-[10px] font-black text-slate-500 uppercase border-b border-slate-200">
                          <tr><th className="p-3">Representantes Legales</th></tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white"><td className="p-4 text-sm font-bold text-slate-700 flex items-center gap-2"><UserCheck size={16} className="text-slate-400"/> {analyzedProveedor.representante}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Tabla Histórica de Adjudicaciones */}
                  <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200">
                    <h4 className="text-lg font-black text-slate-800 uppercase tracking-wide mb-6 flex items-center gap-2"><TableProperties size={20} className="text-blue-600"/> Adjudicaciones y Publicaciones Recibidas (Todas las Modalidades)</h4>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-right text-sm">
                        <thead className="bg-slate-800 text-white text-[10px] font-black uppercase">
                          <tr>
                            <th className="p-4 text-left border-r border-slate-700">Año Adjudicación</th>
                            <th className="p-4 border-r border-slate-700 bg-blue-900/30">Cant. Concursos</th>
                            <th className="p-4 border-r border-slate-700 bg-blue-900/30">Monto Concursos (Q)</th>
                            <th className="p-4 border-r border-slate-700 bg-purple-900/30">Cant. NPGs</th>
                            <th className="p-4 border-r border-slate-700 bg-purple-900/30">Monto NPGs (Q)</th>
                            <th className="p-4 bg-emerald-900/30">Cant. Total</th>
                            <th className="p-4 bg-emerald-900/30">Monto Total (Q)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyzedProveedor.history.map((h:any, idx:number) => (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                              <td className="p-3 text-left font-black text-slate-700 border-r border-slate-100">{h.year}</td>
                              <td className="p-3 font-bold text-blue-600 border-r border-slate-100">{h.adjQty}</td>
                              <td className="p-3 text-slate-600 border-r border-slate-100">{h.adjMonto.toLocaleString('es-GT', {minimumFractionDigits: 2})}</td>
                              <td className="p-3 font-bold text-purple-600 border-r border-slate-100">{h.npgQty}</td>
                              <td className="p-3 text-slate-600 border-r border-slate-100">{h.npgMonto.toLocaleString('es-GT', {minimumFractionDigits: 2})}</td>
                              <td className="p-3 font-black text-slate-800 bg-slate-50 border-r border-slate-100">{h.adjQty + h.npgQty}</td>
                              <td className="p-3 font-black text-emerald-600 bg-emerald-50/50">{(h.adjMonto + h.npgMonto).toLocaleString('es-GT', {minimumFractionDigits: 2})}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                          <tr>
                            <td className="p-4 text-left border-r border-slate-200">TOTALES HISTÓRICOS</td>
                            <td className="p-4 text-blue-700 border-r border-slate-200">{analyzedProveedor.history.reduce((acc:number, val:any) => acc + val.adjQty, 0)}</td>
                            <td className="p-4 border-r border-slate-200">{analyzedProveedor.history.reduce((acc:number, val:any) => acc + val.adjMonto, 0).toLocaleString('es-GT', {minimumFractionDigits: 2})}</td>
                            <td className="p-4 text-purple-700 border-r border-slate-200">{analyzedProveedor.history.reduce((acc:number, val:any) => acc + val.npgQty, 0)}</td>
                            <td className="p-4 border-r border-slate-200">{analyzedProveedor.history.reduce((acc:number, val:any) => acc + val.npgMonto, 0).toLocaleString('es-GT', {minimumFractionDigits: 2})}</td>
                            <td className="p-4 text-slate-900 bg-slate-200 border-r border-slate-300">{analyzedProveedor.history.reduce((acc:number, val:any) => acc + val.adjQty + val.npgQty, 0)}</td>
                            <td className="p-4 text-emerald-700 bg-emerald-100">Q {analyzedProveedor.history.reduce((acc:number, val:any) => acc + val.adjMonto + val.npgMonto, 0).toLocaleString('es-GT', {minimumFractionDigits: 2})}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MÓDULO: ANALIZADOR PROFUNDO NOG (DOSSIER) */}
          {(activeTab === 'ANALIZADOR' || analyzedNog) && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {!analyzedNog ? (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
                  <div className="flex justify-center mb-4"><Fingerprint size={64} className="text-blue-600"/></div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Analizador Profundo de Eventos (NOG)</h2>
                  <p className="text-sm text-slate-500 mb-8 max-w-xl mx-auto">El motor IA escaneará la base de Guatecompras, extraerá bases, identificará fianzas exactas, visitas técnicas, cruzará competidores y desglosará el producto.</p>
                  
                  <form onSubmit={handleAnalyzeNogForm} className="flex max-w-2xl mx-auto gap-4">
                    <input type="text" value={nogSearchInput} onChange={(e)=>setNogSearchInput(e.target.value)} placeholder="Ej. 32560500" className="flex-1 px-6 py-4 rounded-xl border border-slate-300 focus:border-blue-600 outline-none font-bold text-lg bg-slate-50" required/>
                    <button type="submit" disabled={isAnalyzing} className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-xl shadow-md transition-all flex items-center gap-2">
                      {isAnalyzing ? <RefreshCw className="animate-spin" size={20}/> : <Cpu size={20}/>} {isAnalyzing ? 'Analizando (-25 TKN)' : 'Ejecutar Análisis IA'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                  <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                    <button onClick={() => setDetailSubTab('RESUMEN')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${detailSubTab === 'RESUMEN' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Ficha Oficial y Fianzas</button>
                    <button onClick={() => setDetailSubTab('CRITERIOS')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${detailSubTab === 'CRITERIOS' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Scale size={16}/> Extracción IA</button>
                    <button onClick={() => setDetailSubTab('COMPETENCIA')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${detailSubTab === 'COMPETENCIA' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><Crosshair size={16}/> Similitud Histórica</button>
                    <button onClick={() => setDetailSubTab('OPERACION')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${detailSubTab === 'OPERACION' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><FileOutput size={16}/> Creador Oferta (DOCX)</button>
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
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200">
                        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2"><Search className="text-purple-600"/> Análisis IA de Producto/Servicio</h3>
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
                          <h4 className="font-black text-purple-900 mb-1 text-lg">Coincidencia de Rubros {'>'} 70%</h4>
                          <p className="text-sm text-purple-800 leading-relaxed">El motor cruzó el requerimiento con el historial de compras de <strong>{analyzedNog.unidadCompradora}</strong> y encontró un evento pasado con un <strong>{analyzedNog.historicalCompetition.similarityScore}% de similitud técnica</strong>.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                          <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Proveedor Adjudicado Anterior</span>
                          <div className="text-xl font-black text-slate-800">{analyzedNog.historicalCompetition.previousWinner}</div>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded mt-3 inline-block border border-slate-200">Ref NOG: {analyzedNog.historicalCompetition.previousNog}</span>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                          <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Precio Adjudicado (Hace {analyzedNog.historicalCompetition.yearsAgo} años)</span>
                          <div className="text-2xl font-black text-emerald-600">Q {analyzedNog.historicalCompetition.previousPrice.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-xl shadow-lg flex flex-col justify-center">
                          <span className="text-xs font-bold text-blue-400 uppercase block mb-2">Simulador Ofensivo IA</span>
                          <div className="flex gap-2 mb-3">
                            <input type="number" value={ourCost} onChange={(e) => setOurCost(e.target.value)} placeholder="Tu Costo (Q)" className="w-full px-3 py-2 border rounded-lg bg-slate-800 border-slate-700 text-white text-sm font-bold outline-none" />
                            <button onClick={() => handleRunSimulation(analyzedNog.historicalCompetition.previousPrice * 1.05)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-bold">Cruzar</button>
                          </div>
                          {simulationResult && (
                            <div className="bg-slate-800 text-white p-3 rounded-lg text-xs font-medium border border-slate-700">
                              Sug. Ganadora: <span className="font-black text-emerald-400 block text-lg mb-1">Q {simulationResult.suggestedBid}</span>
                              Margen: <span className="text-blue-400 font-bold">{simulationResult.estimatedMargin}%</span>
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
                      <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
                        <button onClick={() => alert("Generando DOCX...")} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-3">
                          <FileText size={20}/> Descargar Checklist (DOC)
                        </button>
                        <button onClick={() => alert("Generando DOCX...")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-3">
                          <FileText size={20}/> Índice de Oferta (DOC)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 🚀 MÓDULO: PROYECTOS DE BASES (BORRADORES) */}
          {activeTab === 'PROYECTOS_BASES' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><BookOpen className="text-blue-600"/> Búsqueda Avanzada de Proyectos de Bases</h3>
                  <p className="text-sm text-slate-500 mt-1 mb-6">Analiza borradores publicados en el último año (Nov 2025 - Nov 2026) para influir técnicamente antes de la licitación oficial.</p>
                  
                  <form onSubmit={(e) => { e.preventDefault(); setIsSearchingBases(true); setTimeout(() => setIsSearchingBases(false), 1500); }} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Entidad Compradora</label>
                      <select value={pbFilterEntidad} onChange={(e) => setPbFilterEntidad(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white outline-none">
                        <option value="TODAS">--- Todas las entidades ---</option>
                        {Array.from(new Set(EMPRESAS_COMPRADORAS.map(e => e.entidad))).map(ent => <option key={ent} value={ent}>{ent}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Categoría</label>
                      <select value={pbFilterCategoria} onChange={(e) => setPbFilterCategoria(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white outline-none">
                        <option value="TODAS">--- Todas las categorías ---</option>
                        {GUATECOMPRAS_CATEGORIAS.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Estatus del Borrador</label>
                      <select value={pbFilterEstatus} onChange={(e) => setPbFilterEstatus(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white outline-none">
                        <option value="TODOS">--- Todos los estatus ---</option>
                        <option value="VIGENTE">Vigente (Aceptan Observaciones)</option>
                        <option value="VENCIDO">Vencido (Histórico / Cerrado)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Rango de Publicación</label>
                      <div className="flex gap-4 items-center">
                        <input type="date" value={pbFechaInicio} onChange={(e) => setPbFechaInicio(e.target.value)} className="w-full py-2 px-3 border rounded-lg text-sm outline-none bg-white" />
                        <span className="text-xs font-bold text-slate-400 uppercase">AL</span>
                        <input type="date" value={pbFechaFin} onChange={(e) => setPbFechaFin(e.target.value)} className="w-full py-2 px-3 border rounded-lg text-sm outline-none bg-white" />
                        <button type="submit" disabled={isSearchingBases} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-8 rounded-lg flex items-center gap-2 shadow-md">
                          {isSearchingBases ? <RefreshCw size={18} className="animate-spin"/> : <Database size={18}/>} Buscar
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="space-y-4 relative min-h-[300px]">
                {isSearchingBases ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/80 backdrop-blur-sm z-10 rounded-2xl">
                    <Database size={48} className="text-blue-500 animate-bounce mb-4"/>
                    <h3 className="text-xl font-black text-slate-800">Consultando MongoDB...</h3>
                  </div>
                ) : (
                  filteredBases.slice(0, 20).map((pb) => (
                    <div key={pb.id} className={`bg-white rounded-2xl shadow-sm border-l-4 overflow-hidden ${pb.status === 'VIGENTE' ? 'border-l-emerald-500' : 'border-l-rose-400 opacity-80'}`}>
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-3">
                              <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded border border-blue-200">Ref: {pb.nog}</span>
                              <span className={`text-[10px] font-black px-2.5 py-1 rounded border ${pb.status === 'VIGENTE' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'}`}>{pb.status}</span>
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">Pub: {pb.publicationDateStr}</span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 leading-tight mb-2">{pb.title}</h3>
                            <p className="text-sm font-bold text-slate-500 mb-2"><Building2 size={16} className="inline mr-1"/> {pb.buyer}</p>
                            <p className="text-xs text-slate-600 mb-2"><strong>Descripción:</strong> {pb.publishedInfo}</p>
                          </div>
                          <div className="w-full md:w-1/3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <h4 className="text-xs font-black text-slate-700 uppercase mb-2">Simulador de Viabilidad IA</h4>
                            <textarea rows={2} placeholder="Ej. Licencias Windows..." className="w-full text-xs p-2 rounded-lg border border-slate-300 outline-none mb-3" value={baseProductsInput[pb.id] || ''} onChange={(e) => setBaseProductsInput(prev => ({...prev, [pb.id]: e.target.value}))}/>
                            <button onClick={() => handleAnalyzeProyectoBase(pb.id)} disabled={isAnalyzingBaseId === pb.id} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                              {isAnalyzingBaseId === pb.id ? <RefreshCw size={14} className="animate-spin"/> : <Percent size={14}/>} Analizar Probabilidad
                            </button>
                            {baseAnalysisResult[pb.id] && (
                              <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in">
                                <span className={`text-lg font-black ${baseAnalysisResult[pb.id].match > 75 ? 'text-emerald-600' : 'text-amber-600'} block mb-1`}>Match IA: {baseAnalysisResult[pb.id].match}%</span>
                                <p className="text-[10px] text-slate-600 leading-tight mb-2">{baseAnalysisResult[pb.id].viability}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* DASHBOARD EJECUTIVO */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><p className="text-xs font-bold text-slate-400 uppercase">Alertas (Vigentes)</p><h3 className="text-4xl font-black text-slate-900 mt-2">{nogs.length}</h3></div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><p className="text-xs font-bold text-slate-400 uppercase">Proyectos de Bases</p><h3 className="text-4xl font-black text-emerald-600 mt-2">155</h3></div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><p className="text-xs font-bold text-slate-400 uppercase">Eventos en Seguimiento</p><h3 className="text-4xl font-black text-amber-500 mt-2">42</h3></div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><p className="text-xs font-bold text-slate-400 uppercase">Contratos a Arrebatar</p><h3 className="text-4xl font-black text-slate-900 mt-2">{historyNogs.length}</h3></div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-base font-black text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2"><Clock size={20} className="text-rose-600"/> Cierre de Oportunidades (Matriz de Riesgo Operativo)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-rose-50 border border-rose-200 p-6 rounded-xl text-center shadow-inner"><span className="text-xs font-bold text-rose-800 uppercase">🔴 Cierran Hoy (Crítico)</span><div className="text-5xl font-black text-rose-700 mt-2">{nogs.filter(n => n?.semaforo === 'ROJO').length}</div></div>
                  <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl text-center shadow-inner"><span className="text-xs font-bold text-amber-800 uppercase">🟡 Mañana (Prevención)</span><div className="text-5xl font-black text-amber-700 mt-2">{nogs.filter(n => n?.semaforo === 'AMARILLO').length}</div></div>
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center shadow-inner"><span className="text-xs font-bold text-emerald-800 uppercase">🟢 Más de 3 Días (A Tiempo)</span><div className="text-5xl font-black text-emerald-700 mt-2">{nogs.filter(n => n?.semaforo === 'VERDE').length}</div></div>
                </div>
              </div>
            </div>
          )}

          {/* MOTOR DE BÚSQUEDA Y RADAR (CON 30 MODALIDADES) */}
          {activeTab === 'ALERTAS' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">1. Filtrar por Modalidad de Compra Oficial (Guatecompras)</label>
                  <select value={filterModalidad} onChange={(e) => setFilterModalidad(e.target.value)} className="w-full md:max-w-xl px-4 py-3 border rounded-xl bg-slate-50 font-bold text-sm outline-none cursor-pointer">
                    <option value="TODAS">TODAS LAS MODALIDADES (BARRIDO COMPLETO)</option>
                    {TODAS_LAS_MODALIDADES.map(mod => <option key={mod} value={mod}>{mod.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">2. Filtrar por Categoría Institucional / Custom</label>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedCategory('TODAS')} className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${selectedCategory === 'TODAS' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>TODAS LAS CATEGORÍAS</button>
                    {GUATECOMPRAS_CATEGORIAS.map((cat) => (
                      <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${selectedCategory === cat.name ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{cat.name.toUpperCase()}</button>
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
                      <button onClick={() => analyzeSpecificNogDirectly(op.nog)} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors w-full md:w-auto whitespace-nowrap">
                        <FileDigit size={16}/> Extraer Dossier NOG (IA)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WORKSPACE OPERATIVO (TABLERO KANBAN REAL) */}
          {activeTab === 'WORKSPACE' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3"><Layout className="text-blue-600"/> Gestor Operativo Kanban</h3>
                <button className="bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-md hover:bg-blue-700">+ Mover NOG a Tablero</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-inner">
                  <h4 className="font-black text-slate-700 mb-4 uppercase text-xs tracking-wider flex items-center gap-2"><AlertCircle size={14}/> 1. Por Evaluar (To-Do)</h4>
                  <div className="space-y-3">
                    {kanbanTasks.filter(t => t.status === 'TODO').map(task => (
                      <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 cursor-pointer">
                        <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded">NOG: {task.nog}</span>
                        <h5 className="font-bold text-slate-800 text-sm mt-2 leading-tight">{task.title}</h5>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-inner">
                  <h4 className="font-black text-slate-700 mb-4 uppercase text-xs tracking-wider flex items-center gap-2"><RefreshCw size={14}/> 2. Armando Oferta Técnica</h4>
                  <div className="space-y-3">
                    {kanbanTasks.filter(t => t.status === 'IN_PROGRESS').map(task => (
                      <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-amber-200 border-l-4 border-l-amber-500 cursor-pointer">
                        <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded">NOG: {task.nog}</span>
                        <h5 className="font-bold text-slate-800 text-sm mt-2 leading-tight">{task.title}</h5>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-inner">
                  <h4 className="font-black text-slate-700 mb-4 uppercase text-xs tracking-wider flex items-center gap-2"><CheckCircle size={14}/> 3. Presentadas</h4>
                  <div className="space-y-3">
                    {kanbanTasks.filter(t => t.status === 'DONE').map(task => (
                      <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-emerald-200 border-l-4 border-l-emerald-500 opacity-75">
                        <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded">NOG: {task.nog}</span>
                        <h5 className="font-bold text-slate-800 text-sm mt-2 leading-tight">{task.title}</h5>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LABORATORIO DE CATEGORÍAS */}
          {activeTab === 'LABORATORIO' && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><Cpu className="text-blue-600"/> Laboratorio de Algoritmos (Categorías Custom)</h3>
                <p className="text-sm text-slate-500 mt-2">Crea segmentos propios para que la IA agrupe eventos que beneficien tu estrategia.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Definir Nueva Categoría (Ej. 'Software Médico')</label>
                <div className="flex gap-4">
                  <input type="text" value={newCustomCat} onChange={e => setNewCustomCat(e.target.value)} placeholder="Nombre de la categoría..." className="flex-1 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-blue-600 text-sm" />
                  <button onClick={() => { if(newCustomCat) { setCustomCategories([...customCategories, newCustomCat]); setNewCustomCat(''); alert('Categoría algorítmica creada e integrada al buscador.'); } }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-8 py-3 rounded-xl shadow-md">Crear Segmento</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
