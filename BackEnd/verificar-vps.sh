#!/bin/bash

# Script para verificar recursos da VPS e identificar problemas de performance

echo "🔍 VERIFICANDO RECURSOS DA VPS..."
echo "=================================="

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

# 1. Verificar uso de CPU
print_header "CPU"
echo "Uso atual de CPU:"
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1
echo ""

# 2. Verificar uso de memória
print_header "MEMÓRIA"
echo "Uso de memória:"
free -h
echo ""

# 3. Verificar uso de disco
print_header "DISCO"
echo "Uso de disco:"
df -h
echo ""

# 4. Verificar processos que mais consomem CPU
print_header "PROCESSOS COM MAIS CPU"
echo "Top 10 processos por CPU:"
ps aux --sort=-%cpu | head -11
echo ""

# 5. Verificar processos que mais consomem memória
print_header "PROCESSOS COM MAIS MEMÓRIA"
echo "Top 10 processos por memória:"
ps aux --sort=-%mem | head -11
echo ""

# 6. Verificar containers Docker
print_header "CONTAINERS DOCKER"
echo "Status dos containers:"
docker ps -a
echo ""

# 7. Verificar uso de recursos por container
print_header "RECURSOS DOS CONTAINERS"
echo "Uso de recursos por container:"
docker stats --no-stream
echo ""

# 8. Verificar logs do sistema
print_header "LOGS DO SISTEMA"
echo "Últimas 20 linhas do syslog:"
tail -20 /var/log/syslog | grep -E "(error|Error|ERROR|fail|Fail|FAIL)" || echo "Nenhum erro encontrado nos logs recentes"
echo ""

# 9. Verificar serviços críticos
print_header "SERVIÇOS CRÍTICOS"
echo "Status dos serviços:"
systemctl status mariadb --no-pager -l | head -10
echo ""
systemctl status coolify --no-pager -l | head -10
echo ""

# 10. Verificar portas em uso
print_header "PORTAS EM USO"
echo "Portas ativas:"
netstat -tlnp | grep -E ':(3000|3001|3306|22|80|443)'
echo ""

# 11. Verificar temperatura (se disponível)
print_header "TEMPERATURA"
if command -v sensors &> /dev/null; then
    sensors | grep -E "(temp|Core)" | head -5
else
    echo "Sensors não disponível"
fi
echo ""

# 12. Verificar carga do sistema
print_header "CARGA DO SISTEMA"
echo "Load average:"
uptime
echo ""

# 13. Verificar processos Node.js
print_header "PROCESSOS NODE.JS"
echo "Processos Node.js ativos:"
ps aux | grep node | grep -v grep || echo "Nenhum processo Node.js encontrado"
echo ""

# 14. Verificar uso de swap
print_header "SWAP"
echo "Uso de swap:"
swapon --show
free -h | grep Swap
echo ""

# 15. Recomendações
print_header "RECOMENDAÇÕES"

# Verificar se CPU está muito alta
cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 | cut -d'.' -f1)
if [ "$cpu_usage" -gt 80 ]; then
    print_warning "CPU está muito alta (${cpu_usage}%). Considere:"
    echo "  - Verificar processos desnecessários"
    echo "  - Otimizar queries do banco"
    echo "  - Aumentar recursos da VPS"
fi

# Verificar se memória está muito baixa
mem_available=$(free -m | grep Mem | awk '{print $7}')
if [ "$mem_available" -lt 100 ]; then
    print_warning "Memória disponível muito baixa (${mem_available}MB). Considere:"
    echo "  - Aumentar RAM da VPS"
    echo "  - Otimizar aplicações"
    echo "  - Configurar swap adequado"
fi

# Verificar se disco está muito cheio
disk_usage=$(df / | tail -1 | awk '{print $5}' | cut -d'%' -f1)
if [ "$disk_usage" -gt 80 ]; then
    print_warning "Disco está muito cheio (${disk_usage}%). Considere:"
    echo "  - Limpar logs antigos"
    echo "  - Remover arquivos temporários"
    echo "  - Aumentar espaço em disco"
fi

print_status "Verificação concluída!"
echo ""
echo "💡 Para monitoramento contínuo, use:"
echo "   - htop (para CPU/memória em tempo real)"
echo "   - docker stats (para containers)"
echo "   - journalctl -u coolify -f (para logs do Coolify)"
