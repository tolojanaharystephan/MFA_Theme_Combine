import { randomUUID } from "node:crypto";
import {
  date,
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/mysql-core";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

const id = (name = "id") => varchar(name, { length: 36 }).primaryKey().$defaultFn(randomUUID);
const createdAt = timestamp("created_at").defaultNow().notNull();
const updatedAt = timestamp("updated_at").defaultNow().onUpdateNow().notNull();

export const roles = mysqlTable("roles", {
  id: id(),
  name: varchar("name", { length: 80 }).notNull().unique(),
  description: text("description"),
  createdAt,
  updatedAt
});

export const permissions = mysqlTable("permissions", {
  id: id(),
  key: varchar("key", { length: 120 }).notNull().unique(),
  description: text("description")
});

export const rolePermissions = mysqlTable(
  "role_permissions",
  {
    roleId: varchar("role_id", { length: 36 }).notNull().references(() => roles.id, { onDelete: "cascade" }),
    permissionId: varchar("permission_id", { length: 36 }).notNull().references(() => permissions.id, {
      onDelete: "cascade"
    })
  },
  (table) => ({
    pk: primaryKey({ columns: [table.roleId, table.permissionId] })
  })
);

export const users = mysqlTable(
  "users",
  {
    id: id(),
    email: varchar("email", { length: 160 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    fullName: varchar("full_name", { length: 160 }).notNull(),
    roleId: varchar("role_id", { length: 36 }).notNull().references(() => roles.id),
    status: mysqlEnum("status", ["ACTIVE", "DISABLED", "LOCKED"]).default("ACTIVE").notNull(),
    lastLoginAt: timestamp("last_login_at"),
    createdAt,
    updatedAt
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.roleId)
  })
);

export const refreshTokens = mysqlTable("refresh_tokens", {
  id: id(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
  createdAt
});

export const grades = mysqlTable("grades", {
  id: id(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  rankOrder: int("rank_order").notNull(),
  category: varchar("category", { length: 80 })
});

export const units = mysqlTable(
  "units",
  {
    id: id(),
    name: varchar("name", { length: 160 }).notNull(),
    code: varchar("code", { length: 50 }).notNull(),
    type: varchar("type", { length: 80 }).notNull(),
    location: varchar("location", { length: 160 }),
    parentUnitId: varchar("parent_unit_id", { length: 36 }),
    status: varchar("status", { length: 30 }).default("ACTIVE").notNull(),
    createdAt,
    updatedAt
  },
  (table) => ({
    codeIdx: uniqueIndex("units_code_idx").on(table.code),
    parentIdx: index("units_parent_idx").on(table.parentUnitId)
  })
);

export const militaryPersonnel = mysqlTable(
  "military_personnel",
  {
    id: id(),
    serviceNumber: varchar("service_number", { length: 80 }).notNull(),
    firstName: varchar("first_name", { length: 120 }).notNull(),
    lastName: varchar("last_name", { length: 120 }).notNull(),
    gender: varchar("gender", { length: 20 }).notNull(),
    birthDate: date("birth_date"),
    gradeId: varchar("grade_id", { length: 36 }).notNull().references(() => grades.id),
    unitId: varchar("unit_id", { length: 36 }).notNull().references(() => units.id),
    availabilityStatus: mysqlEnum("availability_status", [
      "AVAILABLE",
      "ASSIGNED",
      "ON_LEAVE",
      "TRAINING",
      "UNAVAILABLE"
    ]).default("AVAILABLE").notNull(),
    healthStatus: varchar("health_status", { length: 40 }),
    enlistmentDate: date("enlistment_date"),
    archivedAt: timestamp("archived_at"),
    createdAt,
    updatedAt
  },
  (table) => ({
    serviceNumberIdx: uniqueIndex("personnel_service_number_idx").on(table.serviceNumber),
    gradeIdx: index("personnel_grade_idx").on(table.gradeId),
    unitIdx: index("personnel_unit_idx").on(table.unitId),
    availabilityIdx: index("personnel_availability_idx").on(table.availabilityStatus)
  })
);

export const skills = mysqlTable("skills", {
  id: id(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  category: varchar("category", { length: 80 }),
  description: text("description")
});

export const personnelSkills = mysqlTable(
  "personnel_skills",
  {
    personnelId: varchar("personnel_id", { length: 36 }).notNull().references(() => militaryPersonnel.id, {
      onDelete: "cascade"
    }),
    skillId: varchar("skill_id", { length: 36 }).notNull().references(() => skills.id, { onDelete: "cascade" }),
    level: int("level").notNull(),
    certifiedAt: date("certified_at")
  },
  (table) => ({
    pk: primaryKey({ columns: [table.personnelId, table.skillId] })
  })
);

export const assignments = mysqlTable("assignments", {
  id: id(),
  personnelId: varchar("personnel_id", { length: 36 }).notNull().references(() => militaryPersonnel.id),
  unitId: varchar("unit_id", { length: 36 }).notNull().references(() => units.id),
  roleTitle: varchar("role_title", { length: 120 }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  reason: text("reason")
});

export const operations = mysqlTable(
  "operations",
  {
    id: id(),
    code: varchar("code", { length: 80 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    objective: text("objective").notNull(),
    priority: mysqlEnum("priority", ["LOW", "MEDIUM", "HIGH", "CRITICAL"]).notNull(),
    area: varchar("area", { length: 160 }),
    status: mysqlEnum("status", ["PLANNED", "IN_PROGRESS", "SUSPENDED", "COMPLETED", "CANCELLED"])
      .default("PLANNED")
      .notNull(),
    startDate: date("start_date"),
    endDate: date("end_date"),
    createdById: varchar("created_by_id", { length: 36 }).notNull().references(() => users.id),
    createdAt,
    updatedAt
  },
  (table) => ({
    codeIdx: uniqueIndex("operations_code_idx").on(table.code),
    statusIdx: index("operations_status_idx").on(table.status),
    priorityIdx: index("operations_priority_idx").on(table.priority)
  })
);

export const missions = mysqlTable(
  "missions",
  {
    id: id(),
    operationId: varchar("operation_id", { length: 36 }).notNull().references(() => operations.id, {
      onDelete: "cascade"
    }),
    title: varchar("title", { length: 180 }).notNull(),
    description: text("description"),
    requiredSkills: json("required_skills").$type<string[]>(),
    riskLevel: mysqlEnum("risk_level", ["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM").notNull(),
    status: mysqlEnum("status", ["PLANNED", "IN_PROGRESS", "SUSPENDED", "COMPLETED", "CANCELLED"])
      .default("PLANNED")
      .notNull(),
    startDate: date("start_date"),
    endDate: date("end_date"),
    createdAt,
    updatedAt
  },
  (table) => ({
    operationIdx: index("missions_operation_idx").on(table.operationId),
    statusIdx: index("missions_status_idx").on(table.status)
  })
);

export const missionPersonnel = mysqlTable(
  "mission_personnel",
  {
    missionId: varchar("mission_id", { length: 36 }).notNull().references(() => missions.id, { onDelete: "cascade" }),
    personnelId: varchar("personnel_id", { length: 36 }).notNull().references(() => militaryPersonnel.id, {
      onDelete: "cascade"
    }),
    assignmentRole: varchar("assignment_role", { length: 120 }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.missionId, table.personnelId] })
  })
);

export const missionUnits = mysqlTable(
  "mission_units",
  {
    missionId: varchar("mission_id", { length: 36 }).notNull().references(() => missions.id, { onDelete: "cascade" }),
    unitId: varchar("unit_id", { length: 36 }).notNull().references(() => units.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.missionId, table.unitId] })
  })
);

export const reports = mysqlTable("reports", {
  id: id(),
  title: varchar("title", { length: 180 }).notNull(),
  type: varchar("type", { length: 60 }).notNull(),
  operationId: varchar("operation_id", { length: 36 }).references(() => operations.id),
  missionId: varchar("mission_id", { length: 36 }).references(() => missions.id),
  generatedById: varchar("generated_by_id", { length: 36 }).notNull().references(() => users.id),
  filePath: text("file_path"),
  summary: text("summary"),
  createdAt
});

export const aiRecommendations = mysqlTable("ai_recommendations", {
  id: id(),
  missionId: varchar("mission_id", { length: 36 }).notNull().references(() => missions.id, { onDelete: "cascade" }),
  recommendationType: varchar("recommendation_type", { length: 60 }).notNull(),
  payload: json("payload").notNull(),
  score: decimal("score", { precision: 5, scale: 2 }),
  createdAt
});

export const auditLogs = mysqlTable(
  "audit_logs",
  {
    id: id(),
    userId: varchar("user_id", { length: 36 }).references(() => users.id),
    action: varchar("action", { length: 120 }).notNull(),
    entity: varchar("entity", { length: 120 }).notNull(),
    entityId: varchar("entity_id", { length: 36 }),
    ipAddress: varchar("ip_address", { length: 80 }),
    userAgent: text("user_agent"),
    metadata: json("metadata"),
    createdAt
  },
  (table) => ({
    userIdx: index("audit_user_idx").on(table.userId),
    createdIdx: index("audit_created_idx").on(table.createdAt)
  })
);

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Personnel = InferSelectModel<typeof militaryPersonnel>;
export type Operation = InferSelectModel<typeof operations>;
export type Mission = InferSelectModel<typeof missions>;
