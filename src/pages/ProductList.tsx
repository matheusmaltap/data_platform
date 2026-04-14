import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Tag, CheckCircle, Clock, FileEdit, Package } from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { ProductStatus } from '../types/product';
import { useI18n } from '../contexts/I18nContext';

const STATUS_COLORS: Record<ProductStatus, string> = {
  active:     'bg-green-100 text-green-700',
  deprecated: 'bg-red-100 text-red-700',
  draft:      'bg-yellow-100 text-yellow-700',
};

const STATUS_ICONS: Record<ProductStatus, React.ElementType> = {
  active:     CheckCircle,
  deprecated: Clock,
  draft:      FileEdit,
};

const stats = [
  { labelKey: 'products.activeProducts',   value: String(mockProducts.filter((p) => p.status === 'active').length),     color: 'text-green-600',  bg: 'bg-green-50' },
  { labelKey: 'products.totalProducts', value: String(mockProducts.length),                                          color: 'text-blue-600',   bg: 'bg-blue-50' },
  { labelKey: 'products.drafts',       value: String(mockProducts.filter((p) => p.status === 'draft').length),       color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { labelKey: 'products.deprecated',       value: String(mockProducts.filter((p) => p.status === 'deprecated').length),  color: 'text-red-600',    bg: 'bg-red-50' },
];

export function ProductList() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all');

  const filtered = mockProducts.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.object.toLowerCase().includes(search.toLowerCase()) ||
      p.team.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || p.status     === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('products.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('products.subtitle')}
          </p>
        </div>
        <button
          onClick={() => navigate('/products/new')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> {t('products.newProduct')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(({ labelKey, value, color, bg }) => (
          <div key={labelKey} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
              <span className={`text-xl font-bold ${color}`}>{value}</span>
            </div>
            <p className="text-xs text-gray-500">{t(labelKey)}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('products.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProductStatus | 'all')}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('products.allStatus')}</option>
            <option value="active">{t('products.statusActive')}</option>
            <option value="draft">{t('products.statusDraft')}</option>
            <option value="deprecated">{t('products.statusDeprecated')}</option>
          </select>

          <span className="text-xs text-gray-400 ml-auto">{filtered.length} {t('products.productCount')}</span>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('products.colProduct')}</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('products.colDatabricks')}</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('products.colColumns')}</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('products.colTags')}</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('products.colStatus')}</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('products.colTeam')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((p) => {
              const StatusIcon = STATUS_ICONS[p.status];
              return (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/products/${p.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-xs">{p.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-gray-600">
                      <span className="text-blue-600">{p.catalog}</span>
                      <span className="text-gray-400">.</span>
                      <span className="text-green-600">{p.schema}</span>
                      <span className="text-gray-400">.</span>
                      {p.object}
                    </span>
                    {p.importedFromDatabricks && (
                      <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{t('products.imported')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {p.columns.length > 0 ? p.columns.length : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-0.5 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          <Tag size={9} />{tag}
                        </span>
                      ))}
                      {p.tags.length > 2 && (
                        <span className="text-xs text-gray-400">+{p.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status]}`}>
                      <StatusIcon size={10} />
                      {t(`productStatus.${p.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.team}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Package size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">{t('products.noProducts')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
