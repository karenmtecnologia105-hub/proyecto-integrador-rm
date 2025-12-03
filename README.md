# RM Explorer - Proyecto Integrador (Módulo 1)

Aplicación que consume la Rick and Morty API para listar personajes en tarjetas con animaciones y modo oscuro/claro.

Demo:https://karenmtecnologia105-hub.github.io/proyecto-integrador-rm
Repositorio:https://github.com/karenmtecnologia105-hub/proyecto-integrador-rm

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
1. Clona el repositorio:git clone https://github.com/karenmtecnologia105-hub/proyecto-integrador-rm.git
2. Entra en la carpeta:
   ` cd proyecto-integrador-rm
3. Abre `index.html` en tu navegador o usa un servidor local (recomendado).

## Notas técnicas
- API: `https://rickandmortyapi.com/api/character`
- La preferencia de tema se guarda en `localStorage` con la clave `rm_explorer_theme`.
- Las tarjetas usan `requestAnimationFrame` para tilt 3D y respetan `prefers-reduced-motion`.

## Producción / Deploy (GitHub Pages)

1. Asegúrate de que el repositorio sea público.  
2. Ve a GitHub → Settings → Pages.  
3. En "Source" selecciona la rama `main` y carpeta `/ (root)`.  
4. Guarda y espera unos minutos; tu sitio estará en:  
   https://karenmtecnologia105-hub.github.io/proyecto-integrador-rm

Notas:
- Si acabas de hacer push, GitHub Pages puede tardar 1–5 minutos en construir y publicar el sitio.
- Si aún no aparece la página, ve a Settings → Pages → Build history o Actions → Pages build and deployment para revisar si hubo errores.
- Asegúrate de que `index.html` esté en la raíz del repo (no dentro de carpetas) para que la URL funcione correctamente.
## Créditos
Datos provistos por la Rick and Morty API (https://rickandmortyapi.com/).

Licencia: Uso educativo.
