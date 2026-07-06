'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  ExternalLink,
  Clock,
  Video,
  ChevronDown,
  Inbox,
  History as HistoryIcon,
} from 'lucide-react';

type Status = 'Published' | 'Failed' | 'Pending' | 'Processing';
type FilterStatus = 'All' | Status;

interface HistoryItem {
  id: string;
  name: string;
  status: Status;
  createdAt: string;
  publishedAt: string | null;
}

const STATUS_CONFIG: Record<Status, { bg: string; text: string; dot: string }> = {
  Published: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  Failed: {
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
  },
  Pending: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  Processing: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
};

const MOCK_DATA: HistoryItem[] = [
  {
    id: '1',
    name: '10 AI Tools You Must Try in 2026',
    status: 'Published',
    createdAt: '2026-06-26T08:30:00Z',
    publishedAt: '2026-06-26T09:00:00Z',
  },
  {
    id: '2',
    name: 'How to Build a SaaS in 48 Hours',
    status: 'Published',
    createdAt: '2026-06-25T14:00:00Z',
    publishedAt: '2026-06-25T15:30:00Z',
  },
  {
    id: '3',
    name: 'The Future of No-Code Automation',
    status: 'Failed',
    createdAt: '2026-06-25T10:00:00Z',
    publishedAt: null,
  },
  {
    id: '4',
    name: 'Why Every Creator Needs n8n',
    status: 'Pending',
    createdAt: '2026-06-27T00:15:00Z',
    publishedAt: null,
  },
  {
    id: '5',
    name: 'Mastering Short-Form Video Content',
    status: 'Processing',
    createdAt: '2026-06-26T22:00:00Z',
    publishedAt: null,
  },
];

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '–';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('All');
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_DATA.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || item.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const handleRetry = (id: string) => {
    alert(`Retrying video ${id}…`);
  };

  const handleView = (id: string) => {
    alert(`Viewing video ${id}…`);
  };

  const filters: FilterStatus[] = ['All', 'Published', 'Failed', 'Pending', 'Processing'];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <HistoryIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              History
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-1 ml-[52px]">
            Track the status of all your generated and published videos.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search videos…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Filter className="w-4 h-4" />
              {filter}
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-20 py-1.5 overflow-hidden">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                      filter === f
                        ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </p>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Inbox className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              No videos found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {search || filter !== 'All'
                ? 'Try adjusting your search or filter criteria.'
                : 'Your video history will appear here once you start publishing.'}
            </p>
          </div>
        )}

        {/* Desktop Table */}
        {filtered.length > 0 && (
          <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3.5">
                    Video
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3.5">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3.5">
                    Created
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3.5">
                    Published
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-5 py-3.5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <Video className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[240px]">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(item.createdAt)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(item.publishedAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === 'Failed' && (
                          <button
                            onClick={() => handleRetry(item.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Retry
                          </button>
                        )}
                        {item.status === 'Published' && (
                          <button
                            onClick={() => handleView(item.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {filtered.length > 0 && (
          <div className="md:hidden space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h3>
                    <div className="mt-1.5">
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 px-1">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Created {formatDate(item.createdAt)}</span>
                  </div>
                </div>
                {item.publishedAt && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 px-1">
                    Published {formatDate(item.publishedAt)}
                  </p>
                )}
                <div className="flex gap-2">
                  {item.status === 'Failed' && (
                    <button
                      onClick={() => handleRetry(item.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Retry
                    </button>
                  )}
                  {item.status === 'Published' && (
                    <button
                      onClick={() => handleView(item.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
