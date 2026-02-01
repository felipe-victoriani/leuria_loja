// Sistema de Segurança do Admin com Firebase Auth

class AdminSecurity {
  constructor() {
    this.auth = firebase.auth();
    // Configurar persistência LOCAL (mantém login mesmo após fechar navegador)
    this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    this.maxAttempts = 5;
    this.blockDuration = 300000; // 5 minutos
    this.attempts = this.getAttempts();
    this.blocked = this.isBlocked();
  }

  // Obter tentativas do localStorage
  getAttempts() {
    const data = localStorage.getItem("loginAttempts");
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.count || 0;
    }
    return 0;
  }

  // Verificar se está bloqueado
  isBlocked() {
    const data = localStorage.getItem("loginAttempts");
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.blockedUntil && Date.now() < parsed.blockedUntil) {
        return true;
      } else if (parsed.blockedUntil && Date.now() >= parsed.blockedUntil) {
        // Tempo de bloqueio expirou, resetar
        this.resetAttempts();
        return false;
      }
    }
    return false;
  }

  // Obter tempo restante de bloqueio
  getBlockedTimeRemaining() {
    const data = localStorage.getItem("loginAttempts");
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.blockedUntil) {
        const remaining = parsed.blockedUntil - Date.now();
        return Math.ceil(remaining / 1000);
      }
    }
    return 0;
  }

  // Registrar tentativa falhada
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
      return {
        blocked: true,
        timeRemaining: this.blockDuration / 1000,
      };
    } else {
      localStorage.setItem(
        "loginAttempts",
        JSON.stringify({
          count: this.attempts,
          blockedUntil: null,
        }),
      );
      return {
        blocked: false,
        attemptsRemaining: this.maxAttempts - this.attempts,
      };
    }
  }

  // Resetar tentativas
  resetAttempts() {
    this.attempts = 0;
    this.blocked = false;
    localStorage.removeItem("loginAttempts");
  }

  // Verificar reCAPTCHA
  async verifyRecaptcha() {
    if (typeof grecaptcha === "undefined") {
      console.warn("reCAPTCHA não carregado");
      return true; // Permitir em desenvolvimento
    }

    const response = grecaptcha.getResponse();

    if (!response) {
      return false;
    }

    return true;
  }

  // Validar credenciais com Firebase Auth
  async validateCredentials(email, password) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(
        email,
        password,
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Erro de autenticação:", error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  getErrorMessage(errorCode) {
    const errorMessages = {
      "auth/invalid-email": "Email inválido",
      "auth/user-disabled": "Usuário desabilitado",
      "auth/user-not-found": "Email ou senha incorretos",
      "auth/wrong-password": "Email ou senha incorretos",
      "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde",
      "auth/network-request-failed": "Erro de conexão. Verifique sua internet",
    };
    return errorMessages[errorCode] || "Erro ao fazer login. Tente novamente";
  }

  // Fazer login
  async login(email, password) {
    // Verificar se está bloqueado
    if (this.isBlocked()) {
      const timeRemaining = this.getBlockedTimeRemaining();
      return {
        success: false,
        error: `Conta bloqueada. Tente novamente em ${timeRemaining} segundos.`,
        blocked: true,
        timeRemaining: timeRemaining,
      };
    }

    // Validar credenciais com Firebase
    const authResult = await this.validateCredentials(email, password);

    if (authResult.success) {
      this.resetAttempts();

      // Criar sessão
      const session = {
        email: authResult.user.email,
        uid: authResult.user.uid,
        loginTime: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
      };
      localStorage.setItem("adminSession", JSON.stringify(session));

      return {
        success: true,
        session: session,
      };
    } else {
      // Registrar tentativa falhada
      const result = this.recordFailedAttempt();

      if (result.blocked) {
        return {
          success: false,
          error: `Máximo de tentativas excedido. Conta bloqueada por ${result.timeRemaining} segundos.`,
          blocked: true,
          timeRemaining: result.timeRemaining,
        };
      } else {
        return {
          success: false,
          error:
            authResult.error ||
            `Credenciais inválidas. ${result.attemptsRemaining} tentativa(s) restante(s).`,
          attemptsRemaining: result.attemptsRemaining,
        };
      }
    }
  }

  // Verificar sessão
  checkSession() {
    const sessionData = localStorage.getItem("adminSession");

    if (!sessionData) {
      return null;
    }

    const session = JSON.parse(sessionData);

    // Verificar se a sessão expirou
    if (Date.now() > session.expiresAt) {
      this.logout();
      return null;
    }

    return session;
  }

  // Fazer logout
  async logout() {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
    localStorage.removeItem("adminSession");
  }

  // Iniciar timer de bloqueio
  startBlockTimer(callback) {
    if (!this.isBlocked()) {
      return;
    }

    const updateTimer = () => {
      if (!this.isBlocked()) {
        callback(null);
        return;
      }

      const timeRemaining = this.getBlockedTimeRemaining();
      callback(timeRemaining);

      if (timeRemaining > 0) {
        setTimeout(updateTimer, 1000);
      }
    };

    updateTimer();
  }
}

// Exportar para uso global
if (typeof window !== "undefined") {
  window.AdminSecurity = AdminSecurity;
}
