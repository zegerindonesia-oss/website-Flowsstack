import { db } from '@/lib/db';
import { courses, modules, lessons } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import type { CreateCourseInput, UpdateCourseInput, CreateModuleInput, CreateLessonInput } from '@/lib/validations/course';

export const courseService = {
  async create(workspaceId: string, data: CreateCourseInput) {
    const [course] = await db.insert(courses).values({
      ...data,
      workspaceId,
    }).returning();
    return course;
  },

  async getById(id: string) {
    return db.query.courses.findFirst({
      where: eq(courses.id, id),
    });
  },

  async getByWorkspace(workspaceId: string) {
    return db.query.courses.findMany({
      where: eq(courses.workspaceId, workspaceId),
      orderBy: [asc(courses.createdAt)],
    });
  },

  async update(id: string, data: UpdateCourseInput) {
    const [updated] = await db.update(courses)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updated;
  },

  async delete(id: string) {
    await db.delete(courses).where(eq(courses.id, id));
  },

  async createModule(courseId: string, data: CreateModuleInput) {
    const [mod] = await db.insert(modules).values({
      ...data,
      courseId,
    }).returning();
    return mod;
  },

  async getModules(courseId: string) {
    return db.query.modules.findMany({
      where: eq(modules.courseId, courseId),
      orderBy: [asc(modules.position)],
    });
  },

  async createLesson(moduleId: string, data: CreateLessonInput) {
    const [lesson] = await db.insert(lessons).values({
      ...data,
      moduleId,
    }).returning();
    return lesson;
  },

  async getLessons(moduleId: string) {
    return db.query.lessons.findMany({
      where: eq(lessons.moduleId, moduleId),
      orderBy: [asc(lessons.position)],
    });
  },

  async getFullCourse(courseId: string) {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!course) return null;

    const courseModules = await db.query.modules.findMany({
      where: eq(modules.courseId, courseId),
      orderBy: [asc(modules.position)],
    });

    const modulesWithLessons = await Promise.all(
      courseModules.map(async (mod) => {
        const modLessons = await db.query.lessons.findMany({
          where: eq(lessons.moduleId, mod.id),
          orderBy: [asc(lessons.position)],
        });
        return { ...mod, lessons: modLessons };
      })
    );

    return { ...course, modules: modulesWithLessons };
  },
};