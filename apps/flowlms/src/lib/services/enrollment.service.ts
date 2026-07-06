import { db } from '@/lib/db';
import { enrollments, lessonProgress, lessons, modules } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';

export const enrollmentService = {
  async enroll(courseId: string, userId: string, workspaceId: string) {
    const existing = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.courseId, courseId),
        eq(enrollments.userId, userId)
      ),
    });

    if (existing) return existing;

    const [enrollment] = await db.insert(enrollments).values({
      courseId,
      userId,
      workspaceId,
    }).returning();

    return enrollment;
  },

  async getByUser(userId: string) {
    return db.query.enrollments.findMany({
      where: eq(enrollments.userId, userId),
    });
  },

  async getByCourse(courseId: string) {
    return db.query.enrollments.findMany({
      where: eq(enrollments.courseId, courseId),
    });
  },

  async markLessonComplete(enrollmentId: string, lessonId: string) {
    const existing = await db.query.lessonProgress.findFirst({
      where: and(
        eq(lessonProgress.enrollmentId, enrollmentId),
        eq(lessonProgress.lessonId, lessonId)
      ),
    });

    if (existing) {
      const [updated] = await db.update(lessonProgress)
        .set({ completed: true, completedAt: new Date() })
        .where(eq(lessonProgress.id, existing.id))
        .returning();
      return updated;
    }

    const [progress] = await db.insert(lessonProgress).values({
      enrollmentId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    }).returning();

    return progress;
  },

  async getProgress(enrollmentId: string) {
    return db.query.lessonProgress.findMany({
      where: eq(lessonProgress.enrollmentId, enrollmentId),
    });
  },

  async calculateCompletionRate(enrollmentId: string, courseId: string): Promise<number> {
    const courseModules = await db.query.modules.findMany({
      where: eq(modules.courseId, courseId),
    });

    let totalLessons = 0;
    for (const mod of courseModules) {
      const lessonCount = await db.select({ count: count() })
        .from(lessons)
        .where(eq(lessons.moduleId, mod.id));
      totalLessons += Number(lessonCount[0]?.count ?? 0);
    }

    if (totalLessons === 0) return 0;

    const completedLessons = await db.select({ count: count() })
      .from(lessonProgress)
      .where(and(
        eq(lessonProgress.enrollmentId, enrollmentId),
        eq(lessonProgress.completed, true)
      ));

    return Math.round((Number(completedLessons[0]?.count ?? 0) / totalLessons) * 100);
  },
};