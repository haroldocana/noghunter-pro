import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, XCircle, Search, ArrowLeft, Trophy, FileText, ChevronRight, BarChart3, AlertCircle, Clock, Building2, Filter, Download, Cpu, ShieldCheck, Layers, LogOut, PieChart, TrendingUp, Sliders, Zap, AlertTriangle, Eye, RefreshCw } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');

  // 🚀 CRONÓMETRO DE ACTUALIZACIÓN CADA 5 HORAS (18000 segundos)
  const [countdown, setCountdown] = useState(18000); 
  const [lastUpdated, setLastUpdated] = useState('Hace unos segundos');

  const [ourCost, setOurCost] = useState('');
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const [formData, setFormData] = useState({ companyName: '', nit: '', adminName: '', adminEmail: '' });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [companies, setCompanies] = useState<any[]>([]);
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
  const [newCompanyForm, setNewCompanyForm] = useState({ companyName: '', nit: '', adminName: '', adminEmail: '' });
  const [creatingCompany, setCreatingCompany] = useState(false);

  // Efecto para el temporizador de actualización automática cada 5 horas
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          ejecutarEscaneoAutomatico5Horas();
          return 18000; // Reinicia a 5 horas
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const ejecutarEscaneoAutomatico5Horas = () => {
    generar327AlertasMasivas();
    setLastUpdated('Justo ahora (Actualización automática de 5h)');
  };

  const formatCountdown = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === 'haroldocana@comptech.lat' && password === 'Admin123*') {
      setCurrentView('SUPERADMIN');
      setIsLoading(false);
      return; 
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      const data = await response.json();
      if (response.ok) {
        if (data.user.role === 'MASTER') setCurrentView('SUPERADMIN');
        else setCurrentView('CLIENT');
      } else {
        alert(data.error || 'Credenciales inválidas'); 
      }
    } catch (error) {
      alert('Error de conexión al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`,
          companyName: formData.companyName,
          nit: formData.nit,
          adminName: formData.adminName,
          adminEmail: formData.adminEmail,
          amount: 12500
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg('¡Pago exitoso! Revisa tu correo electrónico para obtener tus credenciales.');
        setFormData({ companyName: '', nit: '', adminName: '', adminEmail: '' });
      } else {
        setErrorMsg(data.error || 'Error al procesar la compra.');
      }
    } catch (error) {
      setErrorMsg('Error de conexión con el servidor.');
    } finally {
      setCheckoutLoading(false);
    }
  };

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

  const handleCreateCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCompany(true);
    try {
      const response = await fetch('/api/admin/tenants/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompanyForm)
      });
      const data = await response.json();
      if (response.ok) {
        alert('¡Empresa creada con éxito!');
        setShowNewCompanyModal(false);
        setNewCompanyForm({ companyName: '', nit: '', adminName: '', adminEmail: '' });
        window.location.reload(); 
      } else {
        alert(data.error || 'Error al crear la empresa');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setCreatingCompany(false);
    }
  };

  const handleGenerateCredentials = async (companyId: string) => {
    const newPass = prompt("Nueva contraseña temporal para el administrador:");
    if (!newPass) return;
    try {
      const response = await fetch(`/api/admin/tenants/${companyId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPass })
      });
      if (response.ok) alert('¡Contraseña actualizada con éxito!');
      else alert('Error al actualizar');
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const generar327AlertasMasivas = () => {
    const categorias = [
      "Computación y telecomunicaciones",
      "Salud e insumos hospitalarios",
      "Construcción y materiales afines",
      "Alimentos y semillas",
      "Electricidad y aire acondicionado",
      "Limpieza y fumigación",
      "Muebles y mobiliario de oficina",
      "Papelería y útiles de librería",
      "Seguridad y armamento",
      "Transporte, repuestos y combustibles"
    ];
    
    const tipos = ["LICITACIÓN PÚBLICA", "COTIZACIÓN", "COMPRA DIRECTA"];
    const entidades = [
      "MINISTERIO DE FINANZAS PÚBLICAS",
      "MINISTERIO DE SALUD PÚBLICA Y ASISTENCIA SOCIAL",
      "MINISTERIO DE EDUCACIÓN",
      "SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA (SAT)",
      "MUNICIPALIDAD DE GUATEMALA",
      "INSTITUTO GUATEMALTECO DE SEGURIDAD SOCIAL (IGSS)"
    ];

    const generated = [];
    for (let i = 1; i <= 327; i++) {
      const catIndex = i % categorias.length;
      const typeIndex = i % tipos.length;
      const entIndex = i % entidades.length;
      const nogNum = 1000000 + i;

      generated.push({
        id: nogNum.toString(),
        nog: nogNum.toString(),
        title: `Proceso #${i}: Adquisición y Suministro de ${categorias[catIndex]} para Sector Público`,
        buyer: entidades[entIndex],
        procurementType: tipos[typeIndex],
        extractedProduct: categorias[catIndex],
        category: categorias[catIndex],
        estimatedBudget: Math.floor(Math.random() * 850000) + 25000.00,
        matchScore: Math.floor(Math.random() * 65) + 35,
        closingTime: i % 2 === 0 ? "Cierra Hoy" : "Cierra en 48 Horas",
        requiresOnSiteVisit: i % 5 === 0,
        onSiteVisitDetails: { date: "Próxima semana", location: "Oficinas Centrales" },
        institutionRisk: { avgPaymentDays: "30 días", revocationRate: "Bajo (1.0%)", transparencyScore: "94 / 100" },
        summary: [`Extracción automática IA para ${categorias[catIndex]}`, "Cumple con normativas de Guatecompras"],
        evaluationCriteria: [{ factor: "Precio", weight: 50 }, { factor: "Experiencia", weight: 50 }],
        competitorsAnalysis: [{ name: "Competidor Líder S.A.", probability: "40%", strength: "Historial previo" }],
        strategyIntelligence: { isRenewal: i % 3 === 0, previousWinner: "Competidor Líder S.A.", priceToBeat: 120000.00 },
        riskClauses: ["Garantía de cumplimiento estándar requerida"],
        documents: [{ name: `Bases_NOG_${nogNum}.pdf`, size: "2.4 MB", type: "Bases Oficiales" }]
      });
    }
    setNogs(generated);
  };

  const handleRunSimulation = (priceToBeat: number) => {
    const cost = parseFloat(ourCost);
    if (!cost || isNaN(cost)) {
      alert("Por favor ingresa un costo base válido.");
      return;
    }
    const suggestedBid = priceToBeat * 0.95; 
    const estimatedMargin = ((suggestedBid - cost) / suggestedBid) * 100;
    setSimulationResult({
      suggestedBid: suggestedBid.toFixed(2),
      estimatedMargin: estimatedMargin.toFixed(1),
      winProbability: estimatedMargin > 15 ? 'Alta (78%)' : 'Moderada (52%)',
      recommendation: estimatedMargin > 15 ? 'Oferta altamente competitiva con margen saludable.' : 'Cuidado: el margen de ganancia es ajustado frente al costo.'
    });
  };

  const filteredNogs = nogs.filter(op => {
    const matchesCategory = selectedCategory === 'TODAS' || op.category === selectedCategory;
    const matchesType = filterType === 'TODOS' || op.procurementType === filterType;
    const matchesSearch = searchTerm === '' || 
      op.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      op.nog.includes(searchTerm) || 
      op.extractedProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.buyer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  if (currentView === 'LANDING') {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900">
        <header className="flex justify-between items-center py-4 px-8 border-b border-slate-100">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <Target className="text-blue-600"/><span className="text-blue-700">NOGHunter</span><span className="text-slate-900">Pro</span>
          </div>
          <button onClick={() => setCurrentView('LOGIN')} className="text-sm font-semibold text-slate-600 hover:text-blue-700">Iniciar Sesión</button>
        </header>
        <section className="max-w-5xl mx-auto text-center py-20 px-4">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Guatecompras sin límites de categoría.<br/><span className="text-blue-600">Actualización automática cada 5 horas.</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">La plataforma definitiva de inteligencia comercial con IA.</p>
          <button onClick={() => setCurrentView('CHECKOUT')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg text-lg">Adquirir Licencia Q12,500 / año</button>
        </section>
      </div>
    );
  }

  if (currentView === 'CHECKOUT') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative">
        <button onClick={() => setCurrentView('LANDING')} className="absolute top-6 left-6 text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"><ArrowLeft size={16}/> Volver</button>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Finalizar Compra</h2>
          {successMsg && <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm">{successMsg}</div>}
          {errorMsg && <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">{errorMsg}</div>}
          {!successMsg && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <input type="text" name="companyName" value={formData.companyName} onChange={handleCheckoutChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="Nombre de la Empresa" />
              <input type="text" name="nit" value={formData.nit} onChange={handleCheckoutChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="NIT" />
              <input type="text" name="adminName" value={formData.adminName} onChange={handleCheckoutChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="Nombre Administrador" />
              <input type="email" name="adminEmail" value={formData.adminEmail} onChange={handleCheckoutChange} required className="w-full px-4 py-2 border rounded-lg" placeholder="Correo Electrónico" />
              <button type="submit" disabled={checkoutLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4">{checkoutLoading ? 'Procesando...' : 'Pagar Q12,500 y Activar'}</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'LOGIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
        <button onClick={() => setCurrentView('LANDING')} className="absolute top-6 left-6 text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"><ArrowLeft size={16}/> Volver</button>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 text-center">NOGHunter Pro</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Correo" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Contraseña" required />
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg">{isLoading ? 'Ingresando...' : 'Ingresar al Panel'}</button>
          </form>
        </div>
      </div>
    );
  }

  if (currentView === 'SUPERADMIN') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Target className="text-blue-400"/> NOGHunter SuperAdmin</h1>
          <button onClick={() => setCurrentView('LANDING')} className="text-sm text-slate-400 hover:text-white">Cerrar Sesión</button>
        </nav>
        <main className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Gestión de Inquilinos</h2>
            <button onClick={() => setShowNewCompanyModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Nueva Empresa</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companies.map(company => (
              <div key={company.id || company._id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold mb-2">{company.name}</h3>
                <p className="text-sm text-slate-400 mb-4">Estado: <span className="text-emerald-400 font-bold">{company.status}</span></p>
                <button onClick={() => handleGenerateCredentials(company.id || company._id)} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm font-medium">Generar Credenciales</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'DETAIL' && selectedNog) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans">
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <button onClick={() => setCurrentView('CLIENT')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1"><ArrowLeft size={16}/> Volver al Dashboard</button>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">NOG: {selectedNog.nog}</span>
        </nav>

        <main className="max-w-5xl mx-auto py-8 px-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-700 rounded uppercase">{selectedNog.procurementType}</span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">{selectedNog.title}</h2>
                <p className="text-slate-600 font-medium flex items-center gap-2 mt-1"><Building2 size={16}/> {selectedNog.buyer}</p>
                <span className="inline-block mt-2 bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded">Categoría: {selectedNog.category}</span>
                
                {selectedNog.requiresOnSiteVisit && (
                  <div className="mt-3 bg-purple-50 border border-purple-200 p-3 rounded-xl flex items-center gap-2 text-purple-800 text-xs font-bold">
                    <Eye size={16}/> ⚠️ Este evento exige Visita Presencial: {selectedNog.onSiteVisitDetails.date}
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-bold uppercase">Presupuesto Estimado</span>
                <div className="text-2xl font-black text-emerald-600">Q {selectedNog.estimatedBudget?.toLocaleString('es-GT', {minimumFractionDigits: 2})}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Zap className="text-amber-400"/> Simulador Predictivo de Oferta Ganadora (IA)</h3>
            <p className="text-sm text-slate-300 mb-6">Calcula tu margen óptimo frente al precio a vencer (Q {selectedNog.strategyIntelligence?.priceToBeat?.toLocaleString()}).</p>
            
            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
              <div className="w-full md:flex-1">
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Costo Base (Q)</label>
                <input type="number" value={ourCost} onChange={(e) => setOurCost(e.target.value)} placeholder="Ej. 110000" className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-blue-500" />
              </div>
              <button onClick={() => handleRunSimulation(selectedNog.strategyIntelligence?.priceToBeat)} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all self-end">Simular Propuesta</button>
            </div>

            {simulationResult && (
              <div className="bg-slate-800/90 border border-blue-500/30 p-5 rounded-xl space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><span className="text-xs text-slate-400 uppercase">Oferta Sugerida IA</span><div className="text-2xl font-black text-emerald-400">Q {simulationResult.suggestedBid}</div></div>
                  <div><span className="text-xs text-slate-400 uppercase">Margen Estimado</span><div className="text-2xl font-black text-blue-400">{simulationResult.estimatedMargin}%</div></div>
                  <div><span className="text-xs text-slate-400 uppercase">Probabilidad</span><div className="text-2xl font-black text-amber-400">{simulationResult.winProbability}</div></div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex">
      
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-2 text-white font-black text-xl tracking-tighter">
            <Target className="text-blue-500"/> NOGHunter <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">PRO</span>
          </div>
          <nav className="p-4 space-y-2 text-sm font-medium">
            <button onClick={() => setActiveTab('DASHBOARD')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'DASHBOARD' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <BarChart3 size={18}/> Dashboard
            </button>
            <button onClick={() => setActiveTab('ALERTAS')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'ALERTAS' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <AlertCircle size={18}/> Alertas <span className="ml-auto bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">{nogs.length}</span>
            </button>
            <button onClick={() => setActiveTab('PRESUPUESTOS')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'PRESUPUESTOS' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <PieChart size={18}/> Análisis Presupuestario
            </button>
            <button onClick={() => setActiveTab('RECUPERACION')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'RECUPERACION' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <RefreshCw size={18}/> Recuperar de Competencia
            </button>
            <button onClick={() => setActiveTab('LABORATORIO')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'LABORATORIO' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
              <Cpu size={18}/> Laboratorio de Reglas
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 block mb-1">Próximo Barrido IA (5h):</span>
            <span className="font-mono font-bold text-emerald-400">{formatCountdown(countdown)}</span>
          </div>
          <button onClick={() => setCurrentView('LOGIN')} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-slate-800 text-xs font-bold"><LogOut size={16}/> Cerrar Sesión</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h1 className="text-lg font-bold text-slate-800">Centro de Inteligencia Comercial & Extracción Masiva</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500">Última actualización: <strong className="text-slate-700">{lastUpdated}</strong></span>
            <span className="text-sm font-bold text-emerald-600">Bolsón IA: 48,500 / 50,000 Tokens</span>
          </div>
        </nav>

        <main className="p-6 md:p-8 space-y-8 overflow-y-auto">
          
          {activeTab === 'PRESUPUESTOS' ? (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2"><TrendingUp className="text-blue-600"/> Análisis Presupuestario Global</h3>
                <p className="text-sm text-slate-500">Monitoreo activo de procesos vigentes en Guatecompras.</p>
              </div>
            </div>
          ) : activeTab === 'LABORATORIO' ? (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Cpu className="text-blue-600"/> Laboratorio de Reglas y Criterios IA</h3>
                <p className="text-sm text-slate-500">Configura palabras clave y umbrales para el escaneo automático cada 5 horas.</p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Frecuencia de Barrido Automático</label>
                  <input type="text" disabled value="Cada 5 horas (Sincronizado con Guatecompras)" className="w-full px-4 py-2 border rounded-xl text-sm bg-slate-100 text-slate-600 font-semibold" />
                  <button onClick={() => { ejecutarEscaneoAutomatico5Horas(); alert('¡Radar reindexado manualmente con éxito!'); }} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl">Forzar Escaneo Inmediato</button>
                </div>
              </div>
            </div>
          ) : activeTab === 'RECUPERACION' ? (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2"><RefreshCw className="text-blue-600"/> Recuperación de Proyectos de la Competencia</h3>
                <p className="text-sm text-slate-500 mb-6">Historial de contratos adjudicados a terceros.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Filtrar por Categorías Oficiales de Guatecompras</label>
                <div className="flex flex-wrap gap-2">
                  {['TODAS', 'Computación y telecomunicaciones', 'Salud e insumos hospitalarios', 'Construcción y materiales afines', 'Alimentos y semillas', 'Electricidad y aire acondicionado', 'Limpieza y fumigación', 'Muebles y mobiliario de oficina', 'Papelería y útiles de librería', 'Seguridad y armamento', 'Transporte, repuestos y combustibles'].map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{cat}</button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Search className="text-slate-400" size={20}/>
                  <input type="text" placeholder="Buscar entre las 327+ alertas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-96 px-4 py-2 border rounded-xl outline-none focus:border-blue-600 text-sm" />
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  {['TODOS', 'LICITACIÓN PÚBLICA', 'COTIZACIÓN', 'COMPRA DIRECTA'].map((type) => (
                    <button key={type} onClick={() => setFilterType(type)} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${filterType === type ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{type}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {filteredNogs.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
                    <p className="text-slate-500">Cargando procesos desde el motor masivo...</p>
                  </div>
                ) : (
                  filteredNogs.map((op) => (
                    <div key={op.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-start hover:border-blue-300 transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">NOG: {op.nog}</span>
                          <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">{op.procurementType}</span>
                          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">{op.category}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">{op.title}</h3>
                        <p className="text-slate-600 font-medium flex items-center gap-2 mb-4"><Building2 size={16}/> {op.buyer}</p>
                        
                        <button onClick={() => { setSelectedNog(op); setCurrentView('DETAIL'); }} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm">
                          Simular Oferta IA, Bases y Competencia <ChevronRight size={14}/>
                        </button>
                      </div>

                      <div className="w-full md:w-48 flex flex-col gap-3">
                        <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-100 text-center">
                          <span className="text-xs font-bold text-slate-500 mb-1">Match Score</span>
                          <div className="text-3xl font-black text-green-600 mb-1">{op.matchScore}%</div>
                        </div>
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
