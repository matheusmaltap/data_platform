import { PermissionLevel } from './product';

// ── Access Request types ───────────────────────────────────────────────────────

export type RequestStatus =
  | 'pending_owner'       // aguardando aprovação do owner do produto
  | 'pending_data_team'   // owner aprovou, aguardando double-check do time de dados
  | 'approved'            // ambos aprovaram
  | 'rejected';           // rejeitado em qualquer etapa

export interface AccessRequest {
  id: string;
  productId: string;
  productName: string;
  catalog: string;
  schema: string;
  object: string;
  objectType: 'table' | 'view';
  requester: string;
  requesterEmail: string;
  justification: string;
  permissionLevel: PermissionLevel;
  status: RequestStatus;
  createdAt: string;

  // Owner approval
  ownerApprover?: string;
  ownerDecision?: 'approved' | 'rejected';
  ownerDecisionAt?: string;
  ownerNotes?: string;

  // Data team approval (double-check)
  dataTeamApprover?: string;
  dataTeamDecision?: 'approved' | 'rejected';
  dataTeamDecisionAt?: string;
  dataTeamNotes?: string;
}

// ── Cart Item ──────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  permissionLevel: PermissionLevel;
}

// ── Display helpers ────────────────────────────────────────────────────────────

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  pending_owner:     'Aguardando Owner',
  pending_data_team: 'Aguardando Time de Dados',
  approved:          'Aprovado',
  rejected:          'Rejeitado',
};

export const REQUEST_STATUS_COLORS: Record<RequestStatus, string> = {
  pending_owner:     'bg-yellow-100 text-yellow-700',
  pending_data_team: 'bg-blue-100 text-blue-700',
  approved:          'bg-green-100 text-green-700',
  rejected:          'bg-red-100 text-red-700',
};
