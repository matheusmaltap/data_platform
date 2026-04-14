import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft, Play, Pencil, Clock, CheckCircle, XCircle,
  RefreshCw, Database, Globe, Zap, ExternalLink,
} from 'lucide-react';
import { mockIngestions, mockExecutions } from '../data/mockData';
import { IngestionStatusBadge, ExecutionStatusBadge } from '../components/ingestion/StatusBadge';
import {
  SOURCE_LABELS, SOURCE_CONNECTOR, UNMANAGED_TYPE_LABELS, UnmanagedType,
} from '../types/ingestion';

export function IngestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ing = mockIngestions.find((i) => i.id === id);
  const executions = mockExecutions.filter((e) => e.ingestionId === id);

  if (!ing) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>Ingestão não encontrada.</p>
        <button onClick={() => navigate('/ingestion')} className="mt-4 text-blue-600 text-sm hover:underline">
          Voltar para lista
        </button>
      </div>
    );
  }

  const isManaged = ing.ingestionMode === 'managed';

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate('/ingestion')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft size={16} /> Voltar para lista
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{ing.name}</h1>
            <IngestionStatusBadge status={ing.status} />
            {isManaged ? (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                <Database size={10} /> Gerenciada
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                <Globe size={10} /> Não Gerenciada
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{ing.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
            <Pencil size={14} /> Editar
          </button>
          {isManaged && (
            <button className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Play size={14} /> Executar Agora
            </button>
          )}
        </div>
      </div>

      {/* ── MANAGED ── */}
      {isManaged && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Fonte</p>
              <p className="text-sm font-semibold text-gray-800">{ing.sourceType ? SOURCE_LABELS[ing.sourceType] : '—'}</p>
              <p className="text-xs text-gray-400 mt-1">{ing.sourceType ? SOURCE_CONNECTOR[ing.sourceType] : ''}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tipo de Carga</p>
              <div className="flex items-center gap-1.5 mt-1">
                {ing.loadType === 'delta'
                  ? <Zap size={14} className="text-blue-500" />
                  : <RefreshCw size={14} className="text-gray-500" />}
                <p className="text-sm font-semibold text-gray-800">
                  {ing.loadType === 'delta' ? 'Delta (Incremental)' : 'Batch (Full Load)'}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Chave da Tabela</p>
              <p className="text-sm font-mono font-medium text-gray-800">{ing.tableKey || '—'}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Agendamento</p>
              <p className="text-sm font-semibold text-gray-800">{ing.schedule || '—'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <h2 className="text-base font-semibold text-gray-800">Histórico de Execuções</h2>

              {executions.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
                  <RefreshCw size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhuma execução registrada</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Início</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duração</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registros</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trigger</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {executions.map((exec) => (
                        <tr key={exec.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-xs font-mono text-gray-600">
                            {new Date(exec.startedAt).toLocaleString('pt-BR')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{exec.duration ?? '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {exec.recordsIngested != null ? exec.recordsIngested.toLocaleString('pt-BR') : '—'}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{exec.triggeredBy}</td>
                          <td className="px-4 py-3"><ExecutionStatusBadge status={exec.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {executions[0] && (
                <div>
                  <h2 className="text-base font-semibold text-gray-800 mb-3">Log da Última Execução</h2>
                  <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 whitespace-pre leading-relaxed overflow-auto max-h-48">
                    {executions[0].logs}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-800">Última Execução</h2>
              <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                {ing.lastExecutionStatus ? (
                  <>
                    <div className="flex items-center gap-2">
                      {ing.lastExecutionStatus === 'success' ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : ing.lastExecutionStatus === 'failed' ? (
                        <XCircle size={16} className="text-red-500" />
                      ) : (
                        <RefreshCw size={16} className="text-blue-500 animate-spin" />
                      )}
                      <ExecutionStatusBadge status={ing.lastExecutionStatus} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock size={12} />
                      {ing.lastExecution ? new Date(ing.lastExecution).toLocaleString('pt-BR') : '—'}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Nunca executado</p>
                )}
              </div>

              <h2 className="text-base font-semibold text-gray-800">Informações</h2>
              <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">ID</span><span className="font-mono text-gray-700">{ing.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Criado em</span><span className="text-gray-700">{ing.createdAt}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Owner</span><span className="text-gray-700">{ing.owner}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="text-gray-700">{ing.team}</span></div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Destino</span>
                  <span className="font-mono text-xs text-gray-700">{ing.destination}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── UNMANAGED ── */}
      {!isManaged && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-5">
            {/* Type + URL */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-800">Configuração</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Tipo</p>
                  <p className="font-medium text-gray-800">
                    {ing.unmanagedType ? UNMANAGED_TYPE_LABELS[ing.unmanagedType as UnmanagedType] : '—'}
                  </p>
                </div>
                {ing.sourceUrl && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">URL da Fonte</p>
                    <a
                      href="#"
                      className="text-blue-600 flex items-center gap-1 text-xs font-mono hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      {ing.sourceUrl.length > 40 ? ing.sourceUrl.slice(0, 40) + '…' : ing.sourceUrl}
                      <ExternalLink size={11} />
                    </a>
                  </div>
                )}
              </div>
              {ing.notes && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Observações / Documentação</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 leading-relaxed">
                    {ing.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Databricks provisioning */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-800">Ambiente Databricks Provisionado</h2>
              <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-gray-200 space-y-2">
                <p>
                  <span className="text-gray-500">catalogo </span>
                  <span className="text-blue-400">{ing.databricksCatalog}</span>
                </p>
                <p>
                  <span className="text-gray-500">schema  </span>
                  <span className="text-green-400">{ing.databricksSchema}</span>
                </p>
                <p className="text-gray-500 text-xs pt-1">
                  └─ volume: <span className="text-gray-300">{ing.databricksSchema}/files/</span>
                </p>
              </div>
              <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <ExternalLink size={14} /> Abrir no Databricks
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Informações</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">ID</span><span className="font-mono text-gray-700">{ing.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Criado em</span><span className="text-gray-700">{ing.createdAt}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Owner</span><span className="text-gray-700">{ing.owner}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="text-gray-700">{ing.team}</span></div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
              <p className="font-medium mb-1">Responsabilidade do Time</p>
              <p className="text-xs leading-relaxed">
                Esta ingestão é de responsabilidade do time <strong>{ing.team}</strong>.
                A plataforma mantém o registro e o ambiente, mas a lógica de coleta é gerenciada pelo próprio time.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
