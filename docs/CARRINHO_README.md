# 🛒 Documentação do Sistema de Carrinho

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura](#2-arquitetura)
3. [Funcionalidades](#3-funcionalidades)
4. [Persistência de Dados](#4-persistência-de-dados)
5. [Interface do Usuário](#5-interface-do-usuário)
6. [Integração WhatsApp](#6-integração-whatsapp)
7. [Personalização](#7-personalização)
8. [API do Carrinho](#8-api-do-carrinho)

---

## 1. Visão Geral

### O que é?

Sistema completo de carrinho de compras com:

- Adicionar/remover produtos
- Ajustar quantidades
- Cálculo automático do total
- Persistência com localStorage
- Modal lateral responsivo
- Integração com WhatsApp

### Tecnologias

- JavaScript ES6+ (Classes)
- localStorage API
- CSS3 (Animations)
- WhatsApp API

---

## 2. Arquitetura

### Classe ShoppingCart

```javascript
class ShoppingCart {
    constructor() {
        this.items = [];           // Array de produtos
        this.init();               // Inicializar
    }

    // Métodos principais
    addItem(product)              // Adicionar produto
    removeItem(productId)         // Remover produto
    updateQuantity(id, qty)       // Atualizar quantidade
    clearCart()                   // Limpar tudo
    getTotal()                    // Calcular total
    checkout()                    // Finalizar (WhatsApp)
}
```

### Estrutura de Dados

#### Item do Carrinho

```javascript
{
    id: "produto-123",              // ID único do produto
    name: "Batom Vermelho",         // Nome
    price: 29.99,                   // Preço (número)
    image: "https://...",           // URL da imagem
    quantity: 2                     // Quantidade
}
```

#### Carrinho Completo

```javascript
[
  {
    id: "produto-123",
    name: "Batom Vermelho",
    price: 29.99,
    image: "https://...",
    quantity: 2,
  },
  {
    id: "produto-456",
    name: "Pijama Rosa",
    price: 89.9,
    image: "https://...",
    quantity: 1,
  },
];
```

---

## 3. Funcionalidades

### 3.1 Adicionar Produto

```javascript
// Código
cart.addItem({
  id: "produto-123",
  name: "Batom Vermelho",
  price: 29.99,
  image: "https://...",
});

// Comportamento
// 1. Verifica se produto já existe
// 2. Se existe: incrementa quantidade
// 3. Se não existe: adiciona novo item
// 4. Salva no localStorage
// 5. Atualiza UI
// 6. Mostra notificação
```

### 3.2 Remover Produto

```javascript
// Código
cart.removeItem("produto-123");

// Comportamento
// 1. Remove do array
// 2. Salva no localStorage
// 3. Atualiza UI
```

### 3.3 Atualizar Quantidade

```javascript
// Código
cart.updateQuantity("produto-123", 3);

// Comportamento
// 1. Encontra item no array
// 2. Atualiza quantidade (mínimo 1)
// 3. Salva no localStorage
// 4. Atualiza UI
// 5. Recalcula total
```

### 3.4 Limpar Carrinho

```javascript
// Código
cart.clearCart();

// Comportamento
// 1. Confirma com usuário
// 2. Limpa array
// 3. Remove do localStorage
// 4. Atualiza UI
// 5. Mostra notificação
```

### 3.5 Calcular Total

```javascript
// Código
const total = cart.getTotal();

// Cálculo
// total = Σ (preço × quantidade)
// Exemplo:
// Item 1: R$ 29.99 × 2 = R$ 59.98
// Item 2: R$ 89.90 × 1 = R$ 89.90
// Total: R$ 149.88
```

---

## 4. Persistência de Dados

### localStorage

O carrinho usa `localStorage` para persistir dados entre sessões.

#### Salvar Carrinho

```javascript
saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.items));
}
```

#### Carregar Carrinho

```javascript
loadCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}
```

#### Estrutura no localStorage

```javascript
// Key: 'cart'
// Value:
[
  { id: "produto-123", name: "Batom", price: 29.99, image: "...", quantity: 2 },
  { id: "produto-456", name: "Pijama", price: 89.9, image: "...", quantity: 1 },
];
```

### Vantagens do localStorage

✅ Dados persistem após fechar o navegador
✅ Não requer servidor
✅ Rápido (acesso local)
✅ 5-10 MB de armazenamento

### Limitações

❌ Dados não sincronizam entre dispositivos
❌ Pode ser limpo pelo usuário
❌ Não é criptografado

### Alternativa: Cookies

```javascript
// Salvar em cookie
setCookie("cart", JSON.stringify(items), 7); // 7 dias

// Ler cookie
const cart = getCookie("cart");
```

---

## 5. Interface do Usuário

### 5.1 Badge Contador

Mostra quantidade total de itens no carrinho.

```html
<div class="cart-icon" id="cartIcon">
  🛒
  <span class="cart-badge" id="cartBadge">3</span>
</div>
```

**Atualização**:

```javascript
updateCartUI() {
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
}
```

**CSS**:

```css
.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff6ec4;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
```

### 5.2 Modal Lateral (Off-Canvas)

Modal que desliza da direita com overlay.

**HTML**:

```html
<div class="cart-modal" id="cartModal">
  <div class="cart-overlay"></div>
  <div class="cart-content">
    <!-- Header -->
    <div class="cart-header">
      <h3>Meu Carrinho</h3>
      <button class="close-cart">&times;</button>
    </div>

    <!-- Itens -->
    <div class="cart-items"></div>

    <!-- Footer com total -->
    <div class="cart-footer">
      <div class="cart-total">
        <span>Total:</span>
        <span>R$ 0,00</span>
      </div>
      <button class="btn-primary">Finalizar Pedido</button>
    </div>
  </div>
</div>
```

**Abrir Modal**:

```javascript
openCart() {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Bloqueia scroll
}
```

**Fechar Modal**:

```javascript
closeCart() {
    cartModal.classList.remove('active');
    document.body.style.overflow = ''; // Libera scroll
}
```

**Animação**:

```css
.cart-content {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
```

### 5.3 Lista de Itens

Cada item no carrinho tem:

```html
<div class="cart-item">
  <!-- Imagem -->
  <img src="..." class="cart-item-image" />

  <div class="cart-item-info">
    <!-- Nome -->
    <div class="cart-item-name">Batom Vermelho</div>

    <!-- Preço -->
    <div class="cart-item-price">R$ 29,99</div>

    <!-- Controles de quantidade -->
    <div class="cart-item-controls">
      <button class="quantity-btn">-</button>
      <span class="quantity">2</span>
      <button class="quantity-btn">+</button>
      <button class="remove-item">Remover</button>
    </div>
  </div>
</div>
```

### 5.4 Notificações

Sistema de notificações toast:

```javascript
showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6ec4 0%, #b06fff 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
```

---

## 6. Integração WhatsApp

### Como Funciona

Ao finalizar o pedido, o sistema:

1. Monta uma mensagem formatada
2. Gera link do WhatsApp
3. Abre o WhatsApp com a mensagem

### Implementação

```javascript
checkout() {
    if (this.items.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    // Montar mensagem
    let message = '🛍️ *Novo Pedido - Loja Leuria*\n\n';

    this.items.forEach(item => {
        message += `• ${item.name}\n`;
        message += `  Qtd: ${item.quantity} | R$ ${item.price.toFixed(2)}\n`;
        message += `  Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    message += `💰 *Total: R$ ${this.getTotal().toFixed(2)}*\n\n`;
    message += `📍 Por favor, envie seu endereço completo para entrega.`;

    // Número do WhatsApp
    const whatsappNumber = '5511999999999';

    // Gerar URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Abrir WhatsApp
    window.open(whatsappURL, '_blank');
}
```

### Exemplo de Mensagem

```
🛍️ *Novo Pedido - Loja Leuria*

• Batom Vermelho
  Qtd: 2 | R$ 29.99
  Subtotal: R$ 59.98

• Pijama Rosa
  Qtd: 1 | R$ 89.90
  Subtotal: R$ 89.90

💰 *Total: R$ 149.88*

📍 Por favor, envie seu endereço completo para entrega.
```

### Configurar Número

Edite em `js/script.js`:

```javascript
const whatsappNumber = "5511999999999"; // ← Seu número

// Formato: [Código do País][DDD][Número]
// Brasil: 55
// Exemplo: 55 11 99999-9999 = 5511999999999
```

### Personalizar Mensagem

```javascript
// Adicionar dados do cliente
message += `\n👤 *Dados do Cliente*\n`;
message += `Nome: ${customerName}\n`;
message += `CPF: ${customerCPF}\n`;

// Adicionar forma de pagamento
message += `\n💳 *Forma de Pagamento*\n`;
message += `${paymentMethod}\n`;

// Adicionar observações
message += `\n📝 *Observações*\n`;
message += `${notes}\n`;
```

---

## 7. Personalização

### 7.1 Alterar Animações

```css
/* Animação mais rápida */
.cart-content {
  animation: slideIn 0.2s ease; /* Era 0.3s */
}

/* Animação diferente */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 7.2 Mudar Cores

```css
/* Gradient do carrinho */
.cart-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Badge contador */
.cart-badge {
  background: #ff6ec4;
}

/* Botões */
.btn-primary {
  background: linear-gradient(135deg, #ff6ec4 0%, #b06fff 100%);
}
```

### 7.3 Adicionar Desconto

```javascript
class ShoppingCart {
  constructor() {
    this.discount = 0; // Percentual de desconto
  }

  applyDiscount(percent) {
    this.discount = percent;
    this.updateCartUI();
  }

  getTotal() {
    const subtotal = this.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const discount = subtotal * (this.discount / 100);
    return subtotal - discount;
  }
}

// Usar
cart.applyDiscount(10); // 10% de desconto
```

### 7.4 Adicionar Frete

```javascript
class ShoppingCart {
  constructor() {
    this.shippingCost = 0;
  }

  setShipping(cost) {
    this.shippingCost = cost;
    this.updateCartUI();
  }

  getTotal() {
    const subtotal = this.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    return subtotal + this.shippingCost;
  }
}

// Usar
cart.setShipping(15.9); // Frete R$ 15,90
```

---

## 8. API do Carrinho

### Métodos Públicos

#### addItem(product)

Adiciona produto ao carrinho.

```javascript
cart.addItem({
  id: "123",
  name: "Produto",
  price: 29.99,
  image: "https://...",
});
```

#### removeItem(productId)

Remove produto do carrinho.

```javascript
cart.removeItem("123");
```

#### updateQuantity(productId, quantity)

Atualiza quantidade de um produto.

```javascript
cart.updateQuantity("123", 3);
```

#### clearCart()

Limpa todo o carrinho.

```javascript
cart.clearCart();
```

#### getTotal()

Retorna o valor total do carrinho.

```javascript
const total = cart.getTotal(); // 149.88
```

#### openCart()

Abre o modal do carrinho.

```javascript
cart.openCart();
```

#### closeCart()

Fecha o modal do carrinho.

```javascript
cart.closeCart();
```

#### checkout()

Finaliza pedido via WhatsApp.

```javascript
cart.checkout();
```

### Eventos Personalizados

Disparar eventos ao modificar carrinho:

```javascript
class ShoppingCart {
  addItem(product) {
    // ... código existente ...

    // Disparar evento
    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { items: this.items, total: this.getTotal() },
      }),
    );
  }
}

// Ouvir evento
window.addEventListener("cartUpdated", (e) => {
  console.log("Carrinho atualizado:", e.detail);
});
```

---

## 🎉 Conclusão

Agora você domina completamente o sistema de carrinho da Loja Leuria!

### Próximos Passos

1. Implementar sistema de cupons
2. Adicionar cálculo de frete por CEP
3. Criar sistema de favoritos
4. Implementar carrinho abandonado

### Suporte

Precisa de ajuda? Entre em contato!
