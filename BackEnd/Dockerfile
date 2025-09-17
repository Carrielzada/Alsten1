# ========================================
# DOCKERFILE OTIMIZADO PARA BACKEND NODE.JS
# ========================================

FROM node:18-alpine

WORKDIR /app

# OTIMIZAÇÃO: Cache layer para dependencies
# Só rebuilda se package.json mudar
COPY package.json package-lock.json* ./

# npm ci é mais rápido e reproduzível para produção
RUN npm ci --only=production --silent && npm cache clean --force

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar código fonte
COPY . .

# Criar diretórios necessários
RUN mkdir -p logs uploads

# Definir permissões corretas
RUN chown -R nodejs:nodejs /app

# Usar usuário não-root
USER nodejs

EXPOSE 3001

CMD ["npm", "start"]