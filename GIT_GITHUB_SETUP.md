# 🔗 Git & GitHub Setup - HomeFinance

## ✅ Status Atual
- [x] Repositório Git local inicializado
- [x] Primeiro commit realizado
- [x] .gitignore configurado
- [ ] Conectar com GitHub (Próximo passo)

---

## 📍 Próximos Passos para GitHub

### 1️⃣ Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Nome do repositório: `homefinance`
3. Descrição: `HomeFinance - Gerenciador de Despesas Compartilhadas com React + Node.js`
4. Selecione: **Private** (se quiser privado)
5. Clique em **Create repository**

### 2️⃣ Conectar Repositório Local ao GitHub

```bash
# Adicionar remote (substitua URL)
cd /home/yago/Documentos/workdir/siteYago
git remote add origin https://github.com/seu-usuario/homefinance.git

# Renomear branch para 'main' (padrão GitHub)
git branch -M main

# Push inicial
git push -u origin main
```

### 3️⃣ Verificar Conexão

```bash
# Ver remotes configurados
git remote -v

# Deve mostrar:
# origin  https://github.com/seu-usuario/homefinance.git (fetch)
# origin  https://github.com/seu-usuario/homefinance.git (push)
```

---

## 🔐 Usando SSH (Recomendado)

### Gerar chave SSH (se não tiver)

```bash
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"
# Ou RSA (compatibilidade):
ssh-keygen -t rsa -b 4096 -C "seu-email@exemplo.com"
```

### Adicionar chave ao GitHub

1. Copiar chave pública:
```bash
cat ~/.ssh/id_ed25519.pub
```

2. Ir para https://github.com/settings/keys
3. Clicar em **New SSH key**
4. Colar a chave pública
5. Clicar em **Add SSH key**

### Alterar remote para SSH

```bash
git remote set-url origin git@github.com:seu-usuario/homefinance.git

# Verificar
git remote -v
```

---

## 📤 Workflow de Push/Commit

### Fazer novo commit

```bash
# Ver status
git status

# Adicionar mudanças
git add .            # Tudo
# ou
git add frontend/    # Apenas pasta específica

# Commit
git commit -m "Descrição clara da mudança"

# Push
git push origin main
```

### Exemplo de boas mensagens de commit

```bash
# Feature nova
git commit -m "feat: Adicionar gráfico de expense trends"

# Bug fix
git commit -m "fix: Corrigir erro de login com email inválido"

# Refactor
git commit -m "refactor: Reorganizar estrutura de componentes"

# Documentação
git commit -m "docs: Atualizar guia de deploy"

# Chore (dependências, config)
git commit -m "chore: Atualizar versão do React para 18.3.0"
```

---

## 🌿 Branches para Organização

### Criar branch para desenvolvimento

```bash
# Criar nova branch
git checkout -b develop

# Push branch
git push -u origin develop

# Trabalhar na branch
git checkout -b feature/nova-funcionalidade

# Quando terminar, fazer PR para develop
```

### Estrutura recomendada

```
main
├── develop
├── feature/analytics
├── feature/payments
├── bugfix/login-issue
└── hotfix/production-bug
```

---

## 🔄 Workflow com Equipe

### 1. Clonar projeto
```bash
git clone git@github.com:seu-usuario/homefinance.git
cd homefinance
```

### 2. Criar feature branch
```bash
git checkout -b feature/meu-nome-feature
```

### 3. Trabalhar normalmente
```bash
git add .
git commit -m "feat: Descrição da feature"
```

### 4. Push para GitHub
```bash
git push origin feature/meu-nome-feature
```

### 5. Abrir Pull Request no GitHub

1. Ir para https://github.com/seu-usuario/homefinance
2. Clicar em **Compare & pull request**
3. Descrever as mudanças
4. Clicar em **Create pull request**

### 6. Merge (após revisão)
```bash
git checkout main
git pull origin main
git merge --no-ff feature/meu-nome-feature
git push origin main
```

---

## 📋 Checklist de Commits

Antes de fazer commit, verifique:

- [ ] Código foi testado localmente
- [ ] Não há `console.log` deixado
- [ ] Não há arquivos `.env` versionados
- [ ] Não há `node_modules/` versionado
- [ ] Mensagem de commit é clara
- [ ] Build passa sem erros (`npm run build`)

---

## 🔍 Úteis Git Commands

```bash
# Ver histórico
git log --oneline

# Ver mudanças
git diff

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Desfazer último commit (descarta mudanças)
git reset --hard HEAD~1

# Ver branches
git branch -a

# Deletar branch local
git branch -d nome-branch

# Deletar branch remoto
git push origin --delete nome-branch

# Stash (guardar mudanças temporariamente)
git stash
git stash pop

# Ver quem alterou cada linha
git blame arquivo.ts

# Rebase (reorganizar commits)
git rebase -i HEAD~3
```

---

## 🚀 Deploy Automático com Git

### GitHub Actions CI/CD

Criar arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build & Test
      run: |
        cd backend && npm install && npm run build
        cd ../frontend && npm install && npm run build
    
    - name: Deploy to Locaweb
      run: |
        # Script deploy aqui
```

---

## 📊 Estatísticas do Projeto

```bash
# Contar linhas de código
git log --oneline | wc -l

# Ver contribuições por autor
git shortlog -sn

# Tamanho do repositório
du -sh .git

# Maior arquivo
find . -type f -exec du -b {} + | sort -rn | head -5
```

---

## ✅ Próximas Ações

1. [x] Inicializar Git local ✅
2. [x] Criar primeiro commit ✅
3. [ ] Criar repositório no GitHub
4. [ ] Conectar local com GitHub
5. [ ] Fazer primeiro push
6. [ ] Configurar CI/CD
7. [ ] Deploy em produção

---

**Pronto para versionar e fazer deploy!** 🎉
