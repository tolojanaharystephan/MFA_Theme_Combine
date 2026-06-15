# Phase 1 - Analyse et conception

## 1. Vision generale

Le projet vise a concevoir une plateforme intelligente d'aide a la decision pour le Ministere des Forces Armees de Madagascar. Le systeme centralise les donnees relatives aux personnels militaires, aux unites, aux operations, aux missions, aux competences et aux indicateurs strategiques afin d'offrir une vision fiable, securisee et exploitable par les responsables decisionnels.

La plateforme ne remplace pas la decision humaine. Elle fournit des tableaux de bord, des analyses, des recommandations et des alertes afin d'aider les responsables a prendre des decisions plus rapides, plus traceables et mieux documentees.

## 2. Problematique

Dans une organisation militaire, les informations sont souvent reparties entre plusieurs services, formats et niveaux hierarchiques. Cette fragmentation peut ralentir la planification, la gestion des ressources humaines, le suivi operationnel et la production de rapports fiables.

La problematique principale est donc :

> Comment concevoir et developper un systeme securise, modulaire et intelligent permettant de centraliser les ressources et operations militaires, d'analyser les donnees strategiques et d'assister les responsables dans la prise de decision ?

## 3. Objectifs

### Objectif general

Mettre en place une plateforme fullstack moderne, securisee et intelligente pour la gestion des ressources humaines militaires, le suivi des operations et l'analyse decisionnelle.

### Objectifs specifiques

- Centraliser les informations sur les militaires, les grades, les unites, les competences et les affectations.
- Suivre les operations et missions avec leurs statuts, rapports, unites impliquees et zones d'intervention.
- Fournir des tableaux de bord analytiques avec KPIs, graphiques, tendances et syntheses.
- Integrer un module d'intelligence artificielle pour le scoring, les recommandations et la detection d'anomalies.
- Generer des rapports PDF periodiques et exportables.
- Garantir la securite via authentification, RBAC, validation, audit logs et protection API.
- Proposer une architecture maintenable, scalable et adaptee a une soutenance de Master 2 professionnel.

## 4. Perimetre fonctionnel

### Inclus dans le projet

- Gestion des utilisateurs applicatifs.
- Gestion des roles et permissions.
- Authentification JWT avec refresh token.
- Gestion des profils militaires.
- Gestion des grades, unites, competences et affectations.
- Gestion des operations et missions.
- Gestion des rapports operationnels.
- Dashboards analytiques.
- Module IA simple mais credible.
- Generation de rapports PDF.
- Journalisation et audit.
- Dockerisation de l'ensemble.

### Hors perimetre initial

- Connexion a des systemes militaires reels classifies.
- Geolocalisation tactique en temps reel.
- Gestion d'armes ou de donnees sensibles operationnelles detaillees.
- Intelligence artificielle offensive ou autonome.
- Communication radio ou integration satellite.

## 5. Acteurs

| Acteur | Description | Responsabilites principales |
|---|---|---|
| Administrateur systeme | Responsable technique et securite de la plateforme | Gestion utilisateurs, roles, permissions, audit, parametrage |
| Officier RH | Responsable des ressources humaines militaires | Gestion profils, grades, competences, affectations |
| Commandant d'unite | Responsable d'une unite militaire | Consultation des personnels, suivi unite, participation aux operations |
| Officier operations | Responsable planification et suivi operationnel | Creation missions, affectation unites, suivi statuts, rapports |
| Analyste strategique | Responsable analyse et aide a la decision | Consultation dashboards, analyses, recommandations IA |
| Autorite decisionnelle | Haut responsable ministeriel ou militaire | Consultation syntheses, indicateurs strategiques, rapports |
| Auditeur securite | Controleur des traces et conformite | Consultation logs, audit des actions sensibles |
| Service IA | Microservice interne | Calcul scores, predictions, recommandations, anomalies |

## 6. Besoins fonctionnels

### BF1 - Authentification et acces

- L'utilisateur doit pouvoir se connecter avec email et mot de passe.
- Le systeme doit emettre un access token et un refresh token.
- Les routes doivent etre protegees selon les roles.
- L'utilisateur doit pouvoir se deconnecter.
- Les tentatives et actions sensibles doivent etre journalisees.

### BF2 - Gestion des personnels militaires

- Creer, modifier, consulter et archiver un profil militaire.
- Associer un militaire a un grade, une unite et des competences.
- Suivre l'historique des affectations.
- Rechercher par nom, matricule, grade, unite, competence, disponibilite ou statut.
- Visualiser une fiche individuelle synthetique.

### BF3 - Gestion des unites

- Creer et administrer les unites.
- Associer les personnels a une unite.
- Suivre la capacite, l'effectif et les competences disponibles.
- Consulter l'historique operationnel d'une unite.

### BF4 - Gestion des operations et missions

- Creer une operation avec objectif, priorite, zone, dates et statut.
- Decouper une operation en missions.
- Affecter des unites ou personnels a une mission.
- Suivre l'avancement et les rapports.
- Classer les operations par statut : planifiee, en cours, suspendue, terminee, annulee.

### BF5 - Tableau de bord decisionnel

- Afficher des KPIs : effectif total, taux de disponibilite, operations actives, missions critiques, alertes.
- Afficher des graphiques : repartition par grade, unite, statut, zone, tendance operationnelle.
- Proposer des filtres temporels et organisationnels.
- Fournir une synthese strategique lisible.

### BF6 - Module intelligent

- Calculer un score d'adequation entre une mission et des militaires ou unites.
- Recommander les profils les plus adaptes selon competences, disponibilite, experience et charge.
- Detecter des anomalies simples : surcharge d'unite, incoherence statut/date, manque de competence critique.
- Produire une prediction simple de risque operationnel ou de besoin en ressources.

### BF7 - Rapports

- Generer un rapport PDF sur un personnel, une unite, une operation ou un tableau de bord.
- Produire des rapports periodiques.
- Inclure statistiques, filtres, auteur et date de generation.

### BF8 - Audit et securite

- Journaliser les connexions, creations, modifications, suppressions, exports et actions sensibles.
- Consulter les logs selon permissions.
- Appliquer validation, sanitization, rate limiting et headers de securite.

## 7. Besoins non fonctionnels

| Categorie | Exigence |
|---|---|
| Securite | JWT, refresh token, bcrypt, RBAC, Helmet, CORS strict, rate limiting, audit logs |
| Confidentialite | Separation des permissions, minimisation des donnees exposees, logs controles |
| Maintenabilite | Architecture modulaire, services, repositories, DTO, validations |
| Scalabilite | Separation frontend/backend/IA, Docker, API REST, MySQL |
| Performance | Pagination, index MySQL, selection de champs, cache possible |
| Disponibilite | Services conteneurises, redemarrage Docker, separation des composants |
| Qualite | TypeScript strict, ESLint, Prettier, tests automatises |
| UX/UI | Interface responsive, dashboards lisibles, dark mode, composants reutilisables |
| Traçabilite | Audit logs, horodatage, auteur des actions, historique d'affectation |
| Interoperabilite | API REST documentable, schemas Zod, contrats DTO |

## 8. Cas d'utilisation principaux

### UC1 - Se connecter

Acteur principal : utilisateur autorise.

Scenario nominal :

1. L'utilisateur saisit ses identifiants.
2. Le backend valide les donnees.
3. Le backend verifie le mot de passe avec bcrypt.
4. Le backend genere access token et refresh token.
5. Le frontend stocke le token selon une strategie securisee.
6. L'utilisateur accede au dashboard selon son role.

### UC2 - Creer un profil militaire

Acteur principal : officier RH.

Scenario nominal :

1. L'officier RH ouvre le module personnels.
2. Il renseigne matricule, identite, grade, unite, competences et statut.
3. Le frontend valide le formulaire avec React Hook Form et Zod.
4. Le backend valide a nouveau les donnees.
5. Drizzle ORM enregistre le profil.
6. Une entree d'audit est creee.

### UC3 - Planifier une operation

Acteur principal : officier operations.

Scenario nominal :

1. L'officier operations cree une operation.
2. Il definit objectif, priorite, zone, periode et ressources necessaires.
3. Le systeme propose des unites candidates via le module IA.
4. L'officier selectionne les unites.
5. Le systeme cree les missions associees.
6. Le dashboard operationnel est mis a jour.

### UC4 - Obtenir une recommandation d'affectation

Acteur principal : analyste strategique ou officier operations.

Scenario nominal :

1. L'utilisateur selectionne une mission.
2. Le backend transmet les criteres au service IA.
3. Le service IA calcule les scores.
4. Le backend retourne une liste classee de profils ou unites.
5. L'utilisateur consulte les justifications et valide manuellement.

### UC5 - Consulter le tableau de bord

Acteur principal : autorite decisionnelle.

Scenario nominal :

1. L'utilisateur ouvre le dashboard.
2. Le backend agrege les indicateurs.
3. Le frontend affiche KPIs, graphiques et alertes.
4. L'utilisateur filtre par periode, unite ou type d'operation.

### UC6 - Generer un rapport

Acteur principal : analyste strategique.

Scenario nominal :

1. L'utilisateur choisit le type de rapport.
2. Il selectionne les filtres.
3. Le backend genere les donnees.
4. Le rapport PDF est produit et journalise.

## 9. User stories

| ID | Role | Besoin | Valeur |
|---|---|---|---|
| US-001 | Administrateur | Je veux creer des comptes utilisateurs | Controler l'acces a la plateforme |
| US-002 | Administrateur | Je veux attribuer des roles | Limiter les actions selon les responsabilites |
| US-003 | Officier RH | Je veux creer une fiche militaire | Centraliser les informations du personnel |
| US-004 | Officier RH | Je veux rechercher un militaire par criteres | Retrouver rapidement les profils pertinents |
| US-005 | Officier RH | Je veux consulter l'historique d'affectation | Comprendre le parcours d'un militaire |
| US-006 | Commandant d'unite | Je veux voir l'effectif de mon unite | Connaitre les ressources disponibles |
| US-007 | Officier operations | Je veux creer une operation | Planifier une action structuree |
| US-008 | Officier operations | Je veux affecter une unite a une mission | Organiser les ressources operationnelles |
| US-009 | Analyste | Je veux consulter des KPIs | Aider la decision strategique |
| US-010 | Analyste | Je veux recevoir des recommandations IA | Comparer les options d'affectation |
| US-011 | Auditeur | Je veux consulter les actions sensibles | Verifier la tracabilite |
| US-012 | Autorite | Je veux exporter un rapport PDF | Presenter une synthese exploitable |

## 10. Regles metier initiales

- Un militaire possede un matricule unique.
- Un militaire appartient a une unite active a un instant donne.
- Un militaire peut avoir plusieurs competences.
- Une affectation conserve une date de debut et eventuellement une date de fin.
- Une operation peut contenir plusieurs missions.
- Une mission peut mobiliser plusieurs unites et plusieurs personnels.
- Une mission critique doit avoir au moins une unite affectee avant passage au statut "en cours".
- Une operation terminee ne peut plus recevoir de nouvelles missions actives.
- Toute suppression sensible doit etre logique ou archivee, pas supprimee physiquement.
- Toute action sensible doit produire une entree d'audit.

## 11. Architecture globale proposee

L'architecture est decoupee en quatre blocs principaux :

- Frontend NextJS : interface utilisateur, dashboards, formulaires, visualisation.
- Backend ExpressJS : API REST, securite, logique metier, acces base de donnees.
- AI Service FastAPI : recommandations, scoring, predictions simples, anomalies.
- MySQL : persistance relationnelle, historique, audit, donnees analytiques.

Flux principal :

1. L'utilisateur interagit avec le frontend NextJS.
2. Le frontend appelle l'API backend via Axios.
3. Le backend valide, autorise, applique la logique metier et interroge MySQL via Drizzle ORM.
4. Pour les fonctions intelligentes, le backend appelle le microservice FastAPI.
5. Les resultats sont retournes au frontend sous forme de DTO.

## 12. Architecture applicative

### Frontend

- `app/` : routes App Router.
- `components/` : composants reutilisables.
- `features/` : modules metier frontend.
- `hooks/` : hooks React.
- `lib/` : axios, utils, schemas.
- `types/` : types TypeScript.

### Backend

- `src/modules/` : modules metier.
- `src/common/` : middlewares, erreurs, helpers.
- `src/config/` : environnement, securite, connexion.
- `src/database/` : connexion MySQL, schema Drizzle et migrations.
- `src/integrations/` : client service IA.

Chaque module backend suivra la structure :

- `*.controller.ts`
- `*.service.ts`
- `*.repository.ts`
- `*.routes.ts`
- `*.validation.ts`
- `*.dto.ts`

### AI Service

- `app/main.py` : point d'entree FastAPI.
- `app/schemas.py` : schemas Pydantic.
- `app/services/` : logique IA.
- `app/models/` : modeles entraines ou simulables.

## 13. Modules fonctionnels

| Module | Responsabilite |
|---|---|
| Auth | Connexion, refresh token, logout, hash mot de passe |
| Users | Comptes applicatifs, roles, statut |
| Personnel | Profils militaires, recherche, archive |
| Grades | Referentiel des grades |
| Units | Unites militaires |
| Skills | Competences |
| Assignments | Historique des affectations |
| Operations | Operations strategiques |
| Missions | Missions operationnelles |
| Reports | Rapports PDF et statistiques |
| Analytics | KPIs, agregations, dashboards |
| AI | Appels au microservice IA |
| Audit | Traces et actions sensibles |

## 14. Choix techniques justifies

| Technologie | Justification |
|---|---|
| NextJS App Router | Framework moderne, routing serveur/client, architecture scalable |
| TypeScript | Typage strict, meilleure maintenabilite, reduction des erreurs |
| TailwindCSS | Design system rapide, coherent, responsive |
| Shadcn/UI | Composants modernes, accessibles et personnalisables |
| Framer Motion | Micro-interactions premium et fluides |
| Recharts | Graphiques React simples et adaptes aux dashboards |
| ExpressJS | API REST robuste, flexible et bien maitrisee |
| Drizzle ORM | ORM TypeScript moderne, leger, migrations SQL lisibles |
| MySQL | Base relationnelle largement disponible, robuste et facile a deployer |
| FastAPI | Microservice IA performant, documentation automatique |
| scikit-learn | ML classique credible pour scoring et anomalies |
| Docker Compose | Environnement reproductible et demonstration facile |

## 15. Hypotheses de securite

- Les donnees utilisees pour la demonstration sont fictives.
- Les niveaux de classification reels ne sont pas integres dans la version academique.
- Les mots de passe sont haches avec bcrypt.
- Les tokens sont signes avec secrets d'environnement.
- Le backend reste l'unique point d'acces a la base de donnees.
- Les appels au service IA passent par le backend, pas directement par le frontend.

## 16. Livrables de conception

- Diagramme de cas d'utilisation : `docs/uml/use-cases.puml`
- Diagramme de classes : `docs/uml/class-diagram.puml`
- Diagramme de composants : `docs/uml/component-diagram.puml`
- Diagramme de sequence authentification : `docs/uml/sequence-auth.puml`
- Diagramme de sequence recommandation IA : `docs/uml/sequence-ai-recommendation.puml`
- Diagramme de deploiement : `docs/uml/deployment-diagram.puml`
- MCD/MLD et dictionnaire : `docs/database/data-model.md`

## 17. Positionnement academique

Le projet est soutenable comme projet de Master 2 professionnel car il combine :

- une problematique institutionnelle realiste ;
- une architecture fullstack moderne ;
- une dimension securite forte ;
- une couche analytique exploitable ;
- une intelligence artificielle explicable et limitee a l'aide a la decision ;
- une separation claire des responsabilites ;
- une base de donnees relationnelle bien structuree ;
- une interface professionnelle orientee tableau de bord.
