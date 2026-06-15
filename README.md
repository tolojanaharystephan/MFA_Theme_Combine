# MFA Decision Platform

Plateforme intelligente d'aide a la decision pour la gestion des ressources et operations du Ministere des Forces Armees de Madagascar.

## Stack

- Frontend: NextJS App Router, TypeScript, TailwindCSS, Recharts, Framer Motion
- Backend: NodeJS, ExpressJS, TypeScript, Drizzle ORM, MySQL, JWT
- AI service: Python, FastAPI, scikit-learn
- DevOps: Docker Compose

## Structure

```text
frontend/    Application NextJS
backend/     API Express TypeScript
ai-service/  Microservice IA FastAPI
database/    Scripts init/seed SQL optionnels
docs/        Analyse, architecture et UML
```

## Demarrage rapide

```bash
docker compose up --build
```

URLs:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/v1/health
- AI Service: http://localhost:8000/health
- MySQL: localhost:3306

## Demarrage local hors Docker

Backend:

```bash
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run seed
npm run dev
```

## Base de donnees MySQL

Si tu utilises ton propre SGBD MySQL, cree seulement la base :

```sql
CREATE DATABASE mfa_decision CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mfa_user'@'localhost' IDENTIFIED BY 'mfa_password';
GRANT ALL PRIVILEGES ON mfa_decision.* TO 'mfa_user'@'localhost';
FLUSH PRIVILEGES;
```

Puis configure `backend/.env` :

```env
DATABASE_URL=mysql://mfa_user:mfa_password@localhost:3306/mfa_decision
```

Ensuite :

```bash
cd backend
npm run db:generate
npm run db:migrate
npm run seed
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

AI service:

```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
