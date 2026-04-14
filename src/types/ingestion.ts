export type SourceType = 'sql_server' | 'sap' | 'oracle' | 'postgresql' | 'mysql';

export type IngestionMode = 'managed' | 'unmanaged';

export type LoadType = 'delta' | 'batch';

export type UnmanagedType = 'api' | 'webscraping' | 'other';

export type IngestionStatus = 'active' | 'inactive' | 'running' | 'error';

export type ExecutionStatus = 'success' | 'failed' | 'running' | 'cancelled';

export interface Ingestion {
  id: string;
  name: string;
  description: string;
  owner: string;
  team: string;
  ingestionMode: IngestionMode;
  status: IngestionStatus;
  createdAt: string;

  // Managed only
  sourceType?: SourceType;
  loadType?: LoadType;
  tableKey?: string;
  destination?: string;   // formato: catalog.schema (Delta table no Databricks)
  schedule?: string;
  lastExecution?: string | null;
  lastExecutionStatus?: ExecutionStatus | null;

  // Unmanaged only
  unmanagedType?: UnmanagedType;
  databricksCatalog?: string;
  databricksSchema?: string;
  sourceUrl?: string;
  notes?: string;
}

export interface Execution {
  id: string;
  ingestionId: string;
  startedAt: string;
  finishedAt: string | null;
  status: ExecutionStatus;
  recordsIngested: number | null;
  duration: string | null;
  triggeredBy: string;
  logs: string;
}

export const SOURCE_LABELS: Record<SourceType, string> = {
  sql_server: 'SQL Server',
  sap: 'SAP',
  oracle: 'Oracle',
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
};

export const SOURCE_CONNECTOR: Record<SourceType, string> = {
  sql_server: 'Azure Data Factory',
  sap: 'QLIK / DataVard',
  oracle: 'Azure Data Factory',
  postgresql: 'Azure Data Factory',
  mysql: 'Azure Data Factory',
};

export const LOAD_TYPE_LABELS: Record<LoadType, string> = {
  delta: 'Delta (Incremental)',
  batch: 'Batch (Full Load)',
};

export const UNMANAGED_TYPE_LABELS: Record<UnmanagedType, string> = {
  api: 'API REST',
  webscraping: 'Web Scraping',
  other: 'Outras Fontes',
};
