import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Info, Plus, Trash2 } from 'lucide-react';
import { SourceType, SOURCE_LABELS, SOURCE_CONNECTOR } from '../types/ingestion';
import { TEAMS } from '../data/mockCatalogs';

const SOURCE_ICONS: Record<SourceType, string> = {
  sql_server: '🗄️', sap: '🏭', oracle: '🔶', postgresql: '🐘', mysql: '🐬',
};

const DEFAULT_PORTS: Partial<Record<SourceType, number>> = {
  sql_server: 1433,
  oracle: 1521,
  postgresql: 5432,
  mysql: 3306,
};

interface SchemaEntry {
  id: string;
  name: string;
  tables: string;  // comma-separated, parsed on submit
}

interface FormData {
  name: string;
  description: string;
  owner: string;
  team: string;
  sourceType: SourceType | '';
  // SQL-based
  host: string;
  port: string;
  database: string;
  // SAP
  sapSystem: string;
  sapClient: string;
  sapHost: string;
  // Schemas
  schemas: SchemaEntry[];
}

const newSchema = (): SchemaEntry => ({
  id: crypto.randomUUID(),
  name: '',
  tables: '',
});

const initial: FormData = {
  name: '', description: '', owner: '', team: '',
  sourceType: '',
  host: '', port: '', database: '',
  sapSystem: '', sapClient: '', sapHost: '',
  schemas: [newSchema()],
};

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
const sel = inp;

function Field({ label, hint, required, children }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export function SourceNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(initial);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<any>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const setSourceType = (type: SourceType) => {
    setForm((f) => ({
      ...f,
      sourceType: type,
      port: DEFAULT_PORTS[type] ? String(DEFAULT_PORTS[type]) : '',
    }));
  };

  const addSchema = () =>
    setForm((f) => ({ ...f, schemas: [...f.schemas, newSchema()] }));

  const removeSchema = (id: string) =>
    setForm((f) => ({ ...f, schemas: f.schemas.filter((s) => s.id !== id) }));

  const updateSchema = (id: string, field: keyof SchemaEntry, value: string) =>
    setForm((f) => ({
      ...f,
      schemas: f.schemas.map((s) => s.id === id ? { ...s, [field]: value } : s),
    }));

  const isSQLBased = ['sql_server', 'oracle', 'postgresql', 'mysql'].includes(form.sourceType);
  const isSAP = form.sourceType === 'sap';

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button onClick={() => navigate('/ingestion/sources')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft size={16} /> Voltar para fontes
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nova Fonte Gerenciada</h1>
        <p className="text-sm text-gray-500 mt-1">
          Registre uma fonte de dados para que ela fique disponível nas ingestões gerenciadas
        </p>
      </div>

      <div className="space-y-6">

        {/* ── Identificação ─────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Identificação</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Nome da Fonte" required>
                <input className={inp} value={form.name} onChange={set('name')}
                  placeholder="Ex: SQL Server CRM - Produção" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Descrição">
                <textarea className={inp} rows={2} value={form.description} onChange={set('description')}
                  placeholder="Descreva o que esta fonte contém e para quê serve" />
              </Field>
            </div>
            <Field label="Responsável" required>
              <input className={inp} value={form.owner} onChange={set('owner')} placeholder="Nome do Engenheiro" />
            </Field>
            <Field label="Time / Domínio" required>
              <select className={sel} value={form.team} onChange={set('team')}>
                <option value="">Selecione o time</option>
                {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* ── Tipo de fonte ──────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Tipo de Fonte</h2>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(SOURCE_LABELS) as SourceType[]).map((type) => (
              <button key={type} type="button"
                onClick={() => setSourceType(type)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${form.sourceType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{SOURCE_ICONS[type]}</span>
                  <span className={`font-semibold text-sm ${form.sourceType === type ? 'text-blue-700' : 'text-gray-700'}`}>
                    {SOURCE_LABELS[type]}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{SOURCE_CONNECTOR[type]}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Conexão ───────────────────────────────────────────────── */}
        {form.sourceType && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Configuração de Conexão</h2>

            {isSQLBased && (
              <div className="grid grid-cols-2 gap-4">
                <Field label="Host" required hint="IP ou hostname do servidor">
                  <input className={inp} value={form.host} onChange={set('host')} placeholder="10.0.1.5 ou db.empresa.com" />
                </Field>
                <Field label="Porta">
                  <input type="number" className={inp} value={form.port} onChange={set('port')} placeholder={String(DEFAULT_PORTS[form.sourceType as SourceType] ?? '')} />
                </Field>
                <div className="col-span-2">
                  <Field label="Banco de Dados" required>
                    <input className={inp} value={form.database} onChange={set('database')} placeholder="nome_do_banco" />
                  </Field>
                </div>
              </div>
            )}

            {isSAP && (
              <div className="grid grid-cols-2 gap-4">
                <Field label="Application Server Host" required>
                  <input className={inp} value={form.sapHost} onChange={set('sapHost')} placeholder="sap-prd.empresa.internal" />
                </Field>
                <Field label="System ID" required hint="Código do sistema (ex: PRD, QAS, DEV)">
                  <input className={inp} value={form.sapSystem} onChange={set('sapSystem')} placeholder="PRD" />
                </Field>
                <Field label="Client" required>
                  <input className={inp} value={form.sapClient} onChange={set('sapClient')} placeholder="100" />
                </Field>
              </div>
            )}

            <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
              <Info size={14} className="mt-0.5 shrink-0" />
              <span>
                As credenciais de acesso são gerenciadas centralmente pelo time de Plataforma e não precisam ser informadas aqui.
                O conector <strong>{SOURCE_CONNECTOR[form.sourceType as SourceType]}</strong> já possui os acessos configurados.
              </span>
            </div>
          </div>
        )}

        {/* ── Schemas e Tabelas ──────────────────────────────────────── */}
        {form.sourceType && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Schemas e Tabelas</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Informe os schemas e tabelas disponíveis nesta fonte para uso nas ingestões
                </p>
              </div>
              <button onClick={addSchema} type="button"
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <Plus size={14} /> Adicionar Schema
              </button>
            </div>

            <div className="space-y-3">
              {form.schemas.map((schema, i) => (
                <div key={schema.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Schema {i + 1}
                    </span>
                    {form.schemas.length > 1 && (
                      <button onClick={() => removeSchema(schema.id)} type="button"
                        className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={isSAP ? 'Módulo / Área' : 'Nome do Schema'} required>
                      <input className={inp} value={schema.name}
                        onChange={(e) => updateSchema(schema.id, 'name', e.target.value)}
                        placeholder={isSAP ? 'Ex: SD - Vendas' : 'Ex: dbo, vendas, public'} />
                    </Field>
                    <Field label="Tabelas" hint="Separadas por vírgula">
                      <input className={inp} value={schema.tables}
                        onChange={(e) => updateSchema(schema.id, 'tables', e.target.value)}
                        placeholder="tabela1, tabela2, tabela3" />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Actions ───────────────────────────────────────────────── */}
        <div className="flex justify-between">
          <button onClick={() => navigate('/ingestion/sources')}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button onClick={() => navigate('/ingestion/sources')}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Check size={16} /> Salvar Fonte
          </button>
        </div>
      </div>
    </div>
  );
}
