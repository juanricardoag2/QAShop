/**
 * app.js
 * Lógica de QA Shop: navegación entre vistas, login, búsqueda,
 * carrito, checkout y pedidos. Todo el estado persiste en
 * localStorage; no hay llamadas de red ni backend.
 */

(function () {
  "use strict";

  const state = {
    session: null,        // { email } | null
    cart: {},             // { [productId]: quantity }
    orders: [],           // [{ id, date, items, total }]
    redirectAfterLogin: null
  };

  // ---------------------------------------------------------
  // Utilidades
  // ---------------------------------------------------------

  function formatCurrency(amount) {
    return "$" + amount.toFixed(2);
  }

  function findProduct(id) {
    return PRODUCTS.find((p) => p.id === Number(id));
  }

  function cartEntries() {
    return Object.keys(state.cart)
      .map((id) => ({ product: findProduct(id), qty: state.cart[id] }))
      .filter((entry) => entry.product);
  }

  function cartTotals() {
    const entries = cartEntries();
    const totalItems = entries.reduce((sum, e) => sum + e.qty, 0);
    const subtotal = entries.reduce((sum, e) => sum + e.qty * e.product.price, 0);
    return { totalItems, subtotal, total: subtotal };
  }

  function isCartEmpty() {
    return cartEntries().length === 0;
  }

  // ---------------------------------------------------------
  // Persistencia (localStorage)
  // ---------------------------------------------------------

  function loadState() {
    try {
      state.session = JSON.parse(localStorage.getItem(STORAGE_KEYS.session)) || null;
    } catch (e) {
      state.session = null;
    }
    try {
      state.cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart)) || {};
    } catch (e) {
      state.cart = {};
    }
    try {
      state.orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders)) || [];
    } catch (e) {
      state.orders = [];
    }
  }

  function saveSession() {
    if (state.session) {
      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(state.session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.session);
    }
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state.cart));
  }

  function saveOrders() {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(state.orders));
  }

  // ---------------------------------------------------------
  // Toasts
  // ---------------------------------------------------------

  function showToast(message, type) {
    const stack = document.getElementById("toast-stack");
    const toast = document.createElement("div");
    toast.className = "toast" + (type ? " toast-" + type : "");
    toast.setAttribute("data-testid", "toast");
    toast.textContent = message;
    stack.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3200);
  }

  function showFormMessage(elId, type, text) {
    const el = document.getElementById(elId);
    el.textContent = text;
    el.hidden = false;
    el.className = "form-message is-" + type;
  }

  function hideFormMessage(elId) {
    const el = document.getElementById(elId);
    el.hidden = true;
    el.textContent = "";
  }

  // ---------------------------------------------------------
  // Navegación entre vistas
  // ---------------------------------------------------------

  function navigate(viewName) {
    document.querySelectorAll(".view").forEach((section) => {
      section.classList.toggle("is-active", section.dataset.view === viewName);
    });
    document.querySelectorAll(".nav-link[data-view-link]").forEach((btn) => {
      btn.classList.toggle("is-current", btn.dataset.viewLink === viewName);
    });
    closeMobileNav();
    window.scrollTo({ top: 0, behavior: "auto" });

    if (viewName === "carrito") renderCart();
    if (viewName === "pedidos") renderOrders();
  }

  function goToCheckout() {
    if (!state.session) {
      state.redirectAfterLogin = "checkout";
      showToast("Necesitás iniciar sesión para continuar con el checkout.", "error");
      navigate("login");
      return;
    }
    if (isCartEmpty()) {
      showToast("Tu carrito está vacío. Agregá productos antes de continuar.", "error");
      navigate("carrito");
      return;
    }
    renderCheckoutSummary();
    hideFormMessage("checkout-message");
    navigate("checkout");
  }

  function closeMobileNav() {
    document.querySelector(".header-inner").classList.remove("nav-open");
    document.getElementById("nav-toggle").setAttribute("aria-expanded", "false");
  }

  // ---------------------------------------------------------
  // Sesión / Login
  // ---------------------------------------------------------

  function updateSessionUI() {
    const hello = document.getElementById("session-hello");
    const loginBtn = document.getElementById("btn-login-open");
    const logoutBtn = document.getElementById("btn-logout");

    if (state.session) {
      hello.textContent = "Hola, " + state.session.email;
      hello.hidden = false;
      loginBtn.hidden = true;
      logoutBtn.hidden = false;
    } else {
      hello.hidden = true;
      loginBtn.hidden = false;
      logoutBtn.hidden = true;
    }
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const isValid =
      email.toLowerCase() === VALID_USER.email.toLowerCase() && password === VALID_USER.password;

    if (!isValid) {
      showFormMessage("login-message", "error", "Email o contraseña incorrectos. Verificá tus credenciales.");
      return;
    }

    state.session = { email: VALID_USER.email };
    saveSession();
    updateSessionUI();
    showFormMessage("login-message", "success", "Inicio de sesión exitoso. ¡Bienvenido/a!");
    document.getElementById("login-form").reset();

    setTimeout(() => {
      hideFormMessage("login-message");
      if (state.redirectAfterLogin === "checkout") {
        state.redirectAfterLogin = null;
        goToCheckout();
      } else {
        navigate("inicio");
      }
    }, 600);
  }

  function handleLogout() {
    state.session = null;
    saveSession();
    updateSessionUI();
    showToast("Sesión cerrada correctamente.", "success");
    navigate("inicio");
  }

  // ---------------------------------------------------------
  // Productos / Búsqueda
  // ---------------------------------------------------------

  function renderProducts(list) {
    const grid = document.getElementById("product-grid");
    const empty = document.getElementById("products-empty");

    if (list.length === 0) {
      grid.innerHTML = "";
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    grid.innerHTML = list
      .map(
        (p) => `
      <article class="product-card" data-testid="product-card-${p.id}">
        <div class="product-icon" aria-hidden="true">${p.icon}</div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <span class="product-price" data-testid="product-price-${p.id}">${formatCurrency(p.price)}</span>
          <button class="btn btn-primary" data-add-to-cart="${p.id}" data-testid="add-to-cart-${p.id}">Agregar</button>
        </div>
      </article>`
      )
      .join("");
  }

  function handleSearch() {
    const query = document.getElementById("search-input").value.trim().toLowerCase();
    const info = document.getElementById("search-result-info");

    if (!query) {
      info.hidden = true;
      renderProducts(PRODUCTS);
      return;
    }

    const results = PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
    );

    info.hidden = false;
    info.textContent =
      results.length === 1
        ? `1 resultado para “${query}”`
        : `${results.length} resultados para “${query}”`;

    renderProducts(results);
  }

  function handleClearSearch() {
    document.getElementById("search-input").value = "";
    document.getElementById("search-result-info").hidden = true;
    renderProducts(PRODUCTS);
    document.getElementById("search-input").focus();
  }

  // ---------------------------------------------------------
  // Carrito
  // ---------------------------------------------------------

  function addToCart(id) {
    const product = findProduct(id);
    if (!product) return;
    state.cart[id] = (state.cart[id] || 0) + 1;
    saveCart();
    updateCartBadge();
    showToast(`${product.name} agregado al carrito.`, "success");
  }

  function changeQty(id, delta) {
    const current = state.cart[id] || 0;
    const next = current + delta;
    if (next <= 0) {
      delete state.cart[id];
    } else {
      state.cart[id] = next;
    }
    saveCart();
    updateCartBadge();
    renderCart();
  }

  function updateCartBadge() {
    const { totalItems } = cartTotals();
    document.getElementById("cart-badge").textContent = String(totalItems);
  }

  function renderCart() {
    const entries = cartEntries();
    const itemsEl = document.getElementById("cart-items");
    const layoutEl = document.querySelector(".cart-layout");
    const emptyEl = document.getElementById("cart-empty");

    if (entries.length === 0) {
      itemsEl.innerHTML = "";
      layoutEl.hidden = true;
      emptyEl.hidden = false;
      return;
    }

    layoutEl.hidden = false;
    emptyEl.hidden = true;

    itemsEl.innerHTML = entries
      .map(({ product, qty }) => {
        const lineSubtotal = product.price * qty;
        return `
        <div class="cart-item" data-testid="cart-item-${product.id}">
          <div class="cart-item-icon" aria-hidden="true">${product.icon}</div>
          <div class="cart-item-name-wrap">
            <p class="cart-item-name">${product.name}</p>
            <p class="cart-item-price">${formatCurrency(product.price)} c/u</p>
          </div>
          <div class="qty-control" data-testid="qty-control-${product.id}">
            <button class="qty-btn" data-qty-decrease="${product.id}" aria-label="Disminuir cantidad" data-testid="qty-decrease-${product.id}">−</button>
            <span class="qty-value" data-testid="qty-value-${product.id}">${qty}</span>
            <button class="qty-btn" data-qty-increase="${product.id}" aria-label="Aumentar cantidad" data-testid="qty-increase-${product.id}">+</button>
          </div>
          <span class="cart-item-subtotal" data-testid="cart-item-subtotal-${product.id}">${formatCurrency(lineSubtotal)}</span>
        </div>`;
      })
      .join("");

    const { totalItems, subtotal, total } = cartTotals();
    document.getElementById("cart-total-items").textContent = String(totalItems);
    document.getElementById("cart-subtotal").textContent = formatCurrency(subtotal);
    document.getElementById("cart-total").textContent = formatCurrency(total);
  }

  // ---------------------------------------------------------
  // Checkout
  // ---------------------------------------------------------

  function renderCheckoutSummary() {
    const linesEl = document.getElementById("checkout-order-lines");
    const entries = cartEntries();

    linesEl.innerHTML = entries
      .map(
        ({ product, qty }) => `
      <div class="checkout-line">
        <span>${product.name} × ${qty}</span>
        <span>${formatCurrency(product.price * qty)}</span>
      </div>`
      )
      .join("");

    const { total } = cartTotals();
    document.getElementById("checkout-total").textContent = formatCurrency(total);
  }

  function generateOrderId() {
    return "ORD-" + String(state.orders.length + 1).padStart(4, "0");
  }

  function handleCheckoutSubmit(e) {
    e.preventDefault();

    // Re-validar guardas por si se llegó a esta vista de forma inesperada.
    if (!state.session) {
      showToast("Necesitás iniciar sesión para continuar.", "error");
      navigate("login");
      return;
    }
    if (isCartEmpty()) {
      showToast("Tu carrito está vacío.", "error");
      navigate("carrito");
      return;
    }

    const name = document.getElementById("checkout-name").value.trim();
    const address = document.getElementById("checkout-address").value.trim();
    const city = document.getElementById("checkout-city").value.trim();
    const cardRaw = document.getElementById("checkout-card").value.trim();
    const cardDigits = cardRaw.replace(/\s+/g, "");

    if (!name || !address || !city) {
      showFormMessage("checkout-message", "error", "Completá nombre, dirección y ciudad para continuar.");
      return;
    }

    if (!/^\d{16}$/.test(cardDigits)) {
      showFormMessage("checkout-message", "error", "El número de tarjeta debe tener exactamente 16 dígitos.");
      return;
    }

    const { totalItems, total } = cartTotals();
    const order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      items: totalItems,
      total: total
    };

    state.orders.unshift(order);
    saveOrders();

    state.cart = {};
    saveCart();
    updateCartBadge();
    renderCart();

    hideFormMessage("checkout-message");
    document.getElementById("checkout-form").reset();

    document.getElementById("confirm-order-id").textContent = order.id;
    document.getElementById("confirm-order-total").textContent = formatCurrency(order.total);
    navigate("confirmacion");
    renderOrders();
  }

  // ---------------------------------------------------------
  // Pedidos
  // ---------------------------------------------------------

  function renderOrders() {
    const tbody = document.getElementById("orders-tbody");
    const table = document.getElementById("orders-table");
    const empty = document.getElementById("orders-empty");

    if (state.orders.length === 0) {
      tbody.innerHTML = "";
      table.hidden = true;
      empty.hidden = false;
      return;
    }

    table.hidden = false;
    empty.hidden = true;

    tbody.innerHTML = state.orders
      .map((order) => {
        const dateLabel = new Date(order.date).toLocaleString();
        return `
        <tr data-testid="order-row-${order.id}">
          <td>${order.id}</td>
          <td>${dateLabel}</td>
          <td>${order.items}</td>
          <td>${formatCurrency(order.total)}</td>
        </tr>`;
      })
      .join("");
  }

  // ---------------------------------------------------------
  // Menú móvil
  // ---------------------------------------------------------

  function toggleMobileNav() {
    const header = document.querySelector(".header-inner");
    const toggle = document.getElementById("nav-toggle");
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  }

  // ---------------------------------------------------------
  // Wiring de eventos
  // ---------------------------------------------------------

  function attachEvents() {
    // Navegación por data-view-link (delegado a nivel documento)
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-view-link]");
      if (!link) return;
      e.preventDefault();
      const target = link.dataset.viewLink;
      if (target === "checkout") {
        goToCheckout();
      } else {
        navigate(target);
      }
    });

    document.getElementById("nav-toggle").addEventListener("click", toggleMobileNav);

    // Búsqueda
    document.getElementById("search-input").addEventListener("input", handleSearch);
    document.getElementById("search-clear").addEventListener("click", handleClearSearch);

    // Agregar al carrito (delegado)
    document.getElementById("product-grid").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-add-to-cart]");
      if (!btn) return;
      addToCart(btn.dataset.addToCart);
    });

    // Cantidad en el carrito (delegado)
    document.getElementById("cart-items").addEventListener("click", (e) => {
      const inc = e.target.closest("[data-qty-increase]");
      const dec = e.target.closest("[data-qty-decrease]");
      if (inc) changeQty(inc.dataset.qtyIncrease, 1);
      if (dec) changeQty(dec.dataset.qtyDecrease, -1);
    });

    document.getElementById("btn-go-checkout").addEventListener("click", goToCheckout);

    // Login / logout
    document.getElementById("login-form").addEventListener("submit", handleLoginSubmit);
    document.getElementById("btn-logout").addEventListener("click", handleLogout);

    // Checkout
    document.getElementById("checkout-form").addEventListener("submit", handleCheckoutSubmit);
  }

  // ---------------------------------------------------------
  // Inicialización
  // ---------------------------------------------------------

  function init() {
    loadState();
    renderProducts(PRODUCTS);
    renderCart();
    renderOrders();
    updateCartBadge();
    updateSessionUI();
    attachEvents();
    navigate("inicio");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
