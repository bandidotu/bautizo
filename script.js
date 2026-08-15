// ══════════════════════════════
//  SOBRE
// ══════════════════════════════
(function initEnvelope() {
  const wrap = document.getElementById('envelopeWrap');
  const flap = document.getElementById('envFlap');
  const letter = document.getElementById('envLetter');
  const seal = document.getElementById('waxSeal');
  const hint = document.getElementById('envHint');
  const screen = document.getElementById('envelope-screen');
  const inv = document.getElementById('invitation');
  const audio = document.getElementById('audio');
  let opened = false;

  function abrir() {
    if (opened) return;
    opened = true;
    hint.classList.add('fade');
    setTimeout(() => seal.classList.add('dissolve'), 100);
    setTimeout(() => flap.classList.add('open'), 350);
    setTimeout(() => letter.classList.add('rise'), 700);
    setTimeout(() => {
      // Intenta reproducir música al abrir
      if (audio) {
        audio.play().then(() => {
          playing = true;
          const btn = document.querySelector('.ctrl-btn');
          if (btn) btn.textContent = '⏸';
        }).catch(() => {});
      }
      screen.classList.add('closing');
      inv.classList.remove('hidden');
      document.body.style.overflow = '';
      setTimeout(() => {
        screen.style.display = 'none';
        const first = document.querySelector('#invitation .reveal');
        if (first) first.classList.add('visible');
      }, 850);
    }, 1700);
  }

  wrap.addEventListener('click', abrir);
  wrap.addEventListener('touchstart', abrir, { passive: true });
  document.body.style.overflow = 'hidden';
})();

// ══════════════════════════════
//  REVEAL AL HACER SCROLL
// ══════════════════════════════
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.classList.contains('tl-item')) {
        const items = Array.from(document.querySelectorAll('.tl-item'));
        const delay = items.indexOf(el) * 140;
        setTimeout(() => el.classList.add('visible'), delay);
      } else {
        el.classList.add('visible');
      }
      observer.unobserve(el);
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  document.querySelectorAll('.tl-item').forEach(el => observer.observe(el));
}

// ══════════════════════════════
//  COUNTDOWN — Bautizo: 19 Dic 2025, 11:00 AM
// ══════════════════════════════
function initCountdown() {
  const target = new Date(2026, 11, 19, 11, 0, 0).getTime();
  const cdEl = document.getElementById('countdown');
  const msgEl = document.getElementById('granDia');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      cdEl.style.display = 'none';
      msgEl.classList.remove('hidden');
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    document.getElementById('cd-days').textContent = pad(days);
    document.getElementById('cd-hours').textContent = pad(hours);
    document.getElementById('cd-mins').textContent = pad(mins);
    document.getElementById('cd-secs').textContent = pad(secs);
  }
  tick();
  setInterval(tick, 1000);
}

// ══════════════════════════════
//  CALENDARIO MINI — Diciembre 2025, resalta el 19
// ══════════════════════════════
function initCalendar() {
  const special = 19;
  const year = 2026;
  const month = 11; // Diciembre (0-indexed)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let firstDay = new Date(year, month, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  let html = '';
  for (let r = 0; r < cells.length / 7; r++) {
    html += '<tr>';
    for (let c = 0; c < 7; c++) {
      const v = cells[r * 7 + c];
      if (!v) { html += '<td></td>'; continue; }
      const cls = v === special ? ' class="today"' : '';
      html += `<td${cls}>${v}</td>`;
    }
    html += '</tr>';
  }
  document.getElementById('cal-body').innerHTML = html;
}

// ══════════════════════════════
//  REPRODUCTOR DE MÚSICA
// ══════════════════════════════
let playing = false;
function togglePlay() {
  const btn = document.querySelector('.ctrl-btn');
  const audio = document.getElementById('audio');
  const fill = document.getElementById('fill');
  if (audio.src && audio.src !== window.location.href) {
    if (playing) {
      audio.pause();
      btn.textContent = '▶';
    } else {
      audio.play().catch(() => {});
      btn.textContent = '⏸';
    }
    playing = !playing;
  } else {
    playing = !playing;
    btn.textContent = playing ? '⏸' : '▶';
  }
}
document.getElementById('audio').addEventListener('timeupdate', function () {
  if (this.duration) {
    document.getElementById('fill').style.width = ((this.currentTime / this.duration) * 100) + '%';
  }
});

// ══════════════════════════════
//  PÉTALOS / NUBES AL HACER SCROLL
// ══════════════════════════════
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  document.querySelectorAll('.petal').forEach((p, i) => {
    p.style.transform = `translateY(${sy * (0.08 + i * 0.04)}px)`;
  });
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCountdown();
  initCalendar();
});

// ══════════════════════════════
//  CARRUSEL DE FOTOS
// ══════════════════════════════
(function () {
  const track = document.getElementById('carruselTrack');
  if (!track) return; // el carrusel está comentado en el HTML: no hacer nada

  let actual = 0;
  const total = 5;
  let autoplay;

  function actualizar() {
    const ancho = track.parentElement.offsetWidth;
    track.style.transform = `translateX(-${actual * ancho}px)`;
    document.querySelectorAll('.car-dot').forEach((d, i) => {
      d.classList.toggle('active', i === actual);
    });
  }

  window.moverCarrusel = function (dir) {
    actual = (actual + dir + total) % total;
    actualizar();
    reiniciarAutoplay();
  };
  window.irASlide = function (i) {
    actual = i;
    actualizar();
    reiniciarAutoplay();
  };

  function reiniciarAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => moverCarrusel(1), 4000);
  }

  let startX = 0;
  track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) moverCarrusel(diff > 0 ? 1 : -1);
  });

  window.addEventListener('resize', actualizar);
  reiniciarAutoplay();
  actualizar();
})();

// ══════════════════════════════
//  MODAL ÁLBUM
// ══════════════════════════════
function cerrarModal() {
  document.getElementById('albumModal').style.display = 'none';
}
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('albumModal');
  if (modal) modal.addEventListener('click', function (e) {
    if (e.target === this) cerrarModal();
  });
});

// ══════════════════════════════
//  CONFIRMACIÓN DE ASISTENCIA / INASISTENCIA
// ══════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('bautizo_asist') === 'true') mostrarExito();
  if (localStorage.getItem('bautizo_noasist') === 'true') mostrarExitoNo();
});

function mostrarForm() {
  document.getElementById('action-buttons').style.display = 'none';
  document.getElementById('confirm-form').style.display = 'block';
  document.getElementById('nombre_familia').focus();
}
function cancelarForm() {
  document.getElementById('action-buttons').style.display = 'block';
  document.getElementById('confirm-form').style.display = 'none';
}
function mostrarNoAsist() {
  document.getElementById('attend-section').style.display = 'none';
  document.getElementById('no-attend-section').style.display = 'block';
}
function regresarAsist() {
  document.getElementById('attend-section').style.display = 'block';
  document.getElementById('no-attend-section').style.display = 'none';
}

async function enviarAsist(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-confirmar');
  btn.textContent = 'Enviando...';
  try {
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(document.getElementById('confirm-form'))))
    });
    if (r.ok) {
      localStorage.setItem('bautizo_asist', 'true');
      mostrarExito();
    } else {
      btn.textContent = 'Confirmar Asistencia ✅';
    }
  } catch (err) {
    btn.textContent = 'Confirmar Asistencia ✅';
    alert('Error de conexión');
  }
}

async function enviarNoAsist(e) {
  e.preventDefault();
  try {
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(document.getElementById('no-confirm-form'))))
    });
    if (r.ok) {
      localStorage.setItem('bautizo_noasist', 'true');
      mostrarExitoNo();
    }
  } catch (err) {
    alert('Error de conexión');
  }
}

function mostrarExito() {
  document.getElementById('action-buttons').style.display = 'none';
  document.getElementById('confirm-form').style.display = 'none';
  document.getElementById('msg-exito').style.display = 'block';
}
function mostrarExitoNo() {
  document.getElementById('attend-section').style.display = 'none';
  document.getElementById('no-attend-section').style.display = 'block';
  document.getElementById('no-confirm-form').style.display = 'none';
  document.getElementById('msg-exito-no').style.display = 'block';
}