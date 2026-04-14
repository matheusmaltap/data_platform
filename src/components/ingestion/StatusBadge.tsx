import { IngestionStatus, ExecutionStatus } from '../../types/ingestion';

const ingestionColors: Record<IngestionStatus, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  running: 'bg-blue-100 text-blue-700',
  error: 'bg-red-100 text-red-700',
};

const ingestionLabels: Record<IngestionStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  running: 'Executando',
  error: 'Erro',
};

const executionColors: Record<ExecutionStatus, string> = {
  success: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  running: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-600',
};

const executionLabels: Record<ExecutionStatus, string> = {
  success: 'Sucesso',
  failed: 'Falhou',
  running: 'Executando',
  cancelled: 'Cancelado',
};

export function IngestionStatusBadge({ status }: { status: IngestionStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ingestionColors[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'running' ? 'bg-blue-500 animate-pulse' : status === 'active' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-gray-400'}`} />
      {ingestionLabels[status]}
    </span>
  );
}

export function ExecutionStatusBadge({ status }: { status: ExecutionStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${executionColors[status]}`}>
      {executionLabels[status]}
    </span>
  );
}
