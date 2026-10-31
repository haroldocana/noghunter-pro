import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, XCircle, Search, ArrowLeft, Trophy, FileText, ChevronRight } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'CHECKOUT' | 'LOGIN' | 'CLIENT' | 'SUPERADMIN'>('LANDING');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [nogs, setNogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({ companyName: '', nit: '', adminName: '', adminEmail: '' });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Estado para SuperAdmin y su modal de alta manual
  const [companies, setCompanies] = useState<any[]>([]);
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
  const [newCompanyForm, setNewCompanyForm] = useState({ companyName: '', nit: '', adminName: '', adminEmail: '' });
  const [creatingCompany, setCreatingCompany] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // 🚀 LLAVE MAESTRA FRONTAL: Entra al instante sin tocar el servidor
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
        if (data.user.role === 'MASTER') {
          setCurrentView('SUPERADMIN');
        } else {
          setCurrentView('CLIENT');
        }
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
        setSuccessMsg('¡Pago exitoso! El entorno de tu empresa ha sido creado. Revisa tu correo electrónico para obtener tus credenciales de acceso.');
        setFormData({ companyName: '', nit: '', adminName: '', adminEmail: '' });
      } else {
        setErrorMsg(data.error || 'Ocurrió un error al procesar la compra.');
      }
    } catch (error) {
      setErrorMsg('Error de conexión con el servidor. Intenta de nuevo.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Carga de oportunidades para los clientes
  useEffect(() => {
    if (currentView === 'CLIENT') {
      setIsLoading(true);
      fetch('/api/nogs')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setNogs(data);
          } else {
            cargarDatosMuestra();
          }
          setIsLoading(false);
        })
        .catch(() => {
          cargarDatosMuestra();
          setIsLoading(false);
        });
    }
  }, [currentView]);

  // Carga dinámica de empresas (SUPERADMIN)
  useEffect(() => {
    if (currentView === 'SUPERADMIN') {
      fetch('/api/admin/tenants')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCompanies(data);
          }
        })
        .catch((err) => console.error('Error cargando las empresas:', err));
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
        alert('¡Empresa creada con éxito! Se enviaron las credenciales por correo.');
        setShowNewCompanyModal(false);
        setNewCompanyForm({ companyName: '', nit: '', adminName: '', adminEmail: '' });
        window.location.reload(); 
      } else {
        alert(data.error || 'Error al crear la empresa');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    } finally {
      setCreatingCompany(false);
    }
  };

  // 🚀 Función para generar/actualizar credenciales desde el SuperAdmin
  const handleGenerateCredentials = async (companyId: string) => {
    const newPass = prompt("Ingresa la nueva contraseña temporal para el administrador de esta empresa:");
    if (!newPass) return;

    try {
      const response = await fetch(`/api/admin/tenants/${companyId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPass })
      });
      const data = await response.json();
      if (response.ok) {
        alert('¡Contraseña actualizada exitosamente! Ya puedes iniciar sesión con ella.');
      } else {
        alert(data.error || 'Error al actualizar credenciales');
      }
    } catch (err) {
      alert('Error de conexión con el servidor');
    }
  };

  const cargarDatosMuestra = () => {
    setNogs([
      { 
        id: "9876543", 
        nog: "9876543", 
        title: "Adquisición de Licencias en la Nube y Ciberseguridad", 
        buyer: "Ministerio de Finanzas Públicas", 
        matchScore: 92, 
        summary: ["Se requiere licenciamiento tipo Google Workspace", "Protección perimetral necesaria", "Alta viabilidad para tus servicios"],
        evaluationCriteria: [
          { factor: "Precio", weight: 40 },
          { factor: "Tiempo de Entrega", weight: 30 },
          { factor: "Experiencia Acumulada", weight: 30 }
        ],
        strategyIntelligence: {
          isRenewal: true,
          previousWinner: "CiberSec S.A.",
          priceToBeat: 145500.00
        }
      },
      { 
        id: "1234567", 
        nog: "1234567", 
        title: "Servicios de Limpieza para Oficinas Centrales", 
        buyer: "Ministerio de Salud", 
        matchScore: 12, 
        summary: ["Servicio de limpieza y conserjería", "No requiere tecnología ni nube", "Descartado automáticamente"] 
      }
    ]);
  };

  // ==========================================
  // VISTA 1: LANDING PAGE COMERCIAL
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
            <span className="text-blue-600">Impulsado por Inteligencia Artificial.</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            Olvida los laboriosos "laboratorios de reglas". NOGHunter Pro utiliza Gemini AI para leer bases de licitación y enviar los negocios pre-calificados directo a tu CRM.
          </p>
        </section>

        <section className="max-w-4xl mx-auto py-12 px-4 mb-20">
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between border border-slate-200 shadow-xl">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-2">Licencia Corporativa Anual</h2>
              <ul className="space-y-3 mt-6 text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle className="text-emerald-500" size={20}/> <span className="font-semibold">5 Usuarios</span> incluidos por empresa</li>
                <li className="flex items-center gap-2"><CheckCircle className="text-emerald-500" size={20}/> Bolsón anual de <span className="font-semibold">50,000 Tokens de IA</span></li>
                <li className="flex items-center gap-2"><CheckCircle className="text-emerald-500" size={20}/> Integración API directa con tu CRM</li>
                <li className="flex items-center gap-2"><CheckCircle className="text-emerald-500" size={20}/> Panel Anti-Fricción y resúmenes ejecutivos</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 text-center min-w-[300px]">
              <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-2">Inversión</div>
              <div className="text-4xl font-black text-slate-900 mb-1">Q12,500</div>
              <div className="text-sm text-slate-400 mb-6">Facturación anual</div>
              
              <button 
                onClick={() => setCurrentView('CHECKOUT')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                Suscribirse y Pagar
              </button>
              <div className="mt-3 text-xs text-slate-400 flex items-center justify-center gap-1">
                🔒 Pago seguro con tarjetas locales
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ==========================================
  // VISTA 1.5: CHECKOUT (COMPRA)
  // ==========================================
  if (currentView === 'CHECKOUT') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative">
        <button onClick={() => setCurrentView('LANDING')} className="absolute top-6 left-6 text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft size={16}/> Volver
        </button>
        
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Finalizar Compra</h2>
            <p className="text-slate-500 text-sm mt-1">Configura tu espacio corporativo de NOGHunter Pro.</p>
          </div>

          {successMsg && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-sm">{successMsg}</div>}
          {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">{errorMsg}</div>}

          {!successMsg && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Empresa</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleCheckoutChange} required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Ej. Servinformación" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NIT</label>
                <input type="text" name="nit" value={formData.nit} onChange={handleCheckoutChange} required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="123456-7" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Administrador</label>
                <input type="text" name="adminName" value={formData.adminName} onChange={handleCheckoutChange} required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Ej. Juan Pérez" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico (Login)</label>
                <input type="email" name="adminEmail" value={formData.adminEmail} onChange={handleCheckoutChange} required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="juan@empresa.com" />
              </div>

              <button type="submit" disabled={checkoutLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4 disabled:opacity-50">
                {checkoutLoading ? 'Procesando Pago y Creando Entorno...' : 'Pagar Q12,500 y Activar'}
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
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex justify-center items-center gap-2">
              <Target className="text-blue-600"/> NOGHunter Pro
            </h1>
            <p className="text-slate-500 mt-2 text-sm">Acceso a plataforma</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="usuario@empresa.com.gt" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-sm disabled:opacity-50">
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
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="text-blue-400"/> NOGHunter SuperAdmin
          </h1>
          <button onClick={() => setCurrentView('LANDING')} className="text-sm text-slate-400 hover:text-white">Cerrar Sesión</button>
        </nav>
        <main className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Gestión de Inquilinos (Tenants)</h2>
            <button 
              onClick={() => setShowNewCompanyModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Nueva Empresa
            </button>
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
                  <div className="flex justify-between"><span className="text-slate-400">Bolsón IA:</span><span className="text-emerald-400 font-medium">{company.aiUsed?.toLocaleString()} / {company.aiTotal?.toLocaleString()}</span></div>
                </div>
                <button 
                  onClick={() => handleGenerateCredentials(company.id || company._id)}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm font-medium transition-colors"
                >
                  Generar Credenciales
                </button>
              </div>
            ))}
          </div>

          {/* Modal / Formulario de Alta Manual */}
          {showNewCompanyModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 relative">
                <h3 className="text-xl font-bold text-white mb-4">Dar de alta nueva empresa</h3>
                
                <form onSubmit={handleCreateCompanySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Nombre de la Empresa</label>
                    <input type="text" required value={newCompanyForm.companyName} 
                      onChange={(e) => setNewCompanyForm({...newCompanyForm, companyName: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="Ej. Soluciones Seguras" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">NIT</label>
                    <input type="text" required value={newCompanyForm.nit} 
                      onChange={(e) => setNewCompanyForm({...newCompanyForm, nit: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="Ej. 883921-9" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Nombre del Admin</label>
                    <input type="text" required value={newCompanyForm.adminName} 
                      onChange={(e) => setNewCompanyForm({...newCompanyForm, adminName: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="Ej. Carlos Mendoza" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Correo del Admin (Login)</label>
                    <input type="email" required value={newCompanyForm.adminEmail} 
                      onChange={(e) => setNewCompanyForm({...newCompanyForm, adminEmail: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500" placeholder="carlos@empresa.com" />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowNewCompanyModal(false)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded-lg transition-colors">
                      Cancelar
                    </button>
                    <button type="submit" disabled={creatingCompany}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50">
                      {creatingCompany ? 'Creando...' : 'Guardar y Enviar'}
                    </button>
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
  // VISTA 4: PANEL CLIENTE (ANTI-DASHBOARD)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Target className="text-blue-600"/> NOGHunter Pro
          </h1>
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full border border-blue-200">Suscripción Max</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col text-right">
            <span className="text-xs text-slate-500 font-medium">Bolsón IA Anual</span>
            <span className="text-sm font-bold text-emerald-600">48,500 / 50,000 Tokens</span>
          </div>
          <button onClick={() => setCurrentView('LANDING')} className="text-sm text-slate-500 hover:text-slate-800 font-medium">Cerrar Sesión</button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-8 px-4">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Oportunidades Pre-Calificadas</h2>
            <p className="text-slate-500 mt-1">Filtrado en tiempo real desde la base de datos.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-500 font-medium">Extrayendo licitaciones...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {nogs.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm">
                <p className="text-slate-500">No hay licitaciones nuevas en este momento. El radar sigue monitoreando.</p>
              </div>
            ) : (
              nogs.map((op) => (
                <div key={op.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6 items-start">
                  
                  {/* Columna Izquierda: Información y Resumen */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                        NOG: {op.nog}
                      </span>
                      <h3 className="text-xl font-bold text-slate-800">{op.title}</h3>
                    </div>
                    <p className="text-slate-600 font-medium flex items-center gap-2 mb-4">
                      <Search size={18}/> {op.buyer}
                    </p>
                    
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4">
                      <h4 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Análisis de Gemini AI:</h4>
                      <ul className="space-y-1">
                        {op.summary && op.summary.map((bullet: string, i: number) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span> {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* MÓDULO TÁCTICO DE CIERRE */}
                    {op.evaluationCriteria && op.matchScore >= 70 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Matriz de Calificación */}
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                          <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                            <FileText className="text-blue-400" size={16}/> Criterios de Evaluación
                          </h4>
                          <div className="space-y-2">
                            {op.evaluationCriteria.map((crit: any, index: number) => (
                              <div key={index} className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-1 last:border-0 last:pb-0">
                                <span className="text-slate-400">{crit.factor}</span>
                                <span className="font-bold text-white bg-slate-700 px-2 py-0.5 rounded">{crit.weight}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Inteligencia Histórica */}
                        <div className="bg-blue-950/40 p-4 rounded-xl border border-blue-900/50 relative overflow-hidden">
                          {op.strategyIntelligence?.isRenewal && (
                             <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                RENOVACIÓN DETECTADA
                             </div>
                          )}
                          <h4 className="text-sm font-bold text-blue-300 mb-3 flex items-center gap-2">
                            <Trophy size={16}/> Estrategia de Cierre
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-0.5">Precio Máx a Vencer</div>
                              <div className="text-xl font-black text-emerald-400">
                                Q {op.strategyIntelligence?.priceToBeat?.toLocaleString('es-GT', {minimumFractionDigits: 2})}
                              </div>
                            </div>
                            <div>
                              <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-0.5">Competidor a Vencer</div>
                              <div className="text-sm font-bold text-slate-200 truncate">
                                {op.strategyIntelligence?.previousWinner || 'Sin registro previo'}
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Columna Derecha: Match Score */}
                  <div className="w-full md:w-48 flex flex-col gap-3">
                    <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-100 text-center flex-1">
                      <span className="text-sm font-bold text-slate-500 mb-1">Match Score</span>
                      <div className={`text-4xl font-black mb-2 ${op.matchScore >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                        {op.matchScore}%
                      </div>
                      {op.matchScore >= 70 ? (
                        <span className="flex items-center justify-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded w-full">
                          <CheckCircle size={14}/> Alta Viabilidad
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded w-full">
                          <XCircle size={14}/> Descartado
                        </span>
                      )}
                    </div>
                    {op.matchScore >= 70 && (
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                        Enviar a CRM <ChevronRight size={16}/>
                      </button>
                    )}
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
