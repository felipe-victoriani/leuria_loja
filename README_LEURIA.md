# 🌿 Loja Leuria - Elegância em Cada Detalhe

![Status](https://img.shields.io/badge/status-ativo-success)
![Versão](https://img.shields.io/badge/versão-2.0.0-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)

> Loja virtual premium de bolsas, folheados, semi joias e acessórios sofisticados

---

## 🎨 Identidade Visual

### Paleta de Cores Luxuosa

- **Verde Escuro Elegante:** `#0F2A1D` - Cor principal sofisticada
- **Verde Médio:** `#1a4029` - Complemento harmonioso
- **Dourado Sofisticado:** `#B08D57` - Destaque premium
- **Dourado Claro:** `#d4af6a` - Detalhes sutis
- **Branco Puro:** `#ffffff` - Fundos limpos

### Tipografia Premium

- **Títulos:** [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) - Serif elegante
- **Textos:** [Montserrat](https://fonts.google.com/specimen/Montserrat) - Sans-serif moderna

### Conceito de Design

✨ **Luxo Minimalista**  
🌿 **Sofisticação Atemporal**  
💎 **Elegância Discreta**

---

## 🛍️ Categorias de Produtos

| Categoria         | Descrição                                       | Ícone |
| ----------------- | ----------------------------------------------- | ----- |
| **Bolsas**        | Bolsas estruturadas, clutches e totes premium   | 👜    |
| **Folheados**     | Joias folheadas a ouro com acabamento impecável | ✨    |
| **Semi Joias**    | Peças em prata 925 com design sofisticado       | 💎    |
| **Acessórios**    | Presilhas, tiaras e cintos elegantes            | 🎀    |
| **Óculos de Sol** | Óculos com proteção UV e design contemporâneo   | 🕶️    |

---

## 🚀 Funcionalidades

### ✅ Loja Virtual

- [x] **Grid Responsivo** de produtos com hover elegante
- [x] **Filtro por Categoria** com animações suaves
- [x] **Cards Premium** com imagem, nome, preço e badge "Novo"
- [x] **Hero Section** com frase de impacto
- [x] **Footer Sofisticado** com informações e redes sociais

### ✅ Sistema de Carrinho

- [x] **Adicionar ao Carrinho** com notificação elegante
- [x] **Modal Lateral** deslizante com overlay
- [x] **Ajustar Quantidades** com controles intuitivos
- [x] **Persistência** em localStorage
- [x] **Finalização via WhatsApp** com mensagem formatada

### ✅ Navegação & UX

- [x] **Menu Hambúrguer** responsivo para mobile/tablet
- [x] **Header Fixo** com logo elegante
- [x] **Smooth Scroll** para navegação fluida
- [x] **Animações Sutis** em hover e transições
- [x] **Badge de Itens** no ícone do carrinho

### ✅ Integração Firebase

- [x] **Realtime Database** para produtos
- [x] **CRUD Completo** no painel admin
- [x] **Fallback localStorage** para modo offline

---

## 📁 Estrutura do Projeto

```
loja_leuria/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos luxuosos (verde + dourado)
├── js/
│   ├── firebase-config.js # Configuração Firebase
│   └── script.js          # Lógica: carrinho, menu, filtros
├── pages/
│   ├── admin.html         # Painel administrativo
│   ├── admin.css          # Estilos admin
│   └── admin.js           # Lógica admin
├── images/                # Pasta para imagens locais
├── docs/                  # Documentação completa
│   ├── FIREBASE_SETUP.md
│   ├── SECURITY_SETUP.md
│   ├── DEPLOY.md
│   └── ...
├── PRODUTOS_LEURIA.md     # Catálogo de produtos exemplo
└── README.md              # Este arquivo
```

---

## ⚡ Início Rápido

### 1️⃣ **Abrir Localmente**

```bash
# Navegue até a pasta
cd loja_leuria

# Abra no navegador (duplo clique)
index.html
```

### 2️⃣ **Configurar Firebase**

Edite `js/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  databaseURL: "https://seu-projeto.firebaseio.com",
  projectId: "seu-projeto",
  // ... outras configs
};
```

📚 **Guia completo:** [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md)

### 3️⃣ **Adicionar Produtos**

1. Abra `pages/admin.html`
2. Login: `admin` / `admin123` (altere depois!)
3. Use o formulário ou importe do [PRODUTOS_LEURIA.md](PRODUTOS_LEURIA.md)

---

## 📱 Responsividade

| Dispositivo    | Breakpoint | Comportamento                     |
| -------------- | ---------- | --------------------------------- |
| 📱 **Mobile**  | < 480px    | Grid 1 coluna, menu hambúrguer    |
| 📱 **Tablet**  | 481-900px  | Grid 2 colunas, menu lateral      |
| 💻 **Desktop** | 901-1200px | Grid 3 colunas, menu horizontal   |
| 🖥️ **Large**   | > 1200px   | Grid 4 colunas, espaçamento amplo |

---

## 🎯 Funcionalidades JavaScript

### Menu Hambúrguer

```javascript
// Abre/fecha menu em mobile
class MenuToggle {
  toggleMenu() { ... }
  closeMenu() { ... }
}
```

### Filtro de Categoria

```javascript
// Filtra produtos por categoria
class CategoryFilter {
  filterByCategory(category) { ... }
  updateSectionTitle(category) { ... }
}
```

### Carrinho de Compras

```javascript
// Gerencia carrinho completo
class ShoppingCart {
  addItem(product) { ... }
  removeItem(id) { ... }
  updateQuantity(id, qty) { ... }
  checkout() { ... } // WhatsApp
}
```

---

## 🔧 Customização

### Alterar Cores

Edite `css/style.css`:

```css
:root {
  --verde-escuro: #0f2a1d; /* Sua cor principal */
  --dourado: #b08d57; /* Sua cor de destaque */
  /* ... outras variáveis */
}
```

### Alterar WhatsApp

Edite `js/script.js`:

```javascript
const whatsappNumber = "5511999999999"; // Seu número
```

### Alterar Credenciais Admin

Edite `js/admin-security.js`:

```javascript
const validUsername = "seu_usuario";
const validPassword = "sua_senha_forte";
```

---

## 🚀 Deploy

### Opção 1: Firebase Hosting (Recomendado)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Opção 2: Netlify

1. Arraste pasta para [netlify.com/drop](https://app.netlify.com/drop)
2. Pronto! 🎉

### Opção 3: GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <seu-repo>
git push -u origin main
```

📚 **Guia completo:** [docs/DEPLOY.md](docs/DEPLOY.md)

---

## 📊 Recursos Utilizados

| Tecnologia           | Versão | Finalidade                       |
| -------------------- | ------ | -------------------------------- |
| HTML5                | -      | Estrutura semântica              |
| CSS3                 | -      | Estilização luxuosa              |
| JavaScript ES6+      | -      | Funcionalidades interativas      |
| Firebase Realtime DB | 9.22.0 | Banco de dados em tempo real     |
| Google Fonts         | -      | Tipografia Playfair + Montserrat |
| Unsplash             | -      | Imagens de exemplo               |

---

## 🐛 Solução de Problemas

### Produtos não carregam?

✅ Verifique se Firebase está configurado  
✅ Abra console: `F12` → veja erros  
✅ Teste conexão: `ProductsDB.read()`

### Menu não abre?

✅ Verifique se `script.js` está carregando  
✅ Teste: `menuToggle.toggleMenu()`

### Carrinho não persiste?

✅ Verifique localStorage habilitado  
✅ Limpe cache: `Ctrl + Shift + Delete`

---

## 📚 Documentação Completa

- [🔥 Setup Firebase](docs/FIREBASE_SETUP.md)
- [🔒 Configurar Segurança](docs/SECURITY_SETUP.md)
- [🚀 Guia de Deploy](docs/DEPLOY.md)
- [🛒 Sistema Carrinho](docs/CARRINHO_README.md)
- [📦 Produtos Exemplo](PRODUTOS_LEURIA.md)
- [⚙️ Template Config](docs/CONFIG_TEMPLATE.md)

---

## 🤝 Contribuição

Melhorias são bem-vindas!

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja [LICENSE.md](docs/LICENSE.md) para mais detalhes.

---

## 🌟 Créditos

**Desenvolvido por:** Equipe Leuria  
**Design:** Identidade Visual Premium  
**Fontes:** Google Fonts  
**Ícones:** SVG personalizados  
**Imagens Exemplo:** Unsplash

---

## 📞 Contato

📧 **Email:** contato@lojaleuria.com  
📱 **WhatsApp:** (11) 99999-9999  
📷 **Instagram:** [@lojaleuria](https://instagram.com/lojaleuria)  
📘 **Facebook:** [Loja Leuria](https://facebook.com/lojaleuria)

---

<div align="center">

**Feito com 💚 e ✨ para mulheres que valorizam elegância**

⭐ Dê uma estrela se este projeto te ajudou!

</div>
