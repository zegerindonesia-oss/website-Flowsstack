'use client';

import { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  Video,
  Film,
  Monitor,
  Smartphone,
  Play,
  Globe,
  Clock,
  Hash,
  Calendar,
  Sparkles,
  Check,
  Loader2,
  AlertCircle,
  FolderOpen,
  X,
} from 'lucide-react';
import { triggerN8nWebhookFormData } from '@/lib/n8n';

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

interface WizardData {
  projectId: string;
  productImages: File[];
  aiModelImages: File[];
  contentType: string[]; // Changed to support multiple
  language: string;
  videoDuration: string;
  numberOfVideos: number;
  postingInterval: string;
  startTime: string;
  endTime: string;
}

const STEPS = [
  'Project & Product',
  'AI Model & Type',
  'Language & Duration',
  'Schedule',
  'Review & Generate',
] as const;

const CONTENT_TYPES = [
  { id: 'ugc', label: 'UGC', description: 'User-generated content style', icon: Video },
  { id: 'ads', label: 'Ads', description: 'Professional advertisements', icon: Monitor },
  { id: 'instagram-reel', label: 'Instagram Reel', description: 'Vertical 9:16 for IG', icon: Smartphone },
  { id: 'tiktok', label: 'TikTok', description: 'Vertical short-form video', icon: Play },
  { id: 'youtube-shorts', label: 'YouTube Shorts', description: 'Vertical short for YT', icon: Film },
  { id: 'facebook-reel', label: 'Facebook Reel', description: 'Vertical reel for FB', icon: Play },
] as const;

const LANGUAGES = [
  'Indonesian',
  'English',
  'Malay',
  'Thai',
  'Vietnamese',
  'Filipino',
  'Japanese',
  'Korean',
  'Chinese (Simplified)',
  'Hindi',
  'Arabic',
  'Spanish',
  'Portuguese',
  'French',
  'German',
];

const DURATIONS = [
  { value: '15', label: '15 seconds' },
  { value: '30', label: '30 seconds' },
  { value: '60', label: '60 seconds' },
  { value: '90', label: '90 seconds' },
];

const INTERVALS = [
  { value: '5', label: 'Every 5 minutes' },
  { value: '10', label: 'Every 10 minutes' },
  { value: '30', label: 'Every 30 minutes' },
  { value: '60', label: 'Every 1 hour' },
];

const DEMO_PROJECTS = [
  { id: '1', name: 'Summer Campaign' },
  { id: '2', name: 'Product Launch' },
  { id: '3', name: 'Brand Awareness' },
];

/* ------------------------------------------------------------------ */
/*  File Drop Zone                                                     */
/* ------------------------------------------------------------------ */

function FileDropZone({
  label,
  description,
  files,
  onFilesChange,
  accept,
  icon: Icon,
}: {
  label: string;
  description: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept: string;
  icon: React.ElementType;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onFilesChange([...files, ...droppedFiles]);
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    onFilesChange([...files, ...selectedFiles]);
    e.target.value = '';
  }

  function removeFile(index: number) {
    onFilesChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-200 ${
          isDragOver
            ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
            : 'border-slate-300 bg-slate-50 hover:border-orange-400 hover:bg-orange-50/50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-orange-600 dark:hover:bg-orange-950/10'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleSelect}
          className="hidden"
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-800">
          <Icon className="h-6 w-6 text-slate-400" />
        </div>
        <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
          Drop files here or{' '}
          <span className="text-orange-500">browse</span>
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          {description}
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-center gap-2 truncate">
                <ImageIcon className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate text-sm text-slate-700 dark:text-slate-300">
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-slate-400">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Factory Page                                                  */
/* ------------------------------------------------------------------ */

export default function FactoryPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [data, setData] = useState<WizardData>({
    projectId: '',
    productImages: [],
    aiModelImages: [],
    contentType: [],
    language: 'Indonesian',
    videoDuration: '30',
    numberOfVideos: 1,
    postingInterval: '10',
    startTime: '09:00',
    endTime: '17:00',
  });

  function updateData(partial: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function canProceed(): boolean {
    switch (currentStep) {
      case 0:
        return !!data.projectId;
      case 1:
        return data.contentType.length > 0;
      case 2:
        return !!data.language && !!data.videoDuration;
      case 3:
        return data.numberOfVideos > 0 && !!data.startTime && !!data.endTime;
      case 4:
        return true;
      default:
        return false;
    }
  }

  async function handleGenerate() {
    setIsGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Append Basic Data
      formData.append('projectId', data.projectId);
      formData.append('language', data.language);
      formData.append('videoDuration', data.videoDuration);
      formData.append('numberOfVideos', String(data.numberOfVideos));
      formData.append('postingInterval', data.postingInterval);
      formData.append('startTime', data.startTime);
      formData.append('endTime', data.endTime);
      formData.append('generatedAt', new Date().toISOString());

      // Append Arrays
      formData.append('contentTypes', JSON.stringify(data.contentType));

      // Append Files
      data.productImages.forEach((file, index) => {
        formData.append(`productImage_${index}`, file);
      });
      data.aiModelImages.forEach((file, index) => {
        formData.append(`aiModelImage_${index}`, file);
      });

      // Append Credentials from LocalStorage
      try {
        const savedApiKeys = localStorage.getItem('fc_api_keys');
        const savedSocial = localStorage.getItem('fc_social_accounts');
        if (savedApiKeys) formData.append('apiKeys', savedApiKeys);
        if (savedSocial) formData.append('socialAccounts', savedSocial);
      } catch (e) {
        // ignore storage errors
      }

      await triggerN8nWebhookFormData('generate-videos', formData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-950/30">
            <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-slate-900 dark:text-white">
            Campaign Submitted!
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your video generation campaign has been sent to the AI factory.
            You&apos;ll see progress on your dashboard.
          </p>
          <a
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:brightness-110"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Video Factory
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create and schedule AI-generated video campaigns
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {STEPS.map((stepName, i) => (
              <div key={stepName} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                      i < currentStep
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/25'
                        : i === currentStep
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 ring-4 ring-orange-500/20'
                          : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                    }`}
                  >
                    {i < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`mt-2 hidden text-center text-xs font-medium sm:block ${
                      i <= currentStep
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {stepName}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-2 hidden h-0.5 flex-1 rounded-full sm:block ${
                      i < currentStep
                        ? 'bg-gradient-to-r from-orange-500 to-red-500'
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          {/* Mobile step label */}
          <p className="mt-3 text-center text-xs font-medium text-slate-500 sm:hidden dark:text-slate-400">
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
          </p>
        </div>

        {/* Step Content */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          {/* Step 1: Project & Product */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Select Project & Upload Products
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Choose a project and add product images for AI processing
                </p>
              </div>

              {/* Project Select */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Project <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FolderOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={data.projectId}
                    onChange={(e) => updateData({ projectId: e.target.value })}
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-orange-500"
                  >
                    <option value="">Select a project...</option>
                    {DEMO_PROJECTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Image Upload */}
              <FileDropZone
                label="Product Images"
                description="PNG, JPG, WEBP up to 10MB each"
                files={data.productImages}
                onFilesChange={(files) => updateData({ productImages: files })}
                accept="image/*"
                icon={Upload}
              />
            </div>
          )}

          {/* Step 2: AI Model & Content Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  AI Model & Content Types
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Upload AI model images and select one or more content formats for bulk generation
                </p>
              </div>

              {/* AI Model Upload */}
              <FileDropZone
                label="AI Model Images"
                description="Upload face/body images for AI model generation"
                files={data.aiModelImages}
                onFilesChange={(files) =>
                  updateData({ aiModelImages: files })
                }
                accept="image/*"
                icon={ImageIcon}
              />

              {/* Content Type Radio Cards */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Content Types <span className="text-red-500">*</span> (You can select multiple)
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {CONTENT_TYPES.map((type) => {
                    const isSelected = data.contentType.includes(type.id);
                    const TypeIcon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => {
                          const newTypes = isSelected 
                            ? data.contentType.filter(t => t !== type.id)
                            : [...data.contentType, type.id];
                          updateData({ contentType: newTypes });
                        }}
                        className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-500/10 dark:bg-orange-950/20'
                            : 'border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-orange-600/50'
                        }`}
                      >
                        <TypeIcon
                          className={`h-6 w-6 ${
                            isSelected
                              ? 'text-orange-500'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            isSelected
                              ? 'text-orange-700 dark:text-orange-400'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {type.label}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {type.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Language & Duration */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Language & Duration
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Set the language and duration for your video content
                </p>
              </div>

              {/* Language */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Language <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={data.language}
                    onChange={(e) => updateData({ language: e.target.value })}
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-orange-500"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Video Duration <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {DURATIONS.map((d) => {
                    const isSelected = data.videoDuration === d.value;
                    return (
                      <button
                        key={d.value}
                        onClick={() =>
                          updateData({ videoDuration: d.value })
                        }
                        className={`flex flex-col items-center gap-1 rounded-xl border-2 px-4 py-3 transition-all duration-200 ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-500/10 dark:bg-orange-950/20'
                            : 'border-slate-200 bg-white hover:border-orange-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-orange-600/50'
                        }`}
                      >
                        <span
                          className={`text-xl font-bold ${
                            isSelected
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {d.value}s
                        </span>
                        <span className="text-xs text-slate-400">
                          {d.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Schedule */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Schedule & Volume
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Configure how many videos to generate and posting schedule
                </p>
              </div>

              {/* Number of Videos */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Number of Videos <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={data.numberOfVideos}
                    onChange={(e) =>
                      updateData({
                        numberOfVideos: Math.max(
                          1,
                          parseInt(e.target.value) || 1
                        ),
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Posting Interval */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Posting Interval
                </label>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={data.postingInterval}
                    onChange={(e) =>
                      updateData({ postingInterval: e.target.value })
                    }
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-orange-500"
                  >
                    {INTERVALS.map((interval) => (
                      <option key={interval.value} value={interval.value}>
                        {interval.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="time"
                      value={data.startTime}
                      onChange={(e) =>
                        updateData({ startTime: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="time"
                      value={data.endTime}
                      onChange={(e) =>
                        updateData({ endTime: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Generate */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Review & Generate
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Confirm your campaign details before generating
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-3">
                <SummaryRow
                  label="Project"
                  value={
                    DEMO_PROJECTS.find((p) => p.id === data.projectId)
                      ?.name || '—'
                  }
                />
                <SummaryRow
                  label="Product Images"
                  value={`${data.productImages.length} file(s)`}
                />
                <SummaryRow
                  label="AI Model Images"
                  value={`${data.aiModelImages.length} file(s)`}
                />
                <SummaryRow
                  label="Content Types"
                  value={
                    data.contentType.map((id) => CONTENT_TYPES.find(t => t.id === id)?.label).join(', ') || '—'
                  }
                />
                <SummaryRow label="Language" value={data.language} />
                <SummaryRow
                  label="Video Duration"
                  value={`${data.videoDuration} seconds`}
                />
                <SummaryRow
                  label="Number of Videos"
                  value={String(data.numberOfVideos)}
                />
                <SummaryRow
                  label="Posting Interval"
                  value={
                    INTERVALS.find((i) => i.value === data.postingInterval)
                      ?.label || '—'
                  }
                />
                <SummaryRow
                  label="Time Window"
                  value={`${data.startTime} — ${data.endTime}`}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-orange-500/30 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    GENERATE {data.numberOfVideos} VIDEO
                    {data.numberOfVideos > 1 ? 'S' : ''}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          {currentStep < STEPS.length - 1 && (
            <button
              onClick={() =>
                setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1))
              }
              disabled={!canProceed()}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Summary Row                                                        */
/* ------------------------------------------------------------------ */

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}
