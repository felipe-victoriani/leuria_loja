# 🔧 Guia de Teste - Menu Hambúrguer

## 📋 Problemas Corrigidos

1. ✅ Z-index ajustado (hamburger: 1002, nav: 1001)
2. ✅ Overlay com pointer-events corrigido
3. ✅ JavaScript com logs de debug
4. ✅ Transições suavizadas
5. ✅ Evento stopPropagation adicionado

## 🧪 Como Testar

### Teste 1: Arquivo de Teste Simplificado

1. Abra `test-menu.html` no navegador
2. Redimensione a janela para menos de 900px
3. Clique no ícone hambúrguer (três linhas)
4. Verifique se o menu lateral abre
5. Clique fora para fechar

### Teste 2: Site Principal

1. Abra `index.html` no navegador
2. Pressione `F12` para abrir o Console do Desenvolvedor
3. Redimensione a janela para menos de 900px
4. Verifique os logs no console:
   ```
   🌿 Loja Leuria - Inicializando...
   ✅ Carrinho inicializado
   ✅ Produtos inicializados
   ✅ Menu hambúrguer inicializado
   ```
5. Clique no ícone hambúrguer
6. Deve aparecer: `Menu toggled: true`

## 🐛 Debug

### Se o menu não aparecer:

**Verifique no Console (F12):**

```javascript
// Digite no console:
document.getElementById("hamburger");
document.getElementById("nav");
```

Se retornar `null`, significa que os IDs não foram encontrados.

**Verifique se o CSS está carregando:**

```javascript
// Digite no console:
getComputedStyle(document.getElementById("nav")).right;
```

Deve retornar `-320px` quando fechado.

**Teste manual:**

```javascript
// Digite no console:
const nav = document.getElementById("nav");
nav.classList.add("active");
```

Se adicionar a classe manualmente funcionar, o problema é no JavaScript.

## 🔍 Checklist de Verificação

- [ ] Largura da janela < 900px?
- [ ] Ícone hambúrguer visível?
- [ ] Console sem erros?
- [ ] Firebase carregando (pode ter warnings, ok)?
- [ ] Elementos `#hamburger` e `#nav` existem?
- [ ] CSS `style.css` carregado?
- [ ] JavaScript `script.js` carregado?

## 📱 Teste Responsivo

### Desktop (> 900px)

- Menu horizontal no centro
- Hambúrguer escondido
- ✅ Funcionando

### Tablet (481px - 900px)

- Menu hambúrguer visível
- Menu lateral ao clicar
- ✅ **TESTAR AQUI**

### Mobile (< 480px)

- Menu hambúrguer visível
- Grid de produtos 1 coluna
- ✅ **TESTAR AQUI**

## 🛠️ Soluções Rápidas

### Problema: Hambúrguer não aparece

**Solução:** Redimensione janela para menos de 900px

### Problema: Menu não abre ao clicar

**Solução:**

1. Limpe cache: `Ctrl + Shift + Delete`
2. Recarregue: `Ctrl + F5`
3. Verifique console por erros

### Problema: Menu abre mas não fecha

**Solução:** Clique no overlay escuro (fora do menu branco)

### Problema: Menu abre parcialmente

**Solução:** Verifique se CSS está carregando:

- Clique direito → Inspecionar
- Aba "Network" → Recarregue
- Procure `style.css` → Deve ter status 200

## 🎯 O Que Deve Acontecer

1. **Antes de 900px:** Menu horizontal normal
2. **Abaixo de 900px:**
   - Ícone hambúrguer aparece
   - Menu horizontal esconde
3. **Ao clicar no hambúrguer:**
   - Overlay escuro aparece
   - Menu branco desliza da direita
   - Ícone vira X
4. **Ao clicar em link ou fora:**
   - Menu fecha suavemente
   - Overlay desaparece
   - Ícone volta ao normal

## 📞 Teste Final

Execute este código no console:

```javascript
// Teste automático
console.log("=== TESTE DO MENU ===");
const h = document.getElementById("hamburger");
const n = document.getElementById("nav");
console.log("Hambúrguer encontrado:", !!h);
console.log("Nav encontrado:", !!n);
console.log("MenuToggle existe:", typeof menuToggle !== "undefined");
console.log("Largura da tela:", window.innerWidth + "px");
console.log(window.innerWidth < 900 ? "✅ Modo Mobile" : "⚠️ Modo Desktop");
```

---

**Última atualização:** 31 de janeiro de 2026  
**Status:** 🔧 Debug mode ativado
