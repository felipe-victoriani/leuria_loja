// Sistema de Recuperação de Senha

class PasswordReset {
  constructor() {
    this.currentStep = 1;
    this.email = "";
    this.generatedCode = "";
    this.codeExpiration = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initEmailJS();
  }

  initEmailJS() {
    // Inicializar EmailJS
    // SUBSTITUA PELA SUA PUBLIC KEY DO EMAILJS
    if (typeof emailjs !== "undefined") {
      emailjs.init("SUA_PUBLIC_KEY_EMAILJS");
    }
  }

  setupEventListeners() {
    // Formulário de solicitação de código
    const requestForm = document.getElementById("requestCodeForm");
    if (requestForm) {
      requestForm.addEventListener("submit", (e) => this.handleRequestCode(e));
    }

    // Formulário de verificação de código
    const verifyForm = document.getElementById("verifyCodeForm");
    if (verifyForm) {
      verifyForm.addEventListener("submit", (e) => this.handleVerifyCode(e));
    }

    // Formulário de nova senha
    const newPasswordForm = document.getElementById("newPasswordForm");
    if (newPasswordForm) {
      newPasswordForm.addEventListener("submit", (e) =>
        this.handleNewPassword(e),
      );
    }

    // Reenviar código
    const resendBtn = document.getElementById("resendCode");
    if (resendBtn) {
      resendBtn.addEventListener("click", () => this.resendCode());
    }
  }

  async handleRequestCode(e) {
    e.preventDefault();

    this.email = document.getElementById("email").value.trim();

    // Validar email
    if (!this.validateEmail(this.email)) {
      this.showError("Email inválido");
      return;
    }

    // Verificar se é o email do admin (em produção, verificar no backend)
    const adminEmail = "admin@lojaleuria.com";

    if (this.email !== adminEmail) {
      this.showError("Email não cadastrado no sistema");
      return;
    }

    // Gerar código de 6 dígitos
    this.generatedCode = this.generateCode();
    this.codeExpiration = Date.now() + 10 * 60 * 1000; // 10 minutos

    // Enviar email
    const sent = await this.sendCodeByEmail();

    if (sent) {
      this.showSuccess("Código enviado para seu email!");
      this.goToStep(2);
      this.startTimer();
    } else {
      this.showError("Erro ao enviar email. Tente novamente.");
    }
  }

  async handleVerifyCode(e) {
    e.preventDefault();

    const code = document.getElementById("code").value.trim();

    // Verificar se o código expirou
    if (Date.now() > this.codeExpiration) {
      this.showError("Código expirado. Solicite um novo código.");
      return;
    }

    // Verificar código
    if (code === this.generatedCode) {
      this.showSuccess("Código verificado com sucesso!");
      this.goToStep(3);
    } else {
      this.showError("Código inválido. Tente novamente.");
    }
  }

  async handleNewPassword(e) {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validar senhas
    if (newPassword.length < 6) {
      this.showError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showError("As senhas não coincidem");
      return;
    }

    // Em produção, isso deveria ser feito no backend
    // Por enquanto, vamos simular a mudança de senha
    this.showSuccess("Senha redefinida com sucesso!");

    setTimeout(() => {
      window.location.href = "admin.html";
    }, 2000);
  }

  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendCodeByEmail() {
    // Verificar se EmailJS está disponível
    if (typeof emailjs === "undefined") {
      console.warn("EmailJS não carregado. Código gerado:", this.generatedCode);
      return true; // Simular sucesso em desenvolvimento
    }

    try {
      // SUBSTITUA PELOS SEUS IDs DO EMAILJS
      const serviceID = "SEU_SERVICE_ID";
      const templateID = "SEU_TEMPLATE_ID";

      const templateParams = {
        to_email: this.email,
        to_name: "Administrador",
        verification_code: this.generatedCode,
        expiration_time: "10 minutos",
      };

      await emailjs.send(serviceID, templateID, templateParams);
      return true;
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      // Em desenvolvimento, mostrar o código no console
      console.log("Código de verificação:", this.generatedCode);
      return true; // Simular sucesso em desenvolvimento
    }
  }

  async resendCode() {
    // Gerar novo código
    this.generatedCode = this.generateCode();
    this.codeExpiration = Date.now() + 10 * 60 * 1000;

    const sent = await this.sendCodeByEmail();

    if (sent) {
      this.showSuccess("Novo código enviado!");
      this.startTimer();
    } else {
      this.showError("Erro ao reenviar código. Tente novamente.");
    }
  }

  goToStep(step) {
    // Esconder todas as etapas
    document.querySelectorAll(".step").forEach((el) => {
      el.style.display = "none";
    });

    // Mostrar etapa atual
    document.getElementById(`step${step}`).style.display = "block";
    this.currentStep = step;
  }

  startTimer() {
    const timerElement = document.getElementById("timer");

    const updateTimer = () => {
      const timeRemaining = this.codeExpiration - Date.now();

      if (timeRemaining <= 0) {
        timerElement.textContent = "Código expirado";
        timerElement.style.color = "#ef4444";
        return;
      }

      const minutes = Math.floor(timeRemaining / 60000);
      const seconds = Math.floor((timeRemaining % 60000) / 1000);

      timerElement.textContent = `Código válido por: ${minutes}:${seconds.toString().padStart(2, "0")}`;
      timerElement.style.color = "#667eea";

      setTimeout(updateTimer, 1000);
    };

    updateTimer();
  }

  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  showSuccess(message) {
    const successEl = document.getElementById("successMessage");
    successEl.textContent = message;
    successEl.style.display = "block";

    const errorEl = document.getElementById("errorMessage");
    errorEl.style.display = "none";

    setTimeout(() => {
      successEl.style.display = "none";
    }, 5000);
  }

  showError(message) {
    const errorEl = document.getElementById("errorMessage");
    errorEl.textContent = message;
    errorEl.style.display = "block";

    const successEl = document.getElementById("successMessage");
    successEl.style.display = "none";

    setTimeout(() => {
      errorEl.style.display = "none";
    }, 5000);
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  new PasswordReset();
});
