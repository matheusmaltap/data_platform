import { Settings as SettingsIcon, Globe, Sun, Moon, Monitor, Bell, BellRing, Info, Database } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { Language, LANGUAGE_LABELS, LANGUAGE_FLAGS } from '../i18n/translations';

export function Settings() {
  const { t, language, setLanguage } = useI18n();

  const languages: Language[] = ['pt', 'en', 'es'];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('settings.subtitle')}</p>
      </div>

      <div className="space-y-6">
        {/* Language */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Globe size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{t('settings.language')}</h2>
              <p className="text-xs text-gray-500">{t('settings.languageDesc')}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  language === lang
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{LANGUAGE_FLAGS[lang]}</span>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${language === lang ? 'text-blue-700' : 'text-gray-800'}`}>
                    {LANGUAGE_LABELS[lang]}
                  </p>
                  <p className="text-xs text-gray-400">{lang.toUpperCase()}</p>
                </div>
                {language === lang && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <Sun size={18} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{t('settings.theme')}</h2>
              <p className="text-xs text-gray-500">{t('settings.themeDesc')}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {([
              { key: 'light', label: t('settings.themeLight'), icon: Sun },
              { key: 'dark', label: t('settings.themeDark'), icon: Moon },
              { key: 'system', label: t('settings.themeSystem'), icon: Monitor },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  key === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon size={18} className={key === 'light' ? 'text-blue-600' : 'text-gray-400'} />
                <span className={`text-sm font-medium ${key === 'light' ? 'text-blue-700' : 'text-gray-700'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <Bell size={18} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{t('settings.notifications')}</h2>
              <p className="text-xs text-gray-500">{t('settings.notificationsDesc')}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellRing size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{t('settings.emailNotif')}</p>
                  <p className="text-xs text-gray-400">{t('settings.emailNotifDesc')}</p>
                </div>
              </div>
              <button className="relative w-11 h-6 rounded-full bg-blue-500 transition-colors">
                <span className="absolute left-[22px] top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" />
              </button>
            </div>
            <div className="border-t border-gray-100" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{t('settings.browserNotif')}</p>
                  <p className="text-xs text-gray-400">{t('settings.browserNotifDesc')}</p>
                </div>
              </div>
              <button className="relative w-11 h-6 rounded-full bg-gray-200 transition-colors">
                <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <Info size={18} className="text-gray-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{t('settings.about')}</h2>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{t('settings.version')}</span>
              <span className="font-mono text-gray-700">0.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{t('settings.builtWith')}</span>
              <span className="text-gray-700">React + TypeScript + Tailwind</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
