# ⚙️ Template de Configuração

Este arquivo contém templates de todas as configurações necessárias para colocar a loja no ar.

## 🔥 Firebase Configuration

### Arquivo: `js/firebase-config.js`

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "seu-projeto.firebaseapp.com",
  databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
};
```

**Onde obter:**

1. Firebase Console → Configurações do Projeto
2. Seus aplicativos → Web app
3. Copiar objeto de configuração

---

## 🔒 Google reCAPTCHA

### Arquivo: `pages/admin.html`

```html
<!-- No <head> -->
<script src="https://www.google.com/recaptcha/api.js" async defer></script>

<!-- No formulário de login -->
<div
  class="g-recaptcha"
  data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
></div>
```

**Onde obter:**

1. https://www.google.com/recaptcha/admin
2. Registrar novo site
3. Escolher reCAPTCHA v2
4. Copiar Site Key

**Chave de Teste (apenas desenvolvimento):**

```
Site Key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
Secret Key: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

---

## 📧 EmailJS Configuration

### Arquivo: `js/reset-password.js`

```javascript
initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init('YOUR_PUBLIC_KEY_HERE');
    }
}

async sendCodeByEmail() {
    const serviceID = 'service_xxxxxxx';
    const templateID = 'template_xxxxxxx';

    const templateParams = {
        to_email: this.email,
        to_name: 'Administrador',
        verification_code: this.generatedCode,
        expiration_time: '10 minutos'
    };

    await emailjs.send(serviceID, templateID, templateParams);
}
```

**Onde obter:**

1. https://www.emailjs.com/
2. Account → General → Public Key
3. Email Services → Your Service → Service ID
4. Email Templates → Your Template → Template ID

**Template de Email (HTML):**

```html
<!DOCTYPE html>
<html>
  <body>
    <h1>🔑 Recuperação de Senha</h1>
    <p>Olá {{to_name}},</p>
    <p>Seu código de verificação é:</p>
    <h2 style="color: #667eea;">{{verification_code}}</h2>
    <p>Válido por: {{expiration_time}}</p>
  </body>
</html>
```

---

## 📱 WhatsApp Configuration

### Arquivo: `js/script.js`

```javascript
checkout() {
    // ...código anterior...

    const whatsappNumber = '5511999999999'; // ← SEU NÚMERO AQUI

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, '_blank');
}
```

**Formato do Número:**

```
[Código País][DDD][Número]
Exemplo: 5511999999999

Brasil: 55
Argentina: 54
EUA: 1
```

**Testar URL:**

```
https://wa.me/5511999999999?text=Teste
```

---

## 🔐 Credenciais de Admin

### Arquivo: `js/admin-security.js`

```javascript
validateCredentials(username, password) {
    // ALTERE ESTAS CREDENCIAIS EM PRODUÇÃO!
    const validUsername = 'seu_usuario_aqui';
    const validPassword = 'sua_senha_forte_aqui';

    return username === validUsername && password === validPassword;
}
```

**Recomendações de Senha:**

- Mínimo 12 caracteres
- Letras maiúsculas e minúsculas
- Números
- Caracteres especiais
- Exemplo: `MyL0j@2026#Secure`

---

## 🌐 Firebase Rules

### Arquivo: `config/firebase-rules.json`

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null",
      ".indexOn": ["category", "status", "createdAt"]
    }
  }
}
```

**Aplicar no Firebase:**

1. Firebase Console → Realtime Database
2. Aba "Regras"
3. Colar conteúdo
4. Publicar

---

## 📧 Email Admin para Recuperação

### Arquivo: `js/reset-password.js`

```javascript
const adminEmail = "seu-email@gmail.com"; // ← SEU EMAIL AQUI

if (this.email !== adminEmail) {
  this.showError("Email não cadastrado no sistema");
  return;
}
```

---

## 🔧 Variáveis de Ambiente (Produção)

### Criar arquivo `.env.production`

```env
# Firebase
FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
FIREBASE_DATABASE_URL=https://seu-projeto.firebaseio.com
FIREBASE_PROJECT_ID=seu-projeto
FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# reCAPTCHA
RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

# EmailJS
EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY
EMAILJS_SERVICE_ID=service_xxxxxxx
EMAILJS_TEMPLATE_ID=template_xxxxxxx

# WhatsApp
WHATSAPP_NUMBER=5511999999999

# Admin
ADMIN_USERNAME=seu_usuario
ADMIN_PASSWORD=sua_senha_forte

# Email Admin
ADMIN_EMAIL=seu-email@gmail.com
```

**⚠️ IMPORTANTE:**

- Adicione `.env.production` ao `.gitignore`
- NUNCA faça commit de credenciais reais
- Use variáveis de ambiente no servidor

---

## 🚀 Configurações de Deploy

### Firebase Hosting - `firebase.json`

```json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}
```

### Netlify - `netlify.toml`

```toml
[build]
  publish = "."

[[redirects]]
  from = "/admin"
  to = "/pages/admin.html"
  status = 200
```

### Vercel - `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/admin",
      "destination": "/pages/admin.html"
    }
  ]
}
```

---

## 🔍 Checklist de Configuração

### Pré-Deploy

- [ ] Firebase configurado e testado
- [ ] reCAPTCHA com chaves reais (não usar keys de teste em produção)
- [ ] EmailJS configurado e email admin definido
- [ ] WhatsApp com número real formatado corretamente
- [ ] Credenciais de admin alteradas (não usar admin/admin123)
- [ ] Modo desenvolvimento desativado (`isDevelopment = false`)
- [ ] Produtos de exemplo cadastrados
- [ ] Todas as URLs absolutas corrigidas
- [ ] Imagens otimizadas e hospedadas
- [ ] Testes realizados localmente

### Pós-Deploy

- [ ] Site acessível via HTTPS
- [ ] Firebase conectado
- [ ] Carrinho funcionando
- [ ] WhatsApp redirecionando corretamente
- [ ] Admin acessível
- [ ] reCAPTCHA validando
- [ ] Email de recuperação enviando
- [ ] Domínios autorizados configurados
- [ ] Analytics configurado
- [ ] Backup automatizado

---

## 📝 Script de Validação

Execute no console do navegador para validar configurações:

```javascript
// Validar Firebase
console.log("Firebase:", firebaseInitialized ? "✅" : "❌");

// Validar reCAPTCHA
console.log("reCAPTCHA:", typeof grecaptcha !== "undefined" ? "✅" : "❌");

// Validar EmailJS
console.log("EmailJS:", typeof emailjs !== "undefined" ? "✅" : "❌");

// Testar carrinho
console.log("Carrinho:", typeof cart !== "undefined" ? "✅" : "❌");

// Testar segurança
console.log(
  "Admin Security:",
  typeof AdminSecurity !== "undefined" ? "✅" : "❌",
);
```

---

## 🆘 Solução de Problemas Comuns

### Firebase não conecta

```javascript
// Verificar se credenciais estão corretas
console.log(firebaseConfig);
// Verificar se database está ativo
// Verificar se domínio está autorizado
```

### reCAPTCHA não aparece

```html
<!-- Verificar se script está carregando -->
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<!-- Verificar se site key está correta -->
<div class="g-recaptcha" data-sitekey="SUA_CHAVE"></div>
```

### Email não envia

```javascript
// Verificar public key
emailjs.init("SUA_PUBLIC_KEY");
// Verificar service e template IDs
// Verificar se domínio está autorizado no EmailJS
```

---

## 📚 Recursos Adicionais

### Links Úteis

- [Firebase Console](https://console.firebase.google.com/)
- [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
- [EmailJS Dashboard](https://dashboard.emailjs.com/)
- [WhatsApp API Docs](https://faq.whatsapp.com/general/chats/how-to-use-click-to-chat)

### Documentação

- `README.md` - Visão geral
- `docs/FIREBASE_SETUP.md` - Setup detalhado Firebase
- `docs/SECURITY_SETUP.md` - Setup de segurança
- `docs/DEPLOY.md` - Guia de deploy

---

**Última atualização:** Janeiro 2026  
**Versão:** 1.0.0
