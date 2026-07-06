'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { workspaceService } from '@/lib/services/workspace.service';
import { CreateWorkspaceInput } from '@/lib/validations/workspace';
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

export async function createWorkspaceAction(data: CreateWorkspaceInput) {
  try {
    const userId = await getUserId();
    const workspace = await workspaceService.create(data, userId);
    revalidatePath('/workspaces');
    return { success: true, workspaceId: workspace.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create workspace' };
  }
}

export async function updateWorkspaceAction(id: string, data: Partial<CreateWorkspaceInput>) {
  try {
    await getUserId(); // ensure auth
    const workspace = await workspaceService.update(id, data);
    revalidatePath(`/workspaces/${id}`);
    revalidatePath(`/workspaces/${id}/settings`);
    return { success: true, workspace };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteWorkspaceAction(id: string) {
  try {
    await getUserId(); // ensure auth
    await workspaceService.delete(id);
    revalidatePath('/workspaces');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
