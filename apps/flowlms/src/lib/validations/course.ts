import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(3, 'Judul kursus minimal 3 karakter').max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional(),
  categoryId: z.string().optional(),
  thumbnail: z.string().url().optional(),
});

export const updateCourseSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(2000).optional(),
  thumbnail: z.string().url().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  categoryId: z.string().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
});

export const createModuleSchema = z.object({
  title: z.string().min(1, 'Judul modul wajib diisi').max(200),
  description: z.string().max(500).optional(),
  position: z.number().int().min(0).optional(),
});

export const createLessonSchema = z.object({
  title: z.string().min(1, 'Judul lesson wajib diisi').max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(['video', 'text', 'pdf', 'download']),
  videoProvider: z.enum(['youtube', 'vimeo', 'loom', 'bunny', 'cloudflare']).optional(),
  videoUrl: z.string().url().optional(),
  content: z.string().optional(),
  position: z.number().int().min(0).optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CreateModuleInput = z.infer<typeof createModuleSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;