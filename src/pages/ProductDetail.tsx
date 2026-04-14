import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft, Download, Tag, Pencil, Shield,
  Plus, Trash2, Check, Key, Users, User, Bot, Package,
  GitBranch, Table2, Link2, Database, ArrowRight, ExternalLink,
} from 'lucide-react';
import { mockProducts, mockPermissions } from '../data/mockProducts';
import {
  ProductStatus, ObjectPermission,
  PermissionLevel, PrincipalType, PERMISSION_LABELS, OBJECT_TYPE_LABELS, getTypeColor,
} from '../types/product';
import { useI18n } from '../contexts/I18nContext';

const STATUS_COLORS: Record<ProductStatus, string> = {
  active:     'bg-green-100 text-green-700',
  deprecated: 'bg-red-100 text-red-700',
  draft:      'bg-yellow-100 text-yellow-700',
};

const PRINCIPAL_ICONS: Record<PrincipalType, React.ElementType> = {
  user: User,
  group: Users,
  service_principal: Bot,
};

const PRINCIPAL_LABELS: Record<PrincipalType, string> = {
  user: 'Usuário',
  group: 'Grupo',
  service_principal: 'Service Principal',
};

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const product = mockProducts.find((p) => p.id === id);

  const [permissions, setPermissions] = useState<ObjectPermission[]>(
    mockPermissions.filter((p) => p.productId === id),
  );
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [tab, setTab] = useState<'info' | 'columns' | 'permissions' | 'lineage' | 'sampleData' | 'joins'>('info');

  if (!product) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>{t('productDetail.notFound')}</p>
        <button onClick={() => navigate('/products')} className="mt-4 text-blue-600 text-sm hover:underline">
          {t('productDetail.backToList')}
        </button>
      </div>
    );
  }

  const fqn = `${product.catalog}.${product.schema}.${product.object}`;

  const handleRevoke = (permId: string) => {
    setPermissions((prev) => prev.filter((p) => p.id !== permId));
  };

  const handleGrant = (principal: string, principalType: PrincipalType, permission: PermissionLevel) => {
    const newPerm: ObjectPermission = {
      id: `perm-new-${Date.now()}`,
      productId: product.id,
      principal,
      principalType,
      permission,
      grantedBy: 'Data Engineer',
      grantedAt: new Date().toISOString().slice(0, 10),
    };
    setPermissions((prev) => [...prev, newPerm]);
    setShowGrantModal(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <button onClick={() => navigate('/products')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft size={16} /> {t('productDetail.backToProducts')}
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[product.status]}`}>
              {t(`productStatus.${product.status}`)}
            </span>
            {product.importedFromDatabricks && (
              <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                <Download size={10} /> Importado
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{product.description}</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors shrink-0">
          <Pencil size={14} /> {t('productDetail.edit')}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t('productDetail.object')}</p>
          <p className="text-sm font-mono">
            <span className="text-blue-600">{product.catalog}</span>
            <span className="text-gray-400">.</span>
            <span className="text-green-600">{product.schema}</span>
            <span className="text-gray-400">.</span>
            <span className="text-gray-800">{product.object}</span>
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Owner</p>
          <p className="text-sm font-semibold text-gray-800">{product.owner}</p>
          <p className="text-xs text-gray-400">{product.team}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t('productDetail.columns')}</p>
          <p className="text-xl font-bold text-gray-800">{product.columns.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t('productDetail.permissions')}</p>
          <p className="text-xl font-bold text-gray-800">{permissions.length}</p>
        </div>
      </div>

      {/* Tags */}
      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {product.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-0.5 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              <Tag size={9} />{tag}
            </span>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
        {([
          { key: 'info', label: 'Informações' },
          { key: 'columns', label: `Colunas (${product.columns.length})` },
          { key: 'lineage', label: 'Linhagem' },
          { key: 'sampleData', label: 'Sample Data' },
          { key: 'joins', label: 'Joins & Sinergia' },
          { key: 'permissions', label: `Permissões (${permissions.length})` },
        ] as const).map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${tab === key ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Info */}
      {tab === 'info' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Fully Qualified Name</p>
              <p className="text-sm font-mono text-gray-700">{fqn}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tipo</p>
              <p className="text-sm text-gray-700">{OBJECT_TYPE_LABELS[product.objectType]}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Criado em</p>
              <p className="text-sm text-gray-700">{new Date(product.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Atualizado em</p>
              <p className="text-sm text-gray-700">{new Date(product.updatedAt).toLocaleDateString('pt-BR')}</p>
            </div>
            {product.rowCount != null && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Linhas</p>
                <p className="text-sm text-gray-700">{product.rowCount.toLocaleString('pt-BR')}</p>
              </div>
            )}
            {product.sizeGb != null && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tamanho</p>
                <p className="text-sm text-gray-700">{product.sizeGb} GB</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Columns */}
      {tab === 'columns' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {product.columns.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhuma coluna cadastrada</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nome</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Descrição</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">PK</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Nullable</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {product.columns.map((col, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-sm font-mono font-medium text-gray-800">{col.name}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${getTypeColor(col.dataType)}`}>{col.dataType}</span>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-500">{col.description || '—'}</td>
                    <td className="px-4 py-2.5 text-center">{col.isPrimaryKey ? <Key size={12} className="mx-auto text-blue-600" /> : null}</td>
                    <td className="px-4 py-2.5 text-center">{col.isNullable ? <Check size={12} className="mx-auto text-gray-400" /> : <span className="text-xs text-red-400">NOT NULL</span>}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {col.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{tag}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab: Permissions */}
      {tab === 'permissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Gerencie quem pode acessar este objeto</p>
            <button onClick={() => setShowGrantModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Plus size={14} /> Conceder Permissão
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {permissions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Shield size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhuma permissão concedida</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Principal</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Permissão</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Concedido por</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Data</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {permissions.map((perm) => {
                    const PIcon = PRINCIPAL_ICONS[perm.principalType];
                    return (
                      <tr key={perm.id} className="hover:bg-gray-50 group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <PIcon size={14} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-800">{perm.principal}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{PRINCIPAL_LABELS[perm.principalType]}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            perm.permission === 'OWNER' ? 'bg-orange-100 text-orange-700' :
                            perm.permission === 'WRITE' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {PERMISSION_LABELS[perm.permission]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{perm.grantedBy}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(perm.grantedAt).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 text-center">
                          {perm.permission !== 'OWNER' && (
                            <button onClick={() => handleRevoke(perm.id)}
                              className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Revogar permissão">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Tab: Lineage */}
      {tab === 'lineage' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {product.lineage ? (
            <div className="space-y-6">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Pipeline de dados — Unity Catalog (Databricks)</p>

              {/* Visual flow */}
              <div className="flex items-stretch gap-0 overflow-x-auto pb-2">
                {/* Upstream */}
                {product.lineage.upstream.map((node, i) => (
                  <div key={`up-${i}`} className="flex items-center">
                    <div className={`min-w-[180px] rounded-xl border-2 p-4 text-center ${
                      node.type === 'source' ? 'border-orange-200 bg-orange-50' :
                      node.type === 'bronze' ? 'border-amber-200 bg-amber-50' :
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Database size={12} className={
                          node.type === 'source' ? 'text-orange-500' :
                          node.type === 'bronze' ? 'text-amber-500' :
                          'text-blue-500'
                        } />
                        <span className={`text-[10px] font-bold uppercase ${
                          node.type === 'source' ? 'text-orange-500' :
                          node.type === 'bronze' ? 'text-amber-500' :
                          'text-blue-500'
                        }`}>{node.type}</span>
                      </div>
                      <p className="text-xs font-mono text-gray-700 break-all">{node.name}</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-300 mx-1 shrink-0" />
                  </div>
                ))}

                {/* Current (Gold) */}
                <div className="flex items-center">
                  <div className="min-w-[180px] rounded-xl border-2 border-yellow-400 bg-yellow-50 p-4 text-center ring-2 ring-yellow-200">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Table2 size={12} className="text-yellow-600" />
                      <span className="text-[10px] font-bold uppercase text-yellow-600">GOLD</span>
                    </div>
                    <p className="text-xs font-mono font-semibold text-gray-800">{product.catalog}.{product.schema}.{product.object}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{product.name}</p>
                  </div>
                </div>

                {/* Downstream */}
                {product.lineage.downstream.map((node, i) => (
                  <div key={`down-${i}`} className="flex items-center">
                    <ArrowRight size={16} className="text-gray-300 mx-1 shrink-0" />
                    <div className="min-w-[180px] rounded-xl border-2 border-green-200 bg-green-50 p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <ExternalLink size={12} className="text-green-500" />
                        <span className="text-[10px] font-bold uppercase text-green-500">{node.type}</span>
                      </div>
                      <p className="text-xs text-gray-700">{node.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400">
                  <GitBranch size={12} className="inline mr-1" />
                  Linhagem extraída automaticamente do Unity Catalog. Para detalhes completos, consulte o Databricks diretamente.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <GitBranch size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Linhagem não disponível para este produto</p>
              <p className="text-xs text-gray-300 mt-1">Conecte ao Databricks Unity Catalog para visualizar</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Sample Data */}
      {tab === 'sampleData' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {product.sampleData && product.sampleData.length > 0 ? (
            <>
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Amostra de {product.sampleData.length} registros — dados anonimizados para preview
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      {Object.keys(product.sampleData[0]).map((col) => (
                        <th key={col} className="px-3 py-2.5 font-semibold text-gray-500 uppercase whitespace-nowrap font-mono">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {product.sampleData.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-3 py-2 whitespace-nowrap text-gray-700 font-mono">
                            {val === null ? <span className="text-gray-300 italic">NULL</span> :
                             typeof val === 'boolean' ? <span className={val ? 'text-green-600' : 'text-red-400'}>{String(val)}</span> :
                             typeof val === 'number' ? <span className="text-blue-600">{val.toLocaleString('pt-BR')}</span> :
                             String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Table2 size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Sample data não disponível</p>
              <p className="text-xs text-gray-300 mt-1">Dados de amostra serão exibidos quando disponíveis no catálogo</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Joins & Synergy */}
      {tab === 'joins' && (
        <div className="space-y-4">
          {/* Usage recommendations */}
          {product.usageRecommendations && product.usageRecommendations.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-base">💡</span> Recomendações de Uso
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {product.usageRecommendations.map((rec) => (
                  <div key={rec.tool} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                    <span className="text-xl">{rec.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{rec.tool}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{rec.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related products / joins */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Link2 size={14} /> Joins & Sinergia com outros Produtos
            </h3>
            {product.relatedProducts && product.relatedProducts.length > 0 ? (
              <div className="space-y-3">
                {product.relatedProducts.map((rel) => (
                  <div key={rel.productId} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      rel.type === 'join' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {rel.type === 'join' ? <Link2 size={14} className="text-blue-600" /> : <GitBranch size={14} className="text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <button onClick={() => navigate(`/products/${rel.productId}`)} className="text-sm font-semibold text-blue-600 hover:underline">
                          {rel.productName}
                        </button>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase ${
                          rel.type === 'join' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                        }`}>{rel.type}</span>
                      </div>
                      <p className="text-xs text-gray-500">{rel.relationship}</p>
                      {rel.joinKeys.length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <Key size={10} className="text-gray-400" />
                          <span className="text-xs font-mono text-gray-500">
                            {rel.joinKeys.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Link2 size={24} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhuma relação mapeada ainda</p>
                <p className="text-xs text-gray-300 mt-1">Adicione joins e sinergias com outros produtos de dados</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grant permission modal */}
      {showGrantModal && (
        <GrantModal onClose={() => setShowGrantModal(false)} onGrant={handleGrant} />
      )}
    </div>
  );
}

// ── Grant Modal ────────────────────────────────────────────────────────────────

function GrantModal({ onClose, onGrant }: {
  onClose: () => void;
  onGrant: (principal: string, principalType: PrincipalType, permission: PermissionLevel) => void;
}) {
  const [principal, setPrincipal] = useState('');
  const [principalType, setPrincipalType] = useState<PrincipalType>('user');
  const [permission, setPermission] = useState<PermissionLevel>('READ');

  const canSubmit = principal.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <h2 className="text-lg font-bold text-gray-900">Conceder Permissão</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Principal <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="Ex: grp-analytics ou joao.silva"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <div className="flex gap-2">
            {(['user', 'group', 'service_principal'] as PrincipalType[]).map((t) => {
              const Icon = PRINCIPAL_ICONS[t];
              return (
                <button key={t} type="button" onClick={() => setPrincipalType(t)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${principalType === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <Icon size={12} /> {PRINCIPAL_LABELS[t]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Permissão</label>
          <div className="flex gap-2">
            {(['READ', 'WRITE'] as PermissionLevel[]).map((p) => (
              <button key={p} type="button" onClick={() => setPermission(p)}
                className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${permission === p ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {PERMISSION_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button onClick={() => canSubmit && onGrant(principal.trim(), principalType, permission)} disabled={!canSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Conceder
          </button>
        </div>
      </div>
    </div>
  );
}
