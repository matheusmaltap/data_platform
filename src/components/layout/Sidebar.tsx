import { NavLink } from 'react-router-dom';
import { Database, Search, ClipboardCheck, Settings, GitMerge, Activity, Package } from 'lucide-react';

const navItems = [
  { to: '/', icon: Search, label: 'Discovery' },
  { to: '/access-requests', icon: ClipboardCheck, label: 'Solicitações' },
  { to: '/ingestion', icon: Database, label: 'Ingestão' },
  { to: '/products', icon: Package, label: 'Produtos' },
  { to: '/pipelines', icon: GitMerge, label: 'Pipelines', disabled: true },
  { to: '/monitoring', icon: Activity, label: 'Monitoramento', disabled: true },
  { to: '/settings', icon: Settings, label: 'Configurações', disabled: true },
];

export function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Database size={18} />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">Data Platform</p>
            <p className="text-xs text-gray-400 leading-tight">v0.1.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, disabled }) =>
          disabled ? (
            <div
              key={to}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 cursor-not-allowed text-sm"
            >
              <Icon size={18} />
              <span>{label}</span>
              <span className="ml-auto text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">Em breve</span>
            </div>
          ) : (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          )
        )}
      </nav>

      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
            DE
          </div>
          <div>
            <p className="text-xs font-medium">Data Engineer</p>
            <p className="text-xs text-gray-400">data-eng@empresa.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
