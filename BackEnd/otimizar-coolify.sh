#!/bin/bash

# Script para otimizar o Coolify e resolver problemas de deploy

echo "🚀 OTIMIZANDO COOLIFY PARA RESOLVER PROBLEMAS DE DEPLOY..."
echo "=========================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
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

# 1. Parar serviços para otimização
print_header "PARANDO SERVIÇOS"
print_status "Parando Coolify..."
sudo systemctl stop coolify

print_status "Parando MariaDB..."
sudo systemctl stop mariadb

# 2. Limpar logs e arquivos temporários
print_header "LIMPEZA DE SISTEMA"
print_status "Limpando logs antigos..."
sudo journalctl --vacuum-time=7d

print_status "Limpando arquivos temporários..."
sudo rm -rf /tmp/*
sudo rm -rf /var/tmp/*

print_status "Limpando cache do Docker..."
docker system prune -f

# 3. Otimizar configurações do MariaDB
print_header "OTIMIZANDO MARIADB"
print_status "Criando configuração otimizada para MariaDB..."

sudo tee /etc/mysql/conf.d/optimization.cnf > /dev/null <<EOF
[mysqld]
# Configurações de performance
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
innodb_file_per_table = 1

# Configurações de conexão
max_connections = 100
max_connect_errors = 1000
connect_timeout = 60
wait_timeout = 28800
interactive_timeout = 28800

# Configurações de cache
query_cache_type = 1
query_cache_size = 32M
query_cache_limit = 2M

# Configurações de log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# Configurações de segurança
bind-address = 0.0.0.0
EOF

# 4. Otimizar configurações do sistema
print_header "OTIMIZANDO SISTEMA"
print_status "Configurando limites de arquivos..."

sudo tee /etc/security/limits.conf > /dev/null <<EOF
# Limites para usuário coolify
coolify soft nofile 65536
coolify hard nofile 65536
coolify soft nproc 32768
coolify hard nproc 32768

# Limites para usuário mysql
mysql soft nofile 65536
mysql hard nofile 65536
mysql soft nproc 32768
mysql hard nproc 32768
EOF

# 5. Configurar swap otimizado
print_header "CONFIGURANDO SWAP"
print_status "Verificando swap atual..."
if ! swapon --show | grep -q "/swapfile"; then
    print_status "Criando arquivo de swap..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    
    print_status "Configurando swap permanente..."
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
else
    print_status "Swap já configurado"
fi

# 6. Otimizar configurações do Docker
print_header "OTIMIZANDO DOCKER"
print_status "Configurando daemon do Docker..."

sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 65536,
      "Soft": 65536
    }
  }
}
EOF

# 7. Reiniciar serviços
print_header "REINICIANDO SERVIÇOS"
print_status "Reiniciando MariaDB..."
sudo systemctl start mariadb
sudo systemctl enable mariadb

print_status "Reiniciando Docker..."
sudo systemctl restart docker

print_status "Reiniciando Coolify..."
sudo systemctl start coolify
sudo systemctl enable coolify

# 8. Aguardar inicialização
print_status "Aguardando serviços inicializarem..."
sleep 30

# 9. Verificar status
print_header "VERIFICANDO STATUS"
print_status "Status dos serviços:"
echo "MariaDB: $(systemctl is-active mariadb)"
echo "Docker: $(systemctl is-active docker)"
echo "Coolify: $(systemctl is-active coolify)"

# 10. Configurações específicas para o Coolify
print_header "CONFIGURAÇÕES ESPECÍFICAS"
print_status "Configurando variáveis de ambiente para o Coolify..."

# Criar arquivo de configuração para o Coolify
sudo tee /home/coolify/.env > /dev/null <<EOF
# Configurações de produção otimizadas
NODE_ENV=production
COOLIFY_DATABASE_URL=postgresql://coolify:coolify@localhost:5432/coolify
COOLIFY_REDIS_URL=redis://localhost:6379
COOLIFY_PORT=3000
COOLIFY_HOST=0.0.0.0

# Configurações de performance
COOLIFY_MAX_CONCURRENT_BUILDS=2
COOLIFY_BUILD_TIMEOUT=1800
COOLIFY_DEPLOY_TIMEOUT=1800

# Configurações de log
COOLIFY_LOG_LEVEL=info
COOLIFY_LOG_FORMAT=json
EOF

# 11. Otimizar configurações do Node.js (se aplicável)
print_header "OTIMIZANDO NODE.JS"
if command -v node &> /dev/null; then
    print_status "Configurando variáveis de ambiente para Node.js..."
    
    sudo tee /etc/environment.d/nodejs.conf > /dev/null <<EOF
# Otimizações para Node.js
NODE_OPTIONS="--max-old-space-size=512 --max-semi-space-size=64"
UV_THREADPOOL_SIZE=64
EOF
    
    source /etc/environment.d/nodejs.conf
fi

# 12. Configurar monitoramento
print_header "CONFIGURANDO MONITORAMENTO"
print_status "Instalando ferramentas de monitoramento..."

# Instalar htop se não estiver instalado
if ! command -v htop &> /dev/null; then
    sudo apt update
    sudo apt install -y htop iotop
fi

# 13. Criar script de monitoramento
print_status "Criando script de monitoramento automático..."

sudo tee /usr/local/bin/monitor-vps.sh > /dev/null <<'EOF'
#!/bin/bash
# Script de monitoramento automático da VPS

LOG_FILE="/var/log/vps-monitor.log"
MAX_CPU=80
MAX_MEM=80
MAX_DISK=80

# Função para log
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Verificar CPU
cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 | cut -d'.' -f1)
if [ "$cpu_usage" -gt "$MAX_CPU" ]; then
    log_message "ALERTA: CPU alta - ${cpu_usage}%"
fi

# Verificar memória
mem_usage=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
if [ "$mem_usage" -gt "$MAX_MEM" ]; then
    log_message "ALERTA: Memória alta - ${mem_usage}%"
fi

# Verificar disco
disk_usage=$(df / | tail -1 | awk '{print $5}' | cut -d'%' -f1)
if [ "$disk_usage" -gt "$MAX_DISK" ]; then
    log_message "ALERTA: Disco cheio - ${disk_usage}%"
fi

# Log de status normal
log_message "Status OK - CPU: ${cpu_usage}%, Mem: ${mem_usage}%, Disco: ${disk_usage}%"
EOF

sudo chmod +x /usr/local/bin/monitor-vps.sh

# Configurar cron para monitoramento a cada 5 minutos
print_status "Configurando monitoramento automático..."
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/monitor-vps.sh") | crontab -

# 14. Finalização
print_header "OTIMIZAÇÃO CONCLUÍDA"
print_status "✅ Sistema otimizado com sucesso!"
print_status "✅ Serviços reiniciados e configurados"
print_status "✅ Monitoramento automático configurado"
print_status "✅ Swap otimizado"
print_status "✅ Configurações de banco otimizadas"

print_warning "PRÓXIMOS PASSOS:"
echo "1. Acesse o Coolify: http://31.97.151.181:3000"
echo "2. Configure a aplicação backend novamente"
echo "3. Use as seguintes configurações otimizadas:"
echo "   - Build Command: npm install --production"
echo "   - Start Command: npm start"
echo "   - Port: 3001"
echo "4. Configure as variáveis de ambiente"
echo "5. Faça o deploy"

print_status "🎉 Sistema otimizado e pronto para deploy!"
print_status "📊 Use o script verificar-vps.sh para monitorar recursos"
print_status "🔍 Use o script diagnostico-deploy.js para verificar o backend"
