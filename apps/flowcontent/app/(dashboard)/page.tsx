'use client';

import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import {
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  HardDrive,
  Zap,
  Rocket,
  Activity,
} from 'lucide-react';

const stats = [
  {
    label: "Today's Generated Videos",
    value: '0',
    icon: Video,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-100 dark:border-orange-900/40',
  },
  {
    label: 'Scheduled Videos',
    value: '0',
    icon: Clock,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-100 dark:border-blue-900/40',
  },
  {
    label: 'Published Videos',
    value: '0',
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-100 dark:border-green-900/40',
  },
  {
    label: 'Failed Jobs',
    value: '0',
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-100 dark:border-red-900/40',
  },
  {
    label: 'Google Drive Storage',
    value: '0 GB',
    icon: HardDrive,
    color: 'text-slate-500',
    bg: 'bg-slate-50 dark:bg-slate-800/30',
    border: 'border-slate-100 dark:border-slate-700/40',
  },
  {
    label: 'Token Usage',
    value: '0 / 10,000',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-100 dark:border-amber-900/40',
  },
] as const;

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function DashboardPage() {
  const { user } = useAuth();
  const today = new Date();

  return (
    <div className="mx-auto max-w-7xl">
      <div>
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {user?.displayName || 'Creator'} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {formatDate(today)}
          </p>
        </div>

        {/* Stat Cards Grid */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:bg-slate-900 ${stat.border}`}
              >
                <div className="flex items-start gap-4 p-5">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}
                  >
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Action */}
        <div className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
            Quick Action
          </h2>
          <Link
            href="/factory"
            className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-orange-500/30 hover:brightness-110 active:scale-[0.98]"
          >
            <Rocket className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
            START CAMPAIGN
          </Link>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
            Recent Activity
          </h2>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <Activity className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              No activity yet
            </h3>
            <p className="mt-1 max-w-sm text-center text-sm text-slate-500 dark:text-slate-400">
              Your recent video generations, scheduled posts, and campaign
              activity will appear here. Start a campaign to get going!
            </p>
            <Link
              href="/factory"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Rocket className="h-4 w-4" />
              Create your first campaign
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
