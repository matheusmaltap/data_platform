import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Play, ChevronRight, Database, Globe, Zap, RefreshCw } from 'lucide-react';
import { mockIngestions } from '../data/mockData';
import { IngestionStatusBadge } from '../components/ingestion/StatusBadge';
import { IngestionTabs } from '../components/ingestion/IngestionTabs';
import {
  SOURCE_LABELS, SOURCE_CONNECTOR, SourceType, IngestionStatus,
  IngestionMode, UNMANAGED_TYPE_LABELS, UnmanagedType,
} from '../types/ingestion';

const SOURCE_ICONS: Record<SourceType, string> = {
  sql_server: '🗄️', sap: '🏭', oracle: '🔶', postgresql: '🐘', mysql: '🐬',
};

const stats = [
  {
    label: 'Gerenciadas Ativas',
    value: String(mockIngestions.filter((i) => i.ingestionMode === 'managed' && i.status === 'active').length),
    icon: Database, color: 'text-blue-600', bg: 'bg-blue-50',
  },
  {
    label: 'Não Gerenciadas',
    value: String(mockIngestions.filter((i) => i.ingestionMode === 'unmanaged').length),
    icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50',
  },
  {
    label: 'Execuções Hoje',
    value: '18',
    icon: RefreshCw, color: 'text-green-600', bg: 'bg-green-50',
  },
  {
    label: 'Com Erro',
    value: String(mockIngestions.filter((i) => i.status === 'error').length),
    icon: Database, color: 'text-red-600', bg: 'bg-red-50',
  },
];

export function IngestionList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<IngestionStatus | 'all'>('all');
  const [modeFilter, setModeFilter] = useState<IngestionMode | 'all'>('all');

  const filtered = mockIngestions.filter((ing) => {
    const matchSearch =
      ing.name.toLowerCase().includes(search.toLowerCase()) ||
      ing.owner.toLowerCase().includes(search.toLowerCase()) ||
      ing.team.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || ing.status === statusFilter;
    const matchMode = modeFilter === 'all' || ing.ingestionMode === modeFilter;
    return matchSearch && matchStatus && matchMode;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ingestão de Dados</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie ingestões gerenciadas e não gerenciadas no Datalake</p>
        </div>
        <button
          onClick={() => navigate('/ingestion/new')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Nova Ingestão
        </button>
      </div>

      <IngestionTabs />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar nome, responsável ou time..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {(['all', 'managed', 'unmanaged'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setModeFilter(m)}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                  modeFilter === m ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'all' ? 'Todas' : m === 'managed' ? 'Gerenciada' : 'Não Gerenciada'}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as IngestionStatus | 'all')}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="running">Executando</option>
            <option value="error">Erro</option>
          </select>

          <span className="text-xs text-gray-400 ml-auto">{filtered.length} registro(s)</span>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Modo</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fonte / Tipo</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Destino</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((ing) => (
              <tr
                key={ing.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/ingestion/${ing.id}`)}
              >
                {/* Nome */}
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{ing.name}</p>
                  <p className="text-xs text-gray-400">{ing.owner}</p>
                </td>

                {/* Modo */}
                <td className="px-4 py-3">
                  {ing.ingestionMode === 'managed' ? (
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full w-fit font-medium">
                        <Database size={10} /> Gerenciada
                      </span>
                      {ing.loadType && (
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full w-fit">
                          {ing.loadType === 'delta' ? <Zap size={10} /> : <RefreshCw size={10} />}
                          {ing.loadType === 'delta' ? 'Delta' : 'Batch'}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full w-fit font-medium">
                      <Globe size={10} /> Não Gerenciada
                    </span>
                  )}
                </td>

                {/* Fonte / Tipo */}
                <td className="px-4 py-3">
                  {ing.ingestionMode === 'managed' && ing.sourceType ? (
                    <div>
                      <p className="text-sm flex items-center gap-1.5">
                        <span>{SOURCE_ICONS[ing.sourceType]}</span>
                        {SOURCE_LABELS[ing.sourceType]}
                      </p>
                      <p className="text-xs text-gray-400">{SOURCE_CONNECTOR[ing.sourceType]}</p>
                    </div>
                  ) : ing.unmanagedType ? (
                    <span className="text-sm text-gray-600">
                      {UNMANAGED_TYPE_LABELS[ing.unmanagedType as UnmanagedType]}
                    </span>
                  ) : '—'}
                </td>

                {/* Destino */}
                <td className="px-4 py-3">
                  {ing.ingestionMode === 'managed' ? (
                    <span className="text-xs font-mono text-gray-600">{ing.destination}</span>
                  ) : (
                    <span className="text-xs font-mono text-gray-600">
                      {ing.databricksCatalog}.{ing.databricksSchema}
                    </span>
                  )}
                </td>

                {/* Time */}
                <td className="px-4 py-3 text-sm text-gray-600">{ing.team}</td>

                {/* Status */}
                <td className="px-4 py-3">
                  <IngestionStatusBadge status={ing.status} />
                </td>

                {/* Ações */}
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    {ing.ingestionMode === 'managed' && (
                      <button title="Executar agora" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Play size={14} />
                      </button>
                    )}
                    <button
                      title="Ver detalhes"
                      onClick={() => navigate(`/ingestion/${ing.id}`)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Database size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhuma ingestão encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
