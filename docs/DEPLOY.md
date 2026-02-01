# 🚀 Guia de Deploy - Loja Leuria

## 📋 Índice

1. [Preparação para Deploy](#1-preparação-para-deploy)
2. [Deploy no Firebase Hosting](#2-deploy-no-firebase-hosting)
3. [Deploy no Netlify](#3-deploy-no-netlify)
4. [Deploy no Vercel](#4-deploy-no-vercel)
5. [Deploy no GitHub Pages](#5-deploy-no-github-pages)
6. [Configurações Pós-Deploy](#6-configurações-pós-deploy)
7. [Otimizações](#7-otimizações)
8. [Monitoramento](#8-monitoramento)

---

## 1. Preparação para Deploy

### Checklist Pré-Deploy

- [ ] Firebase configurado e testado
- [ ] reCAPTCHA com chaves reais
- [ ] EmailJS configurado
- [ ] WhatsApp com número real
- [ ] Credenciais de admin alteradas
- [ ] Produtos cadastrados
- [ ] Testes realizados localmente
- [ ] Imagens otimizadas

### Configurações Importantes

#### 1.1 Alterar Credenciais de Admin

Em `js/admin-security.js`:

```javascript
// ALTERE ESTAS CREDENCIAIS!
const validUsername = "seu_usuario";
const validPassword = "sua_senha_forte_123!";
```

⚠️ **MUITO IMPORTANTE**: Use credenciais fortes em produção!

#### 1.2 Desativar Modo Desenvolvimento

Em `js/firebase-config.js`:

```javascript
// Alterar para produção
const isDevelopment = false; // ← Mudar para false
```

#### 1.3 Configurar URLs Corretas

Substitua URLs de teste por URLs reais:

- Firebase config
- reCAPTCHA keys
- EmailJS config
- WhatsApp number

### Estrutura de Arquivos Final

```
loja_leuria/
├── index.html
├── css/
├── js/
├── pages/
├── images/
├── config/
└── docs/
```

---

## 2. Deploy no Firebase Hosting

### Por que Firebase Hosting?

✅ Integração perfeita com Firebase Database
✅ HTTPS automático
✅ CDN global
✅ Deploy simples
✅ Plano gratuito generoso

### Passo a Passo

#### 2.1 Instalar Firebase CLI

```powershell
# Instalar Node.js primeiro (se não tiver)
# Download: https://nodejs.org/

# Instalar Firebase CLI
npm install -g firebase-tools
```

#### 2.2 Login no Firebase

```powershell
firebase login
```

Isso abrirá o navegador para autenticação.

#### 2.3 Inicializar Firebase

Na pasta do projeto:

```powershell
cd C:\Users\felip\OneDrive\Desktop\loja_leuria

firebase init hosting
```

**Perguntas que aparecerão**:

1. **What do you want to use as your public directory?**

   ```
   . (ponto - pasta atual)
   ```

2. **Configure as a single-page app (rewrite all urls to /index.html)?**

   ```
   No
   ```

3. **Set up automatic builds and deploys with GitHub?**
   ```
   No (por enquanto)
   ```

#### 2.4 Configurar firebase.json

Edite `firebase.json`:

```json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**", "docs/**"],
    "rewrites": [
      {
        "source": "/admin",
        "destination": "/pages/admin.html"
      },
      {
        "source": "/sexyshop",
        "destination": "/pages/sexyshop.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=7200"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=3600"
          }
        ]
      }
    ]
  }
}
```

#### 2.5 Deploy

```powershell
firebase deploy
```

**Resultado**:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/loja-leuria
Hosting URL: https://loja-leuria.web.app
```

### Comandos Úteis

```powershell
# Ver preview local
firebase serve

# Deploy apenas hosting
firebase deploy --only hosting

# Ver histórico de deploys
firebase hosting:channel:list
```

---

## 3. Deploy no Netlify

### Por que Netlify?

✅ Deploy gratuito
✅ CI/CD automático
✅ HTTPS grátis
✅ Formulários nativos
✅ Interface simples

### Método 1: Deploy via Interface

#### 3.1 Criar Conta

1. Acesse [Netlify](https://www.netlify.com/)
2. Clique em **"Sign up"**
3. Escolha GitHub, GitLab ou Email

#### 3.2 Deploy Manual

1. No dashboard, clique em **"Sites"**
2. Arraste a pasta do projeto para a área de drop
3. Aguarde o upload e build
4. Site no ar!

**URL gerada**: `https://random-name-12345.netlify.app`

#### 3.3 Configurar Domínio Customizado

1. Clique em **"Domain settings"**
2. **"Add custom domain"**
3. Digite seu domínio: `lojaleuria.com`
4. Configure DNS conforme instruções

### Método 2: Deploy via CLI

#### 3.4 Instalar Netlify CLI

```powershell
npm install -g netlify-cli
```

#### 3.5 Login

```powershell
netlify login
```

#### 3.6 Deploy

```powershell
cd C:\Users\felip\OneDrive\Desktop\loja_leuria

# Deploy de teste
netlify deploy

# Deploy para produção
netlify deploy --prod
```

### Configurar netlify.toml

Crie `netlify.toml`:

```toml
[build]
  publish = "."

[[redirects]]
  from = "/admin"
  to = "/pages/admin.html"
  status = 200

[[redirects]]
  from = "/sexyshop"
  to = "/pages/sexyshop.html"
  status = 200

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "*.jpg"
  [headers.values]
    Cache-Control = "public, max-age=7200"
```

---

## 4. Deploy no Vercel

### Por que Vercel?

✅ Deploy extremamente rápido
✅ Performance excelente
✅ Analytics integrado
✅ HTTPS automático
✅ Git integração perfeita

### Passo a Passo

#### 4.1 Instalar Vercel CLI

```powershell
npm install -g vercel
```

#### 4.2 Login

```powershell
vercel login
```

#### 4.3 Deploy

```powershell
cd C:\Users\felip\OneDrive\Desktop\loja_leuria

vercel
```

**Perguntas**:

- **Set up and deploy?** Y
- **Which scope?** Sua conta
- **Link to existing project?** N
- **What's your project's name?** loja-leuria
- **In which directory is your code located?** ./

#### 4.4 Deploy para Produção

```powershell
vercel --prod
```

### Configurar vercel.json

Crie `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/admin",
      "destination": "/pages/admin.html"
    },
    {
      "source": "/sexyshop",
      "destination": "/pages/sexyshop.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*).js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

---

## 5. Deploy no GitHub Pages

### Por que GitHub Pages?

✅ Gratuito
✅ Simples
✅ Integrado ao GitHub
✅ Bom para projetos open source

### Passo a Passo

#### 5.1 Criar Repositório

1. Crie repositório no GitHub: `loja-leuria`
2. Clone localmente ou use repositório existente

#### 5.2 Configurar GitHub Pages

1. Vá em **Settings** do repositório
2. Clique em **Pages**
3. Em **Source**, selecione **main branch**
4. Clique em **Save**

#### 5.3 Push do Código

```powershell
cd C:\Users\felip\OneDrive\Desktop\loja_leuria

git init
git add .
git commit -m "Deploy inicial"
git branch -M main
git remote add origin https://github.com/seu-usuario/loja-leuria.git
git push -u origin main
```

#### 5.4 Acessar Site

Site disponível em: `https://seu-usuario.github.io/loja-leuria/`

### Limitações do GitHub Pages

❌ Não suporta rewrites de URL
❌ Não suporta variáveis de ambiente
❌ Build apenas de sites estáticos

**Solução**: Usar URLs completas:

- `https://seu-usuario.github.io/loja-leuria/pages/admin.html`

---

## 6. Configurações Pós-Deploy

### 6.1 Atualizar Domínios Autorizados

#### Firebase

1. Firebase Console → Authentication
2. Settings → Authorized domains
3. Adicionar: `seu-dominio.com`

#### reCAPTCHA

1. [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Editar site
3. Adicionar domínio de produção

#### EmailJS

1. Dashboard EmailJS
2. Account → General
3. Adicionar domínio autorizado

### 6.2 Configurar SSL/HTTPS

Todos os serviços acima fornecem HTTPS automático!

Verificar:

```
https://seu-dominio.com ← Deve funcionar
http://seu-dominio.com  ← Deve redirecionar para https
```

### 6.3 Configurar Domínio Customizado

#### Comprar Domínio

Opções:

- [Registro.br](https://registro.br/) (Brasil)
- [Google Domains](https://domains.google/)
- [Namecheap](https://www.namecheap.com/)
- [GoDaddy](https://www.godaddy.com/)

#### Configurar DNS

**Para Firebase/Netlify/Vercel**:

1. No painel do serviço, adicione domínio customizado
2. Copie os nameservers ou registros DNS
3. No registrador do domínio, configure DNS

**Registros típicos**:

```
Type    Name    Value
A       @       75.2.60.5
CNAME   www     seu-site.netlify.app
```

---

## 7. Otimizações

### 7.1 Comprimir Imagens

Use ferramentas online:

- [TinyPNG](https://tinypng.com/)
- [Squoosh](https://squoosh.app/)
- [ImageOptim](https://imageoptim.com/)

### 7.2 Minificar CSS/JS

```powershell
# Instalar minificadores
npm install -g csso-cli uglify-js

# Minificar CSS
csso css/style.css -o css/style.min.css

# Minificar JS
uglifyjs js/script.js -o js/script.min.js
```

Atualizar referências nos HTML:

```html
<link rel="stylesheet" href="css/style.min.css" />
<script src="js/script.min.js"></script>
```

### 7.3 Lazy Loading de Imagens

```html
<img src="placeholder.jpg" data-src="imagem-real.jpg" loading="lazy" />
```

### 7.4 Configurar Cache

Já configurado nos arquivos de configuração (firebase.json, netlify.toml, etc.)

---

## 8. Monitoramento

### 8.1 Google Analytics

1. Crie propriedade no [Google Analytics](https://analytics.google.com/)
2. Copie o código de rastreamento
3. Adicione no `<head>` de todos os HTML:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

### 8.2 Firebase Analytics

Se usando Firebase Hosting:

```javascript
// Em firebase-config.js
firebase.analytics();
```

### 8.3 Monitorar Erros

```javascript
// Capturar erros JavaScript
window.addEventListener("error", (e) => {
  console.error("Erro capturado:", e.error);
  // Enviar para serviço de monitoramento
});
```

### 8.4 Status do Site

Use serviços de uptime monitoring:

- [UptimeRobot](https://uptimerobot.com/) (gratuito)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

---

## 🎉 Conclusão

Sua loja está no ar! 🚀

### Checklist Final de Deploy

- [ ] Site acessível via HTTPS
- [ ] Todos os links funcionando
- [ ] Carrinho salvando dados
- [ ] Admin acessível e seguro
- [ ] Firebase conectado
- [ ] WhatsApp integrando
- [ ] reCAPTCHA funcionando
- [ ] Domínio customizado (se aplicável)
- [ ] Analytics configurado
- [ ] Backups automatizados

### Próximos Passos

1. Compartilhar URL com clientes
2. Divulgar nas redes sociais
3. Configurar marketing digital
4. Monitorar vendas e acessos
5. Coletar feedback dos usuários

### Manutenção

- Backup semanal do Firebase
- Atualizar produtos regularmente
- Monitorar analytics
- Responder clientes rapidamente
- Atualizar segurança

---

**Parabéns pelo deploy! 🎊**
