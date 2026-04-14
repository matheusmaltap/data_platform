import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Database, Globe, Zap, RefreshCw, Info } from 'lucide-react';
import { SourceType, SOURCE_CONNECTOR, IngestionMode, LoadType, UnmanagedType } from '../types/ingestion';
import { TEAMS, DATABRICKS_CATALOGS } from '../data/mockCatalogs';
import { mockSources } from '../data/mockSources';

// ── Steps ──────────────────────────────────────────────────────────────────────

const MANAGED_STEPS = [
  { id: 1, label: 'Informações' },
  { id: 2, label: 'Tipo de Carga' },
  { id: 3, label: 'Origem' },
  { id: 4, label: 'Destino' },
  { id: 5, label: 'Agendamento' },
];

const UNMANAGED_STEPS = [
  { id: 1, label: 'Informações' },
  { id: 2, label: 'Tipo & Fonte' },
  { id: 3, label: 'Provisionamento' },
  { id: 4, label: 'Revisão' },
];

// ── FormData ───────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  description: string;
  owner: string;
  team: string;
  ingestionMode: IngestionMode | '';

  // Managed — load
  loadType: LoadType | '';

  // Managed — source (from registered sources)
  srcSourceId: string;   // ID da fonte cadastrada
  srcSchema: string;
  srcTable: string;
  tableKey: string;

  // Managed — destination (Databricks Delta table)
  destCatalog: string;
  destSchema: string;

  // Managed — schedule
  scheduleType: string;
  scheduleTime: string;
  scheduleInterval: string;
  retryAttempts: string;

  // Unmanaged
  unmanagedType: UnmanagedType | '';
  sourceUrl: string;
  notes: string;
  databricksCatalog: string;
  databricksSchema: string;
}

const initial: FormData = {
  name: '', description: '', owner: '', team: '', ingestionMode: '',
  loadType: '',
  srcSourceId: '', srcSchema: '', srcTable: '', tableKey: '',
  destCatalog: '', destSchema: '',
  scheduleType: 'daily', scheduleTime: '02:00', scheduleInterval: '4', retryAttempts: '2',
  unmanagedType: '', sourceUrl: '', notes: '',
  databricksCatalog: '', databricksSchema: '',
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

function StepIndicator({ steps, current }: { steps: { id: number; label: string }[]; current: number }) {
  return (
    <div className="flex items-center mb-8">
      {steps.map((step, i) => (
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
          {i < steps.length - 1 && (
            <div className={`w-10 h-0.5 mx-2 ${current > step.id ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function ModeCard({ selected, onClick, icon: Icon, title, subtitle, badges }: {
  selected: boolean; onClick: () => void; icon: React.ElementType;
  title: string; subtitle: string; badges: string[];
}) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <p className={`font-semibold mb-1 ${selected ? 'text-blue-700' : 'text-gray-800'}`}>{title}</p>
          <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
          <div className="flex flex-wrap gap-1.5">
            {badges.map((b) => (
              <span key={b} className={`text-xs px-2 py-0.5 rounded-full ${selected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{b}</span>
            ))}
          </div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 ${selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
          {selected && <Check size={12} className="text-white m-auto mt-0.5 ml-0.5" />}
        </div>
      </div>
    </button>
  );
}

// ── Managed steps ──────────────────────────────────────────────────────────────

function ManagedStep1({ form, set }: {
  form: FormData;
  set: (k: keyof FormData) => (e: React.ChangeEvent<any>) => void;
}) {
  return (
    <Grid>
      <Field label="Nome da Ingestão" required full>
        <input className={inp} value={form.name} onChange={set('name')} placeholder="Ex: CRM - Clientes Ativos" />
      </Field>
      <Field label="Descrição" full>
        <textarea className={inp} rows={2} value={form.description} onChange={set('description')} placeholder="Objetivo desta ingestão" />
      </Field>
      <Field label="Responsável" required>
        <input className={inp} value={form.owner} onChange={set('owner')} placeholder="Nome do Engenheiro de Dados" />
      </Field>
      <Field label="Time / Domínio" required>
        <select className={sel} value={form.team} onChange={set('team')}>
          <option value="">Selecione o time</option>
          {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
    </Grid>
  );
}

function ManagedStep2({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {(['delta', 'batch'] as LoadType[]).map((type) => (
          <button key={type} type="button"
            onClick={() => setForm((f) => ({ ...f, loadType: type }))}
            className={`p-4 rounded-xl border-2 text-left transition-all ${form.loadType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className="flex items-center gap-2 mb-2">
              {type === 'delta'
                ? <Zap size={16} className={form.loadType === type ? 'text-blue-600' : 'text-gray-400'} />
                : <RefreshCw size={16} className={form.loadType === type ? 'text-blue-600' : 'text-gray-400'} />}
              <span className={`font-semibold text-sm ${form.loadType === type ? 'text-blue-700' : 'text-gray-700'}`}>
                {type === 'delta' ? 'Delta (Incremental)' : 'Batch (Full Load)'}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              {type === 'delta'
                ? 'Ingere apenas registros novos ou alterados. Requer chave da tabela para o merge incremental.'
                : 'Recarrega a tabela completa a cada execução. Indicado para tabelas sem controle de alteração.'}
            </p>
          </button>
        ))}
      </div>
      {form.loadType && (
        <InfoBox>
          {form.loadType === 'delta'
            ? 'Os dados serão aplicados via merge na Delta table de destino usando a chave informada.'
            : 'A Delta table de destino será truncada e recarregada integralmente a cada execução.'}
        </InfoBox>
      )}
    </div>
  );
}

const SOURCE_ICONS_MAP: Record<SourceType, string> = {
  sql_server: '🗄️', sap: '🏭', oracle: '🔶', postgresql: '🐘', mysql: '🐬',
};

function ManagedStep3({ form, set, setForm }: {
  form: FormData;
  set: (k: keyof FormData) => (e: React.ChangeEvent<any>) => void;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const activeSources = mockSources.filter((s) => s.status === 'active');
  const selectedSource = mockSources.find((s) => s.id === form.srcSourceId);
  const schemas = selectedSource?.schemas ?? [];
  const selectedSchemaObj = schemas.find((s) => s.name === form.srcSchema);
  const tables = selectedSchemaObj?.tables ?? [];

  const handleSourceChange = (id: string) => {
    setForm((f) => ({ ...f, srcSourceId: id, srcSchema: '', srcTable: '' }));
  };

  const handleSchemaChange = (schema: string) => {
    setForm((f) => ({ ...f, srcSchema: schema, srcTable: '' }));
  };

  return (
    <div className="space-y-5">
      {/* Fonte */}
      <Field label="Fonte Gerenciada" required hint="Selecione uma das fontes cadastradas pelo time de Plataforma">
        <select className={sel} value={form.srcSourceId} onChange={(e) => handleSourceChange(e.target.value)}>
          <option value="">Selecione a fonte</option>
          {activeSources.map((s) => (
            <option key={s.id} value={s.id}>
              {SOURCE_ICONS_MAP[s.sourceType]} {s.name}
            </option>
          ))}
        </select>
      </Field>

      {/* Source info card */}
      {selectedSource && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3">
          <span className="text-2xl">{SOURCE_ICONS_MAP[selectedSource.sourceType]}</span>
          <div className="flex-1 text-sm">
            <p className="font-semibold text-gray-800">{selectedSource.name}</p>
            <p className="text-gray-500 text-xs mt-0.5">{selectedSource.description}</p>
            <div className="flex gap-4 mt-2 text-xs text-gray-400 font-mono">
              {selectedSource.host && <span>{selectedSource.host}{selectedSource.port ? `:${selectedSource.port}` : ''}</span>}
              {selectedSource.database && <span>db: {selectedSource.database}</span>}
              {selectedSource.sapSystem && <span>SID: {selectedSource.sapSystem} · client: {selectedSource.sapClient}</span>}
              <span className="text-blue-500">{SOURCE_CONNECTOR[selectedSource.sourceType]}</span>
            </div>
          </div>
        </div>
      )}

      {/* Schema */}
      {selectedSource && (
        <Grid>
          <Field label={selectedSource.sourceType === 'sap' ? 'Módulo / Área' : 'Schema'} required>
            <select className={sel} value={form.srcSchema} onChange={(e) => handleSchemaChange(e.target.value)}>
              <option value="">Selecione o schema</option>
              {schemas.map((s) => (
                <option key={s.name} value={s.name}>{s.name} ({s.tables.length} tabelas)</option>
              ))}
            </select>
          </Field>

          <Field label="Tabela" required>
            <select className={sel} value={form.srcTable} onChange={set('srcTable')} disabled={!form.srcSchema}>
              <option value="">{form.srcSchema ? 'Selecione a tabela' : 'Selecione o schema primeiro'}</option>
              {tables.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>

          {form.srcTable && (
            <Field label="Chave da Tabela" required full
              hint={form.loadType === 'delta'
                ? 'Usada no merge incremental. Para chaves compostas, separe por vírgula.'
                : 'Usada para controle e deduplicação. Para chaves compostas, separe por vírgula.'}>
              <input className={inp} value={form.tableKey} onChange={set('tableKey')}
                placeholder="Ex: id_cliente  ou  filial, numero_pedido" />
            </Field>
          )}
        </Grid>
      )}

      {activeSources.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm mb-2">Nenhuma fonte gerenciada cadastrada.</p>
          <a href="/ingestion/sources/new" className="text-sm text-blue-600 hover:underline">
            Cadastrar primeira fonte →
          </a>
        </div>
      )}
    </div>
  );
}

function ManagedStep4({ form, set, setForm }: {
  form: FormData;
  set: (k: keyof FormData) => (e: React.ChangeEvent<any>) => void;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const catalog = DATABRICKS_CATALOGS.find((c) => c.name === form.destCatalog);
  const schemas = catalog?.schemas ?? [];

  return (
    <div className="space-y-5">
      <Grid>
        <Field label="Catálogo Databricks" required>
          <select className={sel} value={form.destCatalog}
            onChange={(e) => setForm((f) => ({ ...f, destCatalog: e.target.value, destSchema: '' }))}>
            <option value="">Selecione o catálogo</option>
            {DATABRICKS_CATALOGS.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Schema" required>
          <select className={sel} value={form.destSchema} onChange={set('destSchema')} disabled={!form.destCatalog}>
            <option value="">{form.destCatalog ? 'Selecione o schema' : 'Selecione o catálogo primeiro'}</option>
            {schemas.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
      </Grid>

      {form.destCatalog && form.destSchema && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Destino no Databricks:</p>
          <p className="text-sm font-mono text-gray-800">
            <span className="text-blue-600">{form.destCatalog}</span>
            <span className="text-gray-400">.</span>
            <span className="text-green-600">{form.destSchema}</span>
            <span className="text-gray-400">.</span>
            <span className="text-gray-500">{(form.srcTable || 'tabela').toLowerCase()}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Delta table — gerenciada pelo Databricks Unity Catalog</p>
        </div>
      )}
    </div>
  );
}

function ManagedStep5({ form, set }: {
  form: FormData;
  set: (k: keyof FormData) => (e: React.ChangeEvent<any>) => void;
}) {
  return (
    <div className="space-y-5">
      <Grid>
        <Field label="Frequência" required>
          <select className={sel} value={form.scheduleType} onChange={set('scheduleType')}>
            <option value="hourly">A cada N horas</option>
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
            <option value="manual">Manual</option>
          </select>
        </Field>
        {form.scheduleType === 'hourly' && (
          <Field label="Intervalo (horas)">
            <input type="number" min="1" max="24" className={inp} value={form.scheduleInterval} onChange={set('scheduleInterval')} />
          </Field>
        )}
        {['daily', 'weekly', 'monthly'].includes(form.scheduleType) && (
          <Field label="Horário">
            <input type="time" className={inp} value={form.scheduleTime} onChange={set('scheduleTime')} />
          </Field>
        )}
        <Field label="Retries em caso de falha">
          <select className={sel} value={form.retryAttempts} onChange={set('retryAttempts')}>
            <option value="0">Sem retry</option>
            <option value="1">1 tentativa</option>
            <option value="2">2 tentativas</option>
            <option value="3">3 tentativas</option>
          </select>
        </Field>
      </Grid>

      <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
        <p className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-1.5">
          <Check size={14} /> Resumo da Ingestão
        </p>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-green-800">
          <dt className="text-green-600">Nome</dt>
          <dd className="font-medium">{form.name || '—'}</dd>
          <dt className="text-green-600">Time</dt>
          <dd className="font-medium">{form.team || '—'}</dd>
          <dt className="text-green-600">Carga</dt>
          <dd className="font-medium">{form.loadType === 'delta' ? 'Delta (Incremental)' : form.loadType === 'batch' ? 'Batch (Full Load)' : '—'}</dd>
          <dt className="text-green-600">Fonte</dt>
          <dd className="font-medium">{mockSources.find((s) => s.id === form.srcSourceId)?.name || '—'}</dd>
          <dt className="text-green-600">Objeto</dt>
          <dd className="font-mono text-xs">{form.srcSchema && form.srcTable ? `${form.srcSchema}.${form.srcTable}` : '—'}</dd>
          <dt className="text-green-600">Chave</dt>
          <dd className="font-mono text-xs">{form.tableKey || '—'}</dd>
          <dt className="text-green-600">Destino</dt>
          <dd className="font-mono text-xs">
            {form.destCatalog && form.destSchema ? `${form.destCatalog}.${form.destSchema}` : '—'}
          </dd>
          <dt className="text-green-600">Agendamento</dt>
          <dd className="font-medium">
            {form.scheduleType === 'daily' ? `Diário ${form.scheduleTime}`
              : form.scheduleType === 'hourly' ? `A cada ${form.scheduleInterval}h`
              : form.scheduleType}
          </dd>
        </dl>
      </div>
    </div>
  );
}

// ── Unmanaged steps ────────────────────────────────────────────────────────────

const UNMANAGED_OPTIONS: { type: UnmanagedType; title: string; desc: string }[] = [
  { type: 'api', title: 'API REST', desc: 'Consumo de endpoints HTTP/REST externos ou internos.' },
  { type: 'webscraping', title: 'Web Scraping', desc: 'Coleta automatizada de dados de páginas web.' },
  { type: 'other', title: 'Outras Fontes', desc: 'Qualquer outra fonte não mapeada acima (FTP, MQ, EDI, etc.).' },
];

function UnmanagedStep1({ form, set }: { form: FormData; set: (k: keyof FormData) => (e: React.ChangeEvent<any>) => void }) {
  return (
    <Grid>
      <Field label="Nome da Ingestão" required full>
        <input className={inp} value={form.name} onChange={set('name')} placeholder="Ex: API Receita Federal - CNPJ" />
      </Field>
      <Field label="Descrição" full>
        <textarea className={inp} rows={2} value={form.description} onChange={set('description')} placeholder="Objetivo e contexto desta ingestão" />
      </Field>
      <Field label="Responsável" required>
        <input className={inp} value={form.owner} onChange={set('owner')} placeholder="Nome do Engenheiro de Dados" />
      </Field>
      <Field label="Time / Domínio" required hint="Define o catálogo de destino no Databricks">
        <select className={sel} value={form.team} onChange={set('team')}>
          <option value="">Selecione o time</option>
          {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
    </Grid>
  );
}

function UnmanagedStep2({ form, setForm, set }: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  set: (k: keyof FormData) => (e: React.ChangeEvent<any>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Tipo <span className="text-red-500">*</span></p>
        <div className="space-y-2">
          {UNMANAGED_OPTIONS.map(({ type, title, desc }) => (
            <button key={type} type="button"
              onClick={() => setForm((f) => ({ ...f, unmanagedType: type }))}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${form.unmanagedType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${form.unmanagedType === type ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                {form.unmanagedType === type && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <div>
                <p className={`font-semibold text-sm ${form.unmanagedType === type ? 'text-blue-700' : 'text-gray-700'}`}>{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {(form.unmanagedType === 'api' || form.unmanagedType === 'webscraping') && (
        <Field label="URL da Fonte" hint="Pode usar {variavel} para parâmetros dinâmicos">
          <input className={inp} value={form.sourceUrl} onChange={set('sourceUrl')} placeholder="https://api.exemplo.com/v1/recurso" />
        </Field>
      )}

      <Field label="Observações / Documentação" full hint="Como a ingestão funciona, dependências, path do script, agendamento, etc.">
        <textarea className={inp} rows={4} value={form.notes} onChange={set('notes')}
          placeholder="Ex: Script em /Repos/time/projeto/notebook.py. Roda via Databricks Job agendado às 06:00." />
      </Field>
    </div>
  );
}

function UnmanagedStep3({ form, set, setForm }: {
  form: FormData;
  set: (k: keyof FormData) => (e: React.ChangeEvent<any>) => void;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const catalog = DATABRICKS_CATALOGS.find((c) => c.name === form.databricksCatalog);
  const schemas = catalog?.schemas ?? [];

  return (
    <div className="space-y-5">
      <div className="flex gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-700">
        <Info size={14} className="mt-0.5 shrink-0" />
        <span>Ao salvar, o sistema provisionará o acesso ao schema selecionado no Databricks Unity Catalog para o time responsável.</span>
      </div>

      <Grid>
        <Field label="Catálogo Databricks" required>
          <select className={sel} value={form.databricksCatalog}
            onChange={(e) => setForm((f) => ({ ...f, databricksCatalog: e.target.value, databricksSchema: '' }))}>
            <option value="">Selecione o catálogo</option>
            {DATABRICKS_CATALOGS.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Schema" required>
          <select className={sel} value={form.databricksSchema} onChange={set('databricksSchema')} disabled={!form.databricksCatalog}>
            <option value="">{form.databricksCatalog ? 'Selecione o schema' : 'Selecione o catálogo primeiro'}</option>
            {schemas.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
      </Grid>

      {form.databricksCatalog && form.databricksSchema && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ambiente que será utilizado</p>
          <p className="font-mono text-sm">
            <span className="text-blue-600">{form.databricksCatalog}</span>
            <span className="text-gray-400">.</span>
            <span className="text-green-600">{form.databricksSchema}</span>
          </p>
          <p className="text-xs text-gray-400">
            Permissão de leitura/escrita concedida ao time <strong className="text-gray-600">{form.team || '—'}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

function UnmanagedStep4({ form }: { form: FormData }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
        <p className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-1.5">
          <Check size={14} /> Resumo
        </p>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-green-800">
          <dt className="text-green-600">Nome</dt>
          <dd className="font-medium">{form.name || '—'}</dd>
          <dt className="text-green-600">Tipo</dt>
          <dd className="font-medium">Não Gerenciada</dd>
          <dt className="text-green-600">Modalidade</dt>
          <dd className="font-medium capitalize">{form.unmanagedType === 'api' ? 'API REST' : form.unmanagedType === 'webscraping' ? 'Web Scraping' : form.unmanagedType === 'other' ? 'Outras Fontes' : '—'}</dd>
          <dt className="text-green-600">Time</dt>
          <dd className="font-medium">{form.team || '—'}</dd>
          <dt className="text-green-600">Catálogo</dt>
          <dd className="font-mono text-xs">{form.databricksCatalog || '—'}</dd>
          <dt className="text-green-600">Schema</dt>
          <dd className="font-mono text-xs">{form.databricksSchema || '—'}</dd>
        </dl>
      </div>
      <InfoBox>
        Após salvar, o acesso ao schema <strong>{form.databricksCatalog}.{form.databricksSchema}</strong> será liberado para o time <strong>{form.team}</strong>.
      </InfoBox>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export function IngestionNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(initial);
  const [step, setStep] = useState(0);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<any>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const steps = form.ingestionMode === 'managed' ? MANAGED_STEPS : form.ingestionMode === 'unmanaged' ? UNMANAGED_STEPS : [];
  const maxStep = steps.length;

  const renderContent = () => {
    if (step === 0) {
      return (
        <div className="space-y-4">
          <ModeCard
            selected={form.ingestionMode === 'managed'}
            onClick={() => setForm((f) => ({ ...f, ingestionMode: 'managed' }))}
            icon={Database}
            title="Ingestão Gerenciada"
            subtitle="O sistema possui acesso direto à fonte e orquestra a ingestão via conectores gerenciados. Os dados são entregues como Delta table no Databricks."
            badges={['SQL Server → ADF', 'SAP → QLIK/DataVard', 'Oracle → ADF', 'Delta ou Batch']}
          />
          <ModeCard
            selected={form.ingestionMode === 'unmanaged'}
            onClick={() => setForm((f) => ({ ...f, ingestionMode: 'unmanaged' }))}
            icon={Globe}
            title="Ingestão Não Gerenciada"
            subtitle="A ingestão é de responsabilidade do time. A plataforma registra o controle e gerencia o acesso ao ambiente no Databricks."
            badges={['API REST', 'Web Scraping', 'Outras Fontes']}
          />
        </div>
      );
    }

    if (form.ingestionMode === 'managed') {
      switch (step) {
        case 1: return <ManagedStep1 form={form} set={set} />;
        case 2: return <ManagedStep2 form={form} setForm={setForm} />;
        case 3: return <ManagedStep3 form={form} set={set} setForm={setForm} />;
        case 4: return <ManagedStep4 form={form} set={set} setForm={setForm} />;
        case 5: return <ManagedStep5 form={form} set={set} />;
      }
    }

    if (form.ingestionMode === 'unmanaged') {
      switch (step) {
        case 1: return <UnmanagedStep1 form={form} set={set} />;
        case 2: return <UnmanagedStep2 form={form} setForm={setForm} set={set} />;
        case 3: return <UnmanagedStep3 form={form} set={set} setForm={setForm} />;
        case 4: return <UnmanagedStep4 form={form} />;
      }
    }
  };

  const stepTitle = step === 0 ? 'Tipo de Ingestão' : steps[step - 1]?.label;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button onClick={() => navigate('/ingestion')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ChevronLeft size={16} /> Voltar para lista
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nova Ingestão</h1>
        <p className="text-sm text-gray-500 mt-1">Configure uma nova ingestão no módulo de dados</p>
      </div>

      {step > 0 && form.ingestionMode && <StepIndicator steps={steps} current={step} />}

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-5">{stepTitle}</h2>
        {renderContent()}
      </div>

      <div className="flex justify-between">
        <button onClick={() => setStep((s) => s - 1)} disabled={step === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft size={16} /> Anterior
        </button>

        {step < maxStep || step === 0 ? (
          <button onClick={() => setStep((s) => s + 1)} disabled={step === 0 && !form.ingestionMode}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Próximo <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={() => navigate('/ingestion')}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            <Check size={16} /> Salvar Ingestão
          </button>
        )}
      </div>
    </div>
  );
}
