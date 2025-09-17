# MindTracking — Front-End (Next.js)

Este repositório contém o front-end da MindTracking, desenvolvido com Next.js (App Router), React e TypeScript. Abaixo você encontra uma documentação completa: stack, estrutura de pastas, convenções, como rodar localmente, build e deploy.

## Stack e Tecnologias
- **Next.js 15** (App Router) — Framework React para SSR/SSG/ISR
- **React 19** e **React DOM 19** — Biblioteca base de UI
- **TypeScript 5** — Tipagem estática
- **Tailwind CSS v4** — Utilitários de estilos
- **PostCSS** com `@tailwindcss/postcss` — Pipeline de estilos
- **ESLint 9** + `eslint-config-next` — Padrões e boas práticas
- **Prettier** + `prettier-plugin-tailwindcss` — Formatação automática e ordenação de classes
- **Lucide React** — Ícones
- **Framer Motion** — Animações (pronto para uso)
- **Docker** — Build multi-stage de produção (Node 20 Alpine)

Principais arquivos de configuração:
- `package.json`: scripts e dependências
- `tsconfig.json`: aliases e opções do TypeScript (inclui alias `@/*` → `src/*`)
- `next.config.mjs` e `next.config.ts`: configurações do Next.js (modo estrito, SWC, `output: "standalone"`)
- `tailwind.config.js` e `postcss.config.mjs`: Tailwind v4 + PostCSS
- `eslint.config.mjs`: ESLint (flat config) estendendo `next/core-web-vitals` e `next/typescript`
- `Dockerfile`: build multi-stage (builder + runner) para produção

## Scripts
- `npm run dev`: sobe o servidor de desenvolvimento
- `npm run build`: compila o projeto para produção
- `npm run start`: inicia o servidor Next em produção (usa `.next` gerado)
- `npm run lint`: roda o ESLint

## Estrutura de Pastas
Abaixo, uma visão geral do conteúdo em `src/` e pastas relevantes:

```
src/
  app/
    (private)/                # Rotas/segmentos privados (ex.: exige auth)
    (public)/                 # Rotas/segmentos públicos
    layout.tsx                # Root layout (App Router)
    page.tsx                  # Página inicial ("/")

  components/
    common/                   # Componentes reutilizáveis e atômicos
      ButtonColors/
        index.tsx
      Buttons/
        ButtonVerificarEmail.tsx
      Inputs/
        InputEmail.tsx
      Modals/
        ModalRedefinicaoSenha.tsx

    features/                 # Componentes por feature/módulo
      Auth/
        RedefinicaoSenha/
          VerificacaoEmail/
            index.tsx

    layout/                   # Componentes estruturais (layout)
      Footer/
        index.tsx
      Header/
        index.tsx
      Sidebar/
        index.tsx
        SidebarItem.tsx

  contexts/
    ThemeContext.tsx          # Contexto de tema (claro/escuro, etc.)

  styles/
    globals.css               # Estilos globais (importado no App Router)

public/
  images/                     # Imagens e ícones estáticos
```

- O projeto utiliza o **App Router** do Next.js (pasta `src/app`).
- Segmente rotas com pastas nomeadas (ex.: `(public)` e `(private)`) para organização por contexto.
- Componentes são agrupados por **domínio** (`features`) e por **reuso** (`components/common`) e **layout**.
- Contextos React residem em `src/contexts`.

## Convenções de Código
- **Linguagem**: TypeScript com `strict: true`.
- **Aliases**: use `@/` para importar a partir de `src/`, por exemplo:
  ```ts
  import Header from "@/components/layout/Header";
  ```
- **Nomeação**: componentes em PascalCase, arquivos com o nome do componente (ex.: `Header/index.tsx`).
- **Estilos**: preferir utilitários do Tailwind. Classes são ordenadas automaticamente via `prettier-plugin-tailwindcss`.
- **Organização de componentes**:
  - `components/common`: atômicos e altamente reutilizáveis (inputs, botões, modais).
  - `components/layout`: estrutura visual compartilhada (Header, Footer, Sidebar).
  - `components/features`: UI orientada a casos de uso (ex.: autenticação/redefinição de senha).
- **Ícones**: use `lucide-react` quando possível.
- **Animações**: `framer-motion` pronto para composições simples e transições.

## Como Rodar Localmente
Pré-requisitos: Node.js 20+ e npm.

```bash
npm ci          # instala dependências com package-lock
npm run dev     # http://localhost:3000
```

Dicas:
- Se for a primeira vez, `npm i` também funciona, mas `npm ci` garante reprodutibilidade.
- Variáveis de ambiente: caso necessárias futuramente, utilize `.env.local` (não versionado). Atualmente não há chaves obrigatórias para iniciar.

## Build de Produção
```bash
npm run build
npm run start   # inicia o servidor Next usando o build gerado
```

O `next.config.mjs` está com `reactStrictMode: true`, `swcMinify: true` e `output: "standalone"`, o que facilita deploys em ambientes containerizados e plataformas de serverless que suportam Node.js.

## Docker
O projeto inclui um `Dockerfile` multi-stage (builder + runner) com base `node:20-alpine`.

Build da imagem:
```bash
docker build -t mindtracking-frontend .
```

Rodar o container (porta 80 exposta no container):
```bash
docker run -p 3000:80 --name mindtracking-web mindtracking-frontend
# Acesse: http://localhost:3000
```

Notas:
- O estágio de builder roda `npm ci`, `tsc --noEmit` e `npm run build`.
- No runner, apenas dependências de produção são instaladas.
- Porta padrão do container: `80`, mapeada para `3000` local no exemplo acima.

## Lint e Formatação
- Lint:
  ```bash
  npm run lint
  ```
- Prettier (recomendado via editor): o projeto já contém `.prettierrc` e plugin para ordenar classes do Tailwind.

## Estilos (Tailwind CSS v4)
- Conteúdos escaneados via `tailwind.config.js` em `./src/**/*.{js,ts,jsx,tsx}`.
- Use utilitários no JSX. Exemplos:
  ```tsx
  export default function Exemplo() {
    return <button className="rounded-md bg-blue-600 px-4 py-2 text-white">OK</button>;
  }
  ```
- Estilos globais ficam em `src/styles/globals.css`.

## Rotas e Layouts (App Router)
- `src/app/layout.tsx`: layout raiz (providers, fontes, `<html>`, `<body>`).
- `src/app/page.tsx`: página inicial.
- Pastas nomeadas como segmentos agrupadores `(public)` e `(private)` ajudam a organizar domínios de rotas.

## Fluxo de Navegação

### Páginas Públicas
- **Landing Page**
  - **Entrar** → Auth (Login/Cadastro) - via modal
  - **Cadastrar-se** → Auth (Sign Up) - via modal
- **Auth (Login / Cadastro / Recuperação de senha)**
  - Após login bem-sucedido → Dashboard
  - Recuperação de senha → confirmação via modal
- **Not Found (404)**
  - Página de fallback para rotas inexistentes
  - **Voltar para Home** → Landing Page

### Páginas Protegidas (usuário autenticado)
- **Dashboard**
  - Acesso ao Diário
  - Acesso ao Questionário
  - Acesso ao Perfil
  - Acesso ao Athena (assistente virtual)
- **Diário** → volta para Dashboard
- **Questionário** → volta para Dashboard
- **Perfil**
  - Configurações de conta
  - Logout → volta para Landing Page
- **Athena (assistente virtual)** → navegação paralela, pode voltar ao Dashboard



## Context API
- `src/contexts/ThemeContext.tsx`: provê estado de tema. Importe no layout raiz para efeito global.

## Assets
- Coloque imagens/ícones em `public/`. Esses arquivos são servidos diretamente, ex.: `/images/Logo.svg`.

## Boas Práticas
- Tipar todas as props de componentes.
- Evitar `any` — preferir tipos explícitos.
- Early returns para simplificar fluxos.
- Manter componentes pequenos e focados.
- Separar componentes de UI (apresentacionais) de containers quando fizer sentido.

## Roadmap/Futuros Melhorias
- Configurar testes (ex.: Vitest/RTL) e pipeline de CI.
- Adicionar verificação de tipos no CI (`tsc --noEmit`).
- Documentar convenções de acessibilidade (ARIA, foco, contraste) e adicionar checagens automatizadas.

---
Se tiver dúvidas ou precisar evoluir esta documentação (ex.: adicionar `.env` ou políticas de deploy específicas), abra uma issue ou solicite um PR com as alterações. 