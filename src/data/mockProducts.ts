import { DataProduct, ObjectPermission, ColumnMetadata } from '../types/product';

// ── Mock column sets ───────────────────────────────────────────────────────────

const colsVendasConsolidadas: ColumnMetadata[] = [
  { name: 'dt_referencia',      dataType: 'DATE',         description: 'Data de referência da venda',             isPrimaryKey: false, isNullable: false, tags: ['partição'] },
  { name: 'id_pedido',          dataType: 'BIGINT',        description: 'Identificador único do pedido',            isPrimaryKey: true,  isNullable: false, tags: [] },
  { name: 'id_cliente',         dataType: 'BIGINT',        description: 'Identificador do cliente',                 isPrimaryKey: false, isNullable: false, tags: [] },
  { name: 'nm_cliente',         dataType: 'STRING',        description: 'Nome completo do cliente',                 isPrimaryKey: false, isNullable: true,  tags: ['PII'] },
  { name: 'cd_produto',         dataType: 'STRING',        description: 'Código do produto vendido',                isPrimaryKey: false, isNullable: false, tags: [] },
  { name: 'nm_produto',         dataType: 'STRING',        description: 'Descrição do produto',                    isPrimaryKey: false, isNullable: true,  tags: [] },
  { name: 'qt_itens',           dataType: 'INTEGER',       description: 'Quantidade de itens no pedido',            isPrimaryKey: false, isNullable: false, tags: [] },
  { name: 'vl_unitario',        dataType: 'DECIMAL(18,2)', description: 'Valor unitário do produto',                isPrimaryKey: false, isNullable: false, tags: [] },
  { name: 'vl_desconto',        dataType: 'DECIMAL(18,2)', description: 'Valor total de desconto aplicado',         isPrimaryKey: false, isNullable: true,  tags: [] },
  { name: 'vl_total',           dataType: 'DECIMAL(18,2)', description: 'Valor total do pedido',                   isPrimaryKey: false, isNullable: false, tags: [] },
  { name: 'nm_vendedor',        dataType: 'STRING',        description: 'Nome do vendedor responsável',             isPrimaryKey: false, isNullable: true,  tags: [] },
  { name: 'cd_regiao',          dataType: 'STRING',        description: 'Código da região de venda',                isPrimaryKey: false, isNullable: true,  tags: [] },
  { name: 'ds_canal',           dataType: 'STRING',        description: 'Canal de venda (loja, e-commerce, etc)',   isPrimaryKey: false, isNullable: true,  tags: [] },
  { name: 'dt_ingestion',       dataType: 'TIMESTAMP',     description: 'Carimbo de ingestão na plataforma',        isPrimaryKey: false, isNullable: false, tags: ['sistema'] },
];

const colsClientesDimensao: ColumnMetadata[] = [
  { name: 'id_cliente',         dataType: 'BIGINT',        description: 'Identificador único do cliente (PK)',      isPrimaryKey: true,  isNullable: false, tags: [] },
  { name: 'nm_cliente',         dataType: 'STRING',        description: 'Nome completo',                           isPrimaryKey: false, isNullable: false, tags: ['PII'] },
  { name: 'nr_cpf_cnpj',        dataType: 'STRING',        description: 'CPF ou CNPJ do cliente',                  isPrimaryKey: false, isNullable: true,  tags: ['PII', 'sensitivo'] },
  { name: 'ds_email',           dataType: 'STRING',        description: 'E-mail principal',                        isPrimaryKey: false, isNullable: true,  tags: ['PII'] },
  { name: 'nr_telefone',        dataType: 'STRING',        description: 'Telefone de contato',                     isPrimaryKey: false, isNullable: true,  tags: ['PII'] },
  { name: 'tp_cliente',         dataType: 'STRING',        description: 'Tipo: PF ou PJ',                          isPrimaryKey: false, isNullable: false, tags: [] },
  { name: 'ds_segmento',        dataType: 'STRING',        description: 'Segmento de mercado do cliente',          isPrimaryKey: false, isNullable: true,  tags: [] },
  { name: 'dt_primeiro_pedido', dataType: 'DATE',          description: 'Data do primeiro pedido realizado',       isPrimaryKey: false, isNullable: true,  tags: [] },
  { name: 'vl_ltv',             dataType: 'DECIMAL(18,2)', description: 'Lifetime value acumulado',                isPrimaryKey: false, isNullable: true,  tags: [] },
  { name: 'fl_ativo',           dataType: 'BOOLEAN',       description: 'Indica se o cliente está ativo',          isPrimaryKey: false, isNullable: false, tags: [] },
  { name: 'dt_ingestion',       dataType: 'TIMESTAMP',     description: 'Carimbo de ingestão na plataforma',       isPrimaryKey: false, isNullable: false, tags: ['sistema'] },
];

const colsDreConsolidado: ColumnMetadata[] = [
  { name: 'dt_referencia',      dataType: 'DATE',          description: 'Mês de referência (primeiro dia do mês)', isPrimaryKey: true,  isNullable: false, tags: ['partição'] },
  { name: 'cd_empresa',         dataType: 'STRING',        description: 'Código da empresa/filial',                isPrimaryKey: true,  isNullable: false, tags: [] },
  { name: 'cd_conta_contabil',  dataType: 'STRING',        description: 'Código da conta contábil',                isPrimaryKey: true,  isNullable: false, tags: [] },
  { name: 'ds_conta',           dataType: 'STRING',        description: 'Descrição da conta contábil',             isPrimaryKey: false, isNullable: false, tags: [] },
  { name: 'ds_grupo',           dataType: 'STRING',        description: 'Grupo de contas (Receita, Despesa, etc)', isPrimaryKey: false, isNullable: false, tags: [] },
  { name: 'vl_realizado',       dataType: 'DECIMAL(18,2)', description: 'Valor realizado no período',              isPrimaryKey: false, isNullable: true,  tags: [] },
  { name: 'vl_orcado',          dataType: 'DECIMAL(18,2)', description: 'Valor orçado para o período',             isPrimaryKey: false, isNullable: true,  tags: [] },
  { name: 'vl_variacao',        dataType: 'DECIMAL(18,2)', description: 'Variação realizado x orçado',             isPrimaryKey: false, isNullable: true,  tags: [] },
  { name: 'pc_variacao',        dataType: 'DECIMAL(5,2)',  description: 'Percentual de variação',                  isPrimaryKey: false, isNullable: true,  tags: [] },
  { name: 'dt_ingestion',       dataType: 'TIMESTAMP',     description: 'Carimbo de ingestão na plataforma',       isPrimaryKey: false, isNullable: false, tags: ['sistema'] },
];

// ── Mock products ──────────────────────────────────────────────────────────────

export const mockProducts: DataProduct[] = [
  {
    id: 'prod-1',
    name: 'Vendas Consolidadas',
    description: 'Tabela Gold com todas as vendas consolidadas por pedido, enriquecidas com dados de cliente e produto. Principal fonte para relatórios comerciais.',
    objectType: 'table',
    catalog: 'comercial',
    schema: 'gold',
    object: 'vendas_consolidadas',
    owner: 'Ana Lima',
    team: 'Comercial',
    tags: ['vendas', 'gold', 'certificado'],
    status: 'active',
    createdAt: '2026-01-10',
    updatedAt: '2026-04-10',
    importedFromDatabricks: true,
    rowCount: 4820340,
    sizeGb: 12.4,
    columns: colsVendasConsolidadas,
    dataCategory: 'fato',
    usageRecommendations: [
      { tool: 'Power BI', emoji: '📊', description: 'Ideal para dashboards de vendas e relatórios gerenciais' },
      { tool: 'Databricks SQL', emoji: '⚡', description: 'Consultas analíticas de grande volume' },
      { tool: 'Excel', emoji: '📗', description: 'Exportação de subsets para análises pontuais' },
    ],
    relatedProducts: [
      { productId: 'prod-2', productName: 'Dimensão Clientes', joinKeys: ['id_cliente'], relationship: 'Enriquece vendas com dados cadastrais do cliente', type: 'join' },
      { productId: 'prod-3', productName: 'DRE Consolidado', joinKeys: ['dt_referencia'], relationship: 'Conciliação entre receita de vendas e DRE contábil', type: 'synergy' },
    ],
    sampleData: [
      { dt_referencia: '2026-04-10', id_pedido: 9812345, id_cliente: 42001, nm_cliente: 'Maria Silva', cd_produto: 'PRD-001', nm_produto: 'Notebook Pro', qt_itens: 2, vl_unitario: 4500.00, vl_desconto: 450.00, vl_total: 8550.00, nm_vendedor: 'João Santos', cd_regiao: 'SP', ds_canal: 'e-commerce' },
      { dt_referencia: '2026-04-10', id_pedido: 9812346, id_cliente: 42002, nm_cliente: 'Carlos Mendes', cd_produto: 'PRD-015', nm_produto: 'Monitor 27"', qt_itens: 1, vl_unitario: 2200.00, vl_desconto: null, vl_total: 2200.00, nm_vendedor: 'Ana Lima', cd_regiao: 'RJ', ds_canal: 'loja' },
      { dt_referencia: '2026-04-09', id_pedido: 9812300, id_cliente: 42015, nm_cliente: 'Tech Corp LTDA', cd_produto: 'PRD-003', nm_produto: 'Teclado Mecânico', qt_itens: 50, vl_unitario: 350.00, vl_desconto: 1750.00, vl_total: 15750.00, nm_vendedor: 'Pedro Costa', cd_regiao: 'MG', ds_canal: 'B2B' },
      { dt_referencia: '2026-04-09', id_pedido: 9812298, id_cliente: 42008, nm_cliente: 'Fernanda Oliveira', cd_produto: 'PRD-007', nm_produto: 'Mouse Wireless', qt_itens: 3, vl_unitario: 180.00, vl_desconto: 27.00, vl_total: 513.00, nm_vendedor: 'João Santos', cd_regiao: 'SP', ds_canal: 'e-commerce' },
      { dt_referencia: '2026-04-08', id_pedido: 9812250, id_cliente: 42020, nm_cliente: 'Roberto Alves', cd_produto: 'PRD-010', nm_produto: 'Webcam HD', qt_itens: 1, vl_unitario: 420.00, vl_desconto: null, vl_total: 420.00, nm_vendedor: 'Ana Lima', cd_regiao: 'PR', ds_canal: 'loja' },
    ],
    lineage: {
      upstream: [
        { name: 'erp.raw.pedidos', type: 'source' },
        { name: 'erp.bronze.pedidos_raw', type: 'bronze' },
        { name: 'comercial.silver.pedidos_enriquecidos', type: 'silver' },
      ],
      downstream: [
        { name: 'Power BI — Dashboard Comercial', type: 'consumption' },
        { name: 'Power BI — Relatório Vendas Regional', type: 'consumption' },
      ],
    },
  },
  {
    id: 'prod-2',
    name: 'Dimensão Clientes',
    description: 'Dimensão consolidada de clientes com dados cadastrais, segmentação e métricas de relacionamento. Fonte para análises de CRM e marketing.',
    objectType: 'table',
    catalog: 'comercial',
    schema: 'gold',
    object: 'dim_clientes',
    owner: 'Carlos Souza',
    team: 'Marketing',
    tags: ['clientes', 'dimensão', 'PII'],
    status: 'active',
    createdAt: '2026-01-15',
    updatedAt: '2026-04-12',
    importedFromDatabricks: true,
    rowCount: 183200,
    sizeGb: 1.2,
    columns: colsClientesDimensao,
    dataCategory: 'dimensao',
    usageRecommendations: [
      { tool: 'Power BI', emoji: '📊', description: 'Dimensão para enriquecer fatos com dados de cliente' },
      { tool: 'Python / Spark', emoji: '🐍', description: 'Segmentação e análises de cohort' },
      { tool: 'CRM / Marketing', emoji: '📣', description: 'Pilar de campanhas e personalização' },
    ],
    relatedProducts: [
      { productId: 'prod-1', productName: 'Vendas Consolidadas', joinKeys: ['id_cliente'], relationship: 'Chave principal para enriquecer fatos de vendas', type: 'join' },
    ],
    sampleData: [
      { id_cliente: 42001, nm_cliente: 'Maria Silva', nr_cpf_cnpj: '***.***.***-01', ds_email: 'maria@email.com', nr_telefone: '(11) 9****-1234', tp_cliente: 'PF', ds_segmento: 'Premium', dt_primeiro_pedido: '2024-03-15', vl_ltv: 45230.50, fl_ativo: true },
      { id_cliente: 42002, nm_cliente: 'Carlos Mendes', nr_cpf_cnpj: '***.***.***-02', ds_email: 'carlos@email.com', nr_telefone: '(21) 9****-5678', tp_cliente: 'PF', ds_segmento: 'Standard', dt_primeiro_pedido: '2024-06-20', vl_ltv: 12800.00, fl_ativo: true },
      { id_cliente: 42015, nm_cliente: 'Tech Corp LTDA', nr_cpf_cnpj: '**.***.***/0001-**', ds_email: 'compras@techcorp.com', nr_telefone: '(31) 3****-9000', tp_cliente: 'PJ', ds_segmento: 'Enterprise', dt_primeiro_pedido: '2023-11-01', vl_ltv: 287500.00, fl_ativo: true },
      { id_cliente: 42008, nm_cliente: 'Fernanda Oliveira', nr_cpf_cnpj: '***.***.***-08', ds_email: 'fernanda@email.com', nr_telefone: '(11) 9****-4321', tp_cliente: 'PF', ds_segmento: 'Standard', dt_primeiro_pedido: '2025-01-10', vl_ltv: 3420.00, fl_ativo: true },
      { id_cliente: 42099, nm_cliente: 'Loja Express ME', nr_cpf_cnpj: '**.***.***/0001-**', ds_email: 'contato@express.com', nr_telefone: '(41) 3****-7777', tp_cliente: 'PJ', ds_segmento: 'Standard', dt_primeiro_pedido: '2025-08-05', vl_ltv: 9100.00, fl_ativo: false },
    ],
    lineage: {
      upstream: [
        { name: 'crm.raw.clientes_api', type: 'source' },
        { name: 'crm.bronze.clientes_raw', type: 'bronze' },
        { name: 'comercial.silver.clientes_dedup', type: 'silver' },
      ],
      downstream: [
        { name: 'Power BI — Dashboard CRM', type: 'consumption' },
        { name: 'Campanhas Marketing Automation', type: 'consumption' },
      ],
    },
  },
  {
    id: 'prod-3',
    name: 'DRE Consolidado',
    description: 'Demonstrativo de Resultado do Exercício consolidado por empresa e conta contábil, com comparativo orçado x realizado.',
    objectType: 'table',
    catalog: 'financeiro',
    schema: 'gold',
    object: 'dre_consolidado',
    owner: 'Beatriz Rocha',
    team: 'Financeiro',
    tags: ['dre', 'financeiro', 'gold', 'certificado'],
    status: 'active',
    createdAt: '2026-02-01',
    updatedAt: '2026-04-13',
    importedFromDatabricks: false,
    rowCount: 45600,
    sizeGb: 0.3,
    columns: colsDreConsolidado,
    dataCategory: 'agregada',
    usageRecommendations: [
      { tool: 'Power BI', emoji: '📊', description: 'DRE gerencial e acompanhamento orçamentário' },
      { tool: 'Excel', emoji: '📗', description: 'Análises financeiras ad-hoc e modelagem' },
      { tool: 'Tableau', emoji: '📈', description: 'Visualizações financeiras interativas' },
    ],
    relatedProducts: [
      { productId: 'prod-1', productName: 'Vendas Consolidadas', joinKeys: ['dt_referencia'], relationship: 'Conciliação receita de vendas com contas contábeis', type: 'synergy' },
    ],
    sampleData: [
      { dt_referencia: '2026-03-01', cd_empresa: 'EMP-01', cd_conta_contabil: '3.1.01', ds_conta: 'Receita Bruta de Vendas', ds_grupo: 'Receita', vl_realizado: 2450000.00, vl_orcado: 2300000.00, vl_variacao: 150000.00, pc_variacao: 6.52 },
      { dt_referencia: '2026-03-01', cd_empresa: 'EMP-01', cd_conta_contabil: '4.1.01', ds_conta: 'Custo Mercadoria Vendida', ds_grupo: 'Custos', vl_realizado: -1470000.00, vl_orcado: -1380000.00, vl_variacao: -90000.00, pc_variacao: -6.52 },
      { dt_referencia: '2026-03-01', cd_empresa: 'EMP-01', cd_conta_contabil: '4.2.01', ds_conta: 'Despesas Administrativas', ds_grupo: 'Despesa', vl_realizado: -320000.00, vl_orcado: -350000.00, vl_variacao: 30000.00, pc_variacao: 8.57 },
      { dt_referencia: '2026-02-01', cd_empresa: 'EMP-01', cd_conta_contabil: '3.1.01', ds_conta: 'Receita Bruta de Vendas', ds_grupo: 'Receita', vl_realizado: 2180000.00, vl_orcado: 2200000.00, vl_variacao: -20000.00, pc_variacao: -0.91 },
      { dt_referencia: '2026-02-01', cd_empresa: 'EMP-02', cd_conta_contabil: '3.1.01', ds_conta: 'Receita Bruta de Vendas', ds_grupo: 'Receita', vl_realizado: 890000.00, vl_orcado: 850000.00, vl_variacao: 40000.00, pc_variacao: 4.71 },
    ],
    lineage: {
      upstream: [
        { name: 'sap.raw.lancamentos_contabeis', type: 'source' },
        { name: 'financeiro.bronze.lancamentos_raw', type: 'bronze' },
        { name: 'financeiro.silver.dre_por_conta', type: 'silver' },
      ],
      downstream: [
        { name: 'Tableau — Painel Financeiro', type: 'consumption' },
        { name: 'Excel — Modelo Orçamentário', type: 'consumption' },
      ],
    },
  },
  {
    id: 'prod-4',
    name: 'View Performance Campanhas',
    description: 'View que consolida métricas de desempenho de campanhas de marketing com dados de leads, conversão e CAC.',
    objectType: 'view',
    catalog: 'marketing',
    schema: 'gold',
    object: 'vw_performance_campanhas',
    owner: 'Fernanda Costa',
    team: 'Marketing',
    tags: ['marketing', 'campanhas', 'view'],
    status: 'draft',
    createdAt: '2026-04-05',
    updatedAt: '2026-04-05',
    importedFromDatabricks: false,
    columns: [],
    usageRecommendations: [
      { tool: 'Databricks SQL', emoji: '⚡', description: 'Consultas rápidas sobre performance de campanhas' },
      { tool: 'Python / Spark', emoji: '🐍', description: 'Modelos de atribuição e predição de conversão' },
    ],
  },
];

// ── Mock permissions ───────────────────────────────────────────────────────────

export const mockPermissions: ObjectPermission[] = [
  // prod-1 permissions
  { id: 'perm-1', productId: 'prod-1', principal: 'grp-comercial',     principalType: 'group',             permission: 'READ',  grantedBy: 'Ana Lima',    grantedAt: '2026-01-10' },
  { id: 'perm-2', productId: 'prod-1', principal: 'grp-analytics',     principalType: 'group',             permission: 'READ',  grantedBy: 'Ana Lima',    grantedAt: '2026-01-10' },
  { id: 'perm-3', productId: 'prod-1', principal: 'ana.lima',          principalType: 'user',              permission: 'OWNER', grantedBy: 'sistema',     grantedAt: '2026-01-10' },
  { id: 'perm-4', productId: 'prod-1', principal: 'svc-powerbi',       principalType: 'service_principal', permission: 'READ',  grantedBy: 'Ana Lima',    grantedAt: '2026-02-01' },
  { id: 'perm-5', productId: 'prod-1', principal: 'diego.ferreira',    principalType: 'user',              permission: 'READ',  grantedBy: 'Ana Lima',    grantedAt: '2026-03-15' },

  // prod-2 permissions
  { id: 'perm-6', productId: 'prod-2', principal: 'grp-marketing',     principalType: 'group',             permission: 'READ',  grantedBy: 'Carlos Souza', grantedAt: '2026-01-15' },
  { id: 'perm-7', productId: 'prod-2', principal: 'carlos.souza',      principalType: 'user',              permission: 'OWNER', grantedBy: 'sistema',      grantedAt: '2026-01-15' },
  { id: 'perm-8', productId: 'prod-2', principal: 'svc-powerbi',       principalType: 'service_principal', permission: 'READ',  grantedBy: 'Carlos Souza', grantedAt: '2026-02-01' },

  // prod-3 permissions
  { id: 'perm-9',  productId: 'prod-3', principal: 'grp-financeiro',   principalType: 'group',             permission: 'READ',  grantedBy: 'Beatriz Rocha', grantedAt: '2026-02-01' },
  { id: 'perm-10', productId: 'prod-3', principal: 'beatriz.rocha',    principalType: 'user',              permission: 'OWNER', grantedBy: 'sistema',       grantedAt: '2026-02-01' },
  { id: 'perm-11', productId: 'prod-3', principal: 'diretoria',        principalType: 'group',             permission: 'READ',  grantedBy: 'Beatriz Rocha', grantedAt: '2026-02-15' },
  { id: 'perm-12', productId: 'prod-3', principal: 'svc-tableau',      principalType: 'service_principal', permission: 'READ',  grantedBy: 'Beatriz Rocha', grantedAt: '2026-03-01' },
];

// ── Mock Databricks objects for import ─────────────────────────────────────────
// Simula o que seria retornado de uma chamada à API do Unity Catalog

export const MOCK_DATABRICKS_OBJECTS: Record<string, Record<string, { name: string; type: 'table' | 'view' }[]>> = {
  comercial: {
    gold: [
      { name: 'vendas_consolidadas', type: 'table' },
      { name: 'dim_clientes',        type: 'table' },
      { name: 'dim_produtos',        type: 'table' },
      { name: 'fato_pedidos',        type: 'table' },
      { name: 'vw_ranking_vendedores', type: 'view' },
    ],
  },
  financeiro: {
    gold: [
      { name: 'dre_consolidado',       type: 'table' },
      { name: 'fluxo_caixa',           type: 'table' },
      { name: 'budget_vs_realizado',   type: 'table' },
      { name: 'vw_indicadores_kpi',    type: 'view' },
    ],
  },
  marketing: {
    gold: [
      { name: 'vw_performance_campanhas', type: 'view' },
      { name: 'funil_leads',              type: 'table' },
      { name: 'nps_historico',            type: 'table' },
    ],
  },
  dados: {
    gold: [
      { name: 'catalogo_produtos',  type: 'table' },
      { name: 'dim_tempo',          type: 'table' },
    ],
  },
};

// Simula colunas importadas do Databricks por objeto
export const MOCK_DATABRICKS_COLUMNS: Record<string, ColumnMetadata[]> = {
  'comercial.gold.vendas_consolidadas': colsVendasConsolidadas,
  'comercial.gold.dim_clientes':        colsClientesDimensao,
  'financeiro.gold.dre_consolidado':    colsDreConsolidado,
  'comercial.gold.dim_produtos': [
    { name: 'cd_produto',  dataType: 'STRING',        description: 'Código do produto',         isPrimaryKey: true,  isNullable: false, tags: [] },
    { name: 'nm_produto',  dataType: 'STRING',        description: 'Nome do produto',           isPrimaryKey: false, isNullable: false, tags: [] },
    { name: 'ds_categoria',dataType: 'STRING',        description: 'Categoria do produto',      isPrimaryKey: false, isNullable: true,  tags: [] },
    { name: 'vl_preco',    dataType: 'DECIMAL(18,2)', description: 'Preço de tabela',           isPrimaryKey: false, isNullable: false, tags: [] },
    { name: 'fl_ativo',    dataType: 'BOOLEAN',       description: 'Produto ativo',             isPrimaryKey: false, isNullable: false, tags: [] },
  ],
};
