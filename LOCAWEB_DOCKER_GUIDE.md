# 🚀 Guia Prático: Deploy HomeFinance no Locaweb com Docker

**Data:** 1º de Abril de 2026  
**Status:** Passo-a-passo simplificado  
**Método:** Docker + docker-compose

---

## 📋 Este Guia Cobre:

- ✅ Teste local com Docker
- ✅ Criar servidor no Locaweb
- ✅ Deploy com Docker
- ✅ Configurar domínio + SSL
- ✅ Monitoramento

---

## 🏠 PARTE 1: Teste Local com Docker

### 1️⃣ Verificar Docker Instalado

```bash
# Verificar se Docker está instalado
docker --version      # Docker version 20+
docker-compose --version  # ou docker compose
```

### 2️⃣ Preparar Variáveis de Produção

Crie arquivo `.env.production`:

```bash
cat > /home/yago/Documentos/workdir/siteYago/.env.production << 'EOF'
# Produção
NODE_ENV=production
PORT=5000

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=homefinance
DB_PASSWORD=sua_senha_segura_123!@#
DB_NAME=homefinance
DATABASE_URL=postgresql://homefinance:sua_senha_segura_123!@#@postgres:5432/homefinance

# JWT
JWT_SECRET=sua_jwt_secret_super_segura_123!@#
JWT_EXPIRY=7d

# Frontend
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=HomeFinance

# CORS
CORS_ORIGIN=http://localhost:5173
EOF

cat /home/yago/Documentos/workdir/siteYago/.env.production
```

**⚠️ IMPORTANTE:** Mudar todas as senhas para senhas fortes!

### 3️⃣ Testar Localmente com Docker

```bash
cd /home/yago/Documentos/workdir/siteYago

# Construir imagens Docker
docker-compose build

# Iniciar containers
docker-compose up -d

# Aguardar 10 segundos para banco de dados inicializar
sleep 10

# Verificar se está rodando
docker-compose ps

# Ver logs
docker-compose logs -f backend
```

### 4️⃣ Testar Aplicação

```bash
# Verificar health check
curl http://localhost:5000/health

# Testar login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"senha123"}'

# Abrir no navegador
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

### 5️⃣ Parar Containers (local)

```bash
docker-compose down    # Para containers
docker-compose down -v # Para e remove volumes (banco resetado)
```

---

## 🌐 PARTE 2: Criar Servidor no Locaweb

### 1️⃣ Informações Necessárias

Você precisa:
- ✅ Conta Locaweb ativa
- ✅ Domínio registrado (ex: meuapp.com.br)
- ✅ Acesso a cPanel ou SSH do servidor
- ✅ Docker instalado no servidor

### 2️⃣ Etapas no Painel Locaweb

1. **Login no painel:** https://painel.locaweb.com.br
2. **Criar novo plano:**
   - Escolher Linux/VPS com Node.js suporte
   - Mínimo 2GB RAM, 20GB SSD
   - Versão Node.js 20+
3. **Anotar dados:**
   - IP do servidor
   - Usuário SSH
   - Senha SSH
   - Domínio

---

## 🔑 PARTE 3: Deploy no Servidor Locaweb

### 1️⃣ Conectar via SSH

```bash
# Conectar ao servidor Locaweb
ssh usuario@seu-ip-servidor.locaweb.com.br

# Ou se tiver domínio
ssh usuario@seu-dominio.com.br

# Senha: use a que você recebeu
```

### 2️⃣ Criar Diretórios do Projeto

```bash
# No servidor Locaweb, faça:
mkdir -p /home/usuario/apps/homefinance
cd /home/usuario/apps/homefinance

# Clonar repositório do GitHub
git clone https://github.com/YagoRod23/homefinance.git .

# Entrar no diretório
cd /home/usuario/apps/homefinance
```

### 3️⃣ Verificar Docker no Servidor

```bash
# Verificar se Docker está instalado
docker --version
docker-compose --version

# Se não estiver instalado, instale:
# (Pode pedir acesso root)

# Ubuntu/Debian:
sudo apt-get install docker.io docker-compose

# Inicie Docker:
sudo systemctl start docker
sudo systemctl enable docker

# Adicione seu usuário ao grupo docker:
sudo usermod -aG docker $USER
newgrp docker
```

### 4️⃣ Configurar Variáveis de Ambiente

```bash
# No servidor, criar .env.production com senhas fortes
cat > /home/usuario/apps/homefinance/.env.production << 'EOF'
NODE_ENV=production
PORT=5000

# Database - ALTERAR SENHA!
DB_USER=homefinance
DB_PASSWORD=sua_senha_MUITO_segura_123!@#
DB_NAME=homefinance
DATABASE_URL=postgresql://homefinance:sua_senha_MUITO_segura_123!@#@postgres:5432/homefinance

# JWT - GERAR NOVA SECRET!
JWT_SECRET=sua_jwt_secret_production_123!@#$%^&*

# Domínio
VITE_API_URL=https://seu-dominio.com.br/api
CORS_ORIGIN=https://seu-dominio.com.br

# Produção
JWT_EXPIRY=7d
EOF

# Mudar permissões
chmod 600 /home/usuario/apps/homefinance/.env.production
```

### 5️⃣ Construir e Rodar Containers

```bash
# Entrar no diretório
cd /home/usuario/apps/homefinance

# Construir imagens
docker-compose build

# Iniciar em background
docker-compose up -d

# Aguardar 15 segundos para banco inicializar
sleep 15

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

### 6️⃣ Testar no Servidor

```bash
# Health check
curl http://localhost:5000/health

# Ver logs
docker-compose logs backend
```

---

## 🌍 PARTE 4: Configurar Nginx Reverse Proxy

### 1️⃣ Criar Configuração Nginx

```bash
# No servidor Locaweb
cat > /etc/nginx/sites-available/homefinance << 'EOF'
upstream homefinance_backend {
    server localhost:5000;
}

server {
    listen 80;
    listen [::]:80;
    server_name seu-dominio.com.br www.seu-dominio.com.br;

    # Redirect HTTP → HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name seu-dominio.com.br www.seu-dominio.com.br;

    # SSL (configurar depois)
    ssl_certificate /etc/ssl/certs/seu-dominio.crt;
    ssl_certificate_key /etc/ssl/private/seu-dominio.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Root para frontend
    root /home/usuario/apps/homefinance/frontend/dist;

    # API proxy
    location /api/ {
        proxy_pass http://homefinance_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    error_page 404 /index.html;
}
EOF

# Habilitar site
sudo ln -s /etc/nginx/sites-available/homefinance /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 2️⃣ Criar Build Frontend

Não é preciso fazer no servidor, pode fazer local e copiar:

```bash
# EM SEU COMPUTADOR:
cd frontend
npm run build

# Copiar arquivo index.html built para o servidor
# Ou rebuildar no servidor depois
```

---

## 🔐 PARTE 5: SSL/HTTPS com Let's Encrypt

### 1️⃣ Instalar Certbot

```bash
# No servidor
sudo apt-get install certbot python3-certbot-nginx

# Gerar certificado
sudo certbot certonly --nginx -d seu-dominio.com.br -d www.seu-dominio.com.br

# Será criado em:
# /etc/letsencrypt/live/seu-dominio.com.br/fullchain.pem
# /etc/letsencrypt/live/seu-dominio.com.br/privkey.pem
```

### 2️⃣ Atualizar Nginx Config

```bash
# Editar arquivo acima e mudar os caminhos SSL:
sudo nano /etc/nginx/sites-available/homefinance

# Alterar para:
ssl_certificate /etc/letsencrypt/live/seu-dominio.com.br/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com.br/privkey.pem;

# Salvar e reiniciar
sudo systemctl restart nginx
```

---

## 📊 PARTE 6: Monitoramento e Manutenção

### Verificar Status

```bash
# Performance do sistema
docker stats

# Logs aplicação
docker-compose logs -f backend --tail=50

# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Espaço em disco
df -h
docker system df
```

### Auto-restart Containers

Por padrão, docker-compose não reinicia containers. Adicione ao docker-compose.yml:

```yaml
services:
  backend:
    restart_policy:
      condition: on-failure
      delay: 5s
      max_attempts: 5
      window: 120s
```

### Backup do Banco de Dados

```bash
# Backup manualmente
docker-compose exec postgres pg_dump -U homefinance homefinance > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar
cat backup_file.sql | docker-compose exec -T postgres psql -U homefinance homefinance
```

---

## 🆘 Troubleshooting

### Containers Não Iniciam

```bash
# Ver erro
docker-compose logs backend

# Resetar tudo
docker-compose down -v
docker-compose up -d
docker-compose logs
```

### Conexão com Banco de Dados

```bash
# Verificar se postgres está pronto
docker-compose exec postgres pg_isready -U homefinance

# Ver status básico
docker-compose ps
```

### Nginx 502 Bad Gateway

```bash
# Verificar se backend está rodando
docker-compose exec backend curl http://localhost:5000/health

# Ver logs nginx
sudo tail -f /var/log/nginx/error.log
```

### Limpar Tudo e Recomeçar

```bash
# CUIDADO: Deleta banco de dados!
docker-compose down -v
rm -rf node_modules
git pull origin master
docker-compose build --no-cache
docker-compose up -d
```

---

## ✅ Checklist Final

- [ ] Docker e docker-compose instalados no servidor
- [ ] Código clonado do GitHub
- [ ] `.env.production` criado com senhas fortes
- [ ] Containers rodando (`docker-compose up -d`)
- [ ] Health check passando (`curl http://localhost:5000/health`)
- [ ] Nginx configurado como reverse proxy
- [ ] SSL/HTTPS funciando
- [ ] Domínio apontando para IP do servidor
- [ ] Backup automático do DB configurado
- [ ] Monitoramento de logs ativo

---

## 🚀 Próximos Passos

1. **Hoje:** Fazer teste local com docker-compose
2. **Amanhã:** Criar servidor no Locaweb
3. **Depois:** SSH, clonar código, rodar containers
4. **Depois:** Configurar Nginx + SSL
5. **Final:** Testar domínio + deploy completo!

---

**Pronto? Vamos começar? Execute o comando abaixo para testar localmente:**

```bash
cd /home/yago/Documentos/workdir/siteYago
docker-compose build
docker-compose up -d
sleep 10
docker-compose ps
curl http://localhost:5000/health
```
