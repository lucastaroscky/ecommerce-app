# E-commerce Backend

API backend para gerenciamento de produtos, pedidos e usuários, construída com Node.js, Express e TypeORM.

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Setup do Projeto](#-setup-do-projeto)
- [Arquitetura](#-arquitetura)
- [Endpoints](#-endpoints)
- [Autenticação](#-autenticação)
- [Usuário Seed](#-usuário-seed)
- [Melhorias Futuras](#-melhorias-futuras)
- [Observações](#-observações)

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeORM** - ORM para TypeScript/JavaScript
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **class-validator** - Validação de DTOs
- **TypeScript** - Linguagem principal

## 🏗 Setup do Projeto

### 1. Clone o repositório
```bash
git clone <repo-url>
cd ecommerce-backend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL=<sua-database-url>
JWT_SECRET=<seu-jwt-secret>
PORT=3000
```

### 4. Execute as migrations
```bash
npm run migration:run
```

### 5. Execute o seed
```bash
npm run seed
```

### 6. Inicie o container docker
```bash
docker-compose up -d
```

### 6. Inicie a aplicação
```bash
npm run start:dev
```

A API estará disponível em `http://localhost:3000`

## 🏛 Arquitetura

### Decisões Técnicas
- **Node.js + Express** para o backend
- **TypeORM com PostgreSQL** para persistência
- **DTOs + class-validator** para validação de entrada
- **Transactions** para operações críticas (criação de pedidos e atualização de estoque)
- **Soft delete** para produtos
- **JWT** para autenticação e autorização
- **Arquitetura** feature-first separada por módulos, facilitando a leitura e escalabilidade.

### Relacionamentos Principais
```
Order → OrderItem (OneToMany, cascade)
OrderItem → Product (ManyToOne)
Order → User (ManyToOne)
```

## 🛠 Endpoints da API

### 🔐 Autenticação (`/auth`)

#### Registrar Usuário
```http
POST /auth/register
Authorization: Bearer {token} (apenas ADMIN)
Content-Type: application/json
```

**Body:**
```json
{
    "firstName": "Lucas",
    "lastName": "Staroscky", 
    "email": "user@example.com",
    "password": "@Teste123",
    "role": "USER"
}
```

**Respostas:**
- `201` - Usuário criado com sucesso (retorna tokens)
- `403` - Permissão insuficiente para acessar este recurso

#### Login
```http
POST /auth/login
Content-Type: application/json
```

**Body:**
```json
{
    "email": "teste@email.com",
    "password": "Teste123"
}
```

**Respostas:**
- `200` - Login realizado (retorna `accessToken` e `refreshToken`)
- `400` - Dados inválidos com detalhes dos erros de validação

---

### 📦 Produtos (`/products`)

#### Listar Produtos
```http
GET /products?name={filtro}&page={1}&limit={10}&sort={name}&order={ASC|DESC}
Authorization: Bearer {token}
```

**Query Parameters:**
- `name` - Filtro por nome do produto
- `page` - Página (default: 1)  
- `limit` - Itens por página (default: 10)
- `sort` - Campo para ordenação
- `order` - Direção da ordenação (ASC/DESC)

**Resposta 200:**
```json
{
    "code": 200,
    "data": {
        "products": [...],
        "total": 20,
        "page": 1,
        "limit": 10,
        "totalPages": 2
    }
}
```

#### Criar Produto
```http
POST /products
Authorization: Bearer {token} (apenas ADMIN)
Content-Type: application/json
```

**Body:**
```json
{
    "name": "Nome do Produto",
    "description": "Descrição detalhada",
    "price": 99.99,
    "photo": "https://example.com/image.jpg",
    "stockQuantity": 10
}
```

**Respostas:**
- `201` - Produto criado com sucesso
- `403` - Permissão insuficiente

#### Atualizar Produto
```http
PATCH /products/{id}
Authorization: Bearer {token} (apenas ADMIN)
Content-Type: application/json
```

**Body:**
```json
{
    "name": "Novo nome do produto"
}
```

**Resposta 200:**
```json
{
    "code": 200,
    "message": "Produto atualizado com sucesso"
}
```

#### Deletar Produto (Soft Delete)
```http
DELETE /products/{id}
Authorization: Bearer {token} (apenas ADMIN)
```

**Respostas:**
- `204` - Produto deletado com sucesso (sem conteúdo)

---

### 🛒 Pedidos (`/orders`)

#### Criar Pedido
```http
POST /orders
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
    "name": "Pedido teste",
    "notes": "entrega portaria",
    "items": [
        {
            "productId": "8fc3b160-97aa-4264-911b-ab75c394f3da",
            "quantity": 2
        },
        {
            "productId": "65ac1ce5-769a-4268-8ea4-a5d35e21f1e7", 
            "quantity": 1
        }
    ]
}
```

**Resposta 201:**
```json
{
    "code": 201,
    "message": "Pedido criado com sucesso!",
    "data": {
        "id": "63b48eea-9cd5-43ed-9cc7-11dce70481bb",
        "name": "Pedido teste",
        "notes": "entrega portaria",
        "status": "PLACED",
        "totalAmount": 333.88,
        "items": [...],
        "createdAt": "2025-09-08T20:54:38.867Z"
    }
}
```

#### Listar Pedidos
```http
GET /orders?status={PLACED|PAID|SHIPPED|CANCELLED}&page={1}&limit={10}
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` - Filtro por status (apenas para ADMIN)
- `page` - Página (default: 1)
- `limit` - Itens por página (default: 10)

**Comportamento:**
- **Usuário comum:** Vê apenas seus próprios pedidos
- **Admin:** Vê todos os pedidos, pode filtrar por status

**Resposta 200:**
```json
{
    "code": 200,
    "data": {
        "orders": [...],
        "total": 1,
        "page": 1,
        "limit": 10,
        "totalPages": 1
    }
}
```

#### Atualizar Status do Pedido
```http
PATCH /orders/{id}/status
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
    "status": "SHIPPED"
}
```

**Status Válidos:**
- `PLACED` - Pedido realizado
- `PAID` - Pedido pago  
- `SHIPPED` - Pedido enviado
- `CANCELLED` - Pedido cancelado (devolve estoque automaticamente)

**Respostas:**
- `200` - Status atualizado com sucesso
- `404` - Pedido não encontrado

## 🔐 Autenticação

### Níveis de Acesso
- **Usuário comum**: Acessa apenas seus próprios pedidos
- **Admin**: Acesso completo a todos os recursos

### Token JWT
Inclua o token no header das requisições autenticadas:
```
Authorization: Bearer <seu-jwt-token>
```

## 👤 Usuário Seed

Usuário administrador padrão para testes:
```json
{
  "name": "Admin User",
  "email": "teste@email.com",
  "password": "Teste123",
  "role": "ADMIN"
}
```

## 🔄 Funcionalidades Automáticas

### Criação de Pedidos
- Salva automaticamente `OrderItems` com `unitPrice` e `totalPrice`
- Atualiza o estoque do produto em tempo real
- Utiliza transações para garantir consistência

### Cancelamento de Pedidos
- Devolve produtos ao estoque automaticamente
- Mantém histórico do pedido cancelado

## 💡 Melhorias Futuras

### Infraestrutura
- [ ] Middleware global para tratamento de erros e logging
- [ ] Testes unitários e de integração
- [ ] Cache para listagens de produtos e pedidos

### Funcionalidades
- [ ] Filtros avançados de produtos (preço, categoria, disponibilidade)
- [ ] Controle de estoque mais robusto (reserva de estoque)
- [ ] Dashboard administrativo
- [ ] Notificações por email
- [ ] Sistema de categorias de produtos
- [ ] Histórico de preços
- [ ] Controle de sessão com Redis

### Performance
- [ ] Paginação com cursor
- [ ] Compressão de respostas
- [ ] Rate limiting
- [ ] Otimização de queries

## 📄 Observações

- **Valores monetários**: Todos usam `decimal` com precisão 10 e escala 2
- **DTOs**: Validam entradas, mas nem todos os campos são visíveis no body
- **Transações**: Garantem consistência em operações críticas
- **Soft Delete**: Produtos deletados são marcados como inativos, não removidos fisicamente
- **Paginação**: Padrão de 10 itens por página, customizável via parâmetro `limit`

---