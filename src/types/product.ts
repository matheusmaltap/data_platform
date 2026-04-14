export type ObjectType = 'table' | 'view';
export type ProductStatus = 'active' | 'deprecated' | 'draft';
export type PermissionLevel = 'READ' | 'WRITE' | 'OWNER';
export type PrincipalType = 'user' | 'group' | 'service_principal';

export interface ColumnMetadata {
  name: string;
  dataType: string;
  description: string;
  isPrimaryKey: boolean;
  isNullable: boolean;
  tags: string[];
}

export interface DataProduct {
  id: string;
  name: string;
  description: string;
  objectType: ObjectType;
  catalog: string;
  schema: string;
  object: string;             // nome no Databricks
  owner: string;
  team: string;
  tags: string[];
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  importedFromDatabricks: boolean;
  columns: ColumnMetadata[];
  rowCount?: number;
  sizeGb?: number;
}

export interface ObjectPermission {
  id: string;
  productId: string;
  principal: string;
  principalType: PrincipalType;
  permission: PermissionLevel;
  grantedBy: string;
  grantedAt: string;
}

// ── Display helpers ────────────────────────────────────────────────────────────

export const OBJECT_TYPE_LABELS: Record<ObjectType, string> = {
  table: 'Tabela',
  view: 'View',
};

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  active: 'Ativo',
  deprecated: 'Depreciado',
  draft: 'Rascunho',
};

export const PERMISSION_LABELS: Record<PermissionLevel, string> = {
  READ: 'Leitura',
  WRITE: 'Escrita',
  OWNER: 'Proprietário',
};

// Color by data type category
export function getTypeColor(dataType: string): string {
  const t = dataType.toUpperCase();
  if (['STRING', 'VARCHAR', 'CHAR', 'TEXT'].some((x) => t.startsWith(x))) return 'bg-blue-100 text-blue-700';
  if (['INT', 'BIGINT', 'SMALLINT', 'TINYINT', 'DECIMAL', 'DOUBLE', 'FLOAT', 'LONG'].some((x) => t.startsWith(x)))
    return 'bg-green-100 text-green-700';
  if (['DATE', 'TIMESTAMP', 'DATETIME'].some((x) => t.startsWith(x))) return 'bg-purple-100 text-purple-700';
  if (t === 'BOOLEAN') return 'bg-orange-100 text-orange-700';
  return 'bg-gray-100 text-gray-600';
}
