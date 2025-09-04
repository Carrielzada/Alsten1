# 🚀 CONFIGURAÇÃO OTIMIZADA PARA DEPLOY NO COOLIFY

## 🎯 **PROBLEMA IDENTIFICADO**
O Coolify está reiniciando o serviço do backend constantemente devido a:
- Alto uso de CPU (100%)
- Problemas de case sensitivity já corrigidos
- Configurações não otimizadas para produção

## 🔧 **SOLUÇÃO COMPLETA**

### **1. EXECUTAR OTIMIZAÇÃO DA VPS**
```bash
# Na VPS, execute:
chmod +x BackEnd/otimizar-coolify.sh
sudo ./BackEnd/otimizar-coolify.sh
```

### **2. VERIFICAR RECURSOS DA VPS**
```bash
# Após otimização, verifique:
chmod +x BackEnd/verificar-vps.sh
./BackEnd/verificar-vps.sh
```

### **3. DIAGNÓSTICO DO BACKEND**
```bash
# No diretório BackEnd:
node diagnostico-deploy.js
```

## ⚙️ **CONFIGURAÇÃO NO COOLIFY**

### **🔧 APLICAÇÃO: alsten-backend**

#### **Configurações Básicas:**
- **Nome**: `alsten-backend`
- **Porta**: `3001`
- **Branch**: `main`

#### **Build Command (OTIMIZADO):**
```bash
npm ci --only=production --no-audit --no-fund
```

#### **Start Command (OTIMIZADO):**
```bash
NODE_ENV=production NODE_OPTIONS="--max-old-space-size=512" npm start
```

#### **Variáveis de Ambiente (CRÍTICAS):**
```env
# Banco de dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=admin
DB_SENHA=Alsten@321
DB_NOME=alsten_os

# Aplicação
NODE_ENV=production
PORT=3001
CHAVE_SECRETA=Alsten@2024#SecretKey#Production

# Otimizações
NODE_OPTIONS=--max-old-space-size=512
UV_THREADPOOL_SIZE=64

# CORS
FRONTEND_URL=http://31.97.151.181:3000
```

## 🚨 **CONFIGURAÇÕES ESPECIAIS NO COOLIFY**

### **1. Recursos da Aplicação:**
- **CPU Limit**: `0.5` (50% da CPU)
- **Memory Limit**: `512M`
- **Swap**: `256M`

### **2. Health Check:**
- **Path**: `/`
- **Port**: `3001`
- **Interval**: `30s`
- **Timeout**: `10s`
- **Retries**: `3`

### **3. Rede:**
- **Port**: `3001`
- **Protocol**: `HTTP`
- **Internal Port**: `3001`

## 🔍 **VERIFICAÇÕES PÓS-DEPLOY**

### **1. Logs do Coolify:**
- Acesse a aplicação no Coolify
- Clique em "Logs"
- Verifique se não há erros de importação
- Verifique se a aplicação está respondendo

### **2. Teste da Aplicação:**
```bash
# Teste se está respondendo
curl http://31.97.151.181:3001/

# Verifique logs em tempo real
docker logs -f [CONTAINER_ID]
```

### **3. Monitoramento de Recursos:**
```bash
# Use o script de monitoramento
./BackEnd/verificar-vps.sh

# Ou monitore em tempo real
htop
docker stats
```

## 🛠️ **RESOLUÇÃO DE PROBLEMAS COMUNS**

### **Problema: Aplicação não inicia**
**Solução:**
1. Verificar logs no Coolify
2. Verificar variáveis de ambiente
3. Testar localmente com `node diagnostico-deploy.js`
4. Verificar se o banco está acessível

### **Problema: CPU muito alta**
**Solução:**
1. Executar `otimizar-coolify.sh`
2. Limitar recursos da aplicação no Coolify
3. Verificar queries do banco
4. Otimizar código se necessário

### **Problema: Memória insuficiente**
**Solução:**
1. Configurar swap adequado
2. Limitar memória da aplicação
3. Otimizar configurações do MariaDB
4. Considerar aumentar RAM da VPS

### **Problema: Deploy falha**
**Solução:**
1. Verificar logs de build
2. Verificar dependências no package.json
3. Usar `npm ci` em vez de `npm install`
4. Verificar permissões de arquivos

## 📊 **MONITORAMENTO CONTÍNUO**

### **1. Script Automático:**
O script `monitor-vps.sh` foi configurado para rodar a cada 5 minutos e registrar:
- Uso de CPU
- Uso de memória
- Uso de disco
- Alertas quando recursos estão altos

### **2. Logs do Sistema:**
```bash
# Ver logs de monitoramento
tail -f /var/log/vps-monitor.log

# Ver logs do Coolify
sudo journalctl -u coolify -f

# Ver logs do MariaDB
sudo tail -f /var/log/mysql/error.log
```

## 🎯 **CHECKLIST FINAL**

- [ ] Executar `otimizar-coolify.sh`
- [ ] Verificar recursos com `verificar-vps.sh`
- [ ] Testar backend com `diagnostico-deploy.js`
- [ ] Configurar aplicação no Coolify com configurações otimizadas
- [ ] Configurar variáveis de ambiente
- [ ] Fazer deploy
- [ ] Verificar logs e status
- [ ] Testar aplicação
- [ ] Configurar monitoramento contínuo

## 🚀 **RESULTADO ESPERADO**

Após seguir este guia:
- ✅ CPU não deve mais ficar em 100%
- ✅ Coolify não deve mais reiniciar constantemente
- ✅ Backend deve fazer deploy com sucesso
- ✅ Aplicação deve responder normalmente
- ✅ Sistema deve estar otimizado para produção

---

**💡 DICA**: Se ainda houver problemas, execute o diagnóstico completo e verifique os logs específicos do erro.
