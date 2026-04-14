import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Check, Download, Plus, Trash2, Info, Table2, Eye,
} from 'lucide-react';
import { ObjectType, ColumnMetadata } from '../types/product';
import { TEAMS, DATABRICKS_CATALOGS } from '../data/mockCatalogs';
import { MOCK_DATABRICKS_OBJECTS, MOCK_DATABRICKS_COLUMNS } from '../data/mockProducts';

// ── Steps ──────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Localização' },
  { id: 2, label: 'Metadados' },
  { id: 3, label: 'Colunas' },
  { id: 4, label: 'Revisão' },
];

// ── Form data ──────────────────────────────────────────────────────────────────

interface FormData {
  catalog: string;
  schema: string;
  object: string;
  objectType: ObjectType | '';
  name: string;
  description: string;
  owner: string;
  team: string;
  tags: string;
  importedFromDatabricks: boolean;
  columns: ColumnMetadata[];
}

const initial: FormData = {
  catalog: '', schema: '', object: '', objectType: '',
  name: '', description: '', owner: '', team: '', tags: '',
  importedFromDatabricks: false, columns: [],
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
const sel = inp;

function Field({ label, hint, required, full, children }: {
  label: string; hint?: string; required?: boolean; full?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
      <Info size={14} className="mt-0.5 shrink-0" /><span>{children}</span>
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center gap-2 ${current === step.id ? 'text-blue-600' : current > step.id ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
              ${current === step.id ? 'border-blue-600 bg-blue-600 text-white' :
                current > step.id ? 'border-green-600 bg-green-600 text-white' :
                'border-gray-300 bg-white text-gray-400'}`}>
              {current > step.id ? <Check size={12} /> : step.id}
            </div>
            <span className="text-sm font-medium hidden sm:block">{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-10 h-0.5 mx-2 ${current > step.id ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Step 1: Catalog / Schema / Object ──────────────────────────────────────────

function Step1({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const catalogs = DATABRICKS_CATALOGS.map((c) => c.name);

  const schemas = useMemo(() => {
    if (!form.catalog) return [];
    const cat = DATABRICKS_CATALOGS.find((c) => c.name === form.catalog);
    return cat?.schemas ?? [];
  }, [form.catalog]);

  const databricksObjects = useMemo(() => {
    if (!form.catalog || !form.schema) return [];
    return MOCK_DATABRICKS_OBJECTS[form.catalog]?.[form.schema] ?? [];
  }, [form.catalog, form.schema]);

  const handleImport = (obj: { name: string; type: 'table' | 'view' }) => {
    const key = `${form.catalog}.${form.schema}.${obj.name}`;
    const importedCols = MOCK_DATABRICKS_COLUMNS[key] ?? [];
    setForm((f) => ({
      ...f,
      object: obj.name,
      objectType: obj.type,
      name: obj.name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      importedFromDatabricks: true,
      columns: importedCols,
    }));
  };

  return (
    <div className="space-y-6">
      <InfoBox>
        Informe o Catalog, Schema e o nome do Objeto no Databricks. Se o objeto já existir no Unity Catalog, você pode importar os metadados automaticamente.
      </InfoBox>

      <Grid>
        <Field label="Catalog" required>
          <select className={sel} value={form.catalog} onChange={(e) => setForm((f) => ({ ...f, catalog: e.target.value, schema: '', object: '', objectType: '', importedFromDatabricks: false, columns: [] }))}>
            <option value="">Selecione o catalog</option>
            {catalogs.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Schema" required>
          <select className={sel} value={form.schema} onChange={(e) => setForm((f) => ({ ...f, schema: e.target.value, object: '', objectType: '', importedFromDatabricks: false, columns: [] }))} disabled={!form.catalog}>
            <option value="">Selecione o schema</option>
            {schemas.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        <Field label="Nome do Objeto" required hint="Nome da tabela ou view no Databricks">
          <input className={inp} value={form.object} onChange={(e) => setForm((f) => ({ ...f, object: e.target.value }))} placeholder="Ex: vendas_consolidadas" />
        </Field>

        <Field label="Tipo do Objeto" required>
          <div className="flex gap-2">
            {(['table', 'view'] as ObjectType[]).map((t) => (
              <button key={t} type="button"
                onClick={() => setForm((f) => ({ ...f, objectType: t }))}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.objectType === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {t === 'table' ? <Table2 size={14} /> : <Eye size={14} />}
                {t === 'table' ? 'Tabela' : 'View'}
              </button>
            ))}
          </div>
        </Field>
      </Grid>

      {/* Databricks import */}
      {databricksObjects.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Objetos disponíveis em <span className="font-mono text-blue-600">{form.catalog}.{form.schema}</span>
          </h3>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-xs font-semibold text-gray-500 text-left uppercase">Objeto</th>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-500 text-left uppercase">Tipo</th>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-500 text-left uppercase">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {databricksObjects.map((obj) => (
                  <tr key={obj.name} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-mono text-gray-700">{obj.name}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${obj.type === 'table' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                        {obj.type === 'table' ? <Table2 size={10} /> : <Eye size={10} />}
                        {obj.type === 'table' ? 'Tabela' : 'View'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button type="button" onClick={() => handleImport(obj)}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${form.object === obj.name && form.importedFromDatabricks ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                        {form.object === obj.name && form.importedFromDatabricks
                          ? <><Check size={12} /> Importado</>
                          : <><Download size={12} /> Importar</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {form.importedFromDatabricks && (
        <div className="flex gap-2 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700">
          <Check size={14} className="mt-0.5 shrink-0" />
          <span>Metadados importados do Databricks. {form.columns.length > 0 ? `${form.columns.length} colunas carregadas.` : 'Nenhuma coluna encontrada — adicione manualmente na etapa 3.'}</span>
        </div>
      )}
    </div>
  );
}

// ── Step 2: Metadata ───────────────────────────────────────────────────────────

function Step2({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Grid>
      <Field label="Nome de Exibição" required full>
        <input className={inp} value={form.name} onChange={set('name')} placeholder="Ex: Vendas Consolidadas" />
      </Field>
      <Field label="Descrição" full>
        <textarea className={inp} rows={3} value={form.description} onChange={set('description')} placeholder="Descreva o propósito e conteúdo do objeto" />
      </Field>
      <Field label="Responsável (Owner)" required>
        <input className={inp} value={form.owner} onChange={set('owner')} placeholder="Nome do responsável" />
      </Field>
      <Field label="Time / Domínio" required>
        <select className={sel} value={form.team} onChange={set('team')}>
          <option value="">Selecione o time</option>
          {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Tags" full hint="Separe por vírgula: gold, vendas, certificado">
        <input className={inp} value={form.tags} onChange={set('tags')} placeholder="gold, vendas, certificado" />
      </Field>
    </Grid>
  );
}

// ── Step 3: Columns ────────────────────────────────────────────────────────────

const emptyCol: ColumnMetadata = { name: '', dataType: '', description: '', isPrimaryKey: false, isNullable: true, tags: [] };

function Step3({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const updateCol = (idx: number, field: keyof ColumnMetadata, value: any) => {
    setForm((f) => {
      const cols = [...f.columns];
      cols[idx] = { ...cols[idx], [field]: value };
      return { ...f, columns: cols };
    });
  };

  const addCol = () => setForm((f) => ({ ...f, columns: [...f.columns, { ...emptyCol }] }));

  const removeCol = (idx: number) => setForm((f) => ({ ...f, columns: f.columns.filter((_, i) => i !== idx) }));

  return (
    <div className="space-y-4">
      <InfoBox>
        {form.importedFromDatabricks && form.columns.length > 0
          ? 'Colunas importadas do Databricks. Revise e complemente as descrições conforme necessário.'
          : 'Adicione as colunas do objeto manualmente ou volte ao passo 1 para importar do Databricks.'}
      </InfoBox>

      {form.columns.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 text-left uppercase">Nome</th>
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 text-left uppercase">Tipo</th>
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 text-left uppercase">Descrição</th>
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 text-center uppercase">PK</th>
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 text-center uppercase">Nullable</th>
                <th className="px-3 py-2 text-xs font-semibold text-gray-500 text-center uppercase w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {form.columns.map((col, idx) => (
                <tr key={idx} className="group">
                  <td className="px-3 py-1.5">
                    <input className="w-full border border-gray-200 rounded px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500" value={col.name} onChange={(e) => updateCol(idx, 'name', e.target.value)} />
                  </td>
                  <td className="px-3 py-1.5">
                    <input className="w-full border border-gray-200 rounded px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500" value={col.dataType} onChange={(e) => updateCol(idx, 'dataType', e.target.value)} placeholder="STRING" />
                  </td>
                  <td className="px-3 py-1.5">
                    <input className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" value={col.description} onChange={(e) => updateCol(idx, 'description', e.target.value)} />
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <input type="checkbox" checked={col.isPrimaryKey} onChange={(e) => updateCol(idx, 'isPrimaryKey', e.target.checked)} className="rounded border-gray-300" />
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <input type="checkbox" checked={col.isNullable} onChange={(e) => updateCol(idx, 'isNullable', e.target.checked)} className="rounded border-gray-300" />
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <button type="button" onClick={() => removeCol(idx)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button type="button" onClick={addCol}
        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
        <Plus size={14} /> Adicionar Coluna
      </button>
    </div>
  );
}

// ── Step 4: Review ─────────────────────────────────────────────────────────────

function Step4({ form }: { form: FormData }) {
  const fqn = `${form.catalog}.${form.schema}.${form.object}`;
  const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">Localização</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Catalog</p>
            <p className="text-sm font-mono font-medium text-blue-600">{form.catalog || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Schema</p>
            <p className="text-sm font-mono font-medium text-green-600">{form.schema || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Objeto</p>
            <p className="text-sm font-mono font-medium text-gray-700">{form.object || '—'}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Fully Qualified Name</p>
          <p className="text-sm font-mono text-gray-600">{fqn !== '..' ? fqn : '—'}</p>
        </div>
        {form.importedFromDatabricks && (
          <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
            <Download size={10} /> Importado do Databricks
          </span>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">Metadados</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Nome</p>
            <p className="text-sm text-gray-800">{form.name || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tipo</p>
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${form.objectType === 'table' ? 'bg-blue-50 text-blue-700' : form.objectType === 'view' ? 'bg-purple-50 text-purple-700' : 'text-gray-400'}`}>
              {form.objectType === 'table' ? <><Table2 size={10} /> Tabela</> : form.objectType === 'view' ? <><Eye size={10} /> View</> : '—'}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Owner</p>
            <p className="text-sm text-gray-800">{form.owner || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Time</p>
            <p className="text-sm text-gray-800">{form.team || '—'}</p>
          </div>
        </div>
        {form.description && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Descrição</p>
            <p className="text-sm text-gray-600">{form.description}</p>
          </div>
        )}
        {tags.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-gray-800">Colunas ({form.columns.length})</h3>
        {form.columns.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhuma coluna definida</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pr-4 py-1 text-xs font-semibold text-gray-400 uppercase">Nome</th>
                  <th className="pr-4 py-1 text-xs font-semibold text-gray-400 uppercase">Tipo</th>
                  <th className="pr-4 py-1 text-xs font-semibold text-gray-400 uppercase">Descrição</th>
                  <th className="pr-4 py-1 text-xs font-semibold text-gray-400 uppercase text-center">PK</th>
                  <th className="pr-4 py-1 text-xs font-semibold text-gray-400 uppercase text-center">Null</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {form.columns.map((col, i) => (
                  <tr key={i}>
                    <td className="pr-4 py-1.5 text-xs font-mono text-gray-700">{col.name}</td>
                    <td className="pr-4 py-1.5 text-xs font-mono text-gray-500">{col.dataType}</td>
                    <td className="pr-4 py-1.5 text-xs text-gray-500">{col.description || '—'}</td>
                    <td className="pr-4 py-1.5 text-center">{col.isPrimaryKey ? <Check size={12} className="mx-auto text-blue-600" /> : null}</td>
                    <td className="pr-4 py-1.5 text-center">{col.isNullable ? <Check size={12} className="mx-auto text-gray-400" /> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export function ProductNew() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initial);

  const canNext = (() => {
    switch (step) {
      case 1: return !!form.catalog && !!form.schema && !!form.object && !!form.objectType;
      case 2: return !!form.name && !!form.owner && !!form.team;
      case 3: return true; // columns are optional
      default: return true;
    }
  })();

  const handleSubmit = () => {
    // In a real app this would POST to an API
    alert('Produto cadastrado com sucesso!');
    navigate('/products');
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button onClick={() => navigate('/products')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft size={16} /> Voltar para produtos
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Cadastrar Produto</h1>
      <p className="text-sm text-gray-500 mb-6">Registre um objeto da camada Gold para consumo</p>

      <StepIndicator current={step} />

      <div className="mb-8">
        {step === 1 && <Step1 form={form} setForm={setForm} />}
        {step === 2 && <Step2 form={form} setForm={setForm} />}
        {step === 3 && <Step3 form={form} setForm={setForm} />}
        {step === 4 && <Step4 form={form} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <button type="button" onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft size={16} /> Anterior
        </button>

        {step < STEPS.length ? (
          <button type="button" onClick={() => canNext && setStep(step + 1)} disabled={!canNext}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Próximo <ChevronRight size={16} />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit}
            className="flex items-center gap-1 px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
            <Check size={16} /> Cadastrar Produto
          </button>
        )}
      </div>
    </div>
  );
}
