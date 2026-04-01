# 🚀 Guia Completo de Deploy - HomeFinance no Locaweb

**Status:** Aplicação pronta para produção ✅
**Versão:** 5.0 (Todas as Phases completas)
**Data:** 1º de Abril de 2026

---

## 📋 Checklist Pré-Deploy

- [x] Phase 1: Infraestrutura 100% completa
- [x] Phase 2: Autenticação com JWT implementada
- [x] Phase 3: CRUD + Divisão automática de despesas
- [x] Phase 4: Frontend UI responsivo
- [x] Phase 5: Analytics & Relatórios
- [x] Testes de login funcionando
- [x] Banco de dados populado com dados de teste
- [x] CORS configurado
- [x] Versionamento Git iniciado
- [x] .gitignore criado

---

## 🔧 Opção 1: Deploy no Locaweb (Recomendado)

### Pré-requisitos Locaweb
- Conta Locaweb ativa
- Acesso ao painel de controle
- Domínio registrado (ou usar subdomínio)
- SSH acesso ao servidor

### 1️⃣ Preparar Servidor Locaweb

```bash
# 1. SSH no servidor Locaweb
ssh usuario@seu-servidor.locaweb.com.br

# 2. Criar diretório do projeto
mkdir -p /home/username/homefinance
cd /home/username/homefinance

# 3. Clonar repositório (substitua URL)
git clone https://github.com/seu-usuario/homefinance.git .

# 4. Instalar Node.js (se não estiver)
# Locaweb geralmente oferece Node.js via cPanel
# Ou instale via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### 2️⃣ Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env
cat > /home/username/homefinance/.env << 'EOF'
# Backend
NODE_ENV=production
PORT=5000
DB_HOST=seu-db-host.locaweb.com.br
DB_PORT=5432
DB_USER=homefinance
DB_PASSWORD=sua-senha-super-segura
DB_NAME=homefinance
JWT_SECRET=sua-jwt-secret-super-segura
JWT_EXPIRY=7d

# Frontend
VITE_API_URL=https://seu-dominio.com.br/api
VITE_APP_NAME=HomeFinance
EOF
```

### 3️⃣ Instalar Dependências

```bash
cd /home/username/homefinance

# Backend
cd backend
npm install
npm run build

# Frontend
cd ../frontend
npm install
npm run build
cd ..
```

### 4️⃣ Configurar Banco de Dados

```bash
# Se usando PostgreSQL Locaweb:
psql -h seu-db-host -U homefinance -d homefinance < ./backend/src/db/schema.sql

# Ou execute as migrations Drizzle
cd backend
npm run db:push
cd ..
```

### 5️⃣ Configurar Servidor Web (Nginx/Apache)

#### Para Nginx:
```nginx
upstream homefinance_backend {
    server localhost:5000;
}

upstream homefinance_frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name seu-dominio.com.br www.seu-dominio.com.br;
    
    # Redirect HTTP → HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com.br www.seu-dominio.com.br;

    ssl_certificate /etc/ssl/certs/seu-dominio.crt;
    ssl_certificate_key /etc/ssl/private/seu-dominio.key;

    # API
    location /api/ {
        proxy_pass http://homefinance_backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend
    location / {
        proxy_pass http://homefinance_frontend/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Para Apache (cpanel .htaccess):
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.html [L]
</IfModule>

# API Proxy
ProxyPass /api/ http://localhost:5000/api/
ProxyPassReverse /api/ http://localhost:5000/api/
```

### 6️⃣ PM2 para Gerenciamento de Processos

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Criar arquivo ecosystem.config.js
cat > /home/username/homefinance/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'homefinance-backend',
      script: './backend/dist/index.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'homefinance-frontend',
      script: 'npm',
      args: 'run preview',
      cwd: './frontend',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/frontend-err.log',
      out_file: './logs/frontend-out.log',
    }
  ]
};
EOF

# Iniciar com PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7️⃣ SSL/HTTPS (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Gerar certificado
sudo certbot certonly --nginx -d seu-dominio.com.br

# Auto-renovação
sudo systemctl enable certbot.timer
```

---

## 🐳 Opção 2: Deploy com Docker (Alternativa)

### Dockerfile Backend (já existe)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend ./
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "start"]
```

### Dockerfile Frontend (já existe)
```dockerfile
FROM node:20-alpine as builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```bash
# Usar docker-compose.yml existente
docker-compose -f docker-compose.yml up -d

# Verificar status
docker-compose ps
docker-compose logs -f
```

---

## 📦 Opção 3: Usar Vercel + Backend Separado

### Deploy Frontend (Vercel)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

### Deploy Backend (Heroku/Railway/Render)
```bash
# Exemplo com Heroku
heroku create homefinance-api
git push heroku main
```

---

## 🔐 Segurança em Produção

### Checklist de Segurança
- [ ] Alterar todas as senhas padrão
- [ ] Configurar CORS corretamente
- [ ] Habilitar HTTPS obrigatório
- [ ] Configurar rate limiting
- [ ] Implementar WAF (Web Application Firewall)
- [ ] Backup automático do banco de dados
- [ ] Configurar logs e monitoramento
- [ ] Usar variáveis de ambiente seguras

### Exemplo CORS Produção
```javascript
// backend/src/index.ts
const corsOptions = {
  origin: 'https://seu-dominio.com.br',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### Rate Limiting
```bash
npm install express-rate-limit

# Em backend/src/index.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por IP
});

app.use('/api/', limiter);
```

---

## 🔄 CI/CD com GitHub Actions

### Arquivo `.github/workflows/deploy.yml`
```yaml
name: Deploy HomeFinance

on:
  push:
    branches: [ main, master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    
    - name: Install & Build Backend
      run: |
        cd backend
        npm install
        npm run build
    
    - name: Install & Build Frontend
      run: |
        cd frontend
        npm install
        npm run build
    
    - name: Deploy to Locaweb
      env:
        DEPLOY_KEY: ${{ secrets.LOCAWEB_SSH_KEY }}
        DEPLOY_HOST: ${{ secrets.LOCAWEB_HOST }}
        DEPLOY_USER: ${{ secrets.LOCAWEB_USER }}
      run: |
        # Script de deploy aqui
        echo "Deploying to Locaweb..."
```

---

## 📊 Monitoramento em Produção

### PM2 Monitoring
```bash
# Ativar monitoramento
pm2 web

# Acessar em http://localhost:9615
```

### Logs
```bash
# Ver logs em tempo real
pm2 logs

# Ver logs específicos
pm2 logs homefinance-backend
pm2 logs homefinance-frontend
```

### Backup Automático
```bash
# Backup diário do banco
0 2 * * * pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > /backups/homefinance_$(date +\%Y\%m\%d).sql
```

---

## 🚨 Troubleshooting

### Porta já em uso
```bash
# Encontrar processo na porta
lsof -i :5000

# Matar processo
kill -9 <PID>
```

### Banco de dados não conecta
```bash
# Verificar conexão PostgreSQL
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT VERSION();"

# Verificar firewall
sudo ufw allow 5432
```

### Aplicação não inicia
```bash
# Ver logs de erro
pm2 logs homefinance-backend --err

# Verificar variáveis de ambiente
env | grep DB_
```

---

## ✅ Checklist Final de Deploy

- [ ] Código commitado e versionado
- [ ] .env configurado com senhas seguras
- [ ] Banco de dados preparado
- [ ] SSL/HTTPS ativado
- [ ] Domínio apontando para servidor
- [ ] Nginx/Apache configurado
- [ ] PM2 rodando aplicações
- [ ] Backups configurados
- [ ] Monitoramento ativo
- [ ] Testes em produção bem-sucedidos

---

## 📞 Suporte Locaweb

- Website: https://www.locaweb.com.br
- Suporte: https://suporte.locaweb.com.br
- Docs: https://docs.locaweb.com.br

---

## 📝 Próximos Passos Após Deploy

1. **Configurar Email**: Integrar SendGrid/Mailgun
2. **Analytics**: Google Analytics, Hotjar
3. **Backup Automático**: Configurar rotina diária
4. **CDN**: Cloudflare, AWS CloudFront
5. **Pagamentos**: Integrar Stripe/PagSeguro
6. **Notificações**: WhatsApp Business API
7. **Scaling**: Preparar para crescimento

---

## 🎉 Pronto para Deploy!

A aplicação está **100% pronta** para ir para produção. Escolha uma das opções acima e comece o deploy! 🚀
