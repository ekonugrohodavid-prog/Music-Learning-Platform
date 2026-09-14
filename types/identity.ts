export type UserId = string;

export type ActivityId = string;

export type CompetencyId = string;

export type CompositionId = string;

export type ISODateString = string;

export type RoleCode =
  | "guest"
  | "student"
  | "teacher"
  | "admin";

export interface Role {
  id: string;
  code: RoleCode;
  name: string;
  description?: string;
}

export interface UserProfile {
  id: UserId;
  role: RoleCode;
  displayName: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
