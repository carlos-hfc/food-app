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

## Tecnologias Utilizadas
- [Fastify](https://www.fastify.io/) (framework web)
- [Prisma](https://www.prisma.io/) (ORM)
- [TypeScript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/) (testes)
- [Docker](https://www.docker.com/) (opcional, para ambiente de desenvolvimento)

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

## Como Executar

1. **Instale as dependências:**
```powershell
npm install
```
2. **Configure o banco de dados:**
- Crie o arquivo `.env` com as variáveis de ambiente necessárias.
  ```powershell
  PORT=
  DATABASE_URL=
  JWT_SECRET=
  NODE_ENV=
  ```
- Execute as migrações do Prisma:
  ```powershell
  npx prisma migrate dev
  ```
- (Opcional) Popule o banco com dados de exemplo:
  ```powershell
  npx prisma db seed
  ```
3. **Inicie o servidor:**
```powershell
npm run dev
```
O servidor estará disponível em `http://localhost:3333` (ou porta definida em `.env`).

## Testes
Execute os testes com:
```powershell
npm run test
```

## Endpoints Principais
- `/restaurants` - Gerenciamento de restaurantes
- `/products` - Gerenciamento de produtos
- `/orders` - Gerenciamento de pedidos
- `/address` - Gerenciamento de endereços
- `/favorites` - Favoritos
- `/metrics` - Métricas e relatórios

## Licença
Este projeto é distribuído sob a licença MIT.
