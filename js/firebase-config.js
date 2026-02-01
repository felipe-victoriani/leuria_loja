// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC3nmncC2GKoqVe4WUHAwVYx7IPJWlnlaU",
  authDomain: "leuria-joias.firebaseapp.com",
  databaseURL: "https://leuria-joias-default-rtdb.firebaseio.com/",
  projectId: "leuria-joias",
  storageBucket: "leuria-joias.firebasestorage.app",
  messagingSenderId: "486188648749",
  appId: "1:486188648749:web:2a1d2e3c1a9674ab8aaba4",
};

// Modo de desenvolvimento
const isDevelopment = true;

// Inicializar Firebase
let firebaseInitialized = false;
let database = null;
let auth = null;

try {
  if (typeof firebase !== "undefined") {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    auth = firebase.auth();
    firebaseInitialized = true;
    if (isDevelopment) {
      console.log("✅ Firebase inicializado com sucesso");
      console.log("✅ Firebase Auth inicializado");
    }
  }
} catch (error) {
  console.error("❌ Erro ao inicializar Firebase:", error);
  console.warn("⚠️ Usando localStorage como fallback");
}

// Funções de gerenciamento de produtos
const ProductsDB = {
  // Criar produto
  create: async (product) => {
    try {
      if (firebaseInitialized) {
        const productRef = database.ref("products").push();
        const productData = {
          ...product,
          id: productRef.key,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await productRef.set(productData);
        if (isDevelopment) {
          console.log("✅ Produto criado no Firebase:", productData);
        }
        return productData;
      } else {
        // Fallback para localStorage
        const products = JSON.parse(localStorage.getItem("products") || "[]");
        const newProduct = {
          ...product,
          id: Date.now().toString(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        return newProduct;
      }
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  },

  // Ler todos os produtos
  read: async (filters = {}) => {
    try {
      if (firebaseInitialized) {
        console.log("🔍 Lendo produtos do Firebase com filtros:", filters);
        let query = database.ref("products");

        // Aplicar filtros
        if (filters.category) {
          query = query.orderByChild("category").equalTo(filters.category);
        }

        const snapshot = await query.once("value");
        console.log("📦 Snapshot recebido:", snapshot.exists(), snapshot.val());
        const products = [];

        snapshot.forEach((childSnapshot) => {
          const product = childSnapshot.val();
          console.log("📝 Produto encontrado:", product);
          if (!filters.status || product.status === filters.status) {
            products.push(product);
          }
        });

        console.log("✅ Total de produtos lidos do Firebase:", products.length);
        return products;
      } else {
        // Fallback para localStorage
        let products = JSON.parse(localStorage.getItem("products") || "[]");

        if (filters.category) {
          products = products.filter((p) => p.category === filters.category);
        }
        if (filters.status) {
          products = products.filter((p) => p.status === filters.status);
        }

        return products;
      }
    } catch (error) {
      console.error("Erro ao ler produtos:", error);
      return [];
    }
  },

  // Atualizar produto
  update: async (id, updates) => {
    try {
      if (firebaseInitialized) {
        const productRef = database.ref(`products/${id}`);
        const updatedData = {
          ...updates,
          updatedAt: Date.now(),
        };
        await productRef.update(updatedData);
        if (isDevelopment) {
          console.log("✅ Produto atualizado no Firebase:", id);
        }
        return updatedData;
      } else {
        // Fallback para localStorage
        const products = JSON.parse(localStorage.getItem("products") || "[]");
        const index = products.findIndex((p) => p.id === id);

        if (index !== -1) {
          products[index] = {
            ...products[index],
            ...updates,
            updatedAt: Date.now(),
          };
          localStorage.setItem("products", JSON.stringify(products));
          return products[index];
        }
        throw new Error("Produto não encontrado");
      }
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  },

  // Deletar produto
  delete: async (id) => {
    try {
      if (firebaseInitialized) {
        await database.ref(`products/${id}`).remove();
        if (isDevelopment) {
          console.log("✅ Produto deletado do Firebase:", id);
        }
      } else {
        // Fallback para localStorage
        let products = JSON.parse(localStorage.getItem("products") || "[]");
        products = products.filter((p) => p.id !== id);
        localStorage.setItem("products", JSON.stringify(products));
      }
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      throw error;
    }
  },

  // Obter produto por ID
  getById: async (id) => {
    try {
      if (firebaseInitialized) {
        const snapshot = await database.ref(`products/${id}`).once("value");
        return snapshot.val();
      } else {
        const products = JSON.parse(localStorage.getItem("products") || "[]");
        return products.find((p) => p.id === id);
      }
    } catch (error) {
      console.error("Erro ao obter produto:", error);
      return null;
    }
  },

  // Migrar do localStorage para Firebase
  migrateToFirebase: async () => {
    if (!firebaseInitialized) {
      console.warn("Firebase não inicializado. Migração não disponível.");
      return;
    }

    try {
      const localProducts = JSON.parse(
        localStorage.getItem("products") || "[]",
      );

      if (localProducts.length === 0) {
        console.log("Nenhum produto local para migrar");
        return;
      }

      for (const product of localProducts) {
        const productRef = database.ref("products").push();
        await productRef.set({
          ...product,
          id: productRef.key,
          migratedAt: Date.now(),
        });
      }

      console.log(
        `✅ ${localProducts.length} produtos migrados para o Firebase`,
      );

      // Backup do localStorage antes de limpar
      localStorage.setItem("products_backup", JSON.stringify(localProducts));
      localStorage.removeItem("products");
    } catch (error) {
      console.error("Erro ao migrar produtos:", error);
    }
  },
};

// Validação de dados do produto
const validateProduct = (product) => {
  const errors = [];

  // Validar nome
  if (!product.name || product.name.length < 1 || product.name.length > 100) {
    errors.push("Nome deve ter entre 1 e 100 caracteres");
  }

  // Validar preço
  if (!product.price || !/^[0-9]+\.?[0-9]{0,2}$/.test(product.price)) {
    errors.push("Preço inválido");
  }

  // Validar categoria
  const validCategories = [
    "bolsas",
    "folheados",
    "semijoias",
    "acessorios",
    "oculos",
    "cintos",
  ];
  if (!validCategories.includes(product.category)) {
    errors.push("Categoria inválida");
  }

  // Validar status
  const validStatus = ["available", "unavailable"];
  if (!validStatus.includes(product.status)) {
    errors.push("Status inválido");
  }

  // Validar imagem (aceita URL ou base64)
  if (!product.image || product.image.trim().length === 0) {
    errors.push("Imagem é obrigatória");
  }

  return errors;
};

// Exportar para uso global
if (typeof window !== "undefined") {
  window.ProductsDB = ProductsDB;
  window.validateProduct = validateProduct;
  window.firebaseInitialized = firebaseInitialized;
}
