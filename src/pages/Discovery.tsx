import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Tag, ShoppingCart, Check, Database, Users, Layers,
} from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { useCart } from '../contexts/CartContext';

const allTeams = [...new Set(mockProducts.map((p) => p.team))].sort();
const allCatalogs = [...new Set(mockProducts.map((p) => p.catalog))].sort();

export function Discovery() {
  const navigate = useNavigate();
  const { addItem, removeItem, isInCart, count } = useCart();
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [catalogFilter, setCatalogFilter] = useState<string>('all');

  const products = mockProducts.filter((p) => {
    if (p.status !== 'active') return false;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.object.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchTeam = teamFilter === 'all' || p.team === teamFilter;
    const matchCatalog = catalogFilter === 'all' || p.catalog === catalogFilter;
    return matchSearch && matchTeam && matchCatalog;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discovery de Produtos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Explore os produtos de dados disponíveis e solicite acesso
          </p>
        </div>
        <button
          onClick={() => navigate('/discovery/cart')}
          className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <ShoppingCart size={16} />
          Carrinho
          {count > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Database size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{mockProducts.filter((p) => p.status === 'active').length}</p>
            <p className="text-xs text-gray-500">Produtos Disponíveis</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <Layers size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{allCatalogs.length}</p>
            <p className="text-xs text-gray-500">Catalogs</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
            <Users size={18} className="text-orange-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{allTeams.length}</p>
            <p className="text-xs text-gray-500">Times / Domínios</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[260px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar produtos por nome, descrição, objeto ou tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select value={catalogFilter} onChange={(e) => setCatalogFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Todos os catalogs</option>
            {allCatalogs.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Todos os times</option>
            {allTeams.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <span className="text-xs text-gray-400 ml-auto">{products.length} produto(s)</span>
        </div>
      </div>

      {/* Product cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((p) => {
          const inCart = isInCart(p.id);
          return (
            <div key={p.id}
              className="bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all flex flex-col">
              {/* Card header */}
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-gray-400">{p.team}</span>
                </div>

                <h3 className="text-base font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => navigate(`/products/${p.id}`)}>
                  {p.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description}</p>

                {/* FQN */}
                <div className="text-xs font-mono text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg mb-3">
                  <span className="text-blue-600">{p.catalog}</span>
                  <span className="text-gray-300">.</span>
                  <span className="text-green-600">{p.schema}</span>
                  <span className="text-gray-300">.</span>
                  <span className="text-gray-700">{p.object}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-0.5 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      <Tag size={9} />{tag}
                    </span>
                  ))}
                  {p.tags.length > 3 && (
                    <span className="text-xs text-gray-400">+{p.tags.length - 3}</span>
                  )}
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{p.columns.length} colunas</span>
                  {p.rowCount != null && <span>{p.rowCount.toLocaleString('pt-BR')} linhas</span>}
                  <span>Owner: {p.owner}</span>
                </div>
              </div>

              {/* Card footer */}
              <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
                <button
                  onClick={() => navigate(`/products/${p.id}`)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Ver detalhes
                </button>
                <button
                  onClick={() => inCart ? removeItem(p.id) : addItem(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    inCart
                      ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}>
                  {inCart ? <><Check size={12} /> No Carrinho</> : <><ShoppingCart size={12} /> Solicitar Acesso</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Search size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum produto encontrado com os filtros selecionados</p>
        </div>
      )}
    </div>
  );
}
