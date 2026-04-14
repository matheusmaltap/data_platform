import { NavLink } from 'react-router-dom';
import { Database, Search, ClipboardCheck, Settings, Package } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';

const navKeys = [
  { to: '/', icon: Search, labelKey: 'nav.discovery' },
  { to: '/access-requests', icon: ClipboardCheck, labelKey: 'nav.requests' },
  { to: '/ingestion', icon: Database, labelKey: 'nav.ingestion' },
  { to: '/products', icon: Package, labelKey: 'nav.products' },
  { to: '/settings', icon: Settings, labelKey: 'nav.settings' },
];

export function Sidebar() {
  const { t } = useI18n();

  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Database size={18} />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">{t('nav.appName')}</p>
            <p className="text-xs text-gray-400 leading-tight">v0.1.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navKeys.map(({ to, icon: Icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
            DE
          </div>
          <div>
            <p className="text-xs font-medium">{t('nav.dataEngineer')}</p>
            <p className="text-xs text-gray-400">data-eng@empresa.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
