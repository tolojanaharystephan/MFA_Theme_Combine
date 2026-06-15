# Modele de donnees initial

## 1. MCD conceptuel

Entites principales :

- User
- Role
- Permission
- MilitaryPersonnel
- Grade
- Unit
- Skill
- Assignment
- Operation
- Mission
- MissionPersonnel
- MissionUnit
- Report
- AuditLog
- RefreshToken
- AiRecommendation

Relations principales :

- Un utilisateur possede un role.
- Un role possede plusieurs permissions.
- Un militaire possede un grade.
- Un militaire appartient a une unite.
- Un militaire peut posseder plusieurs competences.
- Un militaire peut avoir plusieurs affectations historiques.
- Une operation contient plusieurs missions.
- Une mission peut mobiliser plusieurs personnels.
- Une mission peut mobiliser plusieurs unites.
- Une operation ou une mission peut avoir plusieurs rapports.
- Une action utilisateur peut produire plusieurs logs d'audit.
- Une mission peut avoir plusieurs recommandations IA.

## 2. MLD relationnel

### roles

| Champ | Type | Contraintes |
|---|---|---|
| id | UUID | PK |
| name | VARCHAR(80) | UNIQUE, NOT NULL |
| description | TEXT | NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### permissions

| Champ | Type | Contraintes |
|---|---|---|
| id | UUID | PK |
| key | VARCHAR(120) | UNIQUE, NOT NULL |
| description | TEXT | NULL |

### role_permissions

| Champ | Type | Contraintes |
|---|---|---|
| role_id | UUID | FK roles(id) |
| permission_id | UUID | FK permissions(id) |

Cle primaire composee : `(role_id, permission_id)`.

### users

| Champ | Type | Contraintes |
|---|---|---|
| id | UUID | PK |
| email | VARCHAR(160) | UNIQUE, NOT NULL |
| password_hash | TEXT | NOT NULL |
| full_name | VARCHAR(160) | NOT NULL |
| role_id | UUID | FK roles(id), NOT NULL |
| status | VARCHAR(30) | NOT NULL |
| last_login_at | TIMESTAMP | NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### refresh_tokens

| Champ | Type | Contraintes |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK users(id), NOT NULL |
| token_hash | TEXT | NOT NULL |
| expires_at | TIMESTAMP | NOT NULL |
| revoked_at | TIMESTAMP | NULL |
| created_at | TIMESTAMP | NOT NULL |

### grades

| Champ | Type | Contraintes |
|---|---|---|
| id | UUID | PK |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| rank_order | INT | NOT NULL |
| category | VARCHAR(80) | NULL |

### units

| Champ | Type | Contraintes |
|---|---|---|
| id | UUID | PK |
| name | VARCHAR(160) | NOT NULL |
| code | VARCHAR(50) | UNIQUE, NOT NULL |
| type | VARCHAR(80) | NOT NULL |
| location | VARCHAR(160) | NULL |
| parent_unit_id | UUID | FK units(id), NULL |
| status | VARCHAR(30) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### military_personnel

| Champ | Type | Contraintes |
|---|---|---|
| id | UUID | PK |
| service_number | VARCHAR(80) | UNIQUE, NOT NULL |
| first_name | VARCHAR(120) | NOT NULL |
| last_name | VARCHAR(120) | NOT NULL |
| gender | VARCHAR(20) | NOT NULL |
| birth_date | DATE | NULL |
| grade_id | UUID | FK grades(id), NOT NULL |
| unit_id | UUID | FK units(id), NOT NULL |
| availability_status | VARCHAR(40) | NOT NULL |
| health_status | VARCHAR(40) | NULL |
| enlistment_date | DATE | NULL |
| archived_at | TIMESTAMP | NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### skills

| Champ | Type | Contraintes |
|---|---|---|
| id | UUID | PK |
| name | VARCHAR(120) | UNIQUE, NOT NULL |
| category | VARCHAR(80) | NULL |
| description | TEXT | NULL |

### personnel_skills

| Champ | Type | Contraintes |
|---|---|---|
| personnel_id | UUID | FK military_personnel(id) |
| skill_id | UUID | FK skills(id) |
| level | INT | NOT NULL, 1 a 5 |
| certified_at | DATE | NULL |

Cle primaire composee : `(personnel_id, skill_id)`.

### assignments

| Champ | Type | Contraintes |
|---|---|---|
| id | UUID | PK |
| personnel_id | UUID | FK military_personnel(id), NOT NULL |
| unit_id | UUID | FK units(id), NOT NULL |
| role_title | VARCHAR(120) | NULL |
| start_date | DATE | NOT NULL |
| end_date | DATE | NULL |
| reason | TEXT | NULL |

### operations

| Champ | Type | Contraintes |
|---|---|---|
| id | UUID | PK |
| code | VARCHAR(80) | UNIQUE, NOT NULL |
| title | VARCHAR(180) | NOT NULL |
| objective | TEXT | NOT NULL |
| priority | VARCHAR(30) | NOT NULL |
| area | VARCHAR(160) | NULL |
| status | VARCHAR(40) | NOT NULL |
| start_date | DATE | NULL |
| end_date | DATE | NULL |
| created_by_id | UUID | FK users(id), NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### missions

| Champ | Type | Contraintes |
|---|---|---|
| id | UUID | PK |
| operation_id | UUID | FK operations(id), NOT NULL |
| title | VARCHAR(180) | NOT NULL |
| description | TEXT | NULL |
| required_skills | JSONB | NULL |
| risk_level | VARCHAR(30) | NOT NULL |
| status | VARCHAR(40) | NOT NULL |
| start_date | DATE | NULL |
| end_date | DATE | NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### mission_personnel

| Champ | Type | Contraintes |
|---|---|---|
| mission_id | UUID | FK missions(id) |
| personnel_id | UUID | FK military_personnel(id) |
| assignment_role | VARCHAR(120) | NULL |
| assigned_at | TIMESTAMP | NOT NULL |

Cle primaire composee : `(mission_id, personnel_id)`.

### mission_units

| Champ | Type | Contraintes |
|---|---|---|
| mission_id | UUID | FK missions(id) |
| unit_id | UUID | FK units(id) |
| assigned_at | TIMESTAMP | NOT NULL |

Cle primaire composee : `(mission_id, unit_id)`.

### reports

| Champ | Type | Contraintes |
|---|---|---|
| id | UUID | PK |
| title | VARCHAR(180) | NOT NULL |
| type | VARCHAR(60) | NOT NULL |
| operation_id | UUID | FK operations(id), NULL |
| mission_id | UUID | FK missions(id), NULL |
| generated_by_id | UUID | FK users(id), NOT NULL |
| file_path | TEXT | NULL |
| summary | TEXT | NULL |
| created_at | TIMESTAMP | NOT NULL |

### ai_recommendations

| Champ | Type | Contraintes |
|---|---|---|
| id | UUID | PK |
| mission_id | UUID | FK missions(id), NOT NULL |
| recommendation_type | VARCHAR(60) | NOT NULL |
| payload | JSONB | NOT NULL |
| score | NUMERIC(5,2) | NULL |
| created_at | TIMESTAMP | NOT NULL |

### audit_logs

| Champ | Type | Contraintes |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK users(id), NULL |
| action | VARCHAR(120) | NOT NULL |
| entity | VARCHAR(120) | NOT NULL |
| entity_id | UUID | NULL |
| ip_address | VARCHAR(80) | NULL |
| user_agent | TEXT | NULL |
| metadata | JSONB | NULL |
| created_at | TIMESTAMP | NOT NULL |

## 3. Index recommandes

- `users.email`
- `military_personnel.service_number`
- `military_personnel.grade_id`
- `military_personnel.unit_id`
- `military_personnel.availability_status`
- `units.code`
- `operations.status`
- `operations.priority`
- `missions.operation_id`
- `missions.status`
- `audit_logs.user_id`
- `audit_logs.created_at`

## 4. Enums logiques

### UserStatus

- ACTIVE
- DISABLED
- LOCKED

### AvailabilityStatus

- AVAILABLE
- ASSIGNED
- ON_LEAVE
- TRAINING
- UNAVAILABLE

### OperationStatus

- PLANNED
- IN_PROGRESS
- SUSPENDED
- COMPLETED
- CANCELLED

### Priority

- LOW
- MEDIUM
- HIGH
- CRITICAL

### RiskLevel

- LOW
- MEDIUM
- HIGH
- CRITICAL

## 5. Notes Drizzle/MySQL

Le schema Drizzle devra respecter :

- des UUID generes cote application ;
- `createdAt` et `updatedAt` automatiques ;
- des relations explicites ;
- des index sur les champs de recherche ;
- des suppressions logiques pour les donnees sensibles ;
- des noms de tables stables via `mysqlTable`.
