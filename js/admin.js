// Painel Administrativo

class AdminPanel {
  constructor() {
    this.security = new AdminSecurity();
    this.currentProduct = null;
    this.products = [];
    this.init();
  }

  init() {
    // Verificar sessão do localStorage
    const session = this.security.checkSession();

    if (session) {
      // Verificar se Firebase Auth também está autenticado
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // Usuário autenticado no Firebase
          this.showAdminPanel();
          document.getElementById("adminUsername").textContent = user.email;
          this.loadProducts();
        } else {
          // Não está autenticado no Firebase, fazer logout
          console.warn(
            "⚠️ Sessão local existe, mas Firebase Auth não está autenticado",
          );
          this.security.logout();
          this.showLoginForm();
        }
      });
    } else {
      this.showLoginForm();
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.handleLogout());
    }

    // Formulário de produto
    const productForm = document.getElementById("productForm");
    if (productForm) {
      productForm.addEventListener("submit", (e) =>
        this.handleProductSubmit(e),
      );
    }

    // Cancelar edição
    const cancelBtn = document.getElementById("cancelBtn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => this.cancelEdit());
    }

    // Filtros
    const searchInput = document.getElementById("searchInput");
    const filterCategory = document.getElementById("filterCategory");
    const filterStatus = document.getElementById("filterStatus");

    if (searchInput) {
      searchInput.addEventListener("input", () => this.filterProducts());
    }
    if (filterCategory) {
      filterCategory.addEventListener("change", () => this.filterProducts());
    }
    if (filterStatus) {
      filterStatus.addEventListener("change", () => this.filterProducts());
    }

    // Preview de imagem
    const imageInput = document.getElementById("productImage");
    if (imageInput) {
      imageInput.addEventListener("change", (e) => this.handleImagePreview(e));
    }
  }

  handleImagePreview(e) {
    const file = e.target.files[0];
    const preview = document.getElementById("imagePreview");

    if (file) {
      // Validar tamanho (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 2MB");
        e.target.value = "";
        preview.classList.remove("show");
        preview.innerHTML = "";
        return;
      }

      // Validar tipo
      if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
        alert("Formato inválido. Use JPG, PNG ou WEBP");
        e.target.value = "";
        preview.classList.remove("show");
        preview.innerHTML = "";
        return;
      }

      // Mostrar preview
      const reader = new FileReader();
      reader.onload = (event) => {
        preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
        preview.classList.add("show");
      };
      reader.readAsDataURL(file);
    } else {
      preview.classList.remove("show");
      preview.innerHTML = "";
    }
  }

  async handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("loginError");

    // Limpar mensagens
    errorMessage.classList.remove("show");
    errorMessage.textContent = "";

    // Tentar login
    const result = await this.security.login(email, password);

    if (result.success) {
      this.showAdminPanel();
      document.getElementById("adminUsername").textContent =
        result.session.email;
    } else {
      errorMessage.textContent = result.error;
      errorMessage.classList.add("show");

      if (result.blocked) {
        // Iniciar timer de bloqueio
        this.security.startBlockTimer((timeRemaining) => {
          if (timeRemaining === null) {
            errorMessage.classList.remove("show");
            location.reload();
          } else {
            errorMessage.textContent = `Conta bloqueada. Tente novamente em ${timeRemaining} segundos.`;
          }
        });
      }
    }
  }

  async handleLogout() {
    if (confirm("Deseja realmente sair?")) {
      await this.security.logout();
      location.reload();
    }
  }

  showLoginForm() {
    document.getElementById("loginContainer").style.display = "flex";
    document.getElementById("adminPanel").style.display = "none";
  }

  showAdminPanel() {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    this.loadProducts();
    this.updateStats();
  }

  async loadProducts() {
    try {
      this.products = await ProductsDB.read();
      this.renderProducts();
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  }

  async updateStats() {
    // Stats removidas - manter método vazio para compatibilidade
  }

  renderProducts(productsToRender = this.products) {
    const tbody = document.getElementById("productsTableBody");

    if (productsToRender.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="loading">Nenhum produto cadastrado</td></tr>';
      return;
    }

    tbody.innerHTML = productsToRender
      .map(
        (product) => `
            <tr>
                <td><img src="${product.image}" alt="${product.name}" class="product-thumbnail"></td>
                <td>${product.name}</td>
                <td>${this.getCategoryLabel(product.category)}</td>
                <td>R$ ${parseFloat(product.price).toFixed(2)}</td>
                <td>
                    <span class="status-badge status-${product.status}">
                        ${product.status === "available" ? "Disponível" : "Indisponível"}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="adminPanel.editProduct('${product.id}')">Editar</button>
                        <button class="btn-delete" onclick="adminPanel.deleteProduct('${product.id}')">Deletar</button>
                    </div>
                </td>
            </tr>
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
      cintos: "Cintos",
    };
    return labels[category] || category;
  }

  filterProducts() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("filterCategory").value;
    const status = document.getElementById("filterStatus").value;

    let filtered = this.products;

    if (search) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(search));
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }

    this.renderProducts(filtered);
  }

  async handleProductSubmit(e) {
    e.preventDefault();

    // Obter imagem em base64
    const imageInput = document.getElementById("productImage");
    let imageData = "";

    if (imageInput.files && imageInput.files[0]) {
      // Novo upload
      const file = imageInput.files[0];
      const reader = new FileReader();

      imageData = await new Promise((resolve) => {
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(file);
      });
    } else if (this.currentProduct) {
      // Editando produto existente, manter imagem atual
      imageData = this.currentProduct.image;
    } else {
      alert("Por favor, selecione uma imagem");
      return;
    }

    // Coletar dados do formulário
    const productData = {
      name: document.getElementById("productName").value.trim(),
      price: document.getElementById("productPrice").value.trim(),
      category: document.getElementById("productCategory").value,
      status: document.getElementById("productStatus").value,
      image: imageData,
      description: document.getElementById("productDescription").value.trim(),
      soldOut: document.getElementById("productSoldOut").checked,
      isNew: document.getElementById("productIsNew").checked,
    };

    // Validar dados
    const errors = validateProduct(productData);
    if (errors.length > 0) {
      alert("Erros de validação:\n" + errors.join("\n"));
      return;
    }

    try {
      const productId = document.getElementById("productId").value;

      if (productId) {
        // Atualizar produto existente
        await ProductsDB.update(productId, productData);
        this.showNotification("Produto atualizado com sucesso! ✅");
      } else {
        // Criar novo produto
        await ProductsDB.create(productData);
        this.showNotification("Produto criado com sucesso! ✅");
      }

      this.resetForm();
      await this.loadProducts();
      await this.updateStats();
    } catch (error) {
      alert("Erro ao salvar produto: " + error.message);
    }
  }

  async editProduct(productId) {
    try {
      const product = await ProductsDB.getById(productId);

      if (!product) {
        alert("Produto não encontrado");
        return;
      }

      // Preencher formulário
      document.getElementById("productId").value = productId;
      document.getElementById("productName").value = product.name;
      document.getElementById("productPrice").value = product.price;
      document.getElementById("productCategory").value = product.category;
      document.getElementById("productStatus").value = product.status;

      // Mostrar preview da imagem existente
      const preview = document.getElementById("imagePreview");
      if (product.image) {
        preview.innerHTML = `<img src="${product.image}" alt="Preview">`;
        preview.classList.add("show");
      }

      // Remover required do input de imagem ao editar
      document.getElementById("productImage").removeAttribute("required");
      document.getElementById("productDescription").value =
        product.description || "";
      document.getElementById("productSoldOut").checked =
        product.soldOut || false;
      document.getElementById("productIsNew").checked = product.isNew || false;

      // Atualizar título
      document.getElementById("formTitle").textContent = "✏️ Editar Produto";
      document.getElementById("submitBtn").textContent = "Atualizar Produto";

      // Scroll para o formulário
      document
        .querySelector(".form-section")
        .scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert("Erro ao carregar produto: " + error.message);
    }
  }

  async deleteProduct(productId) {
    if (!confirm("Deseja realmente deletar este produto?")) {
      return;
    }

    try {
      await ProductsDB.delete(productId);
      this.showNotification("Produto deletado com sucesso! 🗑️");
      await this.loadProducts();
      await this.updateStats();
    } catch (error) {
      alert("Erro ao deletar produto: " + error.message);
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    document.getElementById("formTitle").textContent =
      "➕ Adicionar Novo Produto";
    document.getElementById("submitBtn").textContent = "Salvar Produto";

    // Limpar preview de imagem
    const preview = document.getElementById("imagePreview");
    preview.classList.remove("show");
    preview.innerHTML = "";

    // Adicionar required no input de imagem
    document
      .getElementById("productImage")
      .setAttribute("required", "required");

    this.currentProduct = null;
  }

  showNotification(message) {
    const notification = document.createElement("div");
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #b08d57 0%, #d4af6a 100%);
            color: #0f2a1d;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 600;
        `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Inicializar quando o DOM estiver pronto
let adminPanel;

document.addEventListener("DOMContentLoaded", () => {
  adminPanel = new AdminPanel();
});
