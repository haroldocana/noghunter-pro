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

  // Estado dinámico para el SuperAdmin y su modal de alta manual
  const [companies, setCompanies] = useState<any[]>([]);
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
  const [newCompanyForm, setNewCompanyForm] = useState({ companyName: '', nit: '', adminName: '', adminEmail: '' });
  const [creatingCompany, setCreatingCompany] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://noghunter-pro.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
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

  // Carga de oportunidades para los clientes
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

  // Carga dinámica de empresas (SUPERADMIN)
  useEffect(() => {
    if (currentView === 'SUPERADMIN') {
      fetch('https://noghunter-pro.onrender.com/api/admin/tenants')
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
      const response = await fetch('https://noghunter-pro.onrender.com/api/admin/tenants/create', {
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
  // VISTA 1: LANDING PAGE COMERCIAL (PÚBLICA)
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

        <section className="max-w-5xl mx-auto text-center py
