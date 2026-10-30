import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, XCircle, Search, ArrowLeft } from 'lucide-react';

export default function App() {
  // Ahora tenemos un nuevo estado: CHECKOUT
  const [currentView, setCurrentView] = useState<'LANDING' | 'CHECKOUT' | 'LOGIN' | 'CLIENT' | 'SUPERADMIN'>('LANDING');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [nogs, setNogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para el formulario de Checkout
  const [formData, setFormData] = useState({ companyName: '', nit: '', adminName: '', adminEmail: '' });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [companies] = useState([
    { id: 1, name: 'Servinformación Guatemala', status: 'ACTIVE', aiTotal: 50000, aiUsed: 12400, users: 5 },
    { id: 2, name: 'Comptech Latam', status: 'ACTIVE', aiTotal: 50000, aiUsed: 48000, users: 3 }
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      if (email === 'admin@noghunter.com') {
        setCurrentView('SUPERADMIN');
      } else {
        setCurrentView('CLIENT');
      }
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
      const response = await fetch('https://noghunter-pro.onrender.com/api/payments/webhook', {
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

  useEffect(() => {
    if (currentView === 'CLIENT') {
      setIsLoading(true);
      fetch('https://noghunter-pro.onrender.com/api/nogs')
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

  const cargarDatosMuestra = () => {
    setNogs([
      { id: "9876543", nog: "9876543", title: "Adquisición de Licencias en la Nube y Ciberseguridad", buyer: "Ministerio de Finanzas Públicas", matchScore: 92, summary: ["Se requiere licenciamiento tipo Google Workspace", "Protección perimetral necesaria", "Alta viabilidad para tus servicios"] },
      { id: "1234567", nog: "1234567", title: "Servicios de Limpieza para Oficinas Centrales", buyer: "Ministerio de Salud", matchScore: 12, summary: ["Servicio de limpieza y conserjería", "No requiere tecnología ni nube", "Descartado automáticamente"] }
    ]);
  };

  // ==========================================
  // VISTA 1: LANDING PAGE COMERCIAL (PÚBLICA)
  // ==========================================
  if (currentView === 'LANDING') {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900">
        <header className="flex justify-between items-center py-4 px-8 border-b border-slate-100">
          <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <Target className="text-blue-600" />
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
            Olvida los laboriosos "laboratorios de reglas". NOGHunter Pro utiliza Gemini AI para leer bases de licitación y enviar los negocios pre-calificados directo a tu CRM (Zoho, HubSpot, Pipedrive, Odoo).
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
          <ArrowLeft size={16} /> Volver
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
          <ArrowLeft size={16} /> Volver al inicio
        </button>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex justify-center items-center gap-2">
              <Target className="text-blue-600" /> NOGHunter Pro
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
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-sm">
              Ingresar al Panel
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
            <Target className="text-blue-400" /> NOGHunter SuperAdmin
          </h1>
          <button onClick={() => setCurrentView('LANDING')} className="text-sm text-slate-400 hover:text-white">Cerrar Sesión</button>
        </nav>
        <main className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Gestión de Inquilinos (Tenants)</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              + Nueva Empresa
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companies.map(company => (
              <div key={company.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{company.name}</h3>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-900 text-emerald-400">{company.status}</span>
                </div>
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Usuarios:</span><span className="font-medium">{company.users} / 5 Max</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Bolsón IA:</span><span className="text-emerald-400 font-medium">{company.aiUsed.toLocaleString()} / {company.aiTotal.toLocaleString()}</span></div>
                </div>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm font-medium transition-colors">Generar Credenciales</button>
              </div>
            ))}
          </div>
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
            <Target className="text-blue-600" /> NOGHunter Pro
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
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                        NOG: {op.nog}
                      </span>
                      <h3 className="text-xl font-bold text-slate-800">{op.title}</h3>
                    </div>
                    <p className="text-slate-600 font-medium flex items-center gap-2 mb-4">
                      <Search size={18} /> {op.buyer}
                    </p>
                    
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <h4 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Análisis de Gemini AI:</h4>
                      <ul className="space-y-1">
                        {op.summary && op.summary.map((bullet: string, i: number) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span> {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="w-full md:w-48 bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-100 text-center min-h-[160px]">
                    <span className="text-sm font-bold text-slate-500 mb-1">Match Score</span>
                    <div className={`text-4xl font-black mb-2 ${op.matchScore >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                      {op.matchScore}%
                    </div>
                    {op.matchScore >= 70 ? (
                      <span className="flex items-center justify-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded w-full">
                        <CheckCircle size={14} /> Alta Viabilidad
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded w-full">
                        <XCircle size={14} /> Descartado
                      </span>
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
