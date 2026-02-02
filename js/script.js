// ============================================
// LOJA LEURIA - SISTEMA DE GERENCIAMENTO
// Verde Escuro Elegante + Dourado Sofisticado
// ============================================

// Menu Hambúrguer
class MenuToggle {
  constructor() {
    this.hamburger = document.getElementById("hamburger");
    this.nav = document.getElementById("nav");
    this.overlay = document.getElementById("navOverlay");
    this.navClose = document.getElementById("navClose");
    this.navLinks = document.querySelectorAll(".nav-list a");
    this.isOpen = false;
    this.init();
  }

  init() {
    // Garantir que o menu começa fechado
    this.closeMenu();

    if (this.hamburger && this.nav) {
      // Toggle menu ao clicar no hambúrguer
      this.hamburger.addEventListener("click", () => {
        this.toggleMenu();
      });

      // Fechar menu ao clicar no botão X
      if (this.navClose) {
        this.navClose.addEventListener("click", () => {
          console.log("Clicou no botão X");
          this.closeMenu();
        });
      }

      // Fechar menu ao clicar no overlay
      if (this.overlay) {
        this.overlay.addEventListener("click", () => {
          console.log("Clicou no overlay");
          this.closeMenu();
        });
      }

      // Fechar menu ao clicar nos links
      this.navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = link.getAttribute("href");
          const targetSection = document.querySelector(targetId);

          console.log("Clicou em link do menu:", targetId);

          // Scroll suave até a seção
          if (targetSection) {
            targetSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }

          // Fechar menu após pequeno delay
          setTimeout(() => {
            this.closeMenu();
          }, 300);
        });
      });

      // Fechar com tecla ESC
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) {
          console.log("Pressionou ESC");
          this.closeMenu();
        }
      });

      // Fechar ao redimensionar para desktop OU ao redimensionar para mobile
      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (window.innerWidth > 900 && this.isOpen) {
            console.log("Redimensionou para desktop - fechando menu");
            this.closeMenu();
          }
        }, 100);
      });
    } else {
      console.error("Menu hambúrguer não encontrado!", {
        hamburger: this.hamburger,
        nav: this.nav,
        overlay: this.overlay,
      });
    }
  }

  toggleMenu() {
    console.log("Toggle menu - isOpen:", this.isOpen);
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    console.log("Abrindo menu");
    this.isOpen = true;
    this.hamburger.classList.add("active");
    this.nav.classList.add("active");
    if (this.overlay) {
      this.overlay.classList.add("active");
    }
    document.body.style.overflow = "hidden";
  }

  closeMenu() {
    console.log("Fechando menu");
    this.isOpen = false;
    this.hamburger.classList.remove("active");
    this.nav.classList.remove("active");
    if (this.overlay) {
      this.overlay.classList.remove("active");
    }
    document.body.style.overflow = "";
  }
}

// Filtro de Produtos por Categoria
class CategoryFilter {
  constructor(productsManager) {
    this.productsManager = productsManager;
    this.currentCategory = "all";
    this.init();
  }

  init() {
    const categoryLinks = document.querySelectorAll("[data-category]");
    categoryLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const category = link.getAttribute("data-category");
        this.filterByCategory(category);

        // Atualizar título da seção
        this.updateSectionTitle(category);
      });
    });
  }

  filterByCategory(category) {
    this.currentCategory = category;
    this.productsManager.filterProducts(category);
  }

  updateSectionTitle(category) {
    const sectionTitle = document.getElementById("sectionTitle");
    if (sectionTitle) {
      const titles = {
        all: "Toda a Coleção",
        bolsas: "Bolsas",
        folheados: "Folheados",
        semijoias: "Semi Joias",
        acessorios: "Acessórios de Cabelo e Cintos",
        oculos: "Óculos de Sol",
      };
      sectionTitle.textContent = titles[category] || titles["all"];
    }
  }
}

// Gerenciamento do Carrinho de Compras
class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
    this.init();
  }

  // Inicializar eventos
  init() {
    this.updateCartUI();
    this.setupEventListeners();
  }

  // Configurar event listeners
  setupEventListeners() {
    // Ícone do carrinho
    const cartIcon = document.getElementById("cartIcon");
    if (cartIcon) {
      cartIcon.addEventListener("click", () => this.openCart());
    }

    // Fechar carrinho
    const closeCart = document.getElementById("closeCart");
    const cartOverlay = document.getElementById("cartOverlay");

    if (closeCart) {
      closeCart.addEventListener("click", () => this.closeCart());
    }

    if (cartOverlay) {
      cartOverlay.addEventListener("click", () => this.closeCart());
    }

    // Limpar carrinho
    const clearCart = document.getElementById("clearCart");
    if (clearCart) {
      clearCart.addEventListener("click", () => this.clearCart());
    }

    // Finalizar pedido
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => this.checkout());
    }
  }

  // Carregar carrinho do localStorage
  loadCart() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }

  // Salvar carrinho no localStorage
  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.items));
  }

  // Adicionar item ao carrinho
  addItem(product) {
    const existingItem = this.items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        image: product.image,
        quantity: 1,
      });
    }

    this.saveCart();
    this.updateCartUI();
    this.showNotification("Produto adicionado ao carrinho! 🛒");
  }

  // Remover item do carrinho
  removeItem(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.saveCart();
    this.updateCartUI();
  }

  // Atualizar quantidade
  updateQuantity(productId, quantity) {
    const item = this.items.find((item) => item.id === productId);

    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
      this.updateCartUI();
    }
  }

  // Limpar carrinho
  clearCart() {
    if (this.items.length === 0) {
      return;
    }

    if (confirm("Deseja limpar todo o carrinho?")) {
      this.items = [];
      this.saveCart();
      this.updateCartUI();
      this.showNotification("Carrinho limpo!");
    }
  }

  // Calcular total
  getTotal() {
    return this.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  // Atualizar UI do carrinho
  updateCartUI() {
    // Atualizar badge
    const cartBadge = document.getElementById("cartBadge");
    if (cartBadge) {
      const totalItems = this.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? "flex" : "none";
    }

    // Atualizar lista de itens
    const cartItems = document.getElementById("cartItems");
    if (cartItems) {
      if (this.items.length === 0) {
        cartItems.innerHTML =
          '<p class="empty-cart">Seu carrinho está vazio</p>';
      } else {
        cartItems.innerHTML = this.items
          .map(
            (item) => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">R$ ${(item.price || 0).toFixed(2)}</div>
                            <div class="cart-item-controls">
                                <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                                <button class="remove-item" onclick="cart.removeItem('${item.id}')">Remover</button>
                            </div>
                        </div>
                    </div>
                `,
          )
          .join("");
      }
    }

    // Atualizar total
    const cartTotal = document.getElementById("cartTotal");
    if (cartTotal) {
      cartTotal.textContent = `R$ ${this.getTotal().toFixed(2)}`;
    }
  }

  // Abrir modal do carrinho
  openCart() {
    const cartModal = document.getElementById("cartModal");
    if (cartModal) {
      cartModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  // Fechar modal do carrinho
  closeCart() {
    const cartModal = document.getElementById("cartModal");
    if (cartModal) {
      cartModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // Finalizar pedido (WhatsApp)
  checkout() {
    if (this.items.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    // Montar mensagem para WhatsApp
    let message = "🛍️ *Novo Pedido - Loja Leuria*\n\n";

    this.items.forEach((item) => {
      message += `• ${item.name}\n`;
      message += `  Qtd: ${item.quantity} | R$ ${item.price.toFixed(2)}\n`;
      message += `  Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    message += `💰 *Total: R$ ${this.getTotal().toFixed(2)}*\n\n`;
    message += `📍 Aguardo confirmação do pedido.`;

    // Número do WhatsApp
    const whatsappNumber = "5567984571451";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Abrir WhatsApp
    window.open(whatsappURL, "_blank");

    // Mostrar mensagem de confirmação
    this.showCheckoutSuccess();

    // Limpar carrinho após envio
    setTimeout(() => {
      this.clearCart();
      this.closeCart();
    }, 2000);
  }

  // Mostrar mensagem de sucesso do checkout
  showCheckoutSuccess() {
    // Criar modal de sucesso
    const successModal = document.createElement("div");
    successModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(5px);
      animation: fadeIn 0.3s ease;
    `;

    const successContent = document.createElement("div");
    successContent.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.4s ease;
      border: 3px solid #B08D57;
    `;

    successContent.innerHTML = `
      <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
      <h3 style="color: #0F2A1D; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 1rem;">
        Pedido Enviado com Sucesso!
      </h3>
      <p style="color: #666; margin-bottom: 1.5rem; line-height: 1.6;">
        Seu pedido foi enviado para o WhatsApp. Nossa equipe entrará em contato em breve para confirmar os detalhes.
      </p>
      <div style="color: #B08D57; font-weight: 600; font-size: 0.9rem;">
        Obrigado pela preferência! 💝
      </div>
    `;

    successModal.appendChild(successContent);
    document.body.appendChild(successModal);

    // Remover modal após 3 segundos
    setTimeout(() => {
      successModal.style.animation = "fadeOut 0.3s ease";
      setTimeout(() => successModal.remove(), 300);
    }, 3000);

    // Remover ao clicar fora
    successModal.addEventListener("click", (e) => {
      if (e.target === successModal) {
        successModal.remove();
      }
    });
  }

  // Mostrar notificação
  showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement("div");
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #0F2A1D 0%, #1a4029 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 4px;
            box-shadow: 0 8px 24px rgba(15, 42, 29, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 600;
            border-left: 4px solid #B08D57;
        `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remover após 3 segundos
    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Gerenciamento de Produtos na Página
class ProductsManager {
  constructor() {
    this.products = [];
    this.allProducts = [];
    this.currentCategory = "all";
    this.init();
  }

  async init() {
    console.log("🚀 ProductsManager inicializando...");
    await this.loadProducts();
    console.log("📦 Produtos carregados:", this.allProducts.length);
    this.renderAllSections();
  }

  async loadProducts() {
    try {
      console.log("⏳ Carregando produtos...");
      // Verificar se há filtro de categoria (página sexyshop)
      const filterCategory = window.FILTER_CATEGORY || null;

      const filters = filterCategory ? { category: filterCategory } : {};
      console.log("🔍 Filtros aplicados:", filters);
      this.allProducts = await ProductsDB.read(filters);
      console.log(
        "✅ Produtos recebidos do DB:",
        this.allProducts.length,
        this.allProducts,
      );

      // Filtrar apenas produtos disponíveis para a loja
      this.allProducts = this.allProducts.filter(
        (p) => p.status === "available",
      );
      this.products = [...this.allProducts];
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      this.products = [];
      this.allProducts = [];
    }
  }

  filterProducts(category) {
    if (category === "all") {
      this.products = [...this.allProducts];
    } else {
      this.products = this.allProducts.filter((p) => p.category === category);
    }
    this.currentCategory = category;
    this.renderAllSections();
  }

  renderAllSections() {
    console.log("🎨 Renderizando todas as seções...");
    // Renderizar produtos em cada seção específica
    const sections = {
      productsGrid: "bolsas",
      "folheados-grid": "folheados",
      "semijoias-grid": "semijoias",
      "acessorios-grid": "acessorios",
      "oculos-grid": "oculos",
      "cintos-grid": "cintos",
    };

    Object.entries(sections).forEach(([gridId, category]) => {
      console.log(`🔧 Renderizando categoria ${category} no grid ${gridId}`);
      this.renderProductsByCategory(gridId, category);
    });
  }

  renderProductsByCategory(gridId, category) {
    const grid = document.getElementById(gridId);
    console.log(`🎯 Grid encontrado para ${gridId}:`, !!grid);
    if (!grid) {
      console.warn(`⚠️ Grid não encontrado: ${gridId}`);
      return;
    }

    const filteredProducts = this.allProducts.filter(
      (p) => p.category === category,
    );
    console.log(
      `🔍 Produtos filtrados para ${category}:`,
      filteredProducts.length,
      filteredProducts,
    );

    if (filteredProducts.length === 0) {
      grid.innerHTML =
        '<p class="loading">Nenhum produto disponível nesta categoria.</p>';
      console.log(`ℹ️ Nenhum produto para ${category}`);
      return;
    }

    grid.innerHTML = filteredProducts
      .map(
        (product) => `
            <div class="product-card">
                <div class="product-image-container">
                    ${product.isNew ? '<span class="product-badge">Novo</span>' : ""}
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <div class="product-info">
                    <p class="product-category">${this.getCategoryLabel(product.category)}</p>
                    <h3 class="product-name">${product.name}</h3>
                    ${product.description ? `<p style="font-size: 0.9rem; color: #666; margin-bottom: 0.8rem; line-height: 1.5;">${product.description}</p>` : ""}
                    <p class="product-price">R$ ${parseFloat(product.price).toFixed(2)}</p>
                    <div class="product-actions">
                        <button class="btn-add-cart" onclick="cart.addItem(${JSON.stringify(product).replace(/"/g, "&quot;")})" ${product.soldOut ? "disabled" : ""}>
                            ${product.soldOut ? "Esgotado" : "Adicionar ao Carrinho"}
                        </button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("");
  }

  renderProducts() {
    const productsGrid = document.getElementById("productsGrid");

    if (!productsGrid) return;

    if (this.products.length === 0) {
      productsGrid.innerHTML =
        '<p class="loading">Nenhum produto disponível nesta categoria.</p>';
      return;
    }

    productsGrid.innerHTML = this.products
      .map(
        (product) => `
            <div class="product-card">
                <div class="product-image-container">
                    ${product.isNew ? '<span class="product-badge">Novo</span>' : ""}
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <div class="product-info">
                    <p class="product-category">${this.getCategoryLabel(product.category)}</p>
                    <h3 class="product-name">${product.name}</h3>
                    ${product.description ? `<p style="font-size: 0.9rem; color: #666; margin-bottom: 0.8rem; line-height: 1.5;">${product.description}</p>` : ""}
                    <p class="product-price">R$ ${parseFloat(product.price).toFixed(2)}</p>
                    <div class="product-actions">
                        <button class="btn-add-cart" onclick="cart.addItem(${JSON.stringify(product).replace(/"/g, "&quot;")})" ${product.soldOut ? "disabled" : ""}>
                            ${product.soldOut ? "Esgotado" : "Adicionar ao Carrinho"}
                        </button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("");
  }

  getCategoryLabel(category) {
    const labels = {
      bolsas: "Bolsas",
      folheados: "Folheados",
      semijoias: "Semi Joias",
      acessorios: "Acessórios",
      oculos: "Óculos de Sol",
    };
    return labels[category] || category;
  }
}

// Adicionar estilos para animações
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar quando o DOM estiver pronto
let cart, productsManager, menuToggle, categoryFilter;

document.addEventListener("DOMContentLoaded", () => {
  console.log("🌿 Loja Leuria - Inicializando...");

  // Garantir que o menu está fechado ao carregar
  const nav = document.getElementById("nav");
  const hamburger = document.getElementById("hamburger");
  const overlay = document.getElementById("navOverlay");

  if (nav) {
    nav.classList.remove("active");
  }
  if (hamburger) {
    hamburger.classList.remove("active");
  }
  if (overlay) {
    overlay.classList.remove("active");
  }
  document.body.style.overflow = "";

  // Inicializar carrinho
  cart = new ShoppingCart();
  console.log("✅ Carrinho inicializado");

  // Inicializar gerenciador de produtos
  productsManager = new ProductsManager();
  console.log("✅ Produtos inicializados");

  // Inicializar menu hambúrguer
  menuToggle = new MenuToggle();
  console.log("✅ Menu hambúrguer inicializado");

  // Aguardar produtos carregarem antes de inicializar filtros
  setTimeout(() => {
    categoryFilter = new CategoryFilter(productsManager);
    console.log("✅ Filtros de categoria inicializados");
  }, 500);

  // Teste do menu
  console.log("🔍 Elementos encontrados:", {
    hamburger: hamburger ? "✅" : "❌",
    nav: nav ? "✅" : "❌",
  });
});
