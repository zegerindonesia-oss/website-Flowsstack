import { db } from '@/lib/db';
import { certificates, certificateTemplates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const certificateService = {
  async generate(enrollmentId: string, studentName: string, courseName: string, templateId?: string) {
    const certificateNumber = `FLMS-${Date.now()}-${nanoid(6).toUpperCase()}`;

    const [cert] = await db.insert(certificates).values({
      enrollmentId,
      templateId: templateId ?? null,
      certificateNumber,
      studentName,
      courseName,
    }).returning();

    return cert;
  },

  async getByEnrollment(enrollmentId: string) {
    return db.query.certificates.findFirst({
      where: eq(certificates.enrollmentId, enrollmentId),
    });
  },

  async getTemplates(workspaceId: string) {
    return db.query.certificateTemplates.findMany({
      where: eq(certificateTemplates.workspaceId, workspaceId),
    });
  },

  async createTemplate(workspaceId: string, name: string, design: Record<string, unknown>) {
    const [template] = await db.insert(certificateTemplates).values({
      workspaceId,
      name,
      design,
    }).returning();
    return template;
  },
};