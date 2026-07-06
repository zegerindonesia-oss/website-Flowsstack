import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, 'Nama workspace minimal 2 karakter').max(50),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan strip'),
  description: z.string().max(500).optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().max(500).optional(),
  logo: z.string().url().optional(),
  themeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  customDomain: z.string().optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email('Email tidak valid'),
  role: z.enum(['admin', 'instructor', 'student']),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;