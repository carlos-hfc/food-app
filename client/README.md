# Food App Client

Aplicação web para pedidos em restaurantes, desenvolvida com React, TypeScript e Vite.

## Funcionalidades

- Listagem dos melhores restaurantes
- Busca de restaurantes por nome
- Visualização de cardápio e informações detalhadas
- Adição de restaurantes aos favoritos
- Autenticação de usuários (login e cadastro)
- Carrinho de compras e checkout
- Avaliações e comentários de restaurantes

## Requisitos

- Node.js 20+
- pnpm (ou outro gerenciador)

## Tecnologias Utilizadas

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)

## Estrutura do Projeto

```
client/
├── public/                # Arquivos estáticos (imagens, ícones)
├── src/
│   ├── components/        # Componentes reutilizáveis (Header, Footer, etc)
│   ├── contexts/          # Contextos React para estado global
│   ├── hooks/             # Hooks customizados
│   ├── http/              # Funções para requisições HTTP
│   ├── lib/               # Utilitários e bibliotecas auxiliares
│   ├── pages/             # Páginas principais (Home, Restaurante, Auth, etc)
│   ├── reducers/          # Reducers para gerenciamento de estado
│   ├── index.css          # Estilos globais
│   ├── main.tsx           # Ponto de entrada da aplicação
│   └── app.tsx            # Componente principal
├── index.html             # HTML principal
├── package.json           # Dependências e scripts
├── vite.config.ts         # Configuração do Vite
└── tsconfig*.json         # Configurações do TypeScript
```

## Configuração

1. Clone o repositório:
```sh
git clone https://github.com/carlos-hfc/food-app.git
```

2. Instale as dependências:
```sh
cd client
pnpm install
```

3. Configure as variáveis ambiente:
```sh
VITE_API_URL=
```

## Executando o projeto

1. Inicie o servidor de desenvolvimento:
```sh
pnpm dev
```

2. Acesse [http://localhost:5173](http://localhost:5173) no navegador.

## Scripts

- `pnpm dev` — Inicia o ambiente de desenvolvimento
- `pnpm build` — Gera a versão de produção
- `pnpm preview` — Visualiza o build localmente

## Contribuição

Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro para discutir o que você gostaria de modificar.

## Licença

Este projeto está sob a licença MIT.
