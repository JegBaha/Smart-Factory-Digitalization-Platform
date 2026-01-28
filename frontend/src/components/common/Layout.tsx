import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Database,
  ClipboardList,
  BarChart3,
  Globe,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { path: '/predictions', labelKey: 'nav.predictions', icon: Target },
  { path: '/production', labelKey: 'nav.production', icon: Database },
  { path: '/orders', labelKey: 'nav.orders', icon: ClipboardList },
  { path: '/analytics', labelKey: 'nav.analytics', icon: BarChart3 },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary-600">AI Production</h1>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-gray-900">
            {t(navItems.find((item) => item.path === location.pathname)?.labelKey || 'nav.dashboard')}
          </h2>

          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'tr' | 'en')}
              className="bg-gray-100 border-0 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
