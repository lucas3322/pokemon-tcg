# Pokemon TCG Manager

Aplicação web full-stack para gerenciamento de cartas e decks do Pokemon Trading Card Game. Permite buscar cartas oficiais, montar decks personalizados e acompanhar a rotação de sets do formato Standard.

## Funcionalidades

- **Busca de cartas** — pesquise por nome, tipo, set e raridade via API oficial do Pokemon TCG
- **Gerenciamento de decks** — crie, edite e delete decks com controle de quantidade por carta
- **Rastreador de rotação** — visualize quais sets estão legais, saindo em breve ou já fora do Standard
- **Autenticação** — cadastro e login com JWT, decks vinculados ao usuário

## Tecnologias

**Frontend**
- Next.js 14 + TypeScript
- Material-UI (MUI) v5
- React 18

**Backend**
- Express.js + TypeScript
- PostgreSQL 16
- JWT + bcryptjs

**Infraestrutura**
- Docker + Docker Compose

## Como rodar

### Pré-requisitos

- Docker e Docker Compose instalados

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd pokemon-tcg
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` e adicione sua chave da [Pokemon TCG API](https://pokemontcg.io/) (opcional — funciona sem a chave, mas com rate limit menor):

```env
POKEMON_TCG_API_KEY=sua_chave_aqui
```

### 3. Suba os containers

```bash
docker compose up -d
```

A aplicação estará disponível em:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001

### Rodar sem Docker

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

> Certifique-se de ter um PostgreSQL rodando e ajuste o `DATABASE_URL` no ambiente do backend.

## Estrutura do projeto

```
pokemon-tcg/
├── frontend/          # Next.js (porta 3000)
│   └── src/
│       ├── app/       # Páginas (/, /login, /register, /decks, /rotation)
│       ├── components/# Componentes reutilizáveis
│       ├── context/   # AuthContext
│       ├── lib/       # Cliente HTTP
│       └── types/     # Tipos TypeScript
│
├── backend/           # Express.js (porta 3001)
│   └── src/
│       ├── routes/    # auth, cards, decks, rotation
│       ├── middleware/# Autenticação JWT
│       └── services/  # Integração com Pokemon TCG API
│
└── docker-compose.yml
```

## Variáveis de ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `POKEMON_TCG_API_KEY` | Chave da API do Pokemon TCG | — |
| `JWT_SECRET` | Segredo para assinar tokens JWT | definido no compose |
| `DATABASE_URL` | URL de conexão do PostgreSQL | definido no compose |
| `NEXT_PUBLIC_API_URL` | URL do backend | `http://localhost:3001` |

## API

| Método | Endpoint | Descrição | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Cadastro de usuário | — |
| POST | `/api/auth/login` | Login | — |
| GET | `/api/auth/me` | Usuário logado | Sim |
| GET | `/api/cards` | Buscar cartas | — |
| GET | `/api/cards/:id` | Detalhe de carta | — |
| GET | `/api/decks` | Listar decks | Sim |
| POST | `/api/decks` | Criar deck | Sim |
| GET | `/api/decks/:id` | Detalhe do deck | Sim |
| PUT | `/api/decks/:id` | Atualizar deck | Sim |
| DELETE | `/api/decks/:id` | Deletar deck | Sim |
| GET | `/api/rotation` | Status de rotação dos sets | — |
