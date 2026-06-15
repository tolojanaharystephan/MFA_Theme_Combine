# Cahier des charges technique

## 1. Intitule

Conception et developpement d'un systeme intelligent d'aide a la decision pour la gestion des ressources et operations du Ministere des Forces Armees de Madagascar.

## 2. Objectif technique

Construire une application web fullstack securisee, modulaire et dockerisee permettant la gestion des ressources humaines militaires, le suivi operationnel, la production de tableaux de bord analytiques et l'integration d'un microservice IA d'aide a la decision.

## 3. Stack obligatoire

### Frontend

- NextJS latest App Router
- TypeScript
- TailwindCSS
- Shadcn/UI
- Framer Motion
- Recharts
- React Hook Form
- Zod
- Axios

### Backend

- NodeJS
- ExpressJS
- TypeScript
- Drizzle ORM
- MySQL
- JWT
- bcrypt
- multer
- helmet
- cors

### Intelligence artificielle

- Python
- FastAPI
- scikit-learn

### DevOps

- Docker
- Docker Compose

## 4. Architecture cible du repository

```text
MFA/
  frontend/
    app/
    components/
    features/
    hooks/
    lib/
    types/
    public/
  backend/
    drizzle/
    src/
      common/
      config/
      database/
      integrations/
      modules/
      server.ts
      app.ts
  ai-service/
    app/
      main.py
      schemas.py
      services/
      models/
    tests/
  database/
    seed/
    init/
  docs/
    uml/
    database/
  docker-compose.yml
  README.md
```

## 5. Principes d'architecture

- Separation stricte entre presentation, API, IA et persistance.
- Backend organise par modules metier.
- Acces base de donnees uniquement via Drizzle ORM et repositories metier.
- Validation systematique des entrees avec Zod cote backend et frontend.
- DTO pour controler les donnees exposees.
- Gestion centralisee des erreurs.
- Audit logs pour les actions sensibles.
- Service IA appele uniquement depuis le backend.
- Suppression logique pour les donnees sensibles.

## 6. Exigences API

- API REST versionnee sous `/api/v1`.
- JSON comme format principal.
- Pagination pour les listes.
- Filtres multicriteres pour personnels, unites, operations et missions.
- Codes HTTP coherents.
- Reponses d'erreur standardisees.
- Protection JWT sur les routes privees.
- RBAC par role et permission.

Format d'erreur propose :

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

Format succes propose :

```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

## 7. Modules backend a implementer

| Module | Routes principales |
|---|---|
| Auth | `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me` |
| Users | `/users`, `/users/:id`, `/users/:id/status` |
| Roles | `/roles`, `/permissions` |
| Personnel | `/personnel`, `/personnel/:id`, `/personnel/search` |
| Grades | `/grades` |
| Units | `/units`, `/units/:id/personnel` |
| Skills | `/skills` |
| Assignments | `/assignments` |
| Operations | `/operations`, `/operations/:id` |
| Missions | `/missions`, `/missions/:id` |
| Analytics | `/analytics/overview`, `/analytics/operations`, `/analytics/personnel` |
| AI | `/ai/recommendations`, `/ai/anomalies`, `/ai/risk-score` |
| Reports | `/reports`, `/reports/:id/download` |
| Audit | `/audit-logs` |

## 8. Roles initiaux

| Role | Description |
|---|---|
| SUPER_ADMIN | Administration complete |
| ADMIN_SECURITY | Gestion securite et audit |
| HR_OFFICER | Gestion RH militaire |
| OPERATIONS_OFFICER | Gestion operations et missions |
| UNIT_COMMANDER | Consultation et suivi unite |
| STRATEGIC_ANALYST | Dashboards, rapports, IA |
| DECISION_AUTHORITY | Consultation executive et rapports |

## 9. Permissions initiales

- `users:read`
- `users:create`
- `users:update`
- `roles:manage`
- `personnel:read`
- `personnel:create`
- `personnel:update`
- `personnel:archive`
- `units:read`
- `units:manage`
- `operations:read`
- `operations:create`
- `operations:update`
- `missions:assign`
- `analytics:read`
- `ai:read`
- `reports:generate`
- `audit:read`

## 10. Exigences de securite

- Hashage des mots de passe avec bcrypt.
- Access token court et refresh token revocable.
- Secrets via variables d'environnement.
- Helmet active.
- CORS limite aux origines autorisees.
- Rate limiting sur auth et API.
- Validation et sanitization des entrees.
- Upload limite par type MIME et taille.
- Logs applicatifs sans fuite de secrets.
- Audit des actions sensibles.
- Principe du moindre privilege.

## 11. Exigences IA

Le module IA doit rester explicable et demonstrable :

- scoring d'adequation mission-personnel ;
- recommandation d'affectation ;
- detection d'anomalies simples ;
- prediction de niveau de risque ;
- justification textuelle des scores.

Variables possibles :

- niveau de competence ;
- disponibilite ;
- experience ;
- charge operationnelle recente ;
- correspondance avec les competences requises ;
- criticite et risque de la mission.

## 12. Exigences dashboard

KPIs initiaux :

- effectif total ;
- militaires disponibles ;
- taux de disponibilite ;
- operations actives ;
- missions critiques ;
- repartition par grade ;
- repartition par unite ;
- taux de completion operations ;
- alertes IA ;
- tendances mensuelles.

Visualisations :

- cartes KPI ;
- graphiques barres ;
- courbes de tendance ;
- donut charts ;
- tableaux filtrables ;
- heatmap operationnelle simplifiee.

## 13. Criteres d'acceptation academiques

- Le projet s'execute via Docker Compose.
- Le frontend affiche un dashboard moderne et responsive.
- Le backend expose des routes REST securisees.
- La base MySQL est migree via Drizzle Kit.
- L'authentification JWT fonctionne.
- Le RBAC limite les actions selon roles.
- Le module IA retourne des recommandations justifiees.
- Les rapports PDF sont generables.
- Les logs d'audit sont consultables.
- Une demonstration complete peut etre effectuee avec des donnees fictives.
