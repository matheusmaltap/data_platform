import { SourceType } from './ingestion';

export type SourceStatus = 'active' | 'inactive';

export interface SourceSchema {
  name: string;
  tables: string[];
}

export interface ManagedSource {
  id: string;
  name: string;             // nome amigável, ex: "SQL Server CRM - Produção"
  sourceType: SourceType;
  description: string;
  owner: string;
  team: string;
  status: SourceStatus;
  createdAt: string;

  // SQL-based
  host?: string;
  port?: number;
  database?: string;

  // SAP
  sapSystem?: string;
  sapClient?: string;
  sapHost?: string;

  // Schemas e tabelas disponíveis (virá de catalog/introspection no futuro)
  schemas: SourceSchema[];
}
