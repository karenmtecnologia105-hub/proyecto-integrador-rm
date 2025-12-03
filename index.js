// Configuración y selectores
const API_BASE = 'https://rickandmortyapi.com/api/character';
const themeKey = 'rm_explorer_theme';

const selectors = {
  themeToggle: document.getElementById('themeToggle'),
  searchForm: document.getElementById('searchForm'),
  searchInput: document.getElementById('searchInput'),
  results: document.getElementById('results'),
  statusBar: document.getElementById('statusBar'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  pageInfo: document.getElementById('pageInfo'),
};

let currentPage = 1;
let lastPage = null;
let lastQuery = '';

// Inicialización
document.addEventListener('DOMContentLoaded', init);

function init() {
  applySavedTheme();
  attachEventListeners();
  fetchCharacters(); // carga inicial
}

/* -------------------- Tema (dark/light) -------------------- */
function applySavedTheme() {
  const saved = localStorage.getItem(themeKey);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const useDark = saved ? saved === 'dark' : prefersDark;

  setTheme(useDark ? 'dark' : 'light');
  selectors.themeToggle.checked = useDark;
}

function setTheme(mode) {
  if (mode === 'dark') {
    document.body.classList.add('dark');
    localStorage.setItem(themeKey, 'dark');
  } else {
    document.body.classList.remove('dark');
    localStorage.setItem(themeKey, 'light');
  }
}

/* -------------------- Eventos -------------------- */
function attachEventListeners() {
  selectors.themeToggle.addEventListener('change', (e) => {
    setTheme(e.target.checked ? 'dark' : 'light');
  });

  selectors.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = selectors.searchInput.value.trim();
    lastQuery = q;
    currentPage = 1;
    fetchCharacters(q, currentPage);
  });

  selectors.prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchCharacters(lastQuery, currentPage);
    }
  });

  selectors.nextBtn.addEventListener('click', () => {
    if (lastPage && currentPage < lastPage) {
      currentPage++;
      fetchCharacters(lastQuery, currentPage);
    }
  });
}

/* -------------------- Fetch / API -------------------- */
/**
 * fetchCharacters - obtiene personajes de la API con manejo de errores.
 * @param {string} query - texto de búsqueda por nombre (opcional)
 * @param {number} page - número de página (opcional)
 */
async function fetchCharacters(query = '', page = 1) {
  const url = new URL(API_BASE);
  url.searchParams.set('page', page);
  if (query) url.searchParams.set('name', query);

  // UI: mostrar skeletons y estado
  showStatus('Cargando...', true);
  togglePaginationButtons(false);
  showSkeletons(6); // muestra 6 placeholders mientras carga

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      // La API devuelve 404 si no hay resultados
      if (res.status === 404) {
        clearResults();
        showStatus('No se encontraron personajes.', false);
        lastPage = null;
        updatePageInfo();
        return;
      }
      throw new Error(`Error HTTP ${res.status}`);
    }

    const data = await res.json();

    // Guardamos información de paginación
    lastPage = data.info?.pages ?? null;
    currentPage = page;

    renderCharacters(data.results || []);
    showStatus(`Mostrando ${data.results.length} resultados.`, false);
    updatePagination();
  } catch (error) {
    console.error('Fetch error:', error);
    clearResults();
    showStatus('Ocurrió un error al obtener datos. Revisa la consola.', false);
  }
}

/* -------------------- Renderizado DOM -------------------- */
function clearResults() {
  selectors.results.innerHTML = '';
}

function showSkeletons(count = 6) {
  clearResults();
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const sk = document.createElement('div');
    sk.className = 'skeleton';
    sk.innerHTML = `
      <div class="skeleton-img" aria-hidden="true"></div>
      <div class="skeleton-body">
        <div class="line" style="width:70%"></div>
        <div class="line small" style="width:40%"></div>
      </div>
    `;
    fragment.appendChild(sk);
  }
  selectors.results.appendChild(fragment);
}

function renderCharacters(items) {
  clearResults();
  if (!items || items.length === 0) {
    selectors.results.innerHTML = '';
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((ch, idx) => {
    const card = createCard(ch);
    // stagger: aplicar delay en animación para cada tarjeta
    card.classList.add('animate-in');
    card.style.animationDelay = `${idx * 70}ms`;
    fragment.appendChild(card);
  });
  selectors.results.appendChild(fragment);
  // after render, enable interactions
  enableCardInteractions();
  updatePagination();
}

function createCard(character) {
  const card = document.createElement('article');
  card.className = 'card';
  card.tabIndex = 0;
  card.setAttribute('role', 'listitem');
  card.setAttribute('aria-label', `${character.name} - ${character.species}`);

  const img = document.createElement('img');
  img.src = character.image;
  img.alt = `${character.name} avatar`;
  img.loading = 'lazy';

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = character.name;

  const meta = document.createElement('p');
  meta.className = 'card-meta';
  meta.innerHTML = `
    <strong>Especie:</strong> ${character.species} •
    <strong>Estado:</strong> ${character.status} <br/>
    <strong>Origen:</strong> ${character.origin?.name || 'Desconocido'}
  `;

  body.appendChild(title);
  body.appendChild(meta);

  card.appendChild(img);
  card.appendChild(body);

  return card;
}

/* -------------------- Interacciones (tilt 3D, etc.) -------------------- */
/**
 * enableCardInteractions - agrega tilt 3D por pointermove y limpia al salir
 * Respeta prefers-reduced-motion
 */
function enableCardInteractions() {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    // evitar múltiples listeners si ya existe
    if (card._tiltEnabled) return;
    card._tiltEnabled = true;

    let raf = null;

    function onPointerMove(e) {
      // soportar eventos touch (usar touches si existe)
      const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY);
      if (clientX == null || clientY == null) return;

      const rect = card.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;

      // ajustar intensidad
      const maxRotateY = 12; // grados
      const maxRotateX = 8;  // grados
      const rotateY = (px - 0.5) * (maxRotateY * 2);
      const rotateX = (0.5 - py) * (maxRotateX * 2);

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    }

    function onPointerLeave() {
      if (raf) cancelAnimationFrame(raf);
      // suavemente volver a estado original
      card.style.transition = 'transform 420ms cubic-bezier(.2,.8,.2,1)';
      card.style.transform = '';
      setTimeout(() => card.style.transition = '', 450);
    }

    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerleave', onPointerLeave);

    // touch interactions: pequeño pop
    card.addEventListener('pointerdown', () => {
      card.style.transition = 'transform 120ms ease';
      // añadir pequeña escala pero manteniendo posibles rotaciones actuales
      card.style.transform = (card.style.transform || '') + ' scale(0.99)';
    });
    card.addEventListener('pointerup', () => {
      card.style.transform = '';
      setTimeout(() => card.style.transition = '', 160);
    });
  });
}

/* -------------------- UI Helpers -------------------- */
function showStatus(message, loading = false) {
  // limpiar texto y spinner antiguo si lo hay
  selectors.statusBar.textContent = message;
  if (loading) {
    selectors.statusBar.setAttribute('aria-busy', 'true');
    const prev = selectors.statusBar.querySelector('.spinner');
    if (!prev) {
      const s = document.createElement('span');
      s.className = 'spinner';
      selectors.statusBar.prepend(s);
    }
  } else {
    selectors.statusBar.removeAttribute('aria-busy');
    const prev = selectors.statusBar.querySelector('.spinner');
    if (prev) prev.remove();
  }
}

function updatePagination() {
  selectors.pageInfo.textContent = `Página ${currentPage}${lastPage ? ' de ' + lastPage : ''}`;
  togglePaginationButtons(true);
}

function togglePaginationButtons(enable) {
  if (!enable) {
    selectors.prevBtn.disabled = true;
    selectors.nextBtn.disabled = true;
    selectors.pageInfo.textContent = '';
    return;
  }
  selectors.prevBtn.disabled = currentPage <= 1;
  selectors.nextBtn.disabled = !lastPage || currentPage >= lastPage;
}

/* -------------------- Fin -------------------- */