import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db, pool } from "./db.js";
import { grades, militaryPersonnel, permissions, rolePermissions, roles, units, users } from "./schema.js";

const permissionKeys = [
  "users:read",
  "users:create",
  "users:update",
  "roles:manage",
  "personnel:read",
  "personnel:create",
  "personnel:update",
  "personnel:archive",
  "units:read",
  "units:manage",
  "operations:read",
  "operations:create",
  "operations:update",
  "missions:assign",
  "analytics:read",
  "ai:read",
  "reports:generate",
  "audit:read"
];

async function getOrCreate<T extends { id: string }>(
  find: () => Promise<T | undefined>,
  create: () => Promise<T>
) {
  return (await find()) ?? (await create());
}

async function main() {
  const role = await getOrCreate(
    async () => (await db.select().from(roles).where(eq(roles.name, "SUPER_ADMIN")).limit(1))[0],
    async () => (await db.insert(roles).values({ name: "SUPER_ADMIN", description: "Administration complete" }).$returningId())[0]
  );

  for (const key of permissionKeys) {
    const permission = await getOrCreate(
      async () => (await db.select().from(permissions).where(eq(permissions.key, key)).limit(1))[0],
      async () =>
        (await db.insert(permissions).values({ key, description: key.replace(":", " ") }).$returningId())[0]
    );

    await db
      .insert(rolePermissions)
      .values({ roleId: role.id, permissionId: permission.id })
      .onDuplicateKeyUpdate({ set: { roleId: role.id } });
  }

  await db
    .insert(users)
    .values({
      email: "admin@mfa.local",
      fullName: "Administrateur MFA",
      passwordHash: await bcrypt.hash("Admin@12345", 12),
      roleId: role.id
    })
    .onDuplicateKeyUpdate({ set: { fullName: "Administrateur MFA" } });

  const grade = await getOrCreate(
    async () => (await db.select().from(grades).where(eq(grades.name, "Capitaine")).limit(1))[0],
    async () => (await db.insert(grades).values({ name: "Capitaine", rankOrder: 6, category: "Officier" }).$returningId())[0]
  );

  const unit = await getOrCreate(
    async () => (await db.select().from(units).where(eq(units.code, "1RFI")).limit(1))[0],
    async () =>
      (
        await db
          .insert(units)
          .values({
            code: "1RFI",
            name: "1er Regiment des Forces d'Intervention",
            type: "Intervention",
            location: "Antananarivo"
          })
          .$returningId()
      )[0]
  );

  await db
    .insert(militaryPersonnel)
    .values({
      serviceNumber: "MFA-0001",
      firstName: "Andry",
      lastName: "Rabe",
      gender: "M",
      gradeId: grade.id,
      unitId: unit.id,
      availabilityStatus: "AVAILABLE",
      healthStatus: "OPERATIONAL"
    })
    .onDuplicateKeyUpdate({ set: { availabilityStatus: "AVAILABLE" } });
}

main()
  .then(async () => {
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await pool.end();
    process.exit(1);
  });
