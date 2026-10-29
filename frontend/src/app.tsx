import { useState, useEffect } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'CLIENT' | 'SUPERADMIN'>('CLIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [nogs, setNogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulación de empresas clientes para tu panel SuperAdmin
  const [companies] = useState([
    { id: 1, name: 'Servinformación Guatemala', status: 'ACTIVE', aiTotal: 50000, aiUsed: 12400, users: 5 },
    { id: 2, name: 'Comptech Latam', status: 'ACTIVE', aiTotal: 50000, aiUsed: 48000, users: 3 },
    { id: 3, name: 'Soluciones Inactivas S.A.', status: 'SUSPENDED', aiTotal: 50000, aiUsed: 50000, users: 5 }
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Si usas tu correo maestro, entras al panel de control
      if (email === 'admin@noghunter.com') {
        setUserRole('SUPERADMIN');
      } else {
        setUserRole('CLIENT');
      }
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userRole === 'CLIENT') {
      setIsLoading(true);
      fetch('/api/nogs')
        .then((res) => res.json())
        .then((data) => {
          setNogs(Array.isArray(data) ? data : []);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error al conectar con el servidor:', error);
          setIsLoading(false);
        });
    }
  }, [isLoggedIn, userRole]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">NOGHunter Pro</h1>
            <p className="text-slate-500 mt-2 text-sm">Inteligencia de mercado para Guatecompras</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="usuario@empresa.com.gt (Usa admin@noghunter.com)"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Ingresar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // VISTA 1: PANEL SUPERADMIN (Tu vista)
  if (userRole === 'SUPERADMIN') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">NOGHunter SuperAdmin</h1>
          <button onClick={() => setIsLoggedIn(false)} className="text-sm text-slate-400 hover:text-white">Cerrar Sesión</button>
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
                  <span className={`text-xs font-bold px-2 py-1 rounded ${company.status === 'ACTIVE' ? 'bg-emerald-900 text-emerald-400' : 'bg-red-900 text-red-400'}`}>
                    {company.status}
                  </span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Usuarios Asignados:</span>
                    <span className="font-medium">{company.users} / 5 Max</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Bolsón IA Consumido:</span>
                    <span className={`${company.aiUsed > 45000 ? 'text-amber-400' : 'text-emerald-400'} font-medium`}>
                      {company.aiUsed.toLocaleString()} / {company.aiTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm font-medium transition-colors">
                    Generar Credenciales
                  </button>
                  <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm font-medium transition-colors">
                    Recargar IA
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // VISTA 2: PANEL CLIENTE (El Anti-Dashboard)
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800">NOGHunter Pro</h1>
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full border border-blue-200">
            Suscripción Max
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col text-right">
            <span className="text-xs text-slate-500 font-medium">Bolsón IA Anual</span>
            <span className="text-sm font-bold text-emerald-600">48,500 / 50,000 Tokens</span>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="text-sm text-slate-500 hover:text-slate-800 font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-8 px-4">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Oportunidades Pre-Calificadas</h2>
            <p className="text-slate-500 mt-1">Filtrado en tiempo real desde la base de datos.</p>
          </div>
          <button className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Ajustar Perfil IA
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-500 font-medium">Extrayendo licitaciones de Guatecompras...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {nogs.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
                <p className="text-slate-500">No hay licitaciones nuevas en este momento. El radar de NOGHunter sigue monitoreando.</p>
              </div>
            ) : (
              nogs.map((nog) => (
                <div key={nog.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-full pr-4">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-bold text-blue-600">NOG {nog.id}</span>
                        <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">
                          Cierra: {nog.closingDate}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{nog.title}</h3>
                      <p className="text-sm text-slate-600 mb-4">{nog.buyer}</p>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-blue-700 font-semibold text-sm">Análisis de Gemini AI</span>
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                            {nog.matchScore}% Match
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {nog.aiSummary.map((line: string, index: number) => (
                            <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">•</span>
                              {line}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                      Participar
                    </button>
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
