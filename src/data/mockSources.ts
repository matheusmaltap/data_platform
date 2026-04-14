import { ManagedSource } from '../types/source';

export const mockSources: ManagedSource[] = [
  {
    id: 'src-1',
    name: 'SQL Server CRM - Produção',
    sourceType: 'sql_server',
    description: 'Banco de dados do CRM de clientes e oportunidades',
    owner: 'Carlos Souza',
    team: 'Marketing',
    status: 'active',
    createdAt: '2025-10-01',
    host: '10.0.1.5',
    port: 1433,
    database: 'crm_prod',
    schemas: [
      {
        name: 'dbo',
        tables: ['clientes', 'oportunidades', 'contatos', 'atividades', 'produtos'],
      },
      {
        name: 'vendas',
        tables: ['pedidos', 'itens_pedido', 'faturamento', 'metas', 'comissoes'],
      },
      {
        name: 'marketing',
        tables: ['campanhas', 'leads', 'segmentos', 'emails_enviados'],
      },
    ],
  },
  {
    id: 'src-2',
    name: 'SAP ECC - Produção',
    sourceType: 'sap',
    description: 'Sistema SAP ECC principal com módulos SD, MM, FI e HCM',
    owner: 'Ana Lima',
    team: 'Comercial',
    status: 'active',
    createdAt: '2025-09-15',
    sapSystem: 'PRD',
    sapClient: '100',
    sapHost: 'sap-prd.empresa.internal',
    schemas: [
      {
        name: 'SD - Vendas',
        tables: ['VBAK', 'VBAP', 'VBFA', 'LIKP', 'LIPS'],
      },
      {
        name: 'MM - Materiais',
        tables: ['MARA', 'MARC', 'MARD', 'EKKO', 'EKPO'],
      },
      {
        name: 'FI - Financeiro',
        tables: ['BKPF', 'BSEG', 'SKA1', 'LFA1', 'KNA1'],
      },
      {
        name: 'HCM - RH',
        tables: ['PA0001', 'PA0002', 'PA0007', 'PA0008', 'T001P'],
      },
    ],
  },
  {
    id: 'src-3',
    name: 'Oracle Financials - Produção',
    sourceType: 'oracle',
    description: 'Oracle EBS com módulos AP, AR e GL',
    owner: 'Beatriz Rocha',
    team: 'Financeiro',
    status: 'active',
    createdAt: '2025-11-20',
    host: '10.0.2.10',
    port: 1521,
    database: 'FINPRD',
    schemas: [
      {
        name: 'AP',
        tables: ['AP_INVOICES_ALL', 'AP_INVOICE_LINES_ALL', 'AP_PAYMENT_SCHEDULES_ALL'],
      },
      {
        name: 'AR',
        tables: ['AR_CUSTOMERS', 'AR_PAYMENT_SCHEDULES_ALL', 'RA_CUSTOMER_TRX_ALL'],
      },
      {
        name: 'GL',
        tables: ['GL_JE_HEADERS', 'GL_JE_LINES', 'GL_BALANCES', 'GL_CODE_COMBINATIONS'],
      },
    ],
  },
  {
    id: 'src-4',
    name: 'PostgreSQL Analytics - Produção',
    sourceType: 'postgresql',
    description: 'Banco analítico do e-commerce com dados de pedidos e produtos',
    owner: 'Fernanda Costa',
    team: 'Dados',
    status: 'active',
    createdAt: '2026-01-10',
    host: 'pg-analytics.empresa.internal',
    port: 5432,
    database: 'analytics',
    schemas: [
      {
        name: 'ecommerce',
        tables: ['pedidos', 'itens_pedido', 'produtos', 'categorias', 'clientes'],
      },
      {
        name: 'estoque',
        tables: ['inventario', 'movimentacoes', 'fornecedores', 'compras'],
      },
    ],
  },
  {
    id: 'src-5',
    name: 'SQL Server ERP Legado',
    sourceType: 'sql_server',
    description: 'Sistema ERP legado em processo de migração para SAP',
    owner: 'Diego Ferreira',
    team: 'TI',
    status: 'inactive',
    createdAt: '2025-08-05',
    host: '10.0.3.20',
    port: 1433,
    database: 'erp_legacy',
    schemas: [
      {
        name: 'dbo',
        tables: ['funcionarios', 'cargos', 'departamentos', 'folha'],
      },
    ],
  },
];
