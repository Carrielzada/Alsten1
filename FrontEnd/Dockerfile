# ========================================
# DOCKERFILE OTIMIZADO PARA FRONTEND REACT  
# Multi-stage build para reduzir tamanho final
# ========================================

# STAGE 1: Build do React
FROM node:18-alpine AS builder

WORKDIR /app

# OTIMIZAÇÃO: Copiar package.json primeiro para aproveitar cache Docker
COPY package.json package-lock.json* ./

# OTIMIZAÇÃO: npm ci é mais rápido e reproduzível que npm install
RUN npm ci --only=production --silent && npm cache clean --force

# Copiar código fonte
COPY . .

# Build otimizado
ENV NODE_OPTIONS="--max-old-space-size=1024"
RUN npm run build

# STAGE 2: Runtime com Nginx (imagem final muito menor)
FROM nginx:alpine

# Copiar apenas os arquivos built
COPY --from=builder /app/build /usr/share/nginx/html

# Configuração Nginx otimizada para SPA React
RUN echo 'server { \
    listen 3000; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    # Cache para assets estáticos \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]