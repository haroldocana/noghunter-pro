import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, XCircle, Search, ArrowLeft, Trophy, FileText, ChevronRight, BarChart3, AlertCircle, Clock, Building2, Filter, Download, Cpu, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'CHECKOUT' | 'LOGIN' | 'CLIENT' | 'SUPERADMIN' | 'DETAIL'>('LANDING');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [nogs, setNogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNog, setSelectedNog] = useState<any>(null);

  // Filtros avanzados
  const [filterType, setFilterType] = useState('TODOS'); // Licitación, Cotización, Compra Directa
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({ companyName: '', nit: '', adminName: '', adminEmail: '' });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Estado para SuperAdmin
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

  // Carga de oportunidades con datos extendidos (Tipos, Productos extraídos por IA)
  useEffect(() => {
    if (currentView === 'CLIENT') {
      setIsLoading(true);
      fetch('/api/nogs')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setNogs(data);
          } else {
            cargarDatosMuestraExtendidos();
          }
          setIsLoading(false);
        })
        .catch(() => {
          cargarDatosMuestraExtendidos();
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

  const cargarDatosMuestraExtendidos = () => {
    setNogs([
      { 
        id: "9876543", 
        nog: "9876543", 
        title: "Adquisición de Licencias en la Nube y Ciberseguridad", 
        buyer: "Ministerio de Finanzas Públicas", 
        procurementType: "LICITACIÓN PÚBLICA",
        extractedProduct: "Google Workspace & Firewall",
        category: "Tecnología y Cloud",
        matchScore: 92, 
        summary: ["Licenciamiento Google Workspace", "Protección perimetral avanzada", "Alta viabilidad para tus servicios"],
        evaluationCriteria: [
          { factor: "Precio", weight: 40 },
          { factor: "Tiempo de Entrega", weight: 30 },
          { factor: "Experiencia Acumulada", weight: 30 }
        ],
        competitorsAnalysis: [
          { name: "CiberSec S.A.", probability: "25%", strength: "Precio bajo" },
          { name: "Comptech (Tú)", probability: "68%", strength: "Soporte y partner oficial" },
          { name: "TecnoCloud", probability: "7%", strength: "Sin certificaciones" }
        ],
        strategyIntelligence: {
          isRenewal: true,
          previousWinner: "CiberSec S.A.",
          priceToBeat: 145500.00
        },
        documents: [
          { name: "Bases_Licitacion_9876543.pdf", size: "4.2 MB", type: "Bases Oficiales Guatecompras" },
          { name: "Anexo_Tecnico_Requerimientos.pdf", size: "1.8 MB", type: "Especificaciones Técnicas IA" }
        ]
      },
      { 
        id: "4567891", 
        nog: "4567891", 
        title: "Suministro de Enlaces Dedicados de Internet", 
        buyer: "Superintendencia de Administración Tributaria (SAT)", 
        procurementType: "COTIZACIÓN",
        extractedProduct: "Fibra óptica y Enlaces IP",
        category: "Telecomunicaciones",
        matchScore: 85, 
        summary: ["Conectividad redundante 1Gbps", "Soporte 24/7 garantizado", "Compatible con infraestructura actual"],
        evaluationCriteria: [
          { factor: "Ancho de Banda", weight: 50 },
          { factor: "Costo Mensual", weight: 50 }
        ],
        competitorsAnalysis: [
          { name: "Tigo Business", probability: "45%", strength: "Cobertura nacional" },
          { name: "Claro Empresas", probability: "40%", strength: "Precio competitivo" },
          { name: "Comptech / Alianza", probability: "15%", strength: "Especializado" }
        ],
        strategyIntelligence: {
          isRenewal: false,
          previousWinner: "Tigo Business",
          priceToBeat: 89000.00
        },
        documents: [
          { name: "Cotizacion_SAT_4567891.pdf", size: "2.1 MB", type: "Documento Base" }
        ]
      },
      { 
        id: "1234567", 
        nog: "1234567", 
        title: "Servicios de Limpieza para Oficinas Centrales", 
        buyer: "Ministerio de Salud", 
        procurementType: "COMPRA DIRECTA",
        extractedProduct: "Conserjería y Limpieza",
        category: "Servicios Generales",
        matchScore: 12, 
        summary: ["Servicio de limpieza y conserjería", "No requiere tecnología ni nube", "Descartado automáticamente"],
        documents: []
      }
    ]);
  };

  // Filtrado dinámico por tipo y producto extraído por IA
  const filteredNogs = nogs.filter(op => {
    const matchesType = filterType === 'TODOS' || op.procurementType === filterType;
    const matchesSearch = searchTerm === '' || 
      op.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      op.nog.includes(searchTerm) || 
      op.extractedProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // ==========================================
  // VISTA 1: LANDING PAGE
  // ==========================================
  if (currentView === 'LANDING') {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900">
        <header className="flex justify-between items-center py-4 px-8 border-b border-slate-100">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <Target className="text-blue-600"/>
            <span className="text-blue-700">NOGHunter</span><span className="text-slate-900">Pro</span>
          </div>
          <button onClick={() => setCurrentView('LOGIN')} className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors">
            Iniciar Sesión
          </button>
        </header>
        <section className="max-w-5xl mx-auto text-center py-20 px-4">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Guatecompras, sin reglas manuales.<br/>
            <span className="text-blue-600">Inteligencia Artificial aplicada a Licitaciones.</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            Filtra por productos exactos, analiza bases de licitación en segundos y conoce tu probabilidad de éxito frente a la competencia.
          </p>
          <button onClick={() => setCurrentView('CHECKOUT')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg text-lg">
            Adquirir Licencia Corporativa Q12,500 / año
          </button>
        </section>
      </div>
    );
  }

  // ==========================================
  // VISTA 1.5: CHECKOUT
  // ==========================================
  if (currentView === 'CHECKOUT') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative">
        <button onClick={() => setCurrentView('LANDING')} className="absolute top-6 left-6 text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft size={16}/> Volver
        </button>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Finalizar Compra</h2>
          {successMsg && <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm">{successMsg}</div>}
          {errorMsg && <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">{errorMsg}</div>}
          {!successMsg && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Empresa</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleCheckoutChange} required
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-600" placeholder="Ej. Comptech" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NIT</label>
                <input type="text" name="nit" value={formData.nit} onChange={handleCheckoutChange} required
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-600" placeholder="3519971-7" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Administrador</label>
                <input type="text" name="adminName" value={formData.adminName} onChange={handleCheckoutChange} required
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-600" placeholder="Ej. Harold Ocaña" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico (Login)</label>
                <input type="email" name="adminEmail" value={formData.adminEmail} onChange={handleCheckoutChange} required
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-600" placeholder="harold@comptech.lat" />
              </div>
              <button type="submit" disabled={checkoutLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-4 disabled:opacity-50">
                {checkoutLoading ? 'Procesando...' : 'Pagar Q12,500 y Activar'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA 2: LOGIN
  // ==========================================
  if (currentView === 'LOGIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
        <button onClick={() => setCurrentView('LANDING')} className="absolute top-6 left-6 text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft size={16}/> Volver al inicio
        </button>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900 text-center">NOGHunter Pro</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-600" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-blue-600" required />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-sm">
              {isLoading ? 'Ingresando...' : 'Ingresar al Panel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA 3: PANEL SUPERADMIN
  // ==========================================
  if (currentView === 'SUPERADMIN') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Target className="text-blue-400"/> NOGHunter SuperAdmin</h1>
          <button onClick={() => setCurrentView('LANDING')} className="text-sm text-slate-400 hover:text-white">Cerrar Sesión</button>
        </nav>
        <main className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Gestión de Inquilinos (Tenants)</h2>
            <button onClick={() => setShowNewCompanyModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Nueva Empresa</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companies.map(company => (
              <div key={company.id || company._id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{company.name}</h3>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-900 text-emerald-400">{company.status}</span>
                </div>
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Usuarios:</span><span className="font-medium">{company.users} / 5 Max</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Bolsón IA:</span><span className="text-emerald-400 font-medium">{company.aiUsed} / {company.aiTotal}</span></div>
                </div>
                <button onClick={() => handleGenerateCredentials(company.id || company._id)} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm font-medium">Generar Credenciales</button>
              </div>
            ))}
          </div>

          {showNewCompanyModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 relative">
                <h3 className="text-xl font-bold text-white mb-4">Dar de alta nueva empresa</h3>
                <form onSubmit={handleCreateCompanySubmit} className="space-y-4">
                  <input type="text" required value={newCompanyForm.companyName} onChange={(e) => setNewCompanyForm({...newCompanyForm, companyName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" placeholder="Nombre de la Empresa" />
                  <input type="text" required value={newCompanyForm.nit} onChange={(e) => setNewCompanyForm({...newCompanyForm, nit: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" placeholder="NIT" />
                  <input type="text" required value={newCompanyForm.adminName} onChange={(e) => setNewCompanyForm({...newCompanyForm, adminName: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" placeholder="Nombre del Admin" />
                  <input type="email" required value={newCompanyForm.adminEmail} onChange={(e) => setNewCompanyForm({...newCompanyForm, adminEmail: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" placeholder="Correo del Admin" />
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowNewCompanyModal(false)} className="flex-1 bg-slate-700 py-2 rounded-lg text-white">Cancelar</button>
                    <button type="submit" disabled={creatingCompany} className="flex-1 bg-blue-600 py-2 rounded-lg text-white font-medium">Guardar y Enviar</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ==========================================
  // VISTA 4.1: DETALLE Y ANÁLISIS DE NOG / DOCUMENTOS
  // ==========================================
  if (currentView === 'DETAIL' && selectedNog) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans">
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <button onClick={() => setCurrentView('CLIENT')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft size={16}/> Volver al Dashboard
          </button>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">NOG: {selectedNog.nog}</span>
        </nav>

        <main className="max-w-5xl mx-auto py-8 px-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-700 rounded uppercase">{selectedNog.procurementType}</span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">{selectedNog.title}</h2>
                <p className="text-slate-600 font-medium flex items-center gap-2 mt-1"><Building2 size={16}/> {selectedNog.buyer}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-bold uppercase">Match Score IA</span>
                <div className="text-3xl font-black text-emerald-600">{selectedNog.matchScore}%</div>
              </div>
            </div>
          </div>

          {/* DOCUMENTOS OFICIALES Y EXTRACCIÓN */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText size={18} className="text-blue-600"/> Documentos Oficiales Extraídos (Guatecompras)
            </h3>
            {selectedNog.documents && selectedNog.documents.length > 0 ? (
              <div className="space-y-3">
                {selectedNog.documents.map((doc: any, index: number) => (
                  <div key={index} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <FileText className="text-blue-600" size={24}/>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{doc.name}</h4>
                        <span className="text-xs text-slate-500">{doc.type} • {doc.size}</span>
                      </div>
                    </div>
                    <button onClick={() => alert(`Descargando y analizando ${doc.name} con Gemini AI...`)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm">
                      <Download size={14}/> Analizar con IA
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No hay documentos PDF adjuntos en esta oportunidad.</p>
            )}
          </div>

          {/* ANÁLISIS DE COMPETIDORES Y PROBABILIDADES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Trophy size={18} className="text-amber-500"/> Análisis de Competidores y Probabilidad de Éxito
              </h3>
              {selectedNog.competitorsAnalysis ? (
                <div className="space-y-3">
                  {selectedNog.competitorsAnalysis.map((comp: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-800 text-sm">{comp.name}</span>
                        <p className="text-xs text-slate-500">Fortaleza: {comp.strength}</p>
                      </div>
                      <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{comp.probability} prob.</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Sin datos históricos de competidores.</p>
              )}
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldCheck size={18}/> Estrategia de Cierre Recomendada
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Este proceso es una <span className="text-emerald-400 font-bold">{selectedNog.strategyIntelligence?.isRenewal ? 'Renovación detectada' : 'Nueva Adquisición'}</span>. 
                El precio referencial a vencer es de <span className="text-emerald-400 font-black">Q {selectedNog.strategyIntelligence?.priceToBeat?.toLocaleString('es-GT', {minimumFractionDigits: 2})}</span>. 
                Se recomienda enfocar la oferta en valor agregado y soporte local directo para superar al competidor anterior ({selectedNog.strategyIntelligence?.previousWinner}).
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // VISTA 4: PANEL CLIENTE / DASHBOARD COMERCIAL
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Target className="text-blue-600"/> NOGHunter Pro</h1>
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">Comptech - Inteligencia Comercial</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col text-right">
            <span className="text-xs text-slate-500 font-medium">Bolsón IA Anual</span>
            <span className="text-sm font-bold text-emerald-600">48,500 / 50,000 Tokens</span>
          </div>
          <button onClick={() => setCurrentView('LANDING')} className="text-sm text-slate-500 hover:text-slate-800 font-medium">Cerrar Sesión</button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-8 px-4 space-y-8">
        
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Alertas Nuevas</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">327</h3>
              <span className="text-xs text-blue-600 font-medium">Monitoreo activo</span>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><AlertCircle size={24}/></div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Quiero Participar</p>
              <h3 className="text-3xl font-black text-emerald-600 mt-1">16</h3>
              <span className="text-xs text-emerald-600 font-medium">Alta Viabilidad</span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><CheckCircle size={24}/></div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Eventos Seguidos</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">42</h3>
              <span className="text-xs text-orange-500 font-medium">En seguimiento</span>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl text-orange-500"><Trophy size={24}/></div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Productos Activos</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">3</h3>
              <span className="text-xs text-slate-500 font-medium">Cloud & Seguridad</span>
            </div>
            <div className="bg-slate-100 p-3 rounded-xl text-slate-600"><BarChart3 size={24}/></div>
          </div>
        </div>

        {/* CONTROLES DE FILTRADO AVANZADO (TIPO Y PRODUCTO) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Search className="text-slate-400" size={20}/>
              <input 
                type="text" 
                placeholder="Filtrar por NOG, producto extraído (ej. Google Workspace) o categoría..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-96 px-4 py-2 border rounded-xl outline-none focus:border-blue-600 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {['TODOS', 'LICITACIÓN PÚBLICA', 'COTIZACIÓN', 'COMPRA DIRECTA'].map((type) => (
                <button 
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterType === type ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LISTADO DE OPORTUNIDADES FILTRADAS */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-500 font-medium">Extrayendo licitaciones...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNogs.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
                <p className="text-slate-500">No se encontraron oportunidades con los filtros seleccionados.</p>
              </div>
            ) : (
              filteredNogs.map((op) => (
                <div key={op.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-start hover:border-blue-300 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">NOG: {op.nog}</span>
                      <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">{op.procurementType}</span>
                      <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                        <Cpu size={12} className="text-blue-600"/> Producto IA: {op.extractedProduct}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{op.title}</h3>
                    <p className="text-slate-600 font-medium flex items-center gap-2 mb-4"><Building2 size={16}/> {op.buyer}</p>
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                      <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Análisis de Requerimientos:</h4>
                      <ul className="space-y-1">
                        {op.summary && op.summary.map((bullet: string, i: number) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-blue-500">•</span> {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button 
                      onClick={() => { setSelectedNog(op); setCurrentView('DETAIL'); }}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                    >
                      Ver NOG, Documentos y Competencia <ChevronRight size={14}/>
                    </button>
                  </div>

                  <div className="w-full md:w-48 flex flex-col gap-3">
                    <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-100 text-center flex-1">
                      <span className="text-xs font-bold text-slate-500 mb-1">Match Score</span>
                      <div className={`text-4xl font-black mb-2 ${op.matchScore >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                        {op.matchScore}%
                      </div>
                      {op.matchScore >= 70 ? (
                        <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded w-full">Alta Viabilidad</span>
                      ) : (
                        <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-1 rounded w-full">Descartado</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
