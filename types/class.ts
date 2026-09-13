import type { ISODateString, UserId } from "./identity";

export type ClassStatus =
  | "active"
  | "archived";

export interface Class {
  id: string;
  name: string;
  code: string;
  gradeLevel: 10 | 11 | 12;
  academicYear: string;
  semester: 1 | 2;
  teacherId: UserId;
  status: ClassStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export type MembershipStatus =
  | "active"
  | "inactive";

export interface ClassMembership {
  id: string;
  classId: string;
  studentId: UserId;
  joinedAt: ISODateString;
  status: MembershipStatus;
}
