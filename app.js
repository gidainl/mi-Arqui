/* ═══════════════════════════════════════════════════════════════
   ARQ. [mi arquis] — app.js  ·  versión corregida
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURACIÓN  ← EDITAR AQUÍ
───────────────────────────────────────────────────────────── */

const STATS = {
  proyectos: '+50',
  anos:       '17',
  clientes:  '+51',
};

const AVAILABLE_DAYS = [1, 2, 3, 4, 5, 6]; // Lun-Sáb

const TIME_SLOTS = [
  { time: '09:00', taken: false },
  { time: '10:00', taken: false },
  { time: '11:00', taken: false },
  { time: '12:00', taken: true  },
  { time: '15:00', taken: false },
  { time: '16:00', taken: false },
  { time: '17:00', taken: false },
  { time: '18:00', taken: false },
];

const TESTIMONIALS = [
  {
    name:     'Interamericano U-1169',
    initials: 'C1',
    project:  'Escolar — educativos',
    rating:   5,
    text:     '"Batallamos mucho con los arquitectos porque no conocian la normativa del IMSS y nos regresaron los planos muchas veces hasta que contratamos a @mi arqui-, hasta aumento la capacidad"',
    avatar:   '',
  },
  {
    name:     'Armando Martinez A.',
    initials: 'C2',
    project:  'Supervisión de obra — Autoconstrucción',
    rating:   5,
    text:     '"Por querer ahorrar en la construccion de mi casa, los albañiles me robaron material y se tardaron mas de lo acordado. @mi arqui- me asesoro con todo esto. hoy ya vivo en mi propia casa y quedo muy chingona."',
    avatar:   '',
  },
  {
    name:     'CIQA Saltillo',
    initials: 'C3',
    project:  'Comercial',
    rating:   4,
    text:     '"@mi arqui- remodelo nuestras oficinas administrativas y recientemente las oficinas del area contable y sistemas, gano por amplio puntaje las licitaciones, tienen mucha experiencia en ambos casos"',
    avatar:   '',
  },
];

/* 
  PLANES QUE REQUIEREN PAGO ANTES DE AGENDAR CITA.
  Estos abren Stripe directamente; el resto pasa por el flujo normal.
*/
const PLANES_PAGO_PRIMERO = {
  'Consultoría Técnica': 'https://buy.stripe.com/14A28l5Lvgdp2jS5SE1gs01',
  'Supervisión de Obra': 'https://buy.stripe.com/fZu4gtfm56CPaQo0yk1gs00',
};

/*
  PLANES QUE VAN A STRIPE DESPUÉS DE AGENDAR (al confirmar en paso 3).
  Los demás solo muestran WhatsApp.
*/
const PLANES_STRIPE_DESPUES = {
  'Proyecto Residencial Completo': 'https://buy.stripe.com/bJe9AN2zj1ivbUsepa1gs02',
  'Proyecto Comercial':            'https://buy.stripe.com/bJe9AN2zj1ivbUsepa1gs02',
  'Diseño Escolar':                'https://buy.stripe.com/bJe9AN2zj1ivbUsepa1gs02',
  'Diseño Residencial':            'https://buy.stripe.com/bJe9AN2zj1ivbUsepa1gs02',
};

const TU_WHATSAPP = '528186052831';

/* ─────────────────────────────────────────────────────────────
   NO EDITAR DESDE AQUÍ
───────────────────────────────────────────────────────────── */

// ── 2. NAVBAR ────────────────────────────────────────────────
window.addEventListener('scroll', function () {
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── 3. STATS ─────────────────────────────────────────────────
document.getElementById('stat-proyectos').textContent = STATS.proyectos;
document.getElementById('stat-anos').textContent      = STATS.anos;
document.getElementById('stat-clientes').textContent  = STATS.clientes;

// ── 4. GALERÍA FILTRO ────────────────────────────────────────
document.querySelectorAll('.gf-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.gf-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var filter = btn.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach(function (item) {
      var show = filter === 'all' || item.dataset.category === filter;
      item.style.display   = show ? 'block' : 'none';
      item.style.animation = show ? 'fadeUp .4s ease' : '';
    });
  });
});

// ── 5. STAR PICKER ───────────────────────────────────────────
var selectedRating = 0;

document.querySelectorAll('#starPicker svg').forEach(function (star) {
  star.addEventListener('click', function () {
    selectedRating = parseInt(star.dataset.val);
    updateStarPicker(selectedRating, true);
  });
  star.addEventListener('mouseenter', function () {
    var val = parseInt(star.dataset.val);
    document.querySelectorAll('#starPicker svg').forEach(function (s, i) {
      s.style.fill   = i < val ? 'var(--stone)' : 'none';
      s.style.stroke = i < val ? 'var(--stone)' : 'var(--stone-d)';
    });
  });
  star.addEventListener('mouseleave', function () {
    updateStarPicker(selectedRating, false);
  });
});

function updateStarPicker(rating, useClass) {
  document.querySelectorAll('#starPicker svg').forEach(function (s, i) {
    if (useClass) {
      s.classList.toggle('active', i < rating);
    } else {
      s.style.fill   = i < rating ? 'var(--stone)' : 'none';
      s.style.stroke = i < rating ? 'var(--stone)' : 'var(--stone-d)';
    }
  });
}

// ── 6. TESTIMONIOS ───────────────────────────────────────────
function renderTestimonials() {
  var grid = document.getElementById('testimonialsGrid');
  if (!grid) return;
  if (TESTIMONIALS.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);font-size:.9rem;padding:20px 0;">Aún no hay reseñas publicadas.</p>';
    return;
  }
  grid.innerHTML = TESTIMONIALS.map(function (t) {
    var stars = Array.from({ length: 5 }, function (_, i) {
      return '<svg viewBox="0 0 24 24" class="' + (i < t.rating ? '' : 'empty') + '">'
        + '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 '
        + '12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    }).join('');
    var avatarStyle   = t.avatar ? 'background:url("' + t.avatar + '") center/cover no-repeat;' : '';
    var avatarContent = t.avatar ? '' : t.initials;
    return [
      '<div class="testimonial-card">',
        '<div class="tc-stars">' + stars + '</div>',
        '<div class="tc-text">' + t.text + '</div>',
        '<div class="tc-author">',
          '<div class="tc-avatar" style="' + avatarStyle + '">' + avatarContent + '</div>',
          '<div class="tc-info">',
            '<div class="tc-name">'    + t.name    + '</div>',
            '<div class="tc-project">' + t.project + '</div>',
          '</div>',
        '</div>',
      '</div>',
    ].join('');
  }).join('');

  var avg     = TESTIMONIALS.reduce(function (s, t) { return s + t.rating; }, 0) / TESTIMONIALS.length;
  var avgEl   = document.getElementById('avgRating');
  var totalEl = document.getElementById('totalReviews');
  if (avgEl)   avgEl.textContent   = avg.toFixed(1);
  if (totalEl) totalEl.textContent = 'Basado en ' + TESTIMONIALS.length + ' reseña' + (TESTIMONIALS.length !== 1 ? 's' : '');
}
renderTestimonials();

// ── 7. SUBMIT RESEÑA ─────────────────────────────────────────
function submitReview() {
  var name    = document.getElementById('rev_name').value.trim();
  var text    = document.getElementById('rev_text').value.trim();
  var project = document.getElementById('rev_project').value || 'Servicio arquitectónico';
  if (!name || !text || selectedRating === 0) {
    alert('Por favor ingresa tu nombre, calificación (estrellas) y comentario.');
    return;
  }
  TESTIMONIALS.unshift({
    name:     name,
    initials: name.split(' ').map(function (w) { return w[0]; }).join('').substring(0, 2).toUpperCase(),
    project:  project,
    rating:   selectedRating,
    text:     '"' + text + '"',
    avatar:   '',
  });
  renderTestimonials();
  document.getElementById('rev_name').value    = '';
  document.getElementById('rev_text').value    = '';
  document.getElementById('rev_project').value = '';
  selectedRating = 0;
  document.querySelectorAll('#starPicker svg').forEach(function (s) {
    s.classList.remove('active');
    s.style.fill   = 'none';
    s.style.stroke = 'var(--stone-d)';
  });
  var msg = document.getElementById('reviewSuccess');
  if (msg) { msg.style.display = 'block'; setTimeout(function () { msg.style.display = 'none'; }, 4000); }
  document.getElementById('testimonialsGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ═══════════════════════════════════════════════════════════
   8. MODAL — APERTURA CON LÓGICA PAGO-PRIMERO / CITA-PRIMERO
═══════════════════════════════════════════════════════════ */
var selectedPlan = '';

function openModal(planName) {
  selectedPlan = planName;

  /*
    ¿Este plan requiere pagar ANTES de agendar?
    Si sí → abrir Stripe directamente, sin modal de cita.
  */
  if (PLANES_PAGO_PRIMERO[planName]) {
    var confirmPago = confirm(
      '💳 ' + planName + '\n\n' +
      'Este servicio requiere el pago del anticipo para confirmar tu cita.\n' +
      'Serás redirigido a la pasarela de pago segura.\n\n' +
      '¿Continuar al pago?'
    );
    if (confirmPago) {
      window.open(PLANES_PAGO_PRIMERO[planName], '_blank');
    }
    return; // No abrir el modal de citas
  }

  /* ─── Flujo normal: primero datos → fecha → confirmar ─── */
  document.getElementById('modalPlanTag').textContent = 'Servicio seleccionado';
  document.getElementById('modalTitle').textContent   = planName;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Resetear estado
  selectedDate = null;
  selectedTime = null;

  // Ocultar botón WhatsApp y Stripe hasta paso 3
  var waBtn = document.getElementById('whatsappConfirmBtn');
  if (waBtn) waBtn.style.display = 'none';
  var payBtn = document.getElementById('stripePayBtn');
  if (payBtn) payBtn.style.display = 'none';

  // Ir al paso 1 sin validar
  _showStep(1);

  // Limpiar resumen
  var summary = document.getElementById('bookingSummary');
  if (summary) summary.classList.remove('show');

  // Deshabilitar botón confirmar
  _setConfirmBtn(false);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});

/* ═══════════════════════════════════════════════════════════
   9. NAVEGACIÓN ENTRE PASOS — reescrita y limpia
═══════════════════════════════════════════════════════════ */

/**
 * _showStep(num) — muestra el panel sin validar (uso interno)
 */
function _showStep(num) {
  [1, 2, 3].forEach(function (i) {
    var panel = document.getElementById('step-' + i);
    var tab   = document.getElementById('step-tab-' + i);
    if (panel) panel.classList.toggle('active', i === num);
    if (tab) {
      tab.classList.remove('active', 'done');
      if (i === num) tab.classList.add('active');
      if (i < num)   tab.classList.add('done');
    }
  });

  // Construir calendario DESPUÉS de que el panel sea visible en el DOM
  if (num === 2) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        buildCalendar();
        buildTimeSlots();
      });
    });
  }
}

/**
 * goToStep(num, validate) — llamado desde botones del modal
 */
function goToStep(num, validate) {
  if (validate === undefined) validate = true;

  /* ── Validación paso 1 → 2 ── */
  if (validate && num === 2) {
    var name  = (document.getElementById('cl_name')  || {}).value || '';
    var phone = (document.getElementById('cl_phone') || {}).value || '';
    var email = (document.getElementById('cl_email') || {}).value || '';
    var desc  = (document.getElementById('cl_desc')  || {}).value || '';
    if (!name.trim() || !phone.trim() || !email.trim() || !desc.trim()) {
      alert('Por favor completa: nombre completo, teléfono, email y descripción del proyecto.');
      return;
    }
  }

  /* ── Validación paso 2 → 3 ── */
  if (validate && num === 3) {
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona una fecha y un horario disponible.');
      return;
    }
    _prepareConfirmacion();
  }

  _showStep(num);
}

/**
 * _prepareConfirmacion() — llena el paso 3 con los datos del cliente
 */
function _prepareConfirmacion() {
  var name     = document.getElementById('cl_name').value;
  var phone    = document.getElementById('cl_phone').value;
  var email    = document.getElementById('cl_email').value;
  var desc     = document.getElementById('cl_desc').value;
  var datetime = selectedDate + ' a las ' + selectedTime;

  // Rellenar resumen visual
  document.getElementById('conf_name').textContent     = name;
  document.getElementById('conf_service').textContent  = selectedPlan;
  document.getElementById('conf_datetime').textContent = datetime;
  document.getElementById('conf_contact').textContent  = email + ' · ' + phone;

  /* ── Botón WhatsApp ── */
  var mensaje =
    '🏛️ *Nueva solicitud de cita — Mi Arqui*\n\n' +
    '👤 *Cliente:* '     + name        + '\n' +
    '📋 *Servicio:* '    + selectedPlan + '\n' +
    '📅 *Fecha y hora:* '+ datetime    + '\n' +
    '📞 *Teléfono:* '    + phone       + '\n' +
    '📧 *Email:* '       + email       + '\n' +
    '📝 *Proyecto:* '    + desc;

  var waURL = 'https://wa.me/' + TU_WHATSAPP + '?text=' + encodeURIComponent(mensaje);
  var waBtn = document.getElementById('whatsappConfirmBtn');
  if (waBtn) {
    waBtn.href          = waURL;
    waBtn.style.display = 'inline-flex';
  }

  /* ── Botón Stripe (solo para planes que pagan después) ── */
  var payBtn  = document.getElementById('stripePayBtn');
  var payLink = document.getElementById('stripePayLink');
  if (payBtn && payLink) {
    var stripeURL = PLANES_STRIPE_DESPUES[selectedPlan];
    if (stripeURL) {
      payBtn.style.display = 'block';
      payLink.href = stripeURL;
    } else {
      payBtn.style.display = 'none';
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   10. CALENDARIO
═══════════════════════════════════════════════════════════ */
var currentDate  = new Date();
var selectedDate = null;
var selectedTime = null;

var MONTHS_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

function changeMonth(delta) {
  // No retroceder antes del mes actual
  var next = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
  var now  = new Date();
  if (next < new Date(now.getFullYear(), now.getMonth(), 1)) return;
  currentDate = next;
  buildCalendar();
}

function buildCalendar() {
  var grid = document.getElementById('calGrid');
  if (!grid) return;

  var year      = currentDate.getFullYear();
  var month     = currentDate.getMonth();
  var firstDay  = new Date(year, month, 1).getDay();
  var daysInMon = new Date(year, month + 1, 0).getDate();
  var today     = new Date();
  today.setHours(0, 0, 0, 0);

  var monthEl = document.getElementById('calMonth');
  if (monthEl) monthEl.textContent = MONTHS_ES[month] + ' ' + year;

  var html = '';

  // Celdas vacías antes del primer día
  for (var e = 0; e < firstDay; e++) {
    html += '<div class="cal-day empty"></div>';
  }

  for (var d = 1; d <= daysInMon; d++) {
    var date    = new Date(year, month, d);
    var dow     = date.getDay();
    var isPast  = date < today;
    var isToday = date.getTime() === today.getTime();
    var isAvail = !isPast && AVAILABLE_DAYS.indexOf(dow) !== -1;
    var dateStr = d + ' de ' + MONTHS_ES[month] + ' ' + year;
    var isSel   = (selectedDate === dateStr);

    var cls = 'cal-day';
    if (isPast)  cls += ' past';
    if (isToday) cls += ' today';
    if (isAvail) cls += ' available';
    if (isSel)   cls += ' selected';

    if (isAvail) {
      html += '<div class="' + cls + '" onclick="selectDate(\'' + dateStr + '\')">' + d + '</div>';
    } else {
      html += '<div class="' + cls + '">' + d + '</div>';
    }
  }

  grid.innerHTML = html;
}

/* ── selectDate: el click en un día del calendario ── */
function selectDate(dateStr) {
  selectedDate = dateStr;
  selectedTime = null;         // resetear hora al cambiar fecha
  _setConfirmBtn(false);       // deshabilitar hasta que elija hora
  buildCalendar();
  buildTimeSlots();
  _hideSummary();
}

/* ═══════════════════════════════════════════════════════════
   11. HORARIOS
═══════════════════════════════════════════════════════════ */
function buildTimeSlots() {
  var grid = document.getElementById('timeslotsGrid');
  if (!grid) return;

  grid.innerHTML = TIME_SLOTS.map(function (slot) {
    var cls = 'ts-slot';
    if (slot.taken) {
      cls += ' taken';
      return '<div class="' + cls + '">' + slot.time + '</div>';
    }
    if (selectedTime === slot.time) cls += ' available selected';
    else cls += ' available';
    return '<div class="' + cls + '" onclick="selectTime(\'' + slot.time + '\')">' + slot.time + '</div>';
  }).join('');
}

function selectTime(time) {
  if (!selectedDate) {
    alert('Primero selecciona una fecha en el calendario.');
    return;
  }
  selectedTime = time;
  buildTimeSlots();
  _showSummary();
  _setConfirmBtn(true);  // habilitar botón confirmar
}

/* ── Helpers internos ── */
function _setConfirmBtn(enabled) {
  var btn = document.getElementById('confirmDateBtn');
  if (!btn) return;
  btn.style.opacity       = enabled ? '1' : '.4';
  btn.style.pointerEvents = enabled ? 'all' : 'none';
}

function _showSummary() {
  var summary = document.getElementById('bookingSummary');
  if (!summary) return;
  summary.classList.add('show');
  var bsService = document.getElementById('bs_service');
  var bsDate    = document.getElementById('bs_date');
  var bsTime    = document.getElementById('bs_time');
  if (bsService) bsService.textContent = selectedPlan || '—';
  if (bsDate)    bsDate.textContent    = selectedDate  || '—';
  if (bsTime)    bsTime.textContent    = selectedTime  || '—';
}

function _hideSummary() {
  var summary = document.getElementById('bookingSummary');
  if (summary) summary.classList.remove('show');
}

// Inicializar calendario al cargar (para que funcione si el modal ya existe)
buildCalendar();
buildTimeSlots();

/* ═══════════════════════════════════════════════════════════
   12. HAMBURGER MENU (mobile)
═══════════════════════════════════════════════════════════ */
var hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', function () {
    var navLinks = document.querySelector('.nav-links');
    var isOpen   = navLinks.style.display === 'flex';
    if (isOpen) {
      navLinks.style.display = 'none';
    } else {
      Object.assign(navLinks.style, {
        display:       'flex',
        flexDirection: 'column',
        position:      'fixed',
        top:           '58px',
        left:          '0',
        right:         '0',
        background:    'rgba(26,23,20,.98)',
        padding:       '20px 24px 28px',
        borderBottom:  '1px solid rgba(200,184,154,.15)',
        zIndex:        '99',
        gap:           '18px',
      });
      navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { navLinks.style.display = 'none'; }, { once: true });
      });
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   13. SCROLL SUAVE
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var id     = a.getAttribute('href');
    var target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});