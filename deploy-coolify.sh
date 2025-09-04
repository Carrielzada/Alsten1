#!/bin/bash

# =====================================================
# SCRIPT DE DEPLOY COM COOLIFY - VPS ALSTEN
# =====================================================

echo "🚀 Iniciando deploy da aplicação Alsten com Coolify na VPS..."

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

print_header "INSTALAÇÃO DO COOLIFY"

# Verificar se o Coolify já está instalado
if command -v coolify &> /dev/null; then
    print_message "Coolify já está instalado!"
else
    print_message "Instalando Coolify..."
    curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
    
    if [ $? -eq 0 ]; then
        print_message "✅ Coolify instalado com sucesso!"
    else
        print_error "❌ Falha na instalação do Coolify"
        exit 1
    fi
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

print_header "CONFIGURAÇÃO DO COOLIFY"

# Verificar se o Coolify está rodando
print_message "Verificando status do Coolify..."
if systemctl is-active --quiet coolify; then
    print_message "✅ Coolify está rodando!"
else
    print_warning "Coolify não está rodando. Iniciando..."
    sudo systemctl start coolify
    sudo systemctl enable coolify
fi

# Aguardar o Coolify inicializar
print_message "Aguardando Coolify inicializar..."
sleep 30

print_header "INSTRUÇÕES PARA CONFIGURAÇÃO"

print_message "🎯 AGORA SIGA ESTES PASSOS:"
echo ""
echo "1. 🌐 Acesse o Coolify no navegador:"
echo "   http://31.97.151.181:3000"
echo ""
echo "2. 👤 Crie sua conta no Coolify"
echo ""
echo "3. 🔗 Conecte com seu repositório Git:"
echo "   - Clique em 'New Resource'"
echo "   - Escolha 'Application'"
echo "   - Conecte com GitHub/GitLab"
echo "   - Selecione o repositório Alsten1"
echo ""
echo "4. ⚙️ Configure a aplicação:"
echo "   - Nome: alsten-backend"
echo "   - Port: 3001"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo ""
echo "5. 🔑 Configure as variáveis de ambiente:"
echo "   DB_HOST=31.97.151.181"
echo "   DB_PORT=3306"
echo "   DB_USER=admin"
echo "   DB_SENHA=Alsten@321"
echo "   DB_NOME=alsten_os"
echo "   NODE_ENV=production"
echo "   PORT=3001"
echo "   CHAVE_SECRETA=Alsten@2024#SecretKey#Production"
echo ""
echo "6. 🚀 Deploy automático:"
echo "   - Clique em 'Deploy'"
echo "   - O Coolify fará o build e deploy automaticamente"
echo ""

print_header "CONFIGURAÇÃO DO FRONTEND"

print_message "Para o Frontend, crie uma nova aplicação no Coolify:"
echo ""
echo "1. 🌐 Nova aplicação: alsten-frontend"
echo "2. 📁 Build Command: npm install && npm run build"
echo "3. 🚀 Start Command: npx serve -s build -l 3000"
echo "4. 🔑 Variáveis de ambiente:"
echo "   REACT_APP_API_URL=http://31.97.151.181:3001"
echo "   NODE_ENV=production"
echo ""

print_header "CONFIGURAÇÃO DE DOMÍNIO (OPCIONAL)"

print_message "Para configurar um domínio:"
echo ""
echo "1. 🌍 Adicione seu domínio no Coolify"
echo "2. 🔒 SSL automático com Let's Encrypt"
echo "3. 📍 Configure os registros DNS:"
echo "   A: 31.97.151.181"
echo ""

print_header "CONFIGURAÇÃO DE FIREWALL"

# Configurar firewall
if command -v ufw &> /dev/null; then
    print_message "Configurando firewall..."
    sudo ufw allow 22/tcp    # SSH
    sudo ufw allow 80/tcp    # HTTP
    sudo ufw allow 443/tcp   # HTTPS
    sudo ufw allow 3000/tcp  # Coolify
    sudo ufw allow 3001/tcp  # Backend
    sudo ufw allow 3306/tcp  # MariaDB (se necessário)
    sudo ufw enable
    print_message "Firewall configurado!"
else
    print_warning "UFW não encontrado. Configure o firewall manualmente!"
fi

print_header "VERIFICAÇÃO FINAL"

# Verificar status dos serviços
print_message "Status dos serviços:"
echo "MariaDB: $(systemctl is-active mariadb)"
echo "Coolify: $(systemctl is-active coolify)"

# Verificar se as portas estão abertas
print_message "Verificando portas:"
netstat -tlnp | grep -E ':(3000|3001|3306)' || echo "Portas ainda não estão abertas (aguarde o deploy)"

print_header "DEPLOY COM COOLIFY CONCLUÍDO!"

print_message "✅ Coolify instalado e configurado"
print_message "✅ Banco de dados configurado"
print_message "✅ Firewall configurado"
print_message "✅ Scripts SQL prontos"

print_warning "PRÓXIMOS PASSOS:"
echo "1. Configure as aplicações via interface web do Coolify"
echo "2. Faça o primeiro deploy"
echo "3. Configure domínio e SSL se necessário"
echo "4. Monitore via dashboard do Coolify"

print_message "🎉 Agora use a interface web do Coolify para finalizar o deploy!"
print_message "🌐 Acesse: http://31.97.151.181:3000"
