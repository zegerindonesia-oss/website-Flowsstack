'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Settings as SettingsIcon,
  Link2,
  Key,
  Share2,
  Save,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  X,
  Globe,
  Sheet,
  Link as LinkIcon,
  Camera,
  Play,
  ThumbsUp,
  AtSign,
  Film,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface IntegrationSettings {
  googleDriveFolderId: string;
  googleSheetsId: string;
  webhookUrl: string;
}

interface ApiKeys {
  openai: string;
  gemini: string;
  openrouter: string;
  googleVeo: string;
  kling: string;
  runway: string;
  pika: string;
  elevenLabs: string;
  replicate: string;
}

interface SocialAccount {
  key: string;
  label: string;
  icon: React.ReactNode;
  token: string;
  connected: boolean;
}

type ToastData = { message: string; type: 'success' | 'error' } | null;

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const API_KEY_META: { key: keyof ApiKeys; label: string }[] = [
  { key: 'openai', label: 'OpenAI' },
  { key: 'gemini', label: 'Gemini' },
  { key: 'openrouter', label: 'OpenRouter' },
  { key: 'googleVeo', label: 'Google Veo' },
  { key: 'kling', label: 'Kling' },
  { key: 'runway', label: 'Runway' },
  { key: 'pika', label: 'Pika' },
  { key: 'elevenLabs', label: 'ElevenLabs' },
  { key: 'replicate', label: 'Replicate' },
];

const INITIAL_INTEGRATIONS: IntegrationSettings = {
  googleDriveFolderId: '',
  googleSheetsId: '',
  webhookUrl: '',
};

const INITIAL_API_KEYS: ApiKeys = {
  openai: '',
  gemini: '',
  openrouter: '',
  googleVeo: '',
  kling: '',
  runway: '',
  pika: '',
  elevenLabs: '',
  replicate: '',
};

/* ------------------------------------------------------------------ */
/*  Toast Component                                                    */
/* ------------------------------------------------------------------ */

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-[slideIn_0.3s_ease-out]">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border ${
          type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200'
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200'
        }`}
      >
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 shrink-0" />
        ) : (
          <X className="w-5 h-5 shrink-0" />
        )}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper – mask API key                                              */
/* ------------------------------------------------------------------ */

function maskKey(key: string): string {
  if (!key) return '';
  if (key.length <= 4) return '••••';
  return '•'.repeat(Math.min(key.length - 4, 24)) + key.slice(-4);
}

/* ------------------------------------------------------------------ */
/*  Copied tooltip                                                     */
/* ------------------------------------------------------------------ */

function useCopyToClipboard() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = useCallback((key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  return { copiedKey, copy };
}

/* ------------------------------------------------------------------ */
/*  Section Tab Button                                                 */
/* ------------------------------------------------------------------ */

type Section = 'integrations' | 'apikeys' | 'social';

const SECTION_META: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: 'integrations', label: 'Integrations', icon: <Link2 className="w-4 h-4" /> },
  { key: 'apikeys', label: 'API Keys', icon: <Key className="w-4 h-4" /> },
  { key: 'social', label: 'Social Accounts', icon: <Share2 className="w-4 h-4" /> },
];

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function SettingsPage() {
  const [section, setSection] = useState<Section>('integrations');
  const [toast, setToast] = useState<ToastData>(null);

  // Integration settings
  const [integrations, setIntegrations] = useState<IntegrationSettings>(INITIAL_INTEGRATIONS);

  // API keys
  const [apiKeys, setApiKeys] = useState<ApiKeys>(INITIAL_API_KEYS);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [editingKeys, setEditingKeys] = useState<Record<string, boolean>>({});
  const { copiedKey, copy } = useCopyToClipboard();

  // Social accounts
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    {
      key: 'instagram',
      label: 'Instagram',
      icon: <Camera className="w-5 h-5" />,
      token: '',
      connected: false,
    },
    {
      key: 'tiktok',
      label: 'TikTok',
      icon: <Film className="w-5 h-5" />,
      token: '',
      connected: false,
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: <ThumbsUp className="w-5 h-5" />,
      token: '',
      connected: false,
    },
    {
      key: 'threads',
      label: 'Threads',
      icon: <AtSign className="w-5 h-5" />,
      token: '',
      connected: false,
    },
    {
      key: 'youtube',
      label: 'YouTube',
      icon: <Play className="w-5 h-5" />,
      token: '',
      connected: false,
    },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedIntegrations = localStorage.getItem('fc_integrations');
      if (savedIntegrations) setIntegrations(JSON.parse(savedIntegrations));

      const savedApiKeys = localStorage.getItem('fc_api_keys');
      if (savedApiKeys) setApiKeys(JSON.parse(savedApiKeys));

      const savedSocial = localStorage.getItem('fc_social_accounts');
      if (savedSocial) setSocialAccounts(JSON.parse(savedSocial));

      // Also sync webhook URL to the shared key
      const savedWebhook = localStorage.getItem('fc_webhook_url');
      if (savedWebhook && !savedIntegrations) {
        setIntegrations((prev) => ({ ...prev, webhookUrl: savedWebhook }));
      }
    } catch {
      // ignore
    }
  }, []);

  const [saving, setSaving] = useState(false);

  const saveIntegrations = async () => {
    setSaving(true);
    try {
      localStorage.setItem('fc_integrations', JSON.stringify(integrations));
      // Also save webhook URL to the shared key used by other pages
      localStorage.setItem('fc_webhook_url', integrations.webhookUrl);
      setToast({ message: 'Integration settings saved!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to save settings.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const saveApiKeys = async () => {
    setSaving(true);
    try {
      localStorage.setItem('fc_api_keys', JSON.stringify(apiKeys));
      setToast({ message: 'API keys saved securely!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to save API keys.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const saveSocialAccounts = async () => {
    setSaving(true);
    try {
      const updated = socialAccounts.map((acc) => ({
        ...acc,
        connected: acc.token.trim().length > 0,
      }));
      setSocialAccounts(updated);
      localStorage.setItem('fc_social_accounts', JSON.stringify(updated));
      setToast({ message: 'Social credentials saved!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to save credentials.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const toggleKeyVisibility = (key: string) => {
    setVisibleKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleKeyEditing = (key: string) => {
    setEditingKeys((prev) => ({ ...prev, [key]: !prev[key] }));
    // When switching to edit mode, also make visible
    if (!editingKeys[key]) {
      setVisibleKeys((prev) => ({ ...prev, [key]: true }));
    }
  };

  const updateSocialToken = (key: string, token: string) => {
    setSocialAccounts((prev) =>
      prev.map((acc) => (acc.key === key ? { ...acc, token } : acc))
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Settings
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-1 ml-[52px]">
            Manage your integrations, API keys, and social accounts.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-6">
          {SECTION_META.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                section === s.key
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {s.icon}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/* Section 1: Integration Settings                              */}
        {/* ============================================================ */}
        {section === 'integrations' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-1">
              <Link2 className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Integration Settings
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Connect your Google Drive, Sheets, and n8n webhook.
            </p>

            <div className="space-y-5">
              {/* Google Drive Folder ID */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  Google Drive Folder ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1aBcDeFgHiJkLmNoPqRsTuVwXyZ"
                  value={integrations.googleDriveFolderId}
                  onChange={(e) =>
                    setIntegrations((prev) => ({ ...prev, googleDriveFolderId: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
                />
              </div>

              {/* Google Sheets ID */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <Sheet className="w-4 h-4 text-slate-400" />
                  Google Sheets ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1aBcDeFgHiJkLmNoPqRsTuVwXyZ"
                  value={integrations.googleSheetsId}
                  onChange={(e) =>
                    setIntegrations((prev) => ({ ...prev, googleSheetsId: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
                />
              </div>

              {/* n8n Webhook URL */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <LinkIcon className="w-4 h-4 text-slate-400" />
                  n8n Webhook URL
                </label>
                <input
                  type="url"
                  placeholder="https://your-n8n-instance.com/webhook/..."
                  value={integrations.webhookUrl}
                  onChange={(e) =>
                    setIntegrations((prev) => ({ ...prev, webhookUrl: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={saveIntegrations}
                disabled={saving}
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-orange-600 hover:to-red-600 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* Section 2: API Keys                                          */}
        {/* ============================================================ */}
        {section === 'apikeys' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-1">
              <Key className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">API Keys</h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Securely store your API keys. They are saved to your browser&apos;s local storage.
            </p>

            <div className="space-y-4">
              {API_KEY_META.map(({ key, label }) => {
                const isVisible = visibleKeys[key] || false;
                const isEditing = editingKeys[key] || false;
                const value = apiKeys[key];

                return (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      {label}
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type={isEditing ? 'text' : 'password'}
                          value={isEditing ? value : value ? maskKey(value) : ''}
                          onChange={(e) => {
                            if (isEditing) {
                              setApiKeys((prev) => ({ ...prev, [key]: e.target.value }));
                            }
                          }}
                          readOnly={!isEditing}
                          placeholder={isEditing ? `Enter your ${label} API key` : 'Not configured'}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono transition-all ${
                            isEditing
                              ? 'border-orange-300 dark:border-orange-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-default'
                          } placeholder:text-slate-400 placeholder:font-sans`}
                        />
                      </div>

                      {/* Toggle visibility */}
                      <button
                        onClick={() => toggleKeyVisibility(key)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title={isVisible ? 'Hide' : 'Show'}
                      >
                        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      {/* Copy */}
                      <button
                        onClick={() => copy(key, value)}
                        disabled={!value}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Copy"
                      >
                        {copiedKey === key ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      {/* Edit toggle */}
                      <button
                        onClick={() => toggleKeyEditing(key)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isEditing
                            ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isEditing ? 'Done' : 'Edit'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={saveApiKeys}
                disabled={saving}
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-orange-600 hover:to-red-600 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : 'Save API Keys'}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* Section 3: Social Accounts                                   */}
        {/* ============================================================ */}
        {section === 'social' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-1">
              <Share2 className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Social Accounts
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Add your social media credentials or API tokens for auto-publishing.
            </p>

            <div className="space-y-4">
              {socialAccounts.map((account) => (
                <div
                  key={account.key}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                >
                  {/* Platform info */}
                  <div className="flex items-center gap-3 sm:w-40 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                      {account.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {account.label}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            account.connected ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        />
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {account.connected ? 'Connected' : 'Not connected'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Token input */}
                  <div className="flex-1">
                    <input
                      type="password"
                      placeholder={`Enter ${account.label} API token or credentials`}
                      value={account.token}
                      onChange={(e) => updateSocialToken(account.key, e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={saveSocialAccounts}
                disabled={saving}
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-orange-600 hover:to-red-600 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : 'Save Credentials'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
