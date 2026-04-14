import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, CheckCircle, XCircle, User, Users, Shield,
  ChevronDown, ChevronUp, MessageSquare,
} from 'lucide-react';
import { mockAccessRequests } from '../data/mockAccessRequests';
import { AccessRequest, RequestStatus, REQUEST_STATUS_LABELS, REQUEST_STATUS_COLORS } from '../types/accessRequest';
import { PERMISSION_LABELS } from '../types/product';

type ViewMode = 'all' | 'pending_owner' | 'pending_data_team' | 'approved' | 'rejected';

const STATUS_ICONS: Record<RequestStatus, React.ElementType> = {
  pending_owner:     Clock,
  pending_data_team: Shield,
  approved:          CheckCircle,
  rejected:          XCircle,
};

const tabs: { key: ViewMode; label: string }[] = [
  { key: 'all',              label: 'Todas' },
  { key: 'pending_owner',    label: 'Aguardando Owner' },
  { key: 'pending_data_team', label: 'Aguardando Dados' },
  { key: 'approved',         label: 'Aprovadas' },
  { key: 'rejected',         label: 'Rejeitadas' },
];

export function AccessRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<AccessRequest[]>(mockAccessRequests);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = viewMode === 'all' ? requests : requests.filter((r) => r.status === viewMode);

  const counts: Record<ViewMode, number> = {
    all:              requests.length,
    pending_owner:    requests.filter((r) => r.status === 'pending_owner').length,
    pending_data_team: requests.filter((r) => r.status === 'pending_data_team').length,
    approved:         requests.filter((r) => r.status === 'approved').length,
    rejected:         requests.filter((r) => r.status === 'rejected').length,
  };

  const handleOwnerApprove = (id: string) => {
    setRequests((prev) => prev.map((r) =>
      r.id === id ? {
        ...r,
        status: 'pending_data_team' as RequestStatus,
        ownerApprover: 'Data Engineer',
        ownerDecision: 'approved' as const,
        ownerDecisionAt: new Date().toISOString().slice(0, 10),
      } : r
    ));
  };

  const handleOwnerReject = (id: string, notes: string) => {
    setRequests((prev) => prev.map((r) =>
      r.id === id ? {
        ...r,
        status: 'rejected' as RequestStatus,
        ownerApprover: 'Data Engineer',
        ownerDecision: 'rejected' as const,
        ownerDecisionAt: new Date().toISOString().slice(0, 10),
        ownerNotes: notes || 'Solicitação recusada.',
      } : r
    ));
  };

  const handleDataTeamApprove = (id: string) => {
    setRequests((prev) => prev.map((r) =>
      r.id === id ? {
        ...r,
        status: 'approved' as RequestStatus,
        dataTeamApprover: 'Data Engineer',
        dataTeamDecision: 'approved' as const,
        dataTeamDecisionAt: new Date().toISOString().slice(0, 10),
        dataTeamNotes: 'Double-check concluído. Permissão concedida.',
      } : r
    ));
  };

  const handleDataTeamReject = (id: string, notes: string) => {
    setRequests((prev) => prev.map((r) =>
      r.id === id ? {
        ...r,
        status: 'rejected' as RequestStatus,
        dataTeamApprover: 'Data Engineer',
        dataTeamDecision: 'rejected' as const,
        dataTeamDecisionAt: new Date().toISOString().slice(0, 10),
        dataTeamNotes: notes || 'Reprovado pelo Time de Dados.',
      } : r
    ));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Solicitações de Acesso</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie as solicitações de acesso aos produtos de dados
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
            <Clock size={18} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{counts.pending_owner}</p>
            <p className="text-xs text-gray-500">Aguardando Owner</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Shield size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{counts.pending_data_team}</p>
            <p className="text-xs text-gray-500">Aguardando Dados</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <CheckCircle size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{counts.approved}</p>
            <p className="text-xs text-gray-500">Aprovadas</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <XCircle size={18} className="text-red-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{counts.rejected}</p>
            <p className="text-xs text-gray-500">Rejeitadas</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setViewMode(key)}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${viewMode === key ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {label} ({counts[key]})
          </button>
        ))}
      </div>

      {/* Requests list */}
      <div className="space-y-3">
        {filtered.map((req) => {
          const isExpanded = expandedId === req.id;
          const SIcon = STATUS_ICONS[req.status];
          return (
            <div key={req.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Row */}
              <div className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : req.id)}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{req.productName}</h3>
                    <span className="text-xs font-mono text-gray-400">
                      {req.catalog}.{req.schema}.{req.object}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><User size={10} /> {req.requester}</span>
                    <span>{req.requesterEmail}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${req.permissionLevel === 'WRITE' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {PERMISSION_LABELS[req.permissionLevel]}
                    </span>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${REQUEST_STATUS_COLORS[req.status]}`}>
                  <SIcon size={12} />
                  {REQUEST_STATUS_LABELS[req.status]}
                </span>

                <span className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString('pt-BR')}</span>

                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-5 py-5 space-y-4 bg-gray-50/50">
                  {/* Justification */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Justificativa</p>
                    <p className="text-sm text-gray-700 bg-white border border-gray-100 rounded-lg px-3 py-2">{req.justification}</p>
                  </div>

                  {/* Approval timeline */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Pipeline de Aprovação</p>
                    <div className="space-y-3">
                      {/* Step 1: Owner */}
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          req.ownerDecision === 'approved' ? 'bg-green-100 text-green-600' :
                          req.ownerDecision === 'rejected' ? 'bg-red-100 text-red-600' :
                          req.status === 'pending_owner' ? 'bg-yellow-100 text-yellow-600 animate-pulse' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {req.ownerDecision === 'approved' ? <CheckCircle size={14} /> :
                           req.ownerDecision === 'rejected' ? <XCircle size={14} /> : '1'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">Aprovação do Owner</p>
                          {req.ownerApprover && (
                            <div className="text-xs text-gray-500 mt-1">
                              <span>{req.ownerDecision === 'approved' ? 'Aprovado' : 'Rejeitado'} por <strong>{req.ownerApprover}</strong> em {new Date(req.ownerDecisionAt!).toLocaleDateString('pt-BR')}</span>
                              {req.ownerNotes && (
                                <p className="flex items-start gap-1 mt-1 text-gray-400">
                                  <MessageSquare size={10} className="mt-0.5 shrink-0" /> {req.ownerNotes}
                                </p>
                              )}
                            </div>
                          )}
                          {req.status === 'pending_owner' && (
                            <div className="text-xs text-yellow-600 mt-1">Aguardando decisão...</div>
                          )}
                        </div>
                      </div>

                      {/* Step 2: Data team */}
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          req.dataTeamDecision === 'approved' ? 'bg-green-100 text-green-600' :
                          req.dataTeamDecision === 'rejected' ? 'bg-red-100 text-red-600' :
                          req.status === 'pending_data_team' ? 'bg-blue-100 text-blue-600 animate-pulse' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {req.dataTeamDecision === 'approved' ? <CheckCircle size={14} /> :
                           req.dataTeamDecision === 'rejected' ? <XCircle size={14} /> : '2'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">Double-check — Time de Dados</p>
                          {req.dataTeamApprover && (
                            <div className="text-xs text-gray-500 mt-1">
                              <span>{req.dataTeamDecision === 'approved' ? 'Aprovado' : 'Rejeitado'} por <strong>{req.dataTeamApprover}</strong> em {new Date(req.dataTeamDecisionAt!).toLocaleDateString('pt-BR')}</span>
                              {req.dataTeamNotes && (
                                <p className="flex items-start gap-1 mt-1 text-gray-400">
                                  <MessageSquare size={10} className="mt-0.5 shrink-0" /> {req.dataTeamNotes}
                                </p>
                              )}
                            </div>
                          )}
                          {req.status === 'pending_data_team' && (
                            <div className="text-xs text-blue-600 mt-1">Aguardando double-check...</div>
                          )}
                          {req.status === 'pending_owner' && (
                            <div className="text-xs text-gray-400 mt-1">Etapa pendente</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {req.status === 'pending_owner' && (
                    <ApprovalActions
                      label="Owner"
                      onApprove={() => handleOwnerApprove(req.id)}
                      onReject={(notes) => handleOwnerReject(req.id, notes)}
                    />
                  )}
                  {req.status === 'pending_data_team' && (
                    <ApprovalActions
                      label="Time de Dados"
                      onApprove={() => handleDataTeamApprove(req.id)}
                      onReject={(notes) => handleDataTeamReject(req.id, notes)}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            <Shield size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhuma solicitação encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Approval action buttons ────────────────────────────────────────────────────

function ApprovalActions({ label, onApprove, onReject }: {
  label: string;
  onApprove: () => void;
  onReject: (notes: string) => void;
}) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');

  return (
    <div className="border-t border-gray-200 pt-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Ação — {label}</p>
      {!showRejectForm ? (
        <div className="flex items-center gap-2">
          <button onClick={onApprove}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
            <CheckCircle size={14} /> Aprovar
          </button>
          <button onClick={() => setShowRejectForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
            <XCircle size={14} /> Rejeitar
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            rows={2}
            placeholder="Motivo da rejeição..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <div className="flex items-center gap-2">
            <button onClick={() => { onReject(rejectNotes); setShowRejectForm(false); }}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
              <XCircle size={14} /> Confirmar Rejeição
            </button>
            <button onClick={() => setShowRejectForm(false)}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
