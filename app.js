
/* ═══════════════════════════════════════════════════════════════
   ARQ. [mi arquis] — app.js
   Toda la lógica e interactividad de la página
   ═══════════════════════════════════════════════════════════════

   ÍNDICE:
   1.  CONFIGURACIÓN  ← EDITAR AQUÍ TUS DATOS
   2.  Navbar scroll
   3.  Stats del hero
   4.  Galería — filtro por categoría
   5.  Star picker (selector de estrellas en reseñas)
   6.  Testimonios — renderizado dinámico
   7.  Submit de reseña
   8.  Modal — abrir / cerrar
   9.  Modal — navegación entre pasos
   10. Calendario de citas
   11. Slots de horario
   12. Hamburger menu (mobile)
   13. Scroll suave para anclas
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURACIÓN
   ★ EDITAR AQUÍ todos los datos que necesitas personalizar
───────────────────────────────────────────────────────────── */

/**
 * Tus estadísticas para el hero.
 * Reemplaza los valores con los reales.
 */
const STATS = {
  proyectos: '+50',  // Número total de proyectos completados
  anos:       '12',  // Años de experiencia profesional
  clientes:  '+45',  // Clientes satisfechos
};

/**
 * Días de la semana disponibles para agendar citas.
 *   0 = Domingo
 *   1 = Lunes
 *   2 = Martes
 *   3 = Miércoles
 *   4 = Jueves
 *   5 = Viernes
 *   6 = Sábado
 *
 * Ejemplo actual: lunes a viernes.
 * Para agregar sábados: [1, 2, 3, 4, 5, 6]
 */
const AVAILABLE_DAYS = [1, 2, 3, 4, 5];

/**
 * Horarios disponibles por día.
 * Cambia taken: true para bloquear un slot ya ocupado.
 * Puedes agregar o quitar slots libremente.
 */
const TIME_SLOTS = [
  { time: '09:00', taken: false },
  { time: '10:00', taken: false },
  { time: '11:00', taken: false },
  { time: '12:00', taken: true  }, // ← taken: true = no disponible
  { time: '15:00', taken: false },
  { time: '16:00', taken: false },
  { time: '17:00', taken: false },
  { time: '18:00', taken: false },
];

/**
 * Testimonios de tus clientes.
 * Agrega tantos objetos como quieras.
 * Cada objeto tiene:
 *   name     — nombre del cliente
 *   initials — 2 letras para el avatar (si no tienes foto)
 *   project  — tipo de proyecto
 *   rating   — calificación del 1 al 5
 *   text     — comentario (pon comillas "…" dentro del string)
 *   avatar   — (opcional) ruta a foto, ej: 'img/cliente-1.jpg'
 *              Si se omite, se usan las iniciales.
 */
const TESTIMONIALS = [
  {
    name:     '[Nombre del Cliente 1]',
    initials: 'C1',
    project:  'Casa habitación — Residencial',
    rating:   5,
    text:     '"[Reemplaza con el testimonio real. Mientras más específico mejor: menciona el problema que tenías, cómo te ayudé y el resultado que obtuviste.]"',
    avatar:   '', // 'img/cliente-1.jpg'
  },
  {
    name:     '[Nombre del Cliente 2]',
    initials: 'C2',
    project:  'Supervisión de obra — Autoconstrucción',
    rating:   5,
    text:     '"[Segundo testimonio de un proyecto diferente para mostrar versatilidad. Los mejores testimonios son específicos y auténticos.]"',
    avatar:   '',
  },
  {
    name:     '[Nombre del Cliente 3]',
    initials: 'C3',
    project:  'Comercial',
    rating:   5,
    text:     '"[Tercer testimonio. Puedes copiar mensajes reales de WhatsApp o correo que te hayan enviado tus clientes.]"',
    avatar:   '',
  },
];

/* ─────────────────────────────────────────────────────────────
   NO EDITAR DESDE AQUÍ — Lógica de la aplicación
───────────────────────────────────────────────────────────── */

// ── 2. NAVBAR — cambiar estilo al hacer scroll ─────────────────
window.addEventListener('scroll', function () {
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── 3. STATS DEL HERO ──────────────────────────────────────────
document.getElementById('stat-proyectos').textContent = STATS.proyectos;
document.getElementById('stat-anos').textContent      = STATS.anos;
document.getElementById('stat-clientes').textContent  = STATS.clientes;

// ── 4. GALERÍA — FILTRO POR CATEGORÍA ──────────────────────────
document.querySelectorAll('.gf-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    // Activar solo el botón clicado
    document.querySelectorAll('.gf-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    var filter = btn.dataset.filter;

    document.querySelectorAll('.gallery-item').forEach(function (item) {
      var show = filter === 'all' || item.dataset.category === filter;
      item.style.display    = show ? 'block' : 'none';
      item.style.animation  = show ? 'fadeUp .4s ease' : '';
    });
  });
});

// ── 5. STAR PICKER (selector de estrellas para reseñas) ────────
var selectedRating = 0;

document.querySelectorAll('#starPicker svg').forEach(function (star) {

  // Click: fijar la calificación
  star.addEventListener('click', function () {
    selectedRating = parseInt(star.dataset.val);
    updateStarPicker(selectedRating, true);
  });

  // Hover: vista previa
  star.addEventListener('mouseenter', function () {
    var val = parseInt(star.dataset.val);
    document.querySelectorAll('#starPicker svg').forEach(function (s, i) {
      s.style.fill   = i < val ? 'var(--stone)' : 'none';
      s.style.stroke = i < val ? 'var(--stone)' : 'var(--stone-d)';
    });
  });

  // Mouse leave: restaurar al valor fijado
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

// ── 6. TESTIMONIOS — RENDERIZADO ───────────────────────────────
function renderTestimonials() {
  var grid = document.getElementById('testimonialsGrid');
  if (!grid) return;

  if (TESTIMONIALS.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);font-size:.9rem;padding:20px 0;">Aún no hay reseñas publicadas.</p>';
    return;
  }

  grid.innerHTML = TESTIMONIALS.map(function (t) {
    // Generar estrellas
    var stars = Array.from({ length: 5 }, function (_, i) {
      return '<svg viewBox="0 0 24 24" class="' + (i < t.rating ? '' : 'empty') + '">'
        + '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 '
        + '12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    }).join('');

    // Avatar: foto o iniciales
    var avatarStyle = t.avatar
      ? 'background:url("' + t.avatar + '") center/cover no-repeat;'
      : '';
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

  // Actualizar contador y promedio
  var avg = TESTIMONIALS.reduce(function (sum, t) {
    return sum + t.rating;
  }, 0) / TESTIMONIALS.length;

  var avgEl   = document.getElementById('avgRating');
  var totalEl = document.getElementById('totalReviews');
  if (avgEl)   avgEl.textContent   = avg.toFixed(1);
  if (totalEl) totalEl.textContent = 'Basado en ' + TESTIMONIALS.length
    + ' reseña' + (TESTIMONIALS.length !== 1 ? 's' : '');
}

// Renderizar al cargar
renderTestimonials();

// ── 7. SUBMIT DE RESEÑA ────────────────────────────────────────
function submitReview() {
  var name    = document.getElementById('rev_name').value.trim();
  var text    = document.getElementById('rev_text').value.trim();
  var project = document.getElementById('rev_project').value
                || 'Servicio arquitectónico';

  if (!name || !text || selectedRating === 0) {
    alert('Por favor ingresa tu nombre, calificación (estrellas) y comentario.');
    return;
  }

  // Agregar al principio del array para que aparezca primero
  TESTIMONIALS.unshift({
    name:     name,
    initials: name.split(' ').map(function (w) {
      return w[0];
    }).join('').substring(0, 2).toUpperCase(),
    project:  project,
    rating:   selectedRating,
    text:     '"' + text + '"',
    avatar:   '',
  });

  // Re-renderizar
  renderTestimonials();

  // Limpiar formulario
  document.getElementById('rev_name').value     = '';
  document.getElementById('rev_text').value     = '';
  document.getElementById('rev_project').value  = '';
  selectedRating = 0;
  document.querySelectorAll('#starPicker svg').forEach(function (s) {
    s.classList.remove('active');
    s.style.fill   = 'none';
    s.style.stroke = 'var(--stone-d)';
  });

  // Mensaje de éxito
  var msg = document.getElementById('reviewSuccess');
  if (msg) {
    msg.style.display = 'block';
    setTimeout(function () { msg.style.display = 'none'; }, 4000);
  }

  // Scroll suave hacia la sección de testimonios
  document.getElementById('testimonialsGrid')
    .scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── 8. MODAL — ABRIR / CERRAR ──────────────────────────────────
var selectedPlan = '';

/**
 * openModal(planName)
 * Se llama desde onclick en los botones de planes y servicios.
 * @param {string} planName — nombre del servicio/plan seleccionado
 */
function openModal(planName) {
  selectedPlan = planName;
  document.getElementById('modalPlanTag').textContent = 'Servicio seleccionado';
  document.getElementById('modalTitle').textContent   = planName;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Resetear al paso 1 sin validar
  goToStep(1, false);
  selectedDate = null;
  selectedTime = null;
  buildCalendar();
  buildTimeSlots();
  document.getElementById('bookingSummary').classList.remove('show');
  var confirmBtn = document.getElementById('confirmDateBtn');
  if (confirmBtn) {
    confirmBtn.style.opacity       = '.4';
    confirmBtn.style.pointerEvents = 'none';
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Cerrar al hacer clic fuera del modal
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

// Cerrar con la tecla Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});

// ── 9. MODAL — NAVEGACIÓN ENTRE PASOS ─────────────────────────
/**
 * goToStep(num, validate)
 * @param {number}  num      — paso destino (1, 2 o 3)
 * @param {boolean} validate — si true, valida el paso actual antes de avanzar
 */
function goToStep(num, validate) {
  if (validate === undefined) validate = true;

  // Validación paso 1 → 2
  if (validate && num === 2) {
    var name  = document.getElementById('cl_name').value.trim();
    var phone = document.getElementById('cl_phone').value.trim();
    var email = document.getElementById('cl_email').value.trim();
    var desc  = document.getElementById('cl_desc').value.trim();

    if (!name || !phone || !email || !desc) {
      alert('Por favor completa: nombre completo, teléfono, email y descripción del proyecto.');
      return;
    }
  }

  // Validación paso 2 → 3
  if (validate && num === 3) {
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona una fecha y un horario disponible.');
      return;
    }
    // Llenar los datos de confirmación
    document.getElementById('conf_name').textContent =
      document.getElementById('cl_name').value;
    document.getElementById('conf_service').textContent  = selectedPlan;
    document.getElementById('conf_datetime').textContent =
      selectedDate + ' · ' + selectedTime;
    document.getElementById('conf_contact').textContent  =
      document.getElementById('cl_email').value
      + ' · ' + document.getElementById('cl_phone').value;

      var stripeLinks = {
  'Consultoría Técnica':            'https://buy.stripe.com/TU-LINK-CONSULTORIA',
  'Supervisión de Obra':            'https://buy.stripe.com/TU-LINK-SUPERVISION',
  'Diseño Residencial':             'https://buy.stripe.com/TU-LINK-RESIDENCIAL',
  'Proyecto Industrial':            'https://buy.stripe.com/TU-LINK-INDUSTRIAL',
  'Diseño Escolar':                 'https://buy.stripe.com/TU-LINK-ESCOLAR',
  'Proyecto Residencial Completo':  'https://buy.stripe.com/TU-LINK-RESIDENCIAL',
  'Proyecto Especializado':         'https://buy.stripe.com/TU-LINK-ESPECIALIZADO',
  'Consulta Inicial':               'https://buy.stripe.com/TU-LINK-CONSULTORIA',
  'Consulta Inicial Gratuita':      'https://buy.stripe.com/TU-LINK-CONSULTORIA',
};

// Mostrar botón de Stripe con el link correcto
var payBtn  = document.getElementById('stripePayBtn');
var payLink = document.getElementById('stripePayLink');
if (payBtn && payLink && stripeLinks[selectedPlan]) {
  payBtn.style.display = 'block';
  payLink.href = stripeLinks[selectedPlan];
}
  }

  // Mostrar / ocultar paneles y actualizar tabs
  [1, 2, 3].forEach(function (i) {
    var panel = document.getElementById('step-' + i);
    var tab   = document.getElementById('step-tab-' + i);
    if (panel) panel.classList.toggle('active', i === num);
    if (tab) {
      tab.classList.remove('active', 'done');
      if (i === num)  tab.classList.add('active');
      if (i < num)    tab.classList.add('done');
    }
  });
}

// ── 10. CALENDARIO ─────────────────────────────────────────────
var currentDate  = new Date();
var selectedDate = null;
var selectedTime = null;

var MONTHS_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

function changeMonth(delta) {
  currentDate.setMonth(currentDate.getMonth() + delta);
  buildCalendar();
}

function buildCalendar() {
  var year       = currentDate.getFullYear();
  var month      = currentDate.getMonth();
  var firstDay   = new Date(year, month, 1).getDay();
  var daysInMon  = new Date(year, month + 1, 0).getDate();
  var today      = new Date();
  today.setHours(0, 0, 0, 0);

  var monthEl = document.getElementById('calMonth');
  if (monthEl) monthEl.textContent = MONTHS_ES[month] + ' ' + year;

  var grid = document.getElementById('calGrid');
  if (!grid) return;
  grid.innerHTML = '';

  // Días vacíos al inicio del mes
  for (var e = 0; e < firstDay; e++) {
    grid.innerHTML += '<div class="cal-day empty"></div>';
  }

  for (var d = 1; d <= daysInMon; d++) {
    var date    = new Date(year, month, d);
    var dow     = date.getDay();
    var isPast  = date < today;
    var isToday = date.getTime() === today.getTime();
    var isAvail = !isPast && AVAILABLE_DAYS.indexOf(dow) !== -1;
    var dateStr = d + ' ' + MONTHS_ES[month] + ' ' + year;
    var isSel   = selectedDate === dateStr;

    var cls = 'cal-day';
    if (isPast)    cls += ' past';
    if (isToday)   cls += ' today';
    if (isAvail)   cls += ' available';
    if (isSel)     cls += ' selected';

    var onclick = isAvail
      ? 'selectDate("' + dateStr + '")'
      : '';

    grid.innerHTML += '<div class="' + cls + '" onclick="' + onclick + '">' + d + '</div>';
  }
}

function selectDate(dateStr) {
  selectedDate = dateStr;
  selectedTime = null; // resetear hora al cambiar fecha
  buildCalendar();
  buildTimeSlots();
  updateBookingSummary();

  // Activar botón de confirmar (aún necesita también hora)
  if (selectedTime) enableConfirmBtn();
}

// ── 11. SLOTS DE HORARIO ───────────────────────────────────────
function buildTimeSlots() {
  var grid = document.getElementById('timeslotsGrid');
  if (!grid) return;

  grid.innerHTML = TIME_SLOTS.map(function (slot) {
    var cls = 'ts-slot';
    if (slot.taken)                      cls += ' taken';
    else if (selectedTime === slot.time) cls += ' available selected';
    else                                 cls += ' available';

    var onclick = slot.taken ? '' : 'selectTime("' + slot.time + '")';
    return '<div class="' + cls + '" onclick="' + onclick + '">' + slot.time + '</div>';
  }).join('');
}

function selectTime(time) {
  selectedTime = time;
  buildTimeSlots();
  updateBookingSummary();
  enableConfirmBtn();
}

function enableConfirmBtn() {
  var btn = document.getElementById('confirmDateBtn');
  if (btn && selectedDate && selectedTime) {
    btn.style.opacity       = '1';
    btn.style.pointerEvents = 'all';
  }
}

function updateBookingSummary() {
  var summary = document.getElementById('bookingSummary');
  if (!summary) return;

  if (selectedDate && selectedTime) {
    summary.classList.add('show');
    var bsService = document.getElementById('bs_service');
    var bsDate    = document.getElementById('bs_date');
    var bsTime    = document.getElementById('bs_time');
    if (bsService) bsService.textContent = selectedPlan || '—';
    if (bsDate)    bsDate.textContent    = selectedDate;
    if (bsTime)    bsTime.textContent    = selectedTime;
  }
}

// Construir calendario al cargar
buildCalendar();
buildTimeSlots();

// ── 12. HAMBURGER MENU (mobile) ────────────────────────────────
var hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', function () {
    var navLinks = document.querySelector('.nav-links');
    var isOpen   = navLinks.style.display === 'flex';

    if (isOpen) {
      // Cerrar
      navLinks.style.display = 'none';
    } else {
      // Abrir como menú vertical sobre la página
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

      // Cerrar el menú al hacer clic en cualquier enlace
      navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          navLinks.style.display = 'none';
        }, { once: true });
      });
    }
  });
}

// ── 13. SCROLL SUAVE PARA ANCLAS ───────────────────────────────
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