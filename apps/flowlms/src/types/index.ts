import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type { users, workspaces, workspaceMembers, courses, modules, lessons, enrollments, lessonProgress, certificates, plans, subscriptions } from '@/lib/db/schema';

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Workspace = InferSelectModel<typeof workspaces>;
export type NewWorkspace = InferInsertModel<typeof workspaces>;

export type WorkspaceMember = InferSelectModel<typeof workspaceMembers>;
export type NewWorkspaceMember = InferInsertModel<typeof workspaceMembers>;

export type Course = InferSelectModel<typeof courses>;
export type NewCourse = InferInsertModel<typeof courses>;

export type Module = InferSelectModel<typeof modules>;
export type NewModule = InferInsertModel<typeof modules>;

export type Lesson = InferSelectModel<typeof lessons>;
export type NewLesson = InferInsertModel<typeof lessons>;

export type Enrollment = InferSelectModel<typeof enrollments>;
export type NewEnrollment = InferInsertModel<typeof enrollments>;

export type LessonProgress = InferSelectModel<typeof lessonProgress>;

export type Certificate = InferSelectModel<typeof certificates>;

export type Plan = InferSelectModel<typeof plans>;
export type Subscription = InferSelectModel<typeof subscriptions>;

export type WorkspaceRole = 'owner' | 'admin' | 'instructor' | 'student';