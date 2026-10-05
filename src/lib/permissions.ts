export const roles = ["owner", "admin", "member"] as const;
export type Role = (typeof roles)[number];

const permissions = {
  "organization:update": ["owner", "admin"],
  "organization:delete": ["owner"],
  "member:remove": ["owner", "admin"],
  "member:invite": ["owner", "admin"],
  "member:update-role": ["owner"],
  "billing:manage": ["owner"],
  // Example feature: everyone can add projects, only owners and admins can delete them.
  "project:create": ["owner", "admin", "member"],
  "project:delete": ["owner", "admin"],
} satisfies Record<string, Role[]>;

export type Permission = keyof typeof permissions;

export function can(role: Role, permission: Permission) {
  return (permissions[permission] as Role[]).includes(role);
}

export function isRole(value: string): value is Role {
  return (roles as readonly string[]).includes(value);
}
