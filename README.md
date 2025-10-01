# DQ Order Management API (Scaffold)
Backend Developer Assessment scaffold:
- Node.js + TypeScript + Express
- Prisma (Postgres)
- JWT auth
- OpenAPI (Swagger) spec included
- Dockerfile + docker-compose example

See `./src` for application code. Use `.env.example` to configure.

## Quick run (development)
1. Copy `.env.example` to `.env` and set DATABASE_URL and JWT_SECRET
2. Install deps:
   ```bash
   npm install
   ```
3. Generate Prisma client:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Run in dev:
   ```bash
   npm run dev
   ```
API base: `http://localhost:8000/v1`
