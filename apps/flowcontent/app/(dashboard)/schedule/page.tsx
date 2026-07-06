'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  Calendar,
  Hash,
  BarChart3,
  Save,
  Check,
  X,
} from 'lucide-react';

type Interval = 5 | 10 | 30 | 60;

interface ScheduleConfig {
  interval: Interval;
  startTime: string;
  endTime: string;
  videosPerDay: number;
}

const INTERVALS: { value: Interval; label: string }[] = [
  { value: 5, label: 'Every 5 Min' },
  { value: 10, label: 'Every 10 Min' },
  { value: 30, label: 'Every 30 Min' },
  { value: 60, label: 'Every 1 Hour' },
];

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
          <Check className="w-5 h-5 shrink-0" />
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

function calculateMaxVideos(startTime: string, endTime: string, intervalMinutes: number): number {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  if (endMinutes <= startMinutes) return 0;
  return Math.floor((endMinutes - startMinutes) / intervalMinutes);
}

export default function SchedulePage() {
  const [config, setConfig] = useState<ScheduleConfig>({
    interval: 30,
    startTime: '08:00',
    endTime: '22:00',
    videosPerDay: 28,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fc_schedule');
      if (saved) {
        const parsed = JSON.parse(saved) as ScheduleConfig;
        setConfig(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const maxVideos = calculateMaxVideos(config.startTime, config.endTime, config.interval);

  const updateConfig = useCallback((partial: Partial<ScheduleConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      // Auto-adjust videosPerDay if it exceeds max
      const max = calculateMaxVideos(next.startTime, next.endTime, next.interval);
      if (next.videosPerDay > max) {
        next.videosPerDay = max;
      }
      return next;
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('fc_schedule', JSON.stringify(config));

      const webhookUrl = localStorage.getItem('fc_webhook_url');
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save_schedule', data: config }),
        });
      }

      setToast({ message: 'Schedule saved successfully!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to save schedule. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Schedule
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-1 ml-[52px]">
            Configure when and how often your videos are published.
          </p>
        </div>

        <div className="space-y-5">
          {/* Card 1 — Posting Interval */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <Clock className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Posting Interval</h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              How often should a new video be posted?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {INTERVALS.map((item) => (
                <button
                  key={item.value}
                  onClick={() => updateConfig({ interval: item.value })}
                  className={`relative px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border-2 cursor-pointer ${
                    config.interval === item.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-500 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                  {config.interval === item.value && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Card 2 — Posting Window */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <Clock className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Posting Window</h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Set the daily time range for publishing videos.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={config.startTime}
                  onChange={(e) => updateConfig({ startTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={config.endTime}
                  onChange={(e) => updateConfig({ endTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 3 — Videos Per Day */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <Hash className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Videos Per Day</h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Maximum number of videos to publish daily (max {maxVideos} with current settings).
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={maxVideos}
                value={config.videosPerDay}
                onChange={(e) => updateConfig({ videosPerDay: Number(e.target.value) })}
                className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-orange-500 cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={maxVideos}
                  value={config.videosPerDay}
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value), maxVideos);
                    updateConfig({ videosPerDay: Math.max(0, val) });
                  }}
                  className="w-20 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">/day</span>
              </div>
            </div>
          </div>

          {/* Card 4 — Summary */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200 dark:border-orange-900/50 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Schedule Summary</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/70 dark:bg-slate-900/50 rounded-xl px-4 py-3.5 text-center">
                <p className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">
                  {config.videosPerDay}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  videos / day
                </p>
              </div>
              <div className="bg-white/70 dark:bg-slate-900/50 rounded-xl px-4 py-3.5 text-center">
                <p className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">
                  {config.startTime} – {config.endTime}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  posting window
                </p>
              </div>
              <div className="bg-white/70 dark:bg-slate-900/50 rounded-xl px-4 py-3.5 text-center">
                <p className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">
                  {config.interval}m
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  interval
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 text-center">
              <span className="font-semibold">{config.videosPerDay} videos/day</span> from{' '}
              <span className="font-semibold">{config.startTime}</span> to{' '}
              <span className="font-semibold">{config.endTime}</span>, every{' '}
              <span className="font-semibold">
                {config.interval >= 60
                  ? `${config.interval / 60} hour`
                  : `${config.interval} minutes`}
              </span>
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2.5 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-orange-600 hover:to-red-600 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving…' : 'Save Schedule'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
