# Food App

Este projeto é uma aplicação completa para gestão de pedidos e restaurantes, composta por três principais módulos:

- **api/**: Backend em Node.js com TypeScript, utilizando Prisma ORM, Docker e Vitest para testes. Responsável pela lógica de negócios, autenticação, rotas REST, manipulação de dados e integração com banco de dados.
- **client/**: Frontend para clientes finais, desenvolvido em React + Vite, com componentes modernos, integração via Axios, gerenciamento de estado e autenticação.
- **web/**: Painel administrativo para restaurantes, também em React + Vite, com funcionalidades de gestão de produtos, pedidos, avaliações e relatórios.

## Funcionalidades
- Cadastro e login de usuários
- Listagem e filtro de restaurantes
- Gestão de pedidos, favoritos e avaliações
- Painel administrativo para restaurantes
- Upload de imagens
- Relatórios e métricas

## Requisitos

- Node.js 20+
- Docker e Docker Compose
- npm/pnpm (ou outro gerenciador, dependendo do projeto)

## Tecnologias Utilizadas

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)
- [Fastify](https://www.fastify.io/)
- [Prisma](https://www.prisma.io/)
- [Vitest](https://vitest.dev/)
- [Docker](https://www.docker.com/)

## Estrutura do Projeto
```
food-app/
├── api/      # Backend (Node.js, TypeScript, Prisma, Docker)
├── client/   # Frontend do cliente (React, Vite)
├── web/      # Painel administrativo (React, Vite)
```

## Configuração

### Backend (api)

1. Instale as dependências:
```sh
cd api
npm install
```

2. Configure as variáveis ambiente:
```sh
PORT=
DATABASE_URL=
JWT_SECRET=
NODE_ENV=
```

3. Rode o banco de dados com Docker:
```sh
docker-compose up -d
```

4. Execute as migrações do Prisma:
```sh
npm run prisma:migrate
```

5. Popule o banco com exemplos: (opcional)
```sh
npm run prisma:seed
```

### Frontend (client/web)

1. Instale as dependências:
```sh
cd client # ou cd web
npm install # ou pnpm install
```

2. Configure as variáveis ambiente:
```sh
VITE_API_URL=
```

## Executando o projeto

```sh
cd api 
npm run dev
```

```sh
cd client # ou cd web
npm run dev # ou pnpm dev
```

## Contribuição
Pull requests são bem-vindos! Para contribuir, siga as boas práticas de commit e mantenha o padrão de código.

## Licença
Este projeto está sob a licença MIT.
