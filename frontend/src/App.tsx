<div className="flex justify-between items-center mb-8">
    <h2 className="text-2xl font-bold">Gestión de Inquilinos (Tenants)</h2>
    <button 
      onClick={() => setShowNewCompanyModal(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      + Nueva Empresa
    </button>
  </div>

  {/* Modal / Formulario flotante de Alta Manual */}
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
