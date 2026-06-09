/* ===== DXN NUTRICIÓN — CHAT WIDGET ===== */
(function () {

  const WA_NUMBER = '573012705375';
  const WA_BASE   = `https://wa.me/${WA_NUMBER}?text=`;

  /* ── Saludo según hora ── */
  function greeting() {
    const h = new Date().getHours();
    if (h >= 5  && h < 12) return 'Buenos días';
    if (h >= 12 && h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }

  /* ── Hora formateada ── */
  function now() {
    return new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }

  /* ── Opciones del menú principal ── */
  const MENU = [
    { icon: '🌿', label: 'Suplementos',           key: 'suplementos' },
    { icon: '☕', label: 'Alimentos y Bebidas',    key: 'bebidas'     },
    { icon: '🧴', label: 'Cuidado Personal',       key: 'cuidado'     },
    { icon: '🛒', label: 'Hacer un pedido',        key: 'pedido'      },
    { icon: '💬', label: 'Asesoría personalizada', key: 'asesoria'    },
    { icon: '🏆', label: 'Quiero mi membresía',    key: 'membresia'   },
  ];

  /* ── Respuestas por opción ── */
  const RESPONSES = {
    suplementos: {
      msg: '🌿 Nuestra línea de <strong>Suplementos Dietarios</strong> incluye:\n\n• Reishi Gano (RG) — sistema inmune\n• Ganocelium (GL) — vitalidad\n• Spirulina — proteína natural\n\n¿Te conecto con un asesor para más información?',
      wa:  '¡Hola! Estoy interesado/a en los Suplementos Dietarios DXN (Reishi Gano, Ganocelium, Spirulina). ¿Me pueden orientar?'
    },
    bebidas: {
      msg: '☕ Nuestra línea de <strong>Alimentos y Bebidas</strong>:\n\n• Lingzhi Café Negro\n• Zhi Mocha\n• Cocozhi\n• Morinzhi & Morinzyme\n\n¿Quieres conocer precios o hacer un pedido?',
      wa:  '¡Hola! Me interesan los productos de Alimentos y Bebidas DXN (café, mocha, cocozhi). ¿Me pueden ayudar?'
    },
    cuidado: {
      msg: '🧴 Línea de <strong>Cuidado Personal</strong> DXN:\n\n• Ganozhi Shampoo & Gel de Baño\n• Ganozhi Pasta Dental\n• Ganozhi Jabón\n• Gano Massage Oil\n• Tea Tree Cream\n\n¿Te ayudamos a elegir el producto ideal?',
      wa:  '¡Hola! Me interesa la línea de Cuidado Personal DXN (Ganozhi). ¿Me pueden asesorar?'
    },
    pedido: {
      msg: '🛒 ¡Perfecto! Para hacer tu <strong>pedido DXN</strong> te conectamos directamente con nuestro equipo de ventas.\n\nTen listos los productos que deseas y te atendemos de inmediato. 📦',
      wa:  '¡Hola! Quiero hacer un pedido de productos DXN. ¿Me pueden ayudar con los precios y disponibilidad?'
    },
    asesoria: {
      msg: '💬 Con gusto te brindamos una <strong>asesoría personalizada</strong> y gratuita.\n\nNuestro equipo te orientará según tus objetivos de salud, bienestar o negocio. 🙌',
      wa:  '¡Hola! Me gustaría recibir una asesoría personalizada sobre los productos y oportunidades DXN. ¿Cuándo podemos hablar?'
    },
    membresia: {
      msg: '🏆 ¡Excelente decisión! Con tu <strong>membresía DXN</strong> accedes a:\n\n✅ Precios de distribuidor\n✅ Ingresos por ventas y red\n✅ Formación empresarial\n✅ Soporte personalizado\n\nTe conectamos con un líder DXN ahora mismo.',
      wa:  '¡Hola! Quiero información sobre cómo obtener mi membresía DXN y ser distribuidor/a. ¿Me pueden guiar en el proceso?'
    }
  };

  /* ══════════════════════════════════════
     HTML del widget
  ══════════════════════════════════════ */
  const html = `
  <!-- Chat Button -->
  <button id="dxn-chat-btn" aria-label="Abrir chat DXN" title="¿En qué te ayudamos?">
    <span class="notif"></span>
    <svg class="chat-open-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
    <svg class="chat-close-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
  </button>

  <!-- Chat Panel -->
  <div id="dxn-chat-panel" role="dialog" aria-label="Chat DXN Nutrición">
    <div class="chat-header">
      <div class="chat-avatar">🍄</div>
      <div class="chat-header-info">
        <div class="chat-header-name">Asistente DXN Nutrición</div>
        <div class="chat-header-status">
          <span class="chat-status-dot"></span> En línea ahora
        </div>
      </div>
    </div>
    <div class="chat-messages" id="chat-messages"></div>
    <div class="chat-footer">
      <input type="text" class="chat-input" id="chat-input" placeholder="Escribe tu mensaje..." autocomplete="off" />
      <button class="chat-send" id="chat-send" aria-label="Enviar">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
    <div class="chat-powered">Powered by DXN Nutrición Colombia</div>
  </div>`;

  /* ── Inject HTML ── */
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  /* ── References ── */
  const btn      = document.getElementById('dxn-chat-btn');
  const panel    = document.getElementById('dxn-chat-panel');
  const messages = document.getElementById('chat-messages');
  const input    = document.getElementById('chat-input');
  const sendBtn  = document.getElementById('chat-send');
  let   opened   = false;
  let   menuShown= false;

  /* ── Toggle panel ── */
  btn.addEventListener('click', () => {
    opened = !opened;
    btn.classList.toggle('open', opened);
    panel.classList.toggle('open', opened);
    // Remove notification dot on open
    const notif = btn.querySelector('.notif');
    if (notif) notif.remove();
    if (opened && !menuShown) {
      startConversation();
      menuShown = true;
    }
    if (opened) setTimeout(() => input.focus(), 400);
  });

  /* ── Add message ── */
  function addBubble(text, type = 'bot', delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = `chat-bubble ${type}`;
        el.innerHTML = text.replace(/\n/g, '<br>');
        messages.appendChild(el);
        const t = document.createElement('div');
        t.className = `chat-time ${type === 'user' ? 'right' : ''}`;
        t.textContent = now();
        messages.appendChild(t);
        scrollBottom();
        resolve();
      }, delay);
    });
  }

  /* ── Typing indicator ── */
  function showTyping(ms = 1200) {
    return new Promise(resolve => {
      const el = document.createElement('div');
      el.className = 'chat-typing';
      el.id = 'chat-typing';
      el.innerHTML = '<span></span><span></span><span></span>';
      messages.appendChild(el);
      scrollBottom();
      setTimeout(() => { el.remove(); resolve(); }, ms);
    });
  }

  /* ── Show menu options ── */
  function showMenu(delay = 0) {
    setTimeout(() => {
      const wrap = document.createElement('div');
      wrap.className = 'chat-options';
      wrap.id = 'chat-menu';

      MENU.forEach(opt => {
        const b = document.createElement('button');
        b.className = 'chat-option-btn';
        b.innerHTML = `<span class="opt-icon">${opt.icon}</span> ${opt.label}`;
        b.addEventListener('click', () => handleOption(opt));
        wrap.appendChild(b);
      });

      messages.appendChild(wrap);
      scrollBottom();
    }, delay);
  }

  /* ── Handle option click ── */
  async function handleOption(opt) {
    // Remove menu
    const menu = document.getElementById('chat-menu');
    if (menu) menu.remove();

    // User bubble
    await addBubble(`${opt.icon} ${opt.label}`, 'user');

    // Bot typing
    await showTyping(900);

    // Bot response
    const resp = RESPONSES[opt.key];
    await addBubble(resp.msg, 'bot');

    // WhatsApp button
    setTimeout(() => {
      const waWrap = document.createElement('div');
      waWrap.className = 'chat-options';
      waWrap.innerHTML = `
        <button class="chat-option-btn" onclick="window.open('${WA_BASE}${encodeURIComponent(resp.wa)}','_blank')" style="background:linear-gradient(135deg,#25D366,#128C7E);color:white;border-color:transparent">
          <span class="opt-icon">📱</span> Continuar por WhatsApp
        </button>
        <button class="chat-option-btn" id="back-menu-btn">
          <span class="opt-icon">↩️</span> Ver otras opciones
        </button>`;
      messages.appendChild(waWrap);
      scrollBottom();

      document.getElementById('back-menu-btn')?.addEventListener('click', () => {
        waWrap.remove();
        showMenu();
      });
    }, 300);
  }

  /* ── Free text input ── */
  async function handleUserText(text) {
    if (!text.trim()) return;
    input.value = '';

    const menu = document.getElementById('chat-menu');
    if (menu) menu.remove();

    await addBubble(text, 'user');
    await showTyping(800);

    // Simple keyword matching
    const t = text.toLowerCase();
    let matched = null;
    if (t.includes('suplemento') || t.includes('reishi') || t.includes('ganocelium') || t.includes('spirulina')) matched = MENU[0];
    else if (t.includes('café') || t.includes('cafe') || t.includes('bebida') || t.includes('mocha') || t.includes('cocozhi')) matched = MENU[1];
    else if (t.includes('shampoo') || t.includes('jabón') || t.includes('jabon') || t.includes('cuidado') || t.includes('crema')) matched = MENU[2];
    else if (t.includes('pedido') || t.includes('comprar') || t.includes('precio') || t.includes('cuánto') || t.includes('cuanto')) matched = MENU[3];
    else if (t.includes('asesor') || t.includes('ayuda') || t.includes('información') || t.includes('informacion')) matched = MENU[4];
    else if (t.includes('membresía') || t.includes('membresia') || t.includes('distribuidor') || t.includes('negocio') || t.includes('unirme')) matched = MENU[5];

    if (matched) {
      handleOption(matched);
    } else {
      await addBubble(`Gracias por tu mensaje 😊 Para darte la mejor atención, elige una de nuestras opciones o escríbenos directamente por WhatsApp.`, 'bot');
      showMenu(300);
    }
  }

  /* ── Send button ── */
  sendBtn.addEventListener('click', () => handleUserText(input.value));
  input.addEventListener('keypress', e => { if (e.key === 'Enter') handleUserText(input.value); });

  /* ── Start conversation ── */
  async function startConversation() {
    await showTyping(700);
    await addBubble(`👋 ¡<strong>${greeting()}!</strong> Soy el asistente virtual de <strong>DXN Nutrición Colombia</strong>.<br><br>¿En qué te puedo ayudar hoy?`, 'bot');
    showMenu(300);
  }

  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  /* ── Auto-show notification after 4s ── */
  setTimeout(() => {
    if (!opened) {
      const notif = btn.querySelector('.notif');
      if (!notif) {
        const dot = document.createElement('span');
        dot.className = 'notif';
        btn.appendChild(dot);
      }
    }
  }, 4000);

})();
