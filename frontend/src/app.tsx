import { useState } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Simulación de los NOGs filtrados por la IA que vendrán de tu base de datos
  const mockNogs = [
    {
      id: '10293847',
      buyer: 'Ministerio de Salud Pública',
      title: 'Adquisición de Licenciamiento y Servicios de Ciberseguridad',
      matchScore: 98,
      closingDate: 'Mañana, 10:00 AM',
      aiSummary: [
        'Requieren infraestructura cloud compatible con Google Workspace.',
        'Presupuesto histórico estimado: Q250,000.',
        'Baja competencia detectada en renglones similares.'
      ]
    },
    {
      id: '10293855',
      buyer: 'Municipalidad de Guatemala',
      title: 'Renovación de Equipos de Computación y Enlaces',
      matchScore: 92,
      closingDate: 'Viernes, 14:00 PM',
      aiSummary: [
        'Buscan 50 estaciones de trabajo y firewall perimetral.',
        'Exigen certificación de fabricante (Partner autorizado).',
        'Alta probabilidad de compra directa.'
      ]
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

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
                placeholder="usuario@empresa.com.gt"
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
            <p className="text-slate-500 mt-1">Gemini analizó 450 NOGs hoy. Estas 2 coinciden con tu perfil comercial.</p>
          </div>
          <button className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Ajustar Perfil IA
          </button>
        </div>

        <div className="space-y-6">
          {mockNogs.map((nog) => (
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
                      {nog.aiSummary.map((line, index) => (
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
          ))}
        </div>
      </main>
    </div>
  );
}
