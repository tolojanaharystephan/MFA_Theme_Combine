export const dashboardData = {
  kpis: {
    totalPersonnel: 4280,
    availablePersonnel: 3176,
    availabilityRate: 74.2,
    activeOperations: 12,
    criticalMissions: 4,
    aiAlerts: 7
  },
  personnelByGrade: [
    { name: "Officiers", value: 480 },
    { name: "Sous-officiers", value: 1320 },
    { name: "Rang", value: 2480 }
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
    { unit: "Log", readiness: 69 }
  ],
  alerts: [
    { level: "HIGH", label: "Surcharge detectee sur unite logistique" },
    { level: "MEDIUM", label: "Competence transmission sous-representee" },
    { level: "CRITICAL", label: "Mission critique sans reserve affectee" }
  ]
};

