# RM Explorer - Proyecto Integrador (Módulo 1)

Aplicación que consume la Rick and Morty API para listar personajes en tarjetas con animaciones y modo oscuro/claro.

Demo: https://TU-USUARIO.github.io/NOMBRE-REPO  <!-- reemplaza con tu URL de Pages -->
Repositorio: https://github.com/TU-USUARIO/NOMBRE-REPO  <!-- reemplaza con tu repo público -->

## Características principales
- Búsqueda por nombre
- Paginación básica (Prev / Next)
- Modo oscuro / claro con persistencia en localStorage
- Skeleton shimmer mientras cargan los datos
- Animaciones: entrada de tarjetas, "respiración" en imágenes, tilt 3D al mover el puntero, glow y elevación al hover
- Diseño responsive (mobile-first) con Grid/Flex
- Manejo de errores (try/catch) y mensajes de estado

## Estructura del proyecto
proyecto-integrador/
├── index.html
├── styles.css
├── index.js
└── README.md

## Cómo probar localmente
1. Clona el repositorio:
   `git clone https://github.com/TU-USUARIO/NOMBRE-REPO.git`
2. Entra en la carpeta:
   `cd NOMBRE-REPO`
3. Abre `index.html` en tu navegador o usa un servidor local (recomendado).

## Notas técnicas
- API: `https://rickandmortyapi.com/api/character`
- La preferencia de tema se guarda en `localStorage` con la clave `rm_explorer_theme`.
- Las tarjetas usan `requestAnimationFrame` para tilt 3D y respetan `prefers-reduced-motion`.

## Producción / Deploy (GitHub Pages)
1. Asegúrate de que el repositorio sea público.
2. Ve a GitHub → Settings → Pages.
3. En "Source" selecciona la rama `main` y carpeta `/root`.
4. Guarda y espera unos minutos; tu sitio estará en:
   `https://TU-USUARIO.github.io/NOMBRE-REPO`

## Créditos
Datos provistos por la Rick and Morty API (https://rickandmortyapi.com/).

Licencia: Uso educativo.