import { db } from '@/lib/db';
import { workspaces, workspaceMembers, workspaceInvitations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { CreateWorkspaceInput, UpdateWorkspaceInput, InviteMemberInput } from '@/lib/validations/workspace';

export const workspaceService = {
  async create(data: CreateWorkspaceInput, userId: string) {
    const [workspace] = await db.insert(workspaces).values({
      ...data,
      ownerId: userId,
    }).returning();

    await db.insert(workspaceMembers).values({
      workspaceId: workspace.id,
      userId,
      role: 'owner',
    });

    return workspace;
  },

  async getById(id: string) {
    return db.query.workspaces.findFirst({
      where: eq(workspaces.id, id),
    });
  },

  async getBySlug(slug: string) {
    return db.query.workspaces.findFirst({
      where: eq(workspaces.slug, slug),
    });
  },

  async getByUserId(userId: string) {
    const members = await db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.userId, userId),
      with: { workspace: true },
    });
    return members;
  },

  async update(id: string, data: UpdateWorkspaceInput) {
    const [updated] = await db.update(workspaces)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(workspaces.id, id))
      .returning();
    return updated;
  },

  async delete(id: string) {
    await db.delete(workspaces).where(eq(workspaces.id, id));
  },

  async getMembers(workspaceId: string) {
    return db.query.workspaceMembers.findMany({
      where: eq(workspaceMembers.workspaceId, workspaceId),
    });
  },

  async inviteMember(workspaceId: string, data: InviteMemberInput) {
    const token = nanoid(32);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const [invitation] = await db.insert(workspaceInvitations).values({
      workspaceId,
      email: data.email,
      role: data.role,
      token,
      expiresAt,
    }).returning();

    return invitation;
  },

  async removeMember(workspaceId: string, userId: string) {
    await db.delete(workspaceMembers).where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      )
    );
  },

  async getMemberRole(workspaceId: string, userId: string) {
    const member = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId)
      ),
    });
    return member?.role ?? null;
  },
};