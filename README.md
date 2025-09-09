# 📌 Projeto Fullstack (Next.js + Express)

## 🚀 Setup

### Passos para rodar localmente

```bash
# 1. Clonar o repositório
git clone https://github.com/lucastaroscky/ecommerce-app

cd ecommerce-app

# 2. Criar o arquivo de variáveis de ambiente
cp .env.example .env

# 3. Rodar as migrations
npm run migration:run

# 4. Popular a base de dados
npm run seed

# 5. Subir containers (front, back e postgres)
docker-compose up -d
```

Frontend roda na porta `3000`

Backend roda na porta `3001`


## 🛠️ Decisões técnicas

### Backend (Node + Express)
- Estrutura **feature-first** (cada feature com suas rotas, controllers e services)
- Uso de **TypeORM** para modelagem do banco
- Autenticação via **JWT** (access + refresh tokens)
- Middleware para tratamento de erros centralizado
- Seeds para popular usuário inicial
- Migrations

### Frontend (React + Next.js)
- Estrutura mais simples e pragmática, priorizando **clareza e entrega rápida**
- Páginas e componentes organizados de forma básica, sem arquitetura muito rígida
- Consumo de API com axios e interceptors pra controle de autenticação
- UI construída com **Tailwind** por padrão no Next.js

## 📚 Endpoints principais

### Health
- `GET /health` → informações sobre uso de memória, cpu e versão do node.

### Autenticação
- `POST /auth/register` → cria usuário (admin)
- `POST /auth/login` → login com email/senha
- `POST /auth/refresh-token` → refresh token

### Produtos
- `GET /products` → lista produtos
- `POST /products` → cria produto
- `PATCH /products/:id` → atualiza produto (admin)
- `DELETE /products/:id` → remove produto (admin)

### Pedidos
- `GET /orders` → lista pedidos do usuário
- `POST /orders` → cria novo pedido
- `PATCH /orders/:id/status` → atualiza status do pedido (admin)

### Collection Postman

Na raiz do projeto tem um arquivo `ecommerce.postman_collection` que facilita os testes dos endpoints via postman.

## 👤 Usuário seed

Após rodar as migrations + seed, você pode logar com:

```
email: teste@email.com
senha: Teste123
```

## 💡 Melhorias futuras (se tivesse mais tempo)

- Refinar a arquitetura do **frontend** (ex.: separar em `features`, criar hooks bem definidos, usar React Query/SWR e implementar Error boundary + toasts), faltou refinamento por ter focado mais no backend por conta do tempo.
- Controle de sessão com Redis.
- Observabilidade: logs e monitoramento do app.
- Criar testes unitários e de integração para backend e frontend
- Documentar API com **Swagger/OpenAPI**
- Configurar **CI/CD** e deploy automatizado
- Melhorar experiência de UI/UX com design mais consistente

