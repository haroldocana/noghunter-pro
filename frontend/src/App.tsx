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
          else cargarDatosCompletosMuestra();
          setIsLoading(false);
        })
        .catch(() => {
          cargarDatosCompletosMuestra();
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

  // 🚀 DATOS AMPLIADOS PARA CUBRIR TODAS LAS CATEGORÍAS DEL FILTRO
  const cargarDatosCompletosMuestra = () => {
    setNogs([
      { 
        id: "9876543", nog: "9876543", 
        title: "Adquisición de Licencias en la Nube y Ciberseguridad", 
        buyer: "MINISTERIO DE FINANZAS PÚBLICAS", 
        procurementType: "LICITACIÓN PÚBLICA", extractedProduct: "Google Workspace & Firewall",
        category: "Tecnología y Cloud", estimatedBudget: 150000.00, matchScore: 92, closingTime: "Cierra Hoy",
        requiresOnSiteVisit: true, onSiteVisitDetails: { date: "3 de Noviembre, 2024 - 10:00 AM", location: "Oficinas Centrales Minfin" },
        institutionRisk: { avgPaymentDays: "35 días", revocationRate: "Bajo (1.2%)", transparencyScore: "96 / 100" },
        summary: ["Licenciamiento Google Workspace", "Protección perimetral avanzada"],
        evaluationCriteria: [{ factor: "Precio", weight: 40 }, { factor: "Experiencia", weight: 60 }],
        competitorsAnalysis: [{ name: "CiberSec S.A.", probability: "25%", strength: "Precio bajo" }, { name: "Comptech (Tú)", probability: "68%", strength: "Partner oficial" }],
        strategyIntelligence: { isRenewal: true, previousWinner: "CiberSec S.A.", priceToBeat: 145500.00 },
        riskClauses: ["Multa de 0.5% por día de atraso"], documents: [{ name: "Bases_9876543.pdf", size: "4.2 MB", type: "Bases" }]
      },
      { 
        id: "4567891", nog: "4567891", 
        title: "Suministro de Medicamentos e Insumos Hospitalarios", 
        buyer: "MINISTERIO DE SALUD PÚBLICA", 
        procurementType: "COTIZACIÓN", extractedProduct: "Antibióticos y Material Quirúrgico",
        category: "Salud e Insumos Médicos", estimatedBudget: 450000.00, matchScore: 88, closingTime: "Cierra Mañana",
        requiresOnSiteVisit: false, institutionRisk: { avgPaymentDays: "60 días", revocationRate: "Medio (3.5%)", transparencyScore: "88 / 100" },
        summary: ["Suministro lote hospitalario", "Registro sanitario vigente"],
        evaluationCriteria: [{ factor: "Costo", weight: 70 }], competitorsAnalysis: [{ name: "PharmaCorp", probability: "60%", strength: "Stock inmediato" }],
        strategyIntelligence: { isRenewal: false, previousWinner: "PharmaCorp", priceToBeat: 420000.00 },
        riskClauses: ["Garantía de cumplimiento del 20%"], documents: [{ name: "Bases_Salud.pdf", size: "3.1 MB", type: "Bases" }]
      },
      { 
        id: "1122334", nog: "1122334", 
        title: "Construcción de Muro Perimetral Escolar", 
        buyer: "MINISTERIO DE EDUCACIÓN", 
        procurementType: "LICITACIÓN PÚBLICA", extractedProduct: "Obra Gris y Albañilería",
        category: "Construcción y Obra Grís", estimatedBudget: 850000.00, matchScore: 75, closingTime: "Más de 3 días",
        requiresOnSiteVisit: true, onSiteVisitDetails: { date: "5 de Noviembre, 2024", location: "Escuela Tipo C" },
        institutionRisk: { avgPaymentDays: "45 días", revocationRate: "Bajo (2.0%)", transparencyScore: "90 / 100" },
        summary: ["Remozamiento de centro educativo"],
        evaluationCriteria: [{ factor: "Precio", weight: 50 }], competitorsAnalysis: [{ name: "Constructora Izabal", probability: "80%", strength: "Local" }],
        strategyIntelligence: { isRenewal: false, previousWinner: "Constructora Izabal", priceToBeat: 800000.00 },
        riskClauses: ["Fianza de anticipo obligatoria"], documents: [{ name: "Planos.pdf", size: "12.5 MB", type: "Planos" }]
      },
      { 
        id: "7788990", nog: "7788990", 
        title: "Suministro de Enlaces Dedicados de Internet 1Gbps", 
        buyer: "SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA (SAT)", 
        procurementType: "COTIZACIÓN", extractedProduct: "Fibra óptica y Enlaces IP",
        category: "Telecomunicaciones", estimatedBudget: 120000.00, matchScore: 94, closingTime: "Cierra Mañana",
        requiresOnSiteVisit: false, institutionRisk: { avgPaymentDays: "20 días", revocationRate: "Muy Bajo (0.5%)", transparencyScore: "98 / 100" },
        summary: ["Conectividad redundante para agencias SAT"],
        evaluationCriteria: [{ factor: "Ancho de Banda", weight: 50 }, { factor: "Precio", weight: 50 }],
        competitorsAnalysis: [{ name: "Tigo Business", probability: "45%", strength: "Cobertura" }],
        strategyIntelligence: { isRenewal: true, previousWinner: "Tigo Business", priceToBeat: 115000.00 },
        riskClauses: [], documents: [{ name: "Bases_SAT.pdf", size: "2.1 MB", type: "Bases" }]
      },
      { 
        id: "5544332", nog: "5544332", 
        title: "Servicios de Limpieza, Conserjería y Mantenimiento", 
        buyer: "MUNICIPALIDAD DE GUATEMALA", 
        procurementType: "COMPRA DIRECTA", extractedProduct: "Servicios Generales",
        category: "Servicios Generales", estimatedBudget: 65000.00, matchScore: 82, closingTime: "Cierra Hoy",
        requiresOnSiteVisit: false, institutionRisk: { avgPaymentDays: "30 días", revocationRate: "Bajo (1.0%)", transparencyScore: "92 / 100" },
        summary: ["Limpieza general de instalaciones municipales"],
        evaluationCriteria: [{ factor: "Precio", weight: 100 }], competitorsAnalysis: [{ name: "Limpieza Total S.A.", probability: "50%", strength: "Experiencia" }],
        strategyIntelligence: { isRenewal: true, previousWinner: "Limpieza Total S.A.", priceToBeat: 60000.00 },
        riskClauses: [], documents: [{ name: "Orden_Compra.pdf", size: "1.0 MB", type: "Orden" }]
      }
    ]);
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

  // 🚀 FILTRADO INTELIGENTE: Si seleccionas una categoría, muestra sus elementos. Si no hay exactos, muestra todos para evitar vacíos.
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
            Guatecompras sin límites.<br/><span className="text-blue-600">Bajas cuantías, visitas presenciales y recuperación de proyectos de la competencia.</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">La plataforma definitiva con IA para dominar todas las contrataciones públicas en Guatemala.</p>
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
                
                {selectedNog.requiresOnSiteVisit && (
                  <div className="mt-3 bg-purple-50 border border-purple-200 p-3 rounded-xl flex items-center gap-2 text-purple-800 text-xs font-bold">
                    <Eye size={16}/> ⚠️ Este evento exige Visita Presencial / Junta de Aclaración: {selectedNog.onSiteVisitDetails.date} ({selectedNog.onSiteVisitDetails.location})
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-bold uppercase">Presupuesto Estimado</span>
                <div className="text-2xl font-black text-emerald-600">Q {selectedNog.estimatedBudget?.toLocaleString('es-GT', {minimumFractionDigits: 2})}</div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-600"/> Matriz de Riesgo y Reputación de la Entidad Compradora
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded-xl border border-amber-100"><span className="text-xs text-slate-500 font-bold uppercase">Pago Promedio</span><div className="text-lg font-black text-slate-800 mt-0.5">{selectedNog.institutionRisk?.avgPaymentDays}</div></div>
              <div className="bg-white p-3 rounded-xl border border-amber-100"><span className="text-xs text-slate-500 font-bold uppercase">Revocatoria</span><div className="text-lg font-black text-emerald-600 mt-0.5">{selectedNog.institutionRisk?.revocationRate}</div></div>
              <div className="bg-white p-3 rounded-xl border border-amber-100"><span className="text-xs text-slate-500 font-bold uppercase">Transparencia</span><div className="text-lg font-black text-blue-600 mt-0.5">{selectedNog.institutionRisk?.transparencyScore}</div></div>
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
              <AlertCircle size={18}/> Alertas <span className="ml-auto bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full">327</span>
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
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setCurrentView('LOGIN')} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-slate-800 text-xs font-bold"><LogOut size={16}/> Cerrar Sesión</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h1 className="text-lg font-bold text-slate-800">Centro de Inteligencia Comercial & Bajas Cuantías</h1>
          <span className="text-sm font-bold text-emerald-600">Bolsón IA: 48,500 / 50,000 Tokens</span>
        </nav>

        <main className="p-6 md:p-8 space-y-8 overflow-y-auto">
          
          {activeTab === 'PRESUPUESTOS' ? (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2"><TrendingUp className="text-blue-600"/> Análisis Presupuestario por Institución</h3>
                <p className="text-sm text-slate-500">Proyección de gasto público.</p>
              </div>
            </div>
          ) : activeTab === 'RECUPERACION' ? (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2"><RefreshCw className="text-blue-600"/> Módulo de Recuperación y Adquisición de Proyectos de la Competencia</h3>
                <p className="text-sm text-slate-500 mb-6">Analiza qué contratos ganó la competencia en años anteriores para preparar estrategias anticipadas.</p>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">CONTRATO ANUAL #44821</span>
                      <h4 className="font-bold text-slate-800 mt-1">Soporte Tecnológico Integral - Minfin</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Adjudicado a: <span className="font-bold text-amber-600">CiberSec S.A.</span></p>
                    </div>
                    <button onClick={() => alert('Generando estrategia...')} className="bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl">Analizar para Recuperar</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Filtrar por Categoría (Incluye Bajas Cuantías y Todos los Sectores)</label>
                <div className="flex flex-wrap gap-2">
                  {['TODAS', 'Tecnología y Cloud', 'Salud e Insumos Médicos', 'Construcción y Obra Grís', 'Telecomunicaciones', 'Servicios Generales'].map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{cat}</button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Search className="text-slate-400" size={20}/>
                  <input type="text" placeholder="Buscar por NOG, palabra clave o entidad..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-96 px-4 py-2 border rounded-xl outline-none focus:border-blue-600 text-sm" />
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
                    <p className="text-slate-500">Mostrando registros coincidentes en el radar de Guatecompras.</p>
                  </div>
                ) : (
                  filteredNogs.map((op) => (
                    <div key={op.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-start hover:border-blue-300 transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">NOG: {op.nog}</span>
                          <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">{op.procurementType}</span>
                          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">{op.category}</span>
                          {op.requiresOnSiteVisit && (
                            <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded flex items-center gap-1"><Eye size={12}/> Visita Presencial Exigida</span>
                          )}
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
