'use server';

import { revalidatePath } from 'next/cache';
import { courseService } from '@/lib/services/course.service';
import { CreateCourseInput, CreateModuleInput, CreateLessonInput } from '@/lib/validations/course';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

async function getUserId() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
}

export async function createCourseAction(workspaceId: string, data: CreateCourseInput) {
  try {
    await getUserId();
    const course = await courseService.create(workspaceId, data);
    revalidatePath(`/workspaces/${workspaceId}/courses`);
    return { success: true, courseId: course.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create course' };
  }
}

export async function updateCourseAction(workspaceId: string, courseId: string, data: Partial<CreateCourseInput>) {
  try {
    await getUserId();
    const course = await courseService.update(courseId, data);
    revalidatePath(`/workspaces/${workspaceId}/courses`);
    revalidatePath(`/workspaces/${workspaceId}/courses/${courseId}/edit`);
    return { success: true, course };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCourseAction(workspaceId: string, courseId: string) {
  try {
    await getUserId();
    await courseService.delete(courseId);
    revalidatePath(`/workspaces/${workspaceId}/courses`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createModuleAction(courseId: string, data: CreateModuleInput) {
  try {
    await getUserId();
    const mod = await courseService.createModule(courseId, data);
    // Note: Revalidation should be handled by the caller or we can pass workspaceId to revalidate
    return { success: true, module: mod };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createLessonAction(moduleId: string, data: CreateLessonInput) {
  try {
    await getUserId();
    const lesson = await courseService.createLesson(moduleId, data);
    return { success: true, lesson };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
