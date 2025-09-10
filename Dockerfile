# syntax=docker/dockerfile:1.7

# -------- Estágio base: instala dependências com cache --------
FROM node:20-alpine AS base

ENV NODE_ENV=production \
    npm_config_loglevel=warn \
    npm_config_fund=false \
    npm_config_audit=false

WORKDIR /app

# Copia apenas os manifestos primeiro para melhorar o cache das camadas
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Instala dependências de produção usando cache; prefere npm ci se houver lockfile
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    if [ -f package-lock.json ]; then npm ci --omit=dev; \
    else npm install --omit=dev; fi

# -------- Estágio de runtime: imagem mínima --------
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Copia apenas os node_modules de runtime do estágio base
COPY --from=base /app/node_modules ./node_modules

# Copia o código-fonte da aplicação
COPY . .

# Expõe a porta da aplicação (Server.js usa process.env.PORT || 3000)
EXPOSE 3000

# Cria usuário não-root por segurança e define propriedade da pasta
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs \
    && chown -R nodeuser:nodejs /app
USER nodeuser

#  Healthcheck HTTP simples
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT||3000), r=>{if(r.statusCode<500)process.exit(0);process.exit(1)}).on('error',()=>process.exit(1))"

# Inicia o servidor
CMD ["node", "server.js"]
