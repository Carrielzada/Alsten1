# 🌊 DEPLOY COM COOLIFY - APLICAÇÃO ALSTEN

## 🎯 **POR QUE COOLIFY?**

- ✅ **100% GRATUITO** - Sem licenças ou custos ocultos
- ✅ **Deploy automático** - Cada push no Git = deploy automático
- ✅ **Interface web** - Gerenciamento visual intuitivo
- ✅ **SSL automático** - Certificados Let's Encrypt gratuitos
- ✅ **Monitoramento** - Logs, métricas e status em tempo real
- ✅ **Backup automático** - Banco de dados e arquivos
- ✅ **Rollback** - Voltar versão anterior com um clique

## 🚀 **INSTALAÇÃO RÁPIDA**

### **1. Na VPS (após trocar o SO):**
```bash
# Instalar Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# Executar script de deploy
chmod +x deploy-coolify.sh
./deploy-coolify.sh
```

### **2. Acessar interface web:**
```
http://31.97.151.181:3000
```

## ⚙️ **CONFIGURAÇÃO DAS APLICAÇÕES**

### **🔧 BACKEND (alsten-backend)**

#### **Configurações básicas:**
- **Nome**: `alsten-backend`
- **Porta**: `3001`
- **Branch**: `main` ou `master`

#### **Build Command:**
```bash
npm install
```

#### **Start Command:**
```bash
npm start
```

#### **Variáveis de ambiente:**
```env
DB_HOST=31.97.151.181
DB_PORT=3306
DB_USER=admin
DB_SENHA=Alsten@321
DB_NOME=alsten_os
NODE_ENV=production
PORT=3001
CHAVE_SECRETA=Alsten@2024#SecretKey#Production
FRONTEND_URL=http://31.97.151.181:3000
```

### **🎨 FRONTEND (alsten-frontend)**

#### **Configurações básicas:**
- **Nome**: `alsten-frontend`
- **Porta**: `3000`
- **Branch**: `main` ou `master`

#### **Build Command:**
```bash
npm install && npm run build
```

#### **Start Command:**
```bash
npx serve -s build -l 3000
```

#### **Variáveis de ambiente:**
```env
REACT_APP_API_URL=http://31.97.151.181:3001
REACT_APP_FRONTEND_URL=http://31.97.151.181:3000
NODE_ENV=production
```

## 🌐 **CONFIGURAÇÃO DE DOMÍNIO**

### **1. Adicionar domínio no Coolify:**
- Vá em `Settings` > `Domains`
- Adicione seu domínio (ex: `alsten.com.br`)

### **2. Configurar DNS:**
```
Tipo: A
Nome: @
Valor: 31.97.151.181
```

### **3. SSL automático:**
- O Coolify configurará automaticamente o SSL
- Certificados Let's Encrypt gratuitos

## 📊 **MONITORAMENTO**

### **Dashboard principal:**
- Status das aplicações
- Uso de recursos (CPU, RAM, disco)
- Logs em tempo real
- Métricas de performance

### **Logs:**
- Logs de build
- Logs de runtime
- Logs de erro
- Histórico de deploys

## 🔄 **WORKFLOW DE DESENVOLVIMENTO**

### **1. Desenvolvimento local:**
```bash
# Fazer alterações
git add .
git commit -m "Nova funcionalidade"
git push origin main
```

### **2. Deploy automático:**
- Coolify detecta o push
- Faz build automático
- Deploy em produção
- Notificação de sucesso/erro

### **3. Rollback (se necessário):**
- Um clique para voltar versão anterior
- Zero downtime

## 🚨 **SOLUÇÃO DE PROBLEMAS**

### **Aplicação não inicia:**
1. Verificar logs no Coolify
2. Verificar variáveis de ambiente
3. Verificar se o banco está acessível
4. Verificar se as portas estão livres

### **Erro de build:**
1. Verificar logs de build
2. Verificar dependências no package.json
3. Verificar Node.js version
4. Testar build localmente

### **Erro de conexão com banco:**
1. Verificar se MariaDB está rodando
2. Verificar credenciais
3. Verificar firewall
4. Testar conexão manual

## 📱 **COMANDOS ÚTEIS**

### **Via interface web:**
- **Deploy**: Clique em "Deploy"
- **Restart**: Clique em "Restart"
- **Logs**: Clique em "Logs"
- **Settings**: Clique em "Settings"

### **Via SSH (se necessário):**
```bash
# Verificar status
sudo systemctl status coolify

# Reiniciar Coolify
sudo systemctl restart coolify

# Ver logs
sudo journalctl -u coolify -f
```

## 🎉 **VANTAGENS DO COOLIFY**

### **Para desenvolvedores:**
- Deploy com um clique
- Rollback instantâneo
- Logs centralizados
- Monitoramento em tempo real

### **Para DevOps:**
- Zero configuração manual
- Backup automático
- SSL automático
- Escalabilidade fácil

### **Para negócio:**
- Zero custo de licença
- Redução de tempo de deploy
- Maior confiabilidade
- Facilidade de manutenção

## 🔗 **LINKS ÚTEIS**

- **Documentação oficial**: https://coolify.io/docs
- **GitHub**: https://github.com/coollabsio/coolify
- **Comunidade**: https://discord.gg/coolify

---

**🎯 Com Coolify, sua aplicação Alsten terá deploy profissional sem custos!**
