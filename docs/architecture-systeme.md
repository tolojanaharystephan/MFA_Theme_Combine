# Architecture systeme

## 1. Vue d'ensemble

La plateforme est concue selon une architecture modulaire en services separes :

```text
Utilisateur
   |
   v
Frontend NextJS
   |
   v
Backend ExpressJS
   |-----------------> AI Service FastAPI
   |
   v
MySQL via Drizzle ORM
```

Le frontend ne communique jamais directement avec MySQL ni avec le service IA. Le backend est le point de controle central : authentification, autorisation, validation, logique metier, audit et orchestration.

## 2. Responsabilites par couche

### Frontend NextJS

- Interface utilisateur.
- Gestion des formulaires.
- Validation immediate cote client.
- Dashboards analytiques.
- Appels API via Axios.
- Gestion de session cote UI.
- Composants reutilisables.

### Backend ExpressJS

- Authentification JWT.
- RBAC.
- Validation serveur.
- Services metier.
- Repositories Drizzle.
- Gestion des erreurs.
- Audit logs.
- Generation PDF.
- Integration service IA.

### AI Service FastAPI

- Scoring intelligent.
- Recommandation d'affectation.
- Detection d'anomalies.
- Prediction simple de risque.
- Explication des recommandations.

### MySQL

- Donnees utilisateurs.
- Donnees RH militaires.
- Operations et missions.
- Historique.
- Audit logs.
- Resultats IA sauvegardes.

## 3. Clean architecture appliquee au backend

Chaque module backend est organise ainsi :

```text
module/
  module.routes.ts
  module.controller.ts
  module.service.ts
  module.repository.ts
  module.validation.ts
  module.dto.ts
```

### Routes

Declarent les endpoints, les middlewares d'authentification et les permissions requises.

### Controllers

Reçoivent les requetes HTTP, appellent les services et formatent les reponses.

### Services

Portent la logique metier : regles, decisions, orchestration, transactions.

### Repositories

Isolent l'acces a Drizzle ORM et a la base de donnees.

### Validations

Schemas Zod pour valider body, params et query.

### DTO

Controlent les donnees acceptees et retournees par l'API.

## 4. Flux d'authentification

1. L'utilisateur envoie ses identifiants.
2. Le backend valide email et mot de passe.
3. Le backend genere un access token JWT court.
4. Le backend genere un refresh token, le hache et le stocke.
5. Le frontend utilise l'access token pour les routes protegees.
6. Si l'access token expire, le frontend demande un renouvellement.
7. Le refresh token peut etre revoque lors de la deconnexion.

## 5. Flux de recommandation IA

1. L'officier selectionne une mission.
2. Le backend recupere les criteres de mission.
3. Le backend recupere les candidats disponibles.
4. Le backend appelle FastAPI.
5. FastAPI calcule scores et justifications.
6. Le backend sauvegarde la recommandation.
7. Le frontend affiche une liste classee.

## 6. Strategie de securite

Defense en profondeur :

- protection de transport en production via HTTPS ;
- validation client et serveur ;
- authentification JWT ;
- refresh token revocable ;
- permissions par route ;
- rate limiting ;
- headers HTTP securises ;
- upload controle ;
- audit logs ;
- erreurs standardisees sans fuite technique ;
- variables sensibles hors code source.

## 7. Strategie de donnees

- MySQL comme source de verite relationnelle.
- Drizzle ORM et Drizzle Kit pour typage, schema et migrations SQL.
- Historique des affectations conserve.
- Soft delete ou archivage pour entites sensibles.
- Index sur recherches frequentes.
- JSONB seulement pour donnees flexibles comme criteres IA ou metadata.

## 8. Strategie UX/UI

L'interface doit ressembler a une plateforme gouvernementale moderne :

- navigation laterale dense mais claire ;
- dashboard en premiere page apres connexion ;
- cartes KPI sobres ;
- graphiques lisibles ;
- tableaux avec filtres ;
- dark mode professionnel ;
- couleurs inspirees institutionnellement sans surcharge ;
- micro-interactions discretes.

Palette recommandee :

- fond clair : gris froid tres clair ;
- fond sombre : bleu nuit/graphite ;
- accent principal : vert profond ou bleu institutionnel ;
- accent alerte : rouge controle ;
- accent information : cyan ou bleu clair ;
- surfaces : contraste modere, bordures fines.

## 9. Strategie de demonstration

La demonstration finale devra suivre un scenario narratif :

1. Connexion avec un role decisionnel.
2. Consultation du dashboard general.
3. Analyse des effectifs et disponibilites.
4. Creation ou consultation d'une operation.
5. Demande de recommandation IA pour une mission.
6. Validation d'une affectation.
7. Generation d'un rapport PDF.
8. Consultation des audit logs.
