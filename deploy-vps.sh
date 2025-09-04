#!/bin/bash

# =====================================================
# SCRIPT DE DEPLOY PARA VPS ALSTEN
# =====================================================

echo "🚀 Iniciando deploy da aplicação Alsten na VPS..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=====================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=====================================================${NC}"
}

# Verificar se estamos na VPS
if [ ! -f "/etc/os-release" ]; then
    print_error "Este script deve ser executado na VPS!"
    exit 1
fi

print_header "CONFIGURAÇÃO DO BANCO DE DADOS"

# Verificar se o MariaDB está rodando
if ! systemctl is-active --quiet mariadb; then
    print_error "MariaDB não está rodando. Iniciando..."
    sudo systemctl start mariadb
    sudo systemctl enable mariadb
fi

print_message "MariaDB está rodando!"

# Criar banco de dados se não existir
print_message "Criando banco de dados alsten_os..."
mysql -u root -p'Alsten@123' -e "CREATE DATABASE IF NOT EXISTS alsten_os;"

# Criar usuário admin se não existir
print_message "Criando usuário admin..."
mysql -u root -p'Alsten@123' -e "CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'Alsten@321';"
mysql -u root -p'Alsten@123' -e "GRANT ALL PRIVILEGES ON alsten_os.* TO 'admin'@'%';"
mysql -u root -p'Alsten@123' -e "FLUSH PRIVILEGES;"

print_message "Usuário admin criado com sucesso!"

# Executar script SQL para criar tabelas
print_message "Executando script SQL para criar tabelas..."
if [ -f "BackEnd/criar_banco_completo.sql" ]; then
    mysql -u admin -p'Alsten@321' alsten_os < BackEnd/criar_banco_completo.sql
    print_message "Tabelas criadas com sucesso!"
else
    print_warning "Arquivo criar_banco_completo.sql não encontrado!"
fi

print_header "CONFIGURAÇÃO DO BACKEND"

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    print_message "Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

print_message "Node.js $(node --version) instalado!"

# Instalar PM2 se não estiver instalado
if ! command -v pm2 &> /dev/null; then
    print_message "Instalando PM2..."
    sudo npm install -g pm2
fi

print_message "PM2 instalado!"

# Configurar arquivo .env do Backend
print_message "Configurando arquivo .env do Backend..."
cd BackEnd

# Copiar arquivo de exemplo para .env
if [ -f "env.production.txt" ]; then
    cp env.production.txt .env
    print_message "Arquivo .env criado!"
else
    print_warning "Arquivo env.production.txt não encontrado!"
fi

# Instalar dependências
print_message "Instalando dependências do Backend..."
npm install --production

# Criar diretório de logs
mkdir -p logs
mkdir -p uploads

print_message "Backend configurado!"

print_header "CONFIGURAÇÃO DO FRONTEND"

cd ../FrontEnd

# Configurar arquivo .env do Frontend
print_message "Configurando arquivo .env do Frontend..."
if [ -f "env.production.txt" ]; then
    cp env.production.txt .env
    print_message "Arquivo .env criado!"
else
    print_warning "Arquivo env.production.txt não encontrado!"
fi

# Instalar dependências
print_message "Instalando dependências do Frontend..."
npm install --production

# Build de produção
print_message "Fazendo build de produção..."
npm run build

print_message "Frontend configurado!"

print_header "CONFIGURAÇÃO DO PM2"

cd ..

# Criar arquivo de configuração do PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'alsten-backend',
      script: './BackEnd/index.js',
      cwd: './BackEnd',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    },
    {
      name: 'alsten-frontend',
      script: 'serve',
      cwd: './FrontEnd/build',
      args: '-s -l 3000',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOF

print_message "Arquivo de configuração do PM2 criado!"

# Instalar serve para o Frontend
print_message "Instalando serve para o Frontend..."
sudo npm install -g serve

# Iniciar aplicações com PM2
print_message "Iniciando aplicações com PM2..."
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar com o sistema
pm2 startup

print_header "CONFIGURAÇÃO DE FIREWALL"

# Configurar firewall (se UFW estiver ativo)
if command -v ufw &> /dev/null; then
    print_message "Configurando firewall..."
    sudo ufw allow 22/tcp    # SSH
    sudo ufw allow 3000/tcp  # Frontend
    sudo ufw allow 3001/tcp  # Backend
    sudo ufw allow 3306/tcp  # MariaDB (se necessário acesso remoto)
    print_message "Firewall configurado!"
else
    print_warning "UFW não encontrado. Configure o firewall manualmente!"
fi

print_header "VERIFICAÇÃO FINAL"

# Verificar status das aplicações
print_message "Status das aplicações:"
pm2 status

# Verificar se as portas estão abertas
print_message "Verificando portas:"
netstat -tlnp | grep -E ':(3000|3001|3306)'

print_header "DEPLOY CONCLUÍDO!"

print_message "✅ Backend rodando na porta 3001"
print_message "✅ Frontend rodando na porta 3000"
print_message "✅ Banco de dados configurado"
print_message "✅ PM2 configurado para auto-restart"

print_warning "IMPORTANTE:"
echo "1. Configure o domínio/apelido DNS se necessário"
echo "2. Configure SSL/HTTPS se necessário"
echo "3. Monitore os logs: pm2 logs"
echo "4. Reinicie as aplicações: pm2 restart all"

print_message "🎉 Aplicação Alsten deployada com sucesso na VPS!"
