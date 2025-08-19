# Food App Web

Este projeto é um aplicativo web para gestão de restaurantes, pedidos e produtos, desenvolvido com React, TypeScript e Vite.

## Funcionalidades
- Autenticação de usuários (login, cadastro, logout)
- Dashboard com métricas de pedidos, receitas e avaliações
- Gerenciamento de produtos e restaurantes
- Visualização e aprovação/cancelamento de pedidos
- Relatórios de receitas e pedidos por período
- Upload de imagens para produtos e restaurantes
- Filtros e tabelas para avaliações e pedidos
- Interface moderna

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
│   ├── http/              # Funções para requisições HTTP
│   ├── lib/               # Utilitários e bibliotecas auxiliares
│   ├── pages/             # Páginas principais (Home, Restaurante, Auth, etc)
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
cd web
npm install
```

3. Configure as variáveis ambiente:
```sh
VITE_API_URL=
```

## Executando o projeto 

1. Inicie o servidor de desenvolvimento:
```sh
npm run dev
```

2. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a versão de produção
- `npm run preview`: Visualiza a build de produção localmente

## Contribuição

Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro para discutir o que você gostaria de modificar.

## Licença

Este projeto está sob a licença MIT.
