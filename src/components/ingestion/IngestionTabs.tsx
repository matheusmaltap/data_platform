import { NavLink } from 'react-router-dom';
import { Database, Server } from 'lucide-react';

const tabs = [
  { to: '/ingestion', label: 'Ingestões', icon: Database, end: true },
  { to: '/ingestion/sources', label: 'Fontes Gerenciadas', icon: Server, end: false },
];

export function IngestionTabs() {
  return (
    <div className="flex gap-1 border-b border-gray-200 mb-6">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              isActive
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`
          }
        >
          <Icon size={15} />
          {label}
        </NavLink>
      ))}
    </div>
  );
}
