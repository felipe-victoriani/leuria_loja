# 🔥 Guia Completo de Configuração do Firebase

## 📋 Índice

1. [Criar Projeto Firebase](#1-criar-projeto-firebase)
2. [Configurar Realtime Database](#2-configurar-realtime-database)
3. [Aplicar Regras de Segurança](#3-aplicar-regras-de-segurança)
4. [Obter Credenciais](#4-obter-credenciais)
5. [Configurar no Projeto](#5-configurar-no-projeto)
6. [Configurar Domínios Autorizados](#6-configurar-domínios-autorizados)
7. [Testar Conexão](#7-testar-conexão)
8. [Solução de Problemas](#8-solução-de-problemas)

---

## 1. Criar Projeto Firebase

### Passo a Passo

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"** ou **"Create a project"**
3. Digite o nome do projeto: `loja-leuria` (ou o nome que preferir)
4. Clique em **Continuar**
5. **Google Analytics**: Opcional (pode desativar para simplicidade)
6. Clique em **Criar projeto**
7. Aguarde a criação (pode levar alguns segundos)
8. Clique em **Continuar**

### ✅ Resultado

Você terá um projeto Firebase criado e estará na página inicial do console.

---

## 2. Configurar Realtime Database

### Passo a Passo

1. No menu lateral, clique em **"Realtime Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha a localização:
   - **Recomendado**: `us-central1` (melhor performance global)
   - **Brasil**: `southamerica-east1` (São Paulo)
4. Clique em **Próximo**
5. Escolha as regras iniciais:
   - Selecione: **"Iniciar no modo de teste"** (temporário)
6. Clique em **Ativar**

### 📝 Observações

- O modo de teste permite leitura/escrita por 30 dias
- Vamos configurar regras de segurança adequadas no próximo passo
- Anote a URL do database (algo como `https://loja-leuria.firebaseio.com`)

### ✅ Resultado

Seu Realtime Database está ativo e pronto para receber dados.

---

## 3. Aplicar Regras de Segurança

### Entendendo as Regras

As regras do Firebase controlam quem pode ler e escrever dados. Nossa configuração:

- **Leitura**: Pública (todos podem ver produtos)
- **Escrita**: Apenas autenticados (admin)
- **Validação**: Dados seguem estrutura definida

### Aplicar Regras

1. No Realtime Database, clique na aba **"Regras"**
2. Copie o conteúdo do arquivo `config/firebase-rules.json`
3. Cole no editor de regras
4. Clique em **"Publicar"**

### 📄 Regras Explicadas

```json
{
  "rules": {
    "products": {
      // Todos podem ler produtos
      ".read": true,

      // Apenas usuários autenticados podem escrever
      ".write": "auth != null",

      // Índices para consultas otimizadas
      ".indexOn": ["category", "status", "createdAt"],

      // Validação de cada produto
      "$productId": {
        // Campos obrigatórios
        ".validate": "newData.hasChildren(['name', 'price', 'category', 'status'])",

        // Nome: 1-100 caracteres
        "name": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 100"
        },

        // Preço: formato numérico
        "price": {
          ".validate": "newData.isString() && newData.val().matches(/^[0-9]+\\.?[0-9]{0,2}$/)"
        },

        // Categoria: apenas valores permitidos
        "category": {
          ".validate": "newData.isString() && (newData.val() === 'maquiagem' || newData.val() === 'pijama' || newData.val() === 'sexy-shop')"
        },

        // Status: available ou unavailable
        "status": {
          ".validate": "newData.isString() && (newData.val() === 'available' || newData.val() === 'unavailable')"
        }
      }
    }
  }
}
```

### ⚠️ Importante

- Por enquanto, `.write: true` está comentado para funcionar sem autenticação
- Em produção, implemente autenticação Firebase para segurança total
- As validações garantem integridade dos dados

### ✅ Resultado

Regras de segurança configuradas e publicadas.

---

## 4. Obter Credenciais

### Passo a Passo

1. No Firebase Console, clique no ícone de **⚙️ Engrenagem**
2. Selecione **"Configurações do projeto"**
3. Role para baixo até **"Seus aplicativos"**
4. Clique no ícone **"</>"** (Web)
5. Digite um apelido: `loja-leuria-web`
6. **NÃO** marque "Configurar Firebase Hosting"
7. Clique em **"Registrar app"**
8. Copie o objeto `firebaseConfig`

### 📋 Exemplo de Credenciais

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "loja-leuria.firebaseapp.com",
  databaseURL: "https://loja-leuria-default-rtdb.firebaseio.com",
  projectId: "loja-leuria",
  storageBucket: "loja-leuria.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
};
```

### ✅ Resultado

Você tem as credenciais necessárias para conectar o projeto ao Firebase.

---

## 5. Configurar no Projeto

### Editar firebase-config.js

1. Abra o arquivo `js/firebase-config.js`
2. Localize o objeto `firebaseConfig`
3. Substitua pelos seus valores:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI", // ← Cole sua API Key
  authDomain: "seu-projeto.firebaseapp.com", // ← Cole seu Auth Domain
  databaseURL: "https://seu-projeto.firebaseio.com", // ← Cole sua Database URL
  projectId: "seu-projeto", // ← Cole seu Project ID
  storageBucket: "seu-projeto.appspot.com", // ← Cole seu Storage Bucket
  messagingSenderId: "123456789", // ← Cole seu Messaging Sender ID
  appId: "sua-app-id-aqui", // ← Cole seu App ID
};
```

4. Salve o arquivo

### ⚠️ Segurança

- **NÃO** compartilhe suas credenciais publicamente
- **NÃO** faça commit de credenciais reais no GitHub
- Use variáveis de ambiente em produção
- As regras do Firebase são sua verdadeira segurança

### ✅ Resultado

Projeto configurado para conectar ao Firebase.

---

## 6. Configurar Domínios Autorizados

### Por que é necessário?

Firebase só permite acesso de domínios autorizados para segurança.

### Passo a Passo

1. No Firebase Console, vá em **Authentication**
2. Clique na aba **"Settings"** (Configurações)
3. Role até **"Authorized domains"** (Domínios autorizados)
4. Clique em **"Add domain"** (Adicionar domínio)

### Domínios para Adicionar

#### Desenvolvimento Local

```
localhost
```

#### Produção

Adicione seu domínio de produção:

```
seusite.com
www.seusite.com
```

### ✅ Resultado

Seus domínios podem acessar o Firebase.

---

## 7. Testar Conexão

### Teste no Console do Navegador

1. Abra `index.html` no navegador
2. Abra o Console do Desenvolvedor (F12)
3. Você deve ver:

```
✅ Firebase inicializado com sucesso
```

### Teste de Leitura

No console do navegador:

```javascript
// Ler produtos
ProductsDB.read().then((products) => {
  console.log("Produtos:", products);
});
```

### Teste de Escrita (Admin)

1. Acesse `pages/admin.html`
2. Faça login (admin / admin123)
3. Cadastre um produto de teste
4. Verifique no Firebase Console se o produto apareceu

### Verificar no Firebase Console

1. Vá em **Realtime Database**
2. Você deve ver a estrutura:

```
loja-leuria
└── products
    └── -NxxxxxxxxxxxxxxX
        ├── name: "Produto Teste"
        ├── price: "29.99"
        ├── category: "maquiagem"
        ├── status: "available"
        ├── image: "https://..."
        ├── createdAt: 1706745600000
        └── updatedAt: 1706745600000
```

### ✅ Resultado

Conexão funcionando perfeitamente!

---

## 8. Solução de Problemas

### Erro: "Permission denied"

**Causa**: Regras de segurança muito restritivas

**Solução**:

1. Verifique as regras no Firebase Console
2. Temporariamente, teste com:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

3. **ATENÇÃO**: Não use isso em produção!

### Erro: "Firebase not initialized"

**Causa**: Credenciais incorretas

**Solução**:

1. Verifique cada campo em `firebase-config.js`
2. Confirme que não há espaços extras
3. Verifique se a URL do database está correta

### Erro: "CORS policy blocked"

**Causa**: Domínio não autorizado

**Solução**:

1. Adicione seu domínio em **Authorized domains**
2. Para localhost, adicione `localhost` (sem porta)

### Erro: "Network request failed"

**Causa**: Problemas de conexão

**Solução**:

1. Verifique sua conexão com a internet
2. Verifique se o Firebase está operacional: [status.firebase.google.com](https://status.firebase.google.com)
3. Tente limpar cache do navegador

### Produtos não aparecem na loja

**Causa**: Dados no localStorage ou Firebase vazio

**Solução**:

1. Cadastre produtos pelo painel admin
2. Verifique se os produtos têm `status: "available"`
3. Abra o console e execute:

```javascript
ProductsDB.read().then(console.log);
```

### Modo Desenvolvimento

Para ver logs detalhados, em `firebase-config.js`:

```javascript
const isDevelopment = true; // ← Já está ativado
```

Você verá logs como:

```
✅ Firebase inicializado com sucesso
✅ Produtos lidos do Firebase: 5
✅ Produto criado no Firebase: {...}
```

---

## 📊 Monitoramento

### Firebase Console

Acompanhe em tempo real:

1. **Realtime Database**: Veja dados sendo adicionados/editados
2. **Usage**: Monitore leituras/escritas
3. **Rules**: Verifique logs de segurança

### Limites Gratuitos

- **Conexões simultâneas**: 100
- **Storage**: 1 GB
- **Downloads**: 10 GB/mês
- **Uploads**: 10 GB/mês

Para a maioria das lojas, isso é mais que suficiente!

---

## 🔒 Segurança Adicional

### Implementar Autenticação

Para produção real, implemente Firebase Authentication:

```javascript
// Exemplo de login com email/senha
firebase
  .auth()
  .signInWithEmailAndPassword(email, password)
  .then((user) => {
    // Usuário autenticado
  });
```

### Regras Avançadas

```json
{
  "rules": {
    "products": {
      ".read": true,
      ".write": "auth != null && auth.token.admin === true"
      // Apenas admins podem escrever
    }
  }
}
```

---

## 🎉 Conclusão

Agora seu Firebase está totalmente configurado e pronto para uso!

### ✅ Checklist Final

- [ ] Projeto Firebase criado
- [ ] Realtime Database ativado
- [ ] Regras de segurança aplicadas
- [ ] Credenciais copiadas e configuradas
- [ ] Domínios autorizados adicionados
- [ ] Teste de leitura/escrita realizado
- [ ] Produtos visíveis na loja

### 📚 Próximos Passos

1. Cadastre seus produtos reais
2. Personalize o design
3. Configure o WhatsApp
4. Faça o deploy

### 💡 Dicas

- Faça backup regular dos dados
- Monitore o uso para não exceder limites
- Teste sempre em desenvolvimento antes de produção
- Documente mudanças nas regras

---

**Precisa de ajuda?** Entre em contato com o suporte!
