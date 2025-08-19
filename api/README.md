# Food App API

Esta é a API do Food App, um sistema para gerenciamento de restaurantes, produtos, pedidos e avaliações. O backend é desenvolvido em Node.js utilizando Fastify, Prisma e TypeScript.

## Funcionalidades
- Autenticação de usuários e clientes
- Cadastro e gerenciamento de restaurantes
- Cadastro e gerenciamento de produtos
- Gerenciamento de endereços
- Favoritos de restaurantes
- Criação e acompanhamento de pedidos
- Avaliação de pedidos e restaurantes
- Métricas e relatórios
- Upload de imagens para produtos e restaurantes
- Suporte a CORS e cookies

## Requisitos

- Node.js 20+
- Docker e Docker Compose
- npm/pnpm (ou outro gerenciador, dependendo do projeto)

## Tecnologias Utilizadas

- [Fastify](https://www.fastify.io/)
- [Prisma](https://www.prisma.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/)
- [Docker](https://www.docker.com/)

## Estrutura do Projeto
```
api/
├── src/
│   ├── routes/         # Rotas da API
│   ├── middlewares/    # Middlewares customizados
│   ├── utils/          # Utilitários
│   ├── error-handler.ts
│   ├── env.ts
│   └── server.ts       # Inicialização do servidor Fastify
├── prisma/
│   ├── schema.prisma   # Modelo do banco de dados
│   └── seed.ts         # Seed de dados
├── uploads/            # Imagens enviadas
├── docker-compose.yml  # Ambiente Docker
├── package.json        # Dependências e scripts
└── tsconfig.json       # Configuração TypeScript
```

## Configuração

1. Clone o repositório:
```sh
git clone https://github.com/carlos-hfc/food-app.git
```

2. Instale as dependências:
```sh
cd api
npm install
```

3. Configure as variáveis ambiente:
```sh
PORT=
DATABASE_URL=
JWT_SECRET=
NODE_ENV=
```

4. Rode o banco de dados com Docker:
```sh
docker-compose up -d
```

5. Execute as migrações do Prisma:
```sh
npm run prisma:migrate
```

6. Popule o banco com exemplos: (opcional)
```sh
npm run prisma:seed
```

## Executando o projeto

1. Inicie o servidor de desenvolvimento:
```sh
npm run dev
```

2. Acesse [http://localhost:3333](http://localhost:3333) no navegador (ou com a porta definida no `.env`)

## Endpoints Principais

- `/restaurants` - Gerenciamento de restaurantes
- `/products` - Gerenciamento de produtos
- `/orders` - Gerenciamento de pedidos
- `/address` - Gerenciamento de endereços
- `/favorites` - Favoritos
- `/metrics` - Métricas e relatórios

## Scripts

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run prisma:migrate`: Executa as migrações do Prisma
- `npm run prisma:seed`: Popula o banco com dados fictícios
- `npm run test`: Executa os testes

## Contribuição

Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro para discutir o que você gostaria de modificar.

## Licença

Este projeto está sob a licença MIT.
