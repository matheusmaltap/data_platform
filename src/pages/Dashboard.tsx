import { useNavigate } from 'react-router-dom';
import { Database, ArrowRight } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Bem-vindo à Data Platform</p>

      <div className="grid grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/ingestion')}
          className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
            <Database size={20} className="text-blue-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">Ingestão de Dados</h2>
          <p className="text-sm text-gray-500 mb-4">Gerencie ingestões parametrizadas no Datalake via conectores gerenciados</p>
          <span className="text-sm text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
            Acessar módulo <ArrowRight size={14} />
          </span>
        </div>

        {['Pipelines', 'Monitoramento'].map((module) => (
          <div key={module} className="bg-white rounded-xl border border-gray-200 p-6 opacity-50 cursor-not-allowed">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Database size={20} className="text-gray-400" />
            </div>
            <h2 className="text-base font-semibold text-gray-700 mb-1">{module}</h2>
            <p className="text-sm text-gray-400 mb-4">Em desenvolvimento</p>
            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded">Em breve</span>
          </div>
        ))}
      </div>
    </div>
  );
}
