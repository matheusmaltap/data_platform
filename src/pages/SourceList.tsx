import { useNavigate } from 'react-router-dom';
import { Plus, Server, CheckCircle, XCircle, Database } from 'lucide-react';
import { mockSources } from '../data/mockSources';
import { IngestionTabs } from '../components/ingestion/IngestionTabs';
import { SOURCE_LABELS, SOURCE_CONNECTOR } from '../types/ingestion';
import { SourceType } from '../types/ingestion';

const SOURCE_ICONS: Record<SourceType, string> = {
  sql_server: '🗄️', sap: '🏭', oracle: '🔶', postgresql: '🐘', mysql: '🐬',
};

export function SourceList() {
  const navigate = useNavigate();

  const active = mockSources.filter((s) => s.status === 'active').length;
  const totalSchemas = mockSources.reduce((acc, s) => acc + s.schemas.length, 0);
  const totalTables = mockSources.reduce((acc, s) => acc + s.schemas.reduce((a, sc) => a + sc.tables.length, 0), 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ingestão de Dados</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie ingestões e fontes gerenciadas</p>
        </div>
        <button
          onClick={() => navigate('/ingestion/sources/new')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Nova Fonte
        </button>
      </div>

      <IngestionTabs />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Server size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{active}</p>
            <p className="text-xs text-gray-500">Fontes Ativas</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <Database size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalSchemas}</p>
            <p className="text-xs text-gray-500">Schemas Catalogados</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <Database size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalTables}</p>
            <p className="text-xs text-gray-500">Tabelas Disponíveis</p>
          </div>
        </div>
      </div>

      {/* Source cards */}
      <div className="grid grid-cols-2 gap-4">
        {mockSources.map((source) => (
          <div
            key={source.id}
            onClick={() => navigate(`/ingestion/sources/${source.id}`)}
            className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                  {SOURCE_ICONS[source.sourceType]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
                    {source.name}
                  </p>
                  <p className="text-xs text-gray-400">{SOURCE_LABELS[source.sourceType]}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {source.status === 'active'
                  ? <CheckCircle size={14} className="text-green-500" />
                  : <XCircle size={14} className="text-gray-400" />}
                <span className={`text-xs font-medium ${source.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                  {source.status === 'active' ? 'Ativa' : 'Inativa'}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{source.description}</p>

            {/* Connection info */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 font-mono text-xs text-gray-600 space-y-1">
              {source.host && (
                <p><span className="text-gray-400">host  </span>{source.host}{source.port ? `:${source.port}` : ''}</p>
              )}
              {source.database && (
                <p><span className="text-gray-400">db    </span>{source.database}</p>
              )}
              {source.sapSystem && (
                <p><span className="text-gray-400">system</span> {source.sapSystem} / client {source.sapClient}</p>
              )}
              <p><span className="text-gray-400">via   </span>{SOURCE_CONNECTOR[source.sourceType]}</p>
            </div>

            {/* Schema pills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {source.schemas.slice(0, 4).map((sc) => (
                <span key={sc.name} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                  {sc.name}
                  <span className="text-blue-400 ml-1">({sc.tables.length})</span>
                </span>
              ))}
              {source.schemas.length > 4 && (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  +{source.schemas.length - 4} schemas
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
              <span>{source.owner} · {source.team}</span>
              <span>desde {source.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
