/* ===== DXN CARRITO DE COMPRAS ===== */
(function () {

  const WA_NUMBER = '573223153360'; // 322 315 3360
  let cart = JSON.parse(localStorage.getItem('dxn-cart') || '[]');

  /* ── HTML del carrito ── */
  const html = `
  <button id="dxn-cart-btn" aria-label="Carrito de compras" title="Mi carrito DXN">
    <svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-17-16v2h2l3.6 7.6L4.2 14c-.1.3-.2.6-.2.9 0 1.1.9 2 2 2h14v-2H6.4c-.1 0-.2-.1-.2-.2l.1-.3.9-1.5H19c.7 0 1.4-.4 1.7-1l3.6-6.5c.4-.7-.1-1.5-1-1.5H5.2L4.3 2H1z"/></svg>
    <span id="cart-count"></span>
  </button>

  <div id="dxn-cart-panel">
    <div class="cart-header">
      <div class="cart-header-left">
        <svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-17-16v2h2l3.6 7.6L4.2 14c-.1.3-.2.6-.2.9 0 1.1.9 2 2 2h14v-2H6.4c-.1 0-.2-.1-.2-.2l.1-.3.9-1.5H19c.7 0 1.4-.4 1.7-1l3.6-6.5c.4-.7-.1-1.5-1-1.5H5.2L4.3 2H1z"/></svg>
        <h3>Mi Carrito DXN</h3>
      </div>
      <button class="cart-header-close" onclick="toggleCart()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="cart-items" id="cart-items-list"></div>
    <div class="cart-footer" id="cart-footer" style="display:none">
      <div class="cart-summary">
        <span>Total de productos:</span>
        <strong id="cart-total-qty">0 items</strong>
      </div>
      <button class="cart-wa-btn" onclick="sendToWhatsApp()">
        <svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.4.1-.1.2-.3.3-.4.1-.2.1-.4 0-.5-.1-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.1 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5C8.3 21.5 10.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
        Pedir por WhatsApp
      </button>
      <button class="cart-clear-btn" onclick="clearCart()"><i class="fa-solid fa-trash"></i> Vaciar carrito</button>
    </div>
  </div>
  <div id="cart-toast"></div>`;

  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap);

  /* ── Referencias ── */
  const btn      = document.getElementById('dxn-cart-btn');
  const panel    = document.getElementById('dxn-cart-panel');
  const countEl  = document.getElementById('cart-count');
  const itemsEl  = document.getElementById('cart-items-list');
  const footerEl = document.getElementById('cart-footer');
  const totalEl  = document.getElementById('cart-total-qty');
  const toast    = document.getElementById('cart-toast');
  let   isOpen   = false;

  /* ── Toggle panel ── */
  window.toggleCart = function () {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    renderCart();
  };
  btn.addEventListener('click', toggleCart);

  /* ── Render carrito ── */
  function renderCart() {
    if (cart.length === 0) {
      itemsEl.innerHTML = `<div class="cart-empty"><i class="fa-solid fa-cart-shopping"></i><p>Tu carrito está vacío</p><span style="font-size:.8rem;color:#CBD5E1">Agrega productos desde el catálogo</span></div>`;
      footerEl.style.display = 'none';
    } else {
      itemsEl.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
          <img class="cart-item-img" src="${item.img}" alt="${item.name}" onerror="this.style.display='none'">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-cat">${item.cat}</div>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="changeQty(${i},-1)">−</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="removeItem(${i})" title="Eliminar"><i class="fa-solid fa-xmark"></i></button>
        </div>`).join('');
      const total = cart.reduce((a, b) => a + b.qty, 0);
      totalEl.textContent = `${total} producto${total !== 1 ? 's' : ''}`;
      footerEl.style.display = 'block';
    }
    updateBadge();
  }

  /* ── Agregar producto ── */
  window.addToCart = function (name, cat, img) {
    const idx = cart.findIndex(i => i.name === name);
    if (idx >= 0) {
      cart[idx].qty++;
    } else {
      cart.push({ name, cat, img, qty: 1 });
    }
    saveCart();
    updateBadge();
    showToast(`🛒 ${name} agregado`);
    if (isOpen) renderCart();
  };

  /* ── Cambiar cantidad ── */
  window.changeQty = function (idx, delta) {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    saveCart(); renderCart();
  };

  /* ── Eliminar item ── */
  window.removeItem = function (idx) {
    cart.splice(idx, 1);
    saveCart(); renderCart();
  };

  /* ── Vaciar carrito ── */
  window.clearCart = function () {
    cart = [];
    saveCart(); renderCart();
  };

  /* ── Enviar por WhatsApp ── */
  window.sendToWhatsApp = function () {
    if (cart.length === 0) return;
    const lines = cart.map(i => `• ${i.name} x${i.qty}`).join('\n');
    const msg = `¡Hola! Me gustaría hacer el siguiente pedido DXN:\n\n${lines}\n\nPor favor indíqueme disponibilidad y formas de pago. ¡Gracias! 🍄`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  /* ── Badge ── */
  function updateBadge() {
    const total = cart.reduce((a, b) => a + b.qty, 0);
    // Badge flotante
    countEl.textContent = total > 9 ? '9+' : total;
    countEl.classList.toggle('visible', total > 0);
    // Badge en navbar
    const navCount = document.getElementById('nav-cart-count');
    if (navCount) {
      navCount.textContent = total > 9 ? '9+' : total;
      navCount.classList.toggle('visible', total > 0);
    }
  }

  /* ── Save ── */
  function saveCart() {
    localStorage.setItem('dxn-cart', JSON.stringify(cart));
  }

  /* ── Toast ── */
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ── Agregar botones a productos existentes ── */
  function attachCartButtons() {
    document.querySelectorAll('.product-card').forEach(card => {
      const name = card.querySelector('.product-name')?.textContent?.trim();
      const cat  = card.querySelector('.product-category')?.textContent?.trim();
      const img  = card.querySelector('img')?.src || '';
      if (!name) return;

      const footer = card.querySelector('.product-footer');
      if (!footer || footer.querySelector('.add-to-cart-btn')) return;

      const cartBtn = document.createElement('button');
      cartBtn.className = 'add-to-cart-btn';
      cartBtn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar';
      cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(name, cat || 'Producto DXN', img);
        cartBtn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
        cartBtn.classList.add('added');
        setTimeout(() => {
          cartBtn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar';
          cartBtn.classList.remove('added');
        }, 2000);
      });
      footer.appendChild(cartBtn);
    });
  }

  /* Inicializar */
  updateBadge();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachCartButtons);
  } else {
    setTimeout(attachCartButtons, 500);
  }

})();
