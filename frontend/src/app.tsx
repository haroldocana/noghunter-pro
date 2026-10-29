import { useState, useEffect } from 'react';

export default function App() {
  // Manejador de vistas: LANDING (Pública), LOGIN, CLIENT (Dashboard), SUPERADMIN
  const [currentView, setCurrentView] = useState<'LANDING' | 'LOGIN' | 'CLIENT' | 'SUPERADMIN'>('LANDING');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [nogs, setNogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulación para tu panel SuperAdmin
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

  useEffect(() => {
    if (currentView === 'CLIENT') {
      setIsLoading(true);
      fetch('/api/nogs')
        .then((res) => res.json())
        .then((data) => {
          setNogs(Array.isArray(data) ? data : []);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [currentView]);

  // ==========================================
  // VISTA 1: LANDING PAGE COMERCIAL (PÚBLICA)
  // ==========================================
  if (currentView === 'LANDING') {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900">
        {/* Navbar Público */}
        <header className="flex justify-between items-center py-4 px-8 border-b border-slate-100">
          <div className="text-2xl font-black tracking-tighter text-blue-700">NOGHunter<span className="text-slate-900">Pro</span></div>
          <button 
            onClick={() => setCurrentView('LOGIN')}
            className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </header>

        {/* Hero Section */}
        <section className="max-w-5xl mx-auto text-center py-20 px-4">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            Guatecompras, sin reglas manuales.<br/>
            <span className="text-blue-600">Impulsado por Inteligencia Artificial.</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            Olvida los laboriosos "laboratorios de reglas". NOGHunter Pro utiliza Gemini AI para leer bases de licitación y enviar los negocios pre-calificados directo a tu CRM (Zoho, HubSpot, Pipedrive).
          </p>
        </section>

        {/* Pricing Section */}
        <section className="max-w-4xl mx-auto py-12 px-4 mb-20">
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between border border-slate-200 shadow-xl">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-2">Licencia Corporativa Anual</h2>
              <ul className="space-y-3 mt-6 text-slate-700">
                <li className="flex items-center gap-2">✅ <span className="font-semibold">5 Usuarios</span> incluidos por empresa</li>
                <li className="flex items-center gap-2">✅ Bolsón anual de <span className="font-semibold">50,000 Tokens de IA</span></li>
                <li className="flex items-center gap-2">✅ Integración API directa con tu CRM</li>
                <li className="flex items-center gap-2">✅ Panel Anti-Fricción y resúmenes ejecutivos</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 text-center min-w-[300px]">
              <div className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-2">Inversión</div>
              <div className="text-4xl font-black text-slate-900 mb-1">Q12,500</div>
              <div className="text-sm text-slate-400 mb-6">Facturación anual</div>
              
              {/* Botón de Pago (Integración futura con Pagalo/QPayPro) */}
              <button 
                onClick={() => alert('Aquí se abrirá el popup de Pagalo o QPayPro para procesar el cobro en Bi o G&T')}
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
  // VISTA 2: LOGIN
  // ==========================================
  if (currentView === 'LOGIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
        <button onClick={() => setCurrentView('LANDING')} className="absolute top-6 left-6 text-sm text-slate-500 hover:text-slate-800">
          ← Volver al inicio
        </button>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">NOGHunter Pro</h1>
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
          <h1 className="text-xl font-bold text-white">NOGHunter SuperAdmin</h1>
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
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800">NOGHunter Pro</h1>
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
              <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
                <p className="text-slate-500">No hay licitaciones nuevas en este momento. El radar sigue monitoreando.</p>
              </div>
            ) : (
              nogs.map((nog) => (
                <div key={nog.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">{nog.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{nog.buyer}</p>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
