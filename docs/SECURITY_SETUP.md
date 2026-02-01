# 🔐 Guia de Configuração de Segurança

## 📋 Índice

1. [Google reCAPTCHA](#1-google-recaptcha)
2. [Sistema de Bloqueio](#2-sistema-de-bloqueio)
3. [Recuperação de Senha com EmailJS](#3-recuperação-de-senha-com-emailjs)
4. [Validação de Dados](#4-validação-de-dados)
5. [Sessões e Autenticação](#5-sessões-e-autenticação)
6. [Melhores Práticas](#6-melhores-práticas)

---

## 1. Google reCAPTCHA

### O que é reCAPTCHA?

Sistema de proteção contra bots do Google que verifica se o usuário é humano.

### Configurar reCAPTCHA v2

#### Passo 1: Registrar Site

1. Acesse [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Faça login com sua conta Google
3. Clique em **"+"** para adicionar um novo site

#### Passo 2: Preencher Formulário

**Label (Rótulo)**:

```
Loja Leuria Admin
```

**Tipo de reCAPTCHA**:

- Selecione: **reCAPTCHA v2**
- Marque: **"Caixa de seleção 'Não sou um robô'"**

**Domínios**:

```
localhost
seusite.com
www.seusite.com
```

**Proprietários**:

- Adicione emails de administradores

**Aceitar os Termos**:

- Marque a caixa de concordância

**Enviar**:

- Clique em **"Enviar"**

#### Passo 3: Obter Chaves

Após registrar, você receberá:

**Chave do Site (Site Key)**: Chave pública para o frontend

```
6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

**Chave Secreta (Secret Key)**: Chave privada para o backend

```
6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

⚠️ **Nota**: As chaves acima são de teste. Use suas chaves reais!

#### Passo 4: Configurar no Projeto

Edite `pages/admin.html`:

```html
<!-- Adicionar script do reCAPTCHA no <head> -->
<script src="https://www.google.com/recaptcha/api.js" async defer></script>

<!-- No formulário de login -->
<div class="g-recaptcha" data-sitekey="SUA_CHAVE_PUBLICA_AQUI"></div>
```

#### Passo 5: Testar

1. Abra `pages/admin.html`
2. O reCAPTCHA deve aparecer no formulário de login
3. Teste fazendo login

### Chaves de Teste do Google

Para desenvolvimento, use estas chaves de teste:

**Site Key**:

```
6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

**Secret Key**:

```
6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

⚠️ **Estas chaves sempre retornam sucesso!** Use apenas em desenvolvimento.

### Verificação no Backend (Opcional)

Se implementar backend, verifique o reCAPTCHA:

```javascript
// Node.js exemplo
const axios = require("axios");

async function verifyRecaptcha(token) {
  const secretKey = "SUA_SECRET_KEY";
  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify`,
    null,
    {
      params: {
        secret: secretKey,
        response: token,
      },
    },
  );

  return response.data.success;
}
```

### Solução de Problemas

**reCAPTCHA não aparece**:

- Verifique se o script está carregando
- Verifique a chave do site
- Limpe o cache do navegador

**Erro "Invalid site key"**:

- Confirme que está usando a chave correta
- Verifique se o domínio está autorizado

**reCAPTCHA em loop**:

- Pode ser problema de cookies
- Teste em navegação anônima
- Verifique configurações de privacidade

---

## 2. Sistema de Bloqueio

### Como Funciona

O sistema implementa proteção contra ataques de força bruta:

1. **Máximo de Tentativas**: 3 tentativas falhas
2. **Tempo de Bloqueio**: 60 segundos
3. **Armazenamento**: localStorage
4. **Timer Visual**: Contador regressivo

### Fluxo de Segurança

```
Tentativa 1 (falha) → "2 tentativas restantes"
Tentativa 2 (falha) → "1 tentativa restante"
Tentativa 3 (falha) → BLOQUEIO por 60 segundos
Após 60 segundos → Reset automático
```

### Implementação

O código em `js/admin-security.js`:

```javascript
class AdminSecurity {
  constructor() {
    this.maxAttempts = 3; // Máximo de tentativas
    this.blockDuration = 60000; // 60 segundos em ms
    this.attempts = this.getAttempts();
    this.blocked = this.isBlocked();
  }

  recordFailedAttempt() {
    this.attempts++;

    if (this.attempts >= this.maxAttempts) {
      // Bloquear usuário
      const blockedUntil = Date.now() + this.blockDuration;
      localStorage.setItem(
        "loginAttempts",
        JSON.stringify({
          count: this.attempts,
          blockedUntil: blockedUntil,
        }),
      );
      this.blocked = true;
      return { blocked: true, timeRemaining: 60 };
    }

    return {
      blocked: false,
      attemptsRemaining: this.maxAttempts - this.attempts,
    };
  }
}
```

### Personalizar Configurações

Edite em `js/admin-security.js`:

```javascript
// Alterar máximo de tentativas
this.maxAttempts = 5; // 5 tentativas

// Alterar tempo de bloqueio
this.blockDuration = 300000; // 5 minutos (300000ms)
```

### Reset Manual

Se precisar desbloquear manualmente:

```javascript
// No console do navegador
localStorage.removeItem("loginAttempts");
location.reload();
```

### Logs de Segurança

Implementar sistema de logs (opcional):

```javascript
function logSecurityEvent(event, details) {
  const log = {
    timestamp: Date.now(),
    event: event,
    details: details,
    ip: "192.168.1.1", // Obter IP real do servidor
    userAgent: navigator.userAgent,
  };

  // Enviar para servidor ou Firebase
  console.log("Security Log:", log);
}

// Usar em tentativas falhas
logSecurityEvent("LOGIN_FAILED", { username: "admin", attempts: 2 });
```

---

## 3. Recuperação de Senha com EmailJS

### O que é EmailJS?

Serviço que permite enviar emails diretamente do JavaScript sem backend.

### Configurar EmailJS

#### Passo 1: Criar Conta

1. Acesse [EmailJS](https://www.emailjs.com/)
2. Clique em **"Sign Up"**
3. Crie uma conta (grátis: 200 emails/mês)

#### Passo 2: Adicionar Serviço de Email

1. No dashboard, clique em **"Email Services"**
2. Clique em **"Add New Service"**
3. Escolha um provedor:
   - **Gmail**: Mais fácil para teste
   - **Outlook**: Boa alternativa
   - **SendGrid**: Profissional

**Configuração Gmail**:

1. Selecione **Gmail**
2. Clique em **"Connect Account"**
3. Faça login com sua conta Google
4. Autorize o EmailJS
5. Anote o **Service ID** (ex: `service_abc123`)

#### Passo 3: Criar Template de Email

1. Clique em **"Email Templates"**
2. Clique em **"Create New Template"**
3. Preencha o template:

**Nome do Template**:

```
password_reset
```

**Subject (Assunto)**:

```
Recuperação de Senha - Loja Leuria
```

**Conteúdo (HTML)**:

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        background: #f5f5f5;
        padding: 30px;
      }
      .code {
        font-size: 32px;
        font-weight: bold;
        color: #667eea;
        text-align: center;
        padding: 20px;
        background: white;
        border-radius: 10px;
        margin: 20px 0;
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🔑 Recuperação de Senha</h1>
      </div>
      <div class="content">
        <p>Olá {{to_name}},</p>
        <p>
          Você solicitou a recuperação de senha do painel administrativo da Loja
          Leuria.
        </p>
        <p>Use o código abaixo para redefinir sua senha:</p>
        <div class="code">{{verification_code}}</div>
        <p>
          <strong>Atenção:</strong> Este código expira em {{expiration_time}}.
        </p>
        <p>Se você não solicitou esta recuperação, ignore este email.</p>
      </div>
      <div class="footer">
        <p>&copy; 2026 Loja Leuria. Todos os direitos reservados.</p>
      </div>
    </div>
  </body>
</html>
```

**Variáveis do Template**:

- `{{to_name}}`: Nome do destinatário
- `{{to_email}}`: Email do destinatário
- `{{verification_code}}`: Código de 6 dígitos
- `{{expiration_time}}`: Tempo de expiração

4. Clique em **"Save"**
5. Anote o **Template ID** (ex: `template_xyz789`)

#### Passo 4: Obter Chaves

1. Vá em **"Account"** → **"General"**
2. Copie sua **Public Key** (ex: `YOUR_PUBLIC_KEY`)

#### Passo 5: Configurar no Projeto

Edite `js/reset-password.js`:

```javascript
initEmailJS() {
    // Substitua pela sua Public Key
    if (typeof emailjs !== 'undefined') {
        emailjs.init('SUA_PUBLIC_KEY_AQUI');
    }
}

async sendCodeByEmail() {
    const serviceID = 'SEU_SERVICE_ID';      // Ex: service_abc123
    const templateID = 'SEU_TEMPLATE_ID';    // Ex: template_xyz789

    const templateParams = {
        to_email: this.email,
        to_name: 'Administrador',
        verification_code: this.generatedCode,
        expiration_time: '10 minutos'
    };

    await emailjs.send(serviceID, templateID, templateParams);
}
```

#### Passo 6: Testar

1. Abra `pages/reset-password.html`
2. Digite um email
3. Clique em **"Enviar Código"**
4. Verifique sua caixa de entrada

### Configuração do Email Admin

Em produção, configure o email do admin:

```javascript
// Em reset-password.js
const adminEmail = "seu-email@gmail.com"; // ← Seu email real
```

### Solução de Problemas

**Email não chega**:

- Verifique spam/lixo eletrônico
- Confirme que o Service ID e Template ID estão corretos
- Verifique se não excedeu o limite (200/mês no plano gratuito)

**Erro "Public Key not found"**:

- Confirme que a Public Key está correta
- Verifique se o EmailJS foi inicializado

**Template não funciona**:

- Verifique se as variáveis `{{}}` estão corretas
- Teste o template no dashboard do EmailJS

---

## 4. Validação de Dados

### Validações Implementadas

#### Produtos

```javascript
const validateProduct = (product) => {
  const errors = [];

  // Nome: 1-100 caracteres
  if (!product.name || product.name.length < 1 || product.name.length > 100) {
    errors.push("Nome deve ter entre 1 e 100 caracteres");
  }

  // Preço: formato XX.XX
  if (!product.price || !/^[0-9]+\.?[0-9]{0,2}$/.test(product.price)) {
    errors.push("Preço inválido");
  }

  // Categoria: valores permitidos
  const validCategories = ["maquiagem", "pijama", "sexy-shop"];
  if (!validCategories.includes(product.category)) {
    errors.push("Categoria inválida");
  }

  // Status: available ou unavailable
  const validStatus = ["available", "unavailable"];
  if (!validStatus.includes(product.status)) {
    errors.push("Status inválido");
  }

  // URL da imagem: formato válido
  if (!product.image || !/^https?:\/\/.+/.test(product.image)) {
    errors.push("URL da imagem inválida");
  }

  return errors;
};
```

#### Senhas

```javascript
function validatePassword(password) {
  const errors = [];

  if (password.length < 6) {
    errors.push("Senha deve ter no mínimo 6 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Senha deve conter letra maiúscula");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Senha deve conter número");
  }

  return errors;
}
```

### Sanitização de Inputs

```javascript
function sanitizeInput(input) {
  // Remover tags HTML
  return input.replace(/<[^>]*>/g, "");
}

// Uso
const cleanName = sanitizeInput(productName);
```

---

## 5. Sessões e Autenticação

### Sistema de Sessões

```javascript
// Criar sessão
const session = {
  username: username,
  loginTime: Date.now(),
  expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
};
localStorage.setItem("adminSession", JSON.stringify(session));

// Verificar sessão
const sessionData = localStorage.getItem("adminSession");
const session = JSON.parse(sessionData);

if (Date.now() > session.expiresAt) {
  // Sessão expirada
  logout();
}
```

### Implementar Tokens JWT (Avançado)

Para produção real, use JWT:

```javascript
// Backend gera token
const jwt = require("jsonwebtoken");
const token = jwt.sign({ username: "admin" }, "SECRET_KEY", {
  expiresIn: "24h",
});

// Frontend armazena
localStorage.setItem("authToken", token);

// Verificar em cada requisição
const token = localStorage.getItem("authToken");
// Enviar token no header das requisições
```

---

## 6. Melhores Práticas

### ✅ Do's (Faça)

1. **Use HTTPS em produção**
2. **Implemente rate limiting**
3. **Valide dados no cliente e servidor**
4. **Use tokens seguros**
5. **Monitore tentativas de login**
6. **Faça backup regular**
7. **Atualize dependências**
8. **Use senhas fortes**

### ❌ Don'ts (Não Faça)

1. **NÃO armazene senhas em plain text**
2. **NÃO confie apenas em validação client-side**
3. **NÃO exponha chaves secretas**
4. **NÃO use credenciais padrão em produção**
5. **NÃO ignore logs de segurança**
6. **NÃO desative validações**

### Checklist de Segurança

- [ ] reCAPTCHA configurado
- [ ] Sistema de bloqueio ativo
- [ ] Recuperação de senha funcional
- [ ] Validações implementadas
- [ ] Sessões com expiração
- [ ] HTTPS habilitado
- [ ] Backup configurado
- [ ] Logs de segurança ativos

---

## 🎉 Conclusão

Com todas essas medidas implementadas, sua loja está protegida contra as ameaças mais comuns!

**Precisa de mais ajuda?** Consulte a documentação oficial de cada serviço.
