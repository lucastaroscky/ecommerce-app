# Ecommerce Backend - Skeleton

Minimal TypeScript + Express backend skeleton for the "Pedidos & Produtos".

## Run locally

1. Copy `.env.example` to `.env` and update vars.
2. Start Postgres (docker-compose provided) or point DATABASE_URL to your DB.
3. Install:
   ```bash
   npm install
   ```
4. Run dev:
   ```bash
   npm run dev
   ```
5. Seed:
   ```bash
   npm run seed
   ```

Included:
- JWT access + refresh skeleton
- Role-based middleware (ADMIN / USER)
- TypeORM setup (migrations + seed stub)
- Basic routes for auth/products/orders

This is a starting point. Finish validations, tests and migrations as needed.
