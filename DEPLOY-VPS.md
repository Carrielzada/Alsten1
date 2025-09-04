# 🚀 DEPLOY DA APLICAÇÃO ALSTEN NA VPS

## 📋 Pré-requisitos

- VPS com Ubuntu/Debian
- Acesso root ou sudo
- IP da VPS: `31.97.151.181`
- MariaDB instalado e configurado

## 🎯 **OPÇÕES DE PAINÉIS DE CONTROLE (GRATUITOS)**

### **🏆 RECOMENDAÇÃO PRINCIPAL: COOLIFY**
- ✅ **100% GRATUITO** - Sem licenças ou custos ocultos
- ✅ **Deploy automático** - Cada push no Git = deploy automático
- ✅ **Interface web** - Gerenciamento visual intuitivo
- ✅ **SSL automático** - Certificados Let's Encrypt gratuitos
- ✅ **Monitoramento** - Logs, métricas e status em tempo real

### **🥈 ALTERNATIVAS:**
- **CloudPanel** - Gratuito para uso pessoal
- **Dokploy** - Gratuito para projetos open-source
- **CyberPanel** - Gratuito com recursos limitados

## 🔧 Configuração Inicial da VPS

### 1. Acesso SSH
```bash
ssh root@31.97.151.181
```

### 2. Atualizar sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Instalar dependências básicas
```bash
sudo apt install -y curl wget git unzip nginx
```

## 🗄️ Configuração do MariaDB

### 1. Acessar MariaDB como root
```bash
mysql -u root -p
# Senha: Alsten@123
```

### 2. Criar banco e usuário
```sql
CREATE DATABASE alsten_os;
CREATE USER 'admin'@'%' IDENTIFIED BY 'Alsten@321';
GRANT ALL PRIVILEGES ON alsten_os.* TO 'admin'@'%';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Testar conexão
```bash
mysql -u admin -p -h 31.97.151.181 alsten_os
# Senha: Alsten@321
```

## 📁 Deploy da Aplicação

### **🚀 OPÇÃO 1: DEPLOY COM COOLIFY (RECOMENDADO)**

#### **Instalação do Coolify:**
```bash
# Instalar Coolify
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# Executar script de deploy
chmod +x deploy-coolify.sh
./deploy-coolify.sh
```

#### **Configuração via interface web:**
1. Acessar: `http://31.97.151.181:3000`
2. Criar conta
3. Conectar com repositório Git
4. Configurar aplicações (Backend + Frontend)
5. Deploy automático

#### **Vantagens:**
- ✅ Deploy automático com cada push
- ✅ Interface web intuitiva
- ✅ SSL automático
- ✅ Monitoramento em tempo real
- ✅ Rollback com um clique

### **🔧 OPÇÃO 2: DEPLOY MANUAL COM PM2**

#### Backend
```bash
cd BackEnd

# Copiar arquivo de configuração
cp env.production.txt .env

# Instalar dependências
npm install --production

# Criar diretórios necessários
mkdir -p logs uploads

# Testar conexão com banco
node testarConexao.js
```

#### Frontend
```bash
cd FrontEnd

# Copiar arquivo de configuração
cp env.production.txt .env

# Instalar dependências
npm install --production

# Build de produção
npm run build
```

## 🚀 Configuração do PM2 (se não usar Coolify)

### 1. Instalar PM2
```bash
sudo npm install -g pm2
```

### 2. Criar arquivo de configuração
```bash
# Na raiz do projeto
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
```

### 3. Iniciar aplicações
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🌐 Configuração do Nginx (Opcional)

### 1. Criar configuração do site
```bash
sudo nano /etc/nginx/sites-available/alsten
```

### 2. Conteúdo da configuração
```nginx
server {
    listen 80;
    server_name 31.97.151.181;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Ativar site
```bash
sudo ln -s /etc/nginx/sites-available/alsten /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Configuração de Firewall

### 1. Configurar UFW
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (se usar Nginx)
sudo ufw allow 3000/tcp  # Frontend/Coolify
sudo ufw allow 3001/tcp  # Backend
sudo ufw allow 3306/tcp  # MariaDB (se necessário)
sudo ufw enable
```

## 📊 Monitoramento

### **Com Coolify:**
- Dashboard web em tempo real
- Logs centralizados
- Métricas de recursos
- Status das aplicações

### **Com PM2:**
```bash
# Status das aplicações
pm2 status
pm2 logs

# Verificar portas
netstat -tlnp | grep -E ':(3000|3001|3306)'

# Verificar logs
tail -f BackEnd/logs/combined.log
pm2 logs alsten-backend
pm2 logs alsten-frontend
```

## 🔄 Comandos Úteis

### **Com Coolify:**
- Deploy: Via interface web
- Restart: Via interface web
- Logs: Via interface web
- Monitoramento: Dashboard integrado

### **Com PM2:**
```bash
# Reiniciar aplicações
pm2 restart all
pm2 restart alsten-backend
pm2 restart alsten-frontend

# Parar aplicações
pm2 stop all
pm2 delete all

# Atualizar aplicação
git pull origin main
npm install --production
pm2 restart all
```

## 🚨 Solução de Problemas

### 1. Aplicação não inicia
```bash
# Com Coolify: Verificar logs na interface web
# Com PM2: pm2 logs

# Verificar se as portas estão em uso
sudo lsof -i :3000
sudo lsof -i :3001
```

### 2. Erro de conexão com banco
```bash
# Testar conexão
cd BackEnd
node testarConexao.js

# Verificar se MariaDB está rodando
sudo systemctl status mariadb
```

### 3. Erro de permissão
```bash
# Corrigir permissões
sudo chown -R $USER:$USER .
chmod +x deploy-*.sh
```

## 📝 Arquivos de Configuração

### Backend (.env)
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

### Frontend (.env)
```env
REACT_APP_API_URL=http://31.97.151.181:3001
REACT_APP_FRONTEND_URL=http://31.97.151.181:3000
NODE_ENV=production
```

## ✅ Verificação Final

### **Com Coolify:**
1. ✅ Coolify rodando na porta 3000
2. ✅ Backend configurado e rodando
3. ✅ Frontend configurado e rodando
4. ✅ Banco de dados acessível
5. ✅ Deploy automático funcionando

### **Com PM2:**
1. ✅ Backend rodando na porta 3001
2. ✅ Frontend rodando na porta 3000
3. ✅ Banco de dados acessível
4. ✅ Aplicações iniciando automaticamente com PM2
5. ✅ Firewall configurado
6. ✅ Logs sendo gerados

## 🌍 URLs de Acesso

- **Coolify**: http://31.97.151.181:3000
- **Frontend**: http://31.97.151.181:3000 (se não usar Coolify)
- **Backend API**: http://31.97.151.181:3001
- **Banco de Dados**: 31.97.151.181:3306

## 📞 Suporte

### **Com Coolify:**
1. Verificar dashboard web
2. Verificar logs na interface
3. Verificar configurações das aplicações
4. Verificar variáveis de ambiente

### **Com PM2:**
1. Verificar logs: `pm2 logs`
2. Verificar status: `pm2 status`
3. Teste a conexão com o banco
4. Verifique as configurações dos arquivos .env

## 🎯 **RECOMENDAÇÃO FINAL**

**Use o Coolify!** É a melhor opção porque:
- ✅ **Totalmente gratuito**
- ✅ **Deploy automático**
- ✅ **Interface profissional**
- ✅ **Zero configuração manual**
- ✅ **Monitoramento integrado**

---

**🎉 Sua aplicação Alsten está pronta para produção na VPS!**

**Escolha o Coolify para ter uma experiência profissional sem custos!**
