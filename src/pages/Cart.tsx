import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ShoppingCart, Trash2, Send, Check, MessageSquare,
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { mockProducts } from '../data/mockProducts';
import { PermissionLevel, PERMISSION_LABELS } from '../types/product';

export function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updatePermission, clearCart, count } = useCart();
  const [justification, setJustification] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const cartProducts = items.map((item) => {
    const product = mockProducts.find((p) => p.id === item.productId);
    return { ...item, product };
  }).filter((i) => i.product != null);

  const handleSubmit = () => {
    // In a real app, this would POST access requests to an API
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Solicitação Enviada!</h1>
          <p className="text-sm text-gray-500 mb-2">
            Sua solicitação de acesso foi enviada para aprovação.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Primeiro o <strong>Owner do produto</strong> irá avaliar e, após aprovação, o <strong>Time de Dados</strong> fará o double-check.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Voltar ao Discovery
            </button>
            <button onClick={() => navigate('/access-requests')}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              Ver Minhas Solicitações
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft size={16} /> Voltar ao Discovery
      </button>

      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart size={24} className="text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carrinho de Acesso</h1>
          <p className="text-sm text-gray-500">{count} produto(s) selecionado(s)</p>
        </div>
      </div>

      {cartProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <ShoppingCart size={36} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-500 mb-4">Seu carrinho está vazio</p>
          <button onClick={() => navigate('/')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Explorar produtos
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700">Produtos Selecionados</p>
            </div>
            <div className="divide-y divide-gray-100">
              {cartProducts.map(({ productId, permissionLevel, product }) => (
                <div key={productId} className="px-5 py-4 flex items-center gap-4 group">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{product!.name}</h3>
                    <p className="text-xs font-mono text-gray-500">
                      <span className="text-blue-600">{product!.catalog}</span>
                      <span className="text-gray-300">.</span>
                      <span className="text-green-600">{product!.schema}</span>
                      <span className="text-gray-300">.</span>
                      {product!.object}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Owner: {product!.owner} · {product!.team}</p>
                  </div>

                  {/* Permission selector */}
                  <div className="flex gap-1.5">
                    {(['READ', 'WRITE'] as PermissionLevel[]).map((perm) => (
                      <button key={perm} onClick={() => updatePermission(productId, perm)}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium border-2 transition-all ${
                          permissionLevel === perm
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}>
                        {PERMISSION_LABELS[perm]}
                      </button>
                    ))}
                  </div>

                  <button onClick={() => removeItem(productId)}
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Justification */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-gray-500" />
              <label className="text-sm font-semibold text-gray-700">
                Justificativa <span className="text-red-500">*</span>
              </label>
            </div>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={3}
              placeholder="Descreva por que você precisa acessar estes dados e como pretende utilizá-los..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">
              A justificativa será enviada ao Owner do produto e ao Time de Dados para avaliação.
            </p>
          </div>

          {/* Approval pipeline info */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-blue-800 mb-3">Fluxo de Aprovação</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">1</div>
                <span className="text-sm text-blue-700">Solicitação enviada</span>
              </div>
              <div className="w-8 h-0.5 bg-blue-200" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">2</div>
                <span className="text-sm text-blue-700">Aprovação do Owner</span>
              </div>
              <div className="w-8 h-0.5 bg-blue-200" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">3</div>
                <span className="text-sm text-blue-700">Double-check Time de Dados</span>
              </div>
              <div className="w-8 h-0.5 bg-blue-200" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-xs font-bold">✓</div>
                <span className="text-sm text-green-700">Acesso concedido</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3">
            <button onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Continuar Explorando
            </button>
            <button onClick={handleSubmit} disabled={!justification.trim()}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <Send size={14} /> Enviar Solicitação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
