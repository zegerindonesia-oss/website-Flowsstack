export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  OWNER: 'owner',
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<Role, number> = {
  super_admin: 100,
  owner: 80,
  admin: 60,
  instructor: 40,
  student: 20,
};

export const PERMISSIONS = {
  WORKSPACE: {
    CREATE: ['super_admin', 'owner'] as Role[],
    READ: ['super_admin', 'owner', 'admin', 'instructor', 'student'] as Role[],
    UPDATE: ['super_admin', 'owner', 'admin'] as Role[],
    DELETE: ['super_admin', 'owner'] as Role[],
    MANAGE_TEAM: ['super_admin', 'owner', 'admin'] as Role[],
    MANAGE_BILLING: ['super_admin', 'owner'] as Role[],
  },
  COURSE: {
    CREATE: ['super_admin', 'owner', 'admin', 'instructor'] as Role[],
    READ: ['super_admin', 'owner', 'admin', 'instructor', 'student'] as Role[],
    UPDATE: ['super_admin', 'owner', 'admin', 'instructor'] as Role[],
    DELETE: ['super_admin', 'owner', 'admin'] as Role[],
    PUBLISH: ['super_admin', 'owner', 'admin'] as Role[],
  },
  STUDENT: {
    VIEW: ['super_admin', 'owner', 'admin', 'instructor'] as Role[],
    MANAGE: ['super_admin', 'owner', 'admin'] as Role[],
  },
  ANALYTICS: {
    VIEW: ['super_admin', 'owner', 'admin'] as Role[],
  },
} as const;

export const PLAN_LIMITS = {
  free: { maxCourses: 1, maxStudents: 50, maxWorkspaces: 1, maxStorageMB: 500, whiteLabel: false, customDomain: false },
  pro: { maxCourses: -1, maxStudents: -1, maxWorkspaces: 1, maxStorageMB: 10000, whiteLabel: false, customDomain: true },
  agency: { maxCourses: -1, maxStudents: -1, maxWorkspaces: 10, maxStorageMB: 50000, whiteLabel: true, customDomain: true },
  enterprise: { maxCourses: -1, maxStudents: -1, maxWorkspaces: -1, maxStorageMB: -1, whiteLabel: true, customDomain: true },
} as const;

export type PlanSlug = keyof typeof PLAN_LIMITS;

export function hasPermission(userRole: Role, allowedRoles: readonly Role[]): boolean {
  return allowedRoles.includes(userRole);
}

export function checkUsageLimit(currentUsage: number, limit: number): boolean {
  if (limit === -1) return true;
  return currentUsage < limit;
}