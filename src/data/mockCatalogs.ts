export const TEAMS = [
  'Comercial',
  'Marketing',
  'Financeiro',
  'RH',
  'Dados',
  'Pricing',
  'TI',
  'Operações',
  'Supply Chain',
  'Jurídico',
];

export interface DatabricksCatalog {
  name: string;
  schemas: string[];
}

export const DATABRICKS_CATALOGS: DatabricksCatalog[] = [
  {
    name: 'comercial',
    schemas: ['pedidos_venda', 'faturamento', 'vendas_b2b', 'clientes_b2b', 'metas'],
  },
  {
    name: 'marketing',
    schemas: ['campanhas', 'clientes_b2c', 'leads', 'eventos', 'nps'],
  },
  {
    name: 'financeiro',
    schemas: ['contas_pagar', 'contas_receber', 'orcamento', 'fiscal', 'custos'],
  },
  {
    name: 'rh',
    schemas: ['funcionarios', 'folha_pagamento', 'beneficios', 'recrutamento', 'treinamentos'],
  },
  {
    name: 'dados',
    schemas: ['crm_silver', 'erp_silver', 'bi_gold', 'enrichment', 'api_cnpj'],
  },
  {
    name: 'pricing',
    schemas: ['precos_produto', 'concorrencia', 'historico_precos', 'politica_descontos'],
  },
  {
    name: 'supply_chain',
    schemas: ['estoque', 'fornecedores', 'pedidos_compra', 'logistica'],
  },
];
