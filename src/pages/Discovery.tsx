import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Tag, ShoppingCart, Check, Sparkles, X, Send, Bot, User, Table2, Eye,
} from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { DataProduct } from '../types/product';
import { useCart } from '../contexts/CartContext';
import { useI18n } from '../contexts/I18nContext';

const allTeams = [...new Set(mockProducts.map((p) => p.team))].sort();
const allCatalogs = [...new Set(mockProducts.map((p) => p.catalog))].sort();

// ── LLM chat simulation ───────────────────────────────────────────────────────

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  products?: DataProduct[];
}

function matchProducts(query: string): DataProduct[] {
  const q = query.toLowerCase();
  return mockProducts.filter((p) => {
    if (p.status !== 'active') return false;
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.catalog.toLowerCase().includes(q) ||
      p.team.toLowerCase().includes(q) ||
      p.object.toLowerCase().includes(q) ||
      p.schema.toLowerCase().includes(q)
    );
  });
}

function generateReply(query: string, t: (key: string, params?: Record<string, string | number>) => string): { text: string; products: DataProduct[] } {
  const q = query.toLowerCase();

  // Try keyword matching
  const keywords = q.split(/\s+/).filter((w) => w.length > 2);
  let found: DataProduct[] = [];
  for (const kw of keywords) {
    const m = matchProducts(kw);
    if (m.length > 0) found = [...new Map([...found, ...m].map((p) => [p.id, p])).values()];
  }

  if (found.length > 0) {
    const names = found.map((p) => `**${p.name}**`).join(', ');
    return {
      text: t('chat.found', { count: found.length, names }),
      products: found,
    };
  }

  // Generic helpful responses
  if (q.includes('venda') || q.includes('comercial') || q.includes('pedido') || q.includes('sales') || q.includes('order')) {
    const m = matchProducts('vendas');
    return { text: m.length > 0 ? t('chat.salesRecommend', { name: m[0].name, cols: m[0].columns.length }) : t('chat.noSalesProducts'), products: m };
  }
  if (q.includes('cliente') || q.includes('crm') || q.includes('marketing') || q.includes('client') || q.includes('customer')) {
    const m = matchProducts('clientes');
    return { text: m.length > 0 ? t('chat.clientsRecommend', { name: m[0].name, desc: m[0].description }) : t('chat.noClientsProducts'), products: m };
  }
  if (q.includes('finance') || q.includes('dre') || q.includes('orçament') || q.includes('contab') || q.includes('financ')) {
    const m = matchProducts('financeiro');
    return { text: m.length > 0 ? t('chat.financeRecommend', { name: m[0].name, desc: m[0].description }) : t('chat.noFinanceProducts'), products: m };
  }

  // Fallback
  const activeProducts = mockProducts.filter((p) => p.status === 'active');
  const teamList = allTeams.join(', ');
  return {
    text: t('chat.fallback', { count: activeProducts.length, teams: teamList }),
    products: [],
  };
}

// ── Chat Panel ─────────────────────────────────────────────────────────────────

function ChatPanel({ open, onClose, onNavigate }: {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
  const { t } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: 'assistant', text: '', products: [] },
  ]);
  // Update greeting when language changes
  const greeting = t('chat.greeting');
  if (messages[0] && messages[0].id === 0 && messages[0].text !== greeting) {
    messages[0] = { ...messages[0], text: greeting };
  }
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    const q = input.trim();
    if (!q) return;
    const userMsg: ChatMessage = { id: Date.now(), role: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate LLM delay
    setTimeout(() => {
      const { text, products } = generateReply(q, t);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', text, products }]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  return (
    <>
      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />}

      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-[420px] max-w-full bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="flex items-center gap-2 text-white">
            <Sparkles size={18} />
            <div>
              <p className="text-sm font-semibold">{t('chat.title')}</p>
              <p className="text-xs text-white/70">{t('chat.subtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? '' : ''}`}>
                <div className="flex items-start gap-2">
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={12} className="text-purple-600" />
                    </div>
                  )}
                  <div>
                    <div className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}>
                      {msg.text.split('**').map((part, i) =>
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                      )}
                    </div>

                    {/* Product suggestions */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {msg.products.map((p) => (
                          <button key={p.id} onClick={() => onNavigate(p.id)}
                            className="w-full text-left bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
                            <p className="text-xs font-semibold text-gray-800 group-hover:text-blue-700">{p.name}</p>
                            <p className="text-xs font-mono text-gray-400 mt-0.5">
                              {p.catalog}.{p.schema}.{p.object}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <User size={12} className="text-blue-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <Bot size={12} className="text-purple-600" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chat.placeholder')}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button onClick={handleSend} disabled={!input.trim()}
              className="w-9 h-9 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <Send size={14} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">{t('chat.footer')}</p>
        </div>
      </div>
    </>
  );
}

// ── Discovery ──────────────────────────────────────────────────────────────────

export function Discovery() {
  const navigate = useNavigate();
  const { addItem, removeItem, isInCart, count } = useCart();
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [catalogFilter, setCatalogFilter] = useState<string>('all');
  const [chatOpen, setChatOpen] = useState(false);

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
          <h1 className="text-2xl font-bold text-gray-900">{t('discovery.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('discovery.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            <Sparkles size={16} />
            {t('discovery.aiSearch')}
          </button>
          <button
            onClick={() => navigate('/discovery/cart')}
            className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <ShoppingCart size={16} />
            {t('discovery.cart')}
            {count > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[260px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('discovery.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select value={catalogFilter} onChange={(e) => setCatalogFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">{t('discovery.allCatalogs')}</option>
            {allCatalogs.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">{t('discovery.allTeams')}</option>
            {allTeams.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <span className="text-xs text-gray-400 ml-auto">{products.length} {t('discovery.productCount')}</span>
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
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                      {p.objectType === 'table' ? <Table2 size={10} /> : <Eye size={10} />}
                      {p.objectType.toUpperCase()}
                    </span>
                    {p.dataCategory && (
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        p.dataCategory === 'fato' ? 'bg-blue-50 text-blue-600' :
                        p.dataCategory === 'dimensao' ? 'bg-purple-50 text-purple-600' :
                        p.dataCategory === 'agregada' ? 'bg-amber-50 text-amber-600' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {p.dataCategory === 'fato' ? 'Fato' : p.dataCategory === 'dimensao' ? 'Dimensão' : p.dataCategory === 'agregada' ? 'Agregada' : 'Snapshot'}
                      </span>
                    )}
                  </div>
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

                {/* Usage recommendations */}
                {p.usageRecommendations && p.usageRecommendations.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.usageRecommendations.map((rec) => (
                      <span key={rec.tool} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded" title={rec.description}>
                        <span className="text-[10px]">{rec.emoji}</span>{rec.tool}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{p.columns.length} {t('discovery.columns')}</span>
                  {p.rowCount != null && <span>{p.rowCount.toLocaleString('pt-BR')} {t('discovery.rows')}</span>}
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
                  {inCart ? <><Check size={12} /> {t('discovery.inCart')}</> : <><ShoppingCart size={12} /> {t('discovery.requestAccess')}</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Search size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">{t('discovery.noResults')}</p>
        </div>
      )}

      {/* LLM Chat Panel */}
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} onNavigate={(id) => { setChatOpen(false); navigate(`/products/${id}`); }} />
    </div>
  );
}
