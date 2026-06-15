import { count, eq } from "drizzle-orm";
import { db } from "../../database/db.js";
import { militaryPersonnel, missions, operations } from "../../database/schema.js";

export class AnalyticsService {
  async getOverview() {
    const [totalPersonnel] = await db.select({ value: count() }).from(militaryPersonnel);
    const [availablePersonnel] = await db
      .select({ value: count() })
      .from(militaryPersonnel)
      .where(eq(militaryPersonnel.availabilityStatus, "AVAILABLE"));
    const [activeOperations] = await db
      .select({ value: count() })
      .from(operations)
      .where(eq(operations.status, "IN_PROGRESS"));
    const [criticalMissions] = await db
      .select({ value: count() })
      .from(missions)
      .where(eq(missions.riskLevel, "CRITICAL"));

    const total = totalPersonnel.value || 0;
    const available = availablePersonnel.value || 0;

    return {
      kpis: {
        totalPersonnel: total,
        availablePersonnel: available,
        availabilityRate: total > 0 ? Number(((available / total) * 100).toFixed(1)) : 0,
        activeOperations: activeOperations.value || 0,
        criticalMissions: criticalMissions.value || 0,
        aiAlerts: 7
      },
      personnelByGrade: [
        { name: "Officiers", value: 480 },
        { name: "Sous-officiers", value: 1320 },
        { name: "Militaires du rang", value: 2480 }
      ],
      operationsTrend: [
        { month: "Jan", planned: 8, completed: 5 },
        { month: "Fev", planned: 11, completed: 7 },
        { month: "Mar", planned: 9, completed: 8 },
        { month: "Avr", planned: 14, completed: 10 },
        { month: "Mai", planned: 12, completed: 9 }
      ],
      unitReadiness: [
        { unit: "1er RFI", readiness: 83 },
        { unit: "2e BIA", readiness: 76 },
        { unit: "GN", readiness: 88 },
        { unit: "Logistique", readiness: 69 }
      ],
      alerts: [
        { level: "HIGH", label: "Surcharge detectee sur unite logistique" },
        { level: "MEDIUM", label: "Competence transmission sous-representee" },
        { level: "CRITICAL", label: "Mission critique sans reserve affectee" }
      ]
    };
  }
}

export const analyticsService = new AnalyticsService();
