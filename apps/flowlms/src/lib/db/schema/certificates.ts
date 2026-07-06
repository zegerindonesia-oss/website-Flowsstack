import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';
import { enrollments } from './enrollments';
import { workspaces } from './workspaces';

export const certificateTemplates = sqliteTable('certificate_templates', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  design: text('design', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const certificates = sqliteTable('certificates', {
  id: text('id').primaryKey().$defaultFn(() => nanoid()),
  enrollmentId: text('enrollment_id').notNull().references(() => enrollments.id, { onDelete: 'cascade' }),
  templateId: text('template_id').references(() => certificateTemplates.id, { onDelete: 'set null' }),
  certificateNumber: text('certificate_number').notNull().unique(),
  studentName: text('student_name').notNull(),
  courseName: text('course_name').notNull(),
  issuedAt: integer('issued_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});