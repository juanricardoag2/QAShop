# QA Shop 🧪🛒

QA Shop es una tienda web **ficticia pero funcional**, construida para
practicar QA Manual, Testing y QA Automation. Es una aplicación 100%
estática — sin backend, sin base de datos, sin Docker ni Python para
ejecutarla — pensada para desplegarse gratis en **GitHub Pages** y usarse
como proyecto de portafolio de QA Automation Engineer.

## Índice

- [Objetivo](#objetivo)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Credenciales de prueba](#credenciales-de-prueba)
- [Funcionalidades](#funcionalidades)
- [Casos de prueba](#casos-de-prueba)
- [Reporte de bugs](#reporte-de-bugs)
- [Automatización](#automatización)
- [Cómo ejecutar localmente](#cómo-ejecutar-localmente)
- [Cómo subir a GitHub](#cómo-subir-a-github)
- [Cómo activar GitHub Pages](#cómo-activar-github-pages)

## Objetivo

Ofrecer un entorno controlado y reproducible donde practicar:

- Smoke Testing
- Functional Testing
- Regression Testing
- UI Testing
- Exploratory Testing
- Diseño de casos de prueba
- Reporte de bugs
- QA Automation con Selenium

## Tecnologías

- HTML5
- CSS3 (sin frameworks)
- JavaScript puro (Vanilla JS, sin frameworks)
- `localStorage` como única capa de persistencia
- **Sin backend, sin base de datos, sin Docker, sin Python** para correr la web

## Estructura del proyecto

```
qa-testing-github-pages/
│
├── index.html                 # Página única (SPA sin router de terceros)
│
├── css/
│   └── styles.css             # Estilos, responsive incluido
│
├── js/
│   ├── data.js                # Catálogo de productos y credenciales de prueba
│   └── app.js                 # Lógica de la app (navegación, carrito, login, etc.)
│
├── test-cases/
│   ├── TEST-PLAN.md           # Plan de pruebas
│   └── TEST-CASES.md          # TC-001 a TC-010 documentados
│
├── bugs/
│   └── BUG-TEMPLATE.md        # Plantilla de reporte de bugs
│
├── automation/
│   └── README.md              # Guía y selectores para automatizar con Selenium
│
├── .gitignore
└── README.md
```

## Credenciales de prueba

| Campo       | Valor                  |
|-------------|-------------------------|
| Email       | `qa.user@example.com`   |
| Contraseña  | `Qa12345!`               |

Estas credenciales están fijas en `js/data.js` y son las únicas válidas para
iniciar sesión — cualquier otra combinación debe fallar (ver TC-002).

## Funcionalidades

### Página principal
Menú con **Inicio**, **Productos**, **Pedidos** y **Carrito**, diseño
responsive con menú hamburguesa en móvil.

### Login
- Login correcto y mensaje de éxito.
- Login incorrecto y mensaje de error.
- Persistencia de sesión mediante `localStorage`.

### Productos
8 productos con ID, nombre, precio, descripción, icono y botón
"Agregar al carrito": Monitor 34" 2K, Smartphone Pro, Teclado mecánico,
Mouse gamer, Laptop Developer, Audífonos inalámbricos, Webcam 4K y SSD 1 TB.

### Búsqueda
Buscador con coincidencia parcial e insensible a mayúsculas, mensaje de "sin
resultados" y botón para limpiar la búsqueda.

### Carrito
Agregar, aumentar y disminuir cantidad, eliminación automática al llegar a
0, subtotal y total, cantidad total de artículos, todo persistido en
`localStorage`.

### Checkout
Formulario con nombre completo, dirección, ciudad y número de tarjeta
(validado como exactamente 16 dígitos). Bloquea el avance si no hay sesión
iniciada o si el carrito está vacío. **No procesa ningún pago real.**

### Pedidos
Historial con ID, fecha y total de cada pedido confirmado, persistido en
`localStorage`.

### Responsive
Probado en anchos de escritorio, tablet y móvil (ver TC-010).

## Casos de prueba

Documentados en [`test-cases/TEST-CASES.md`](test-cases/TEST-CASES.md),
con precondiciones, pasos, datos de prueba, resultado esperado, resultado
obtenido y estado (PASS/FAIL):

| ID      | Título                        |
|---------|--------------------------------|
| TC-001  | Login válido                   |
| TC-002  | Login inválido                 |
| TC-003  | Buscar producto                |
| TC-004  | Agregar producto                |
| TC-005  | Modificar cantidad               |
| TC-006  | Checkout sin login              |
| TC-007  | Tarjeta inválida                |
| TC-008  | Checkout válido                 |
| TC-009  | Persistencia del carrito         |
| TC-010  | Responsive                       |

El plan de pruebas completo está en
[`test-cases/TEST-PLAN.md`](test-cases/TEST-PLAN.md).

## Reporte de bugs

Usá la plantilla de [`bugs/BUG-TEMPLATE.md`](bugs/BUG-TEMPLATE.md) para
documentar cualquier defecto encontrado: incluye severidad, prioridad,
entorno, navegador, pasos de reproducción, resultado esperado/actual y
espacio para evidencia.

## Automatización

La app expone atributos `data-testid` estables en todos los elementos
interactivos, pensados para Selenium (o cualquier otra herramienta de
automatización). La guía completa, la tabla de selectores y un esqueleto de
tests en Python + Selenium + pytest están en
[`automation/README.md`](automation/README.md).

Flujos previstos para automatizar:

1. Abrir la web
2. Login
3. Buscar producto
4. Agregar producto
5. Abrir carrito
6. Modificar cantidad
7. Checkout
8. Validar pedido

## Cómo ejecutar localmente

No hace falta instalar nada. Alguna de estas opciones:

**Opción A — Abrir el archivo directamente**
1. Descomprimí o cloná el proyecto.
2. Hacé doble clic en `index.html` (se abre en tu navegador por defecto).

**Opción B — Servidor estático simple (recomendado para evitar restricciones del navegador)**

Con VS Code:
1. Instalá la extensión "Live Server".
2. Click derecho sobre `index.html` → "Open with Live Server".

Con Node.js:
```bash
npx serve .
```

Con Python (solo como servidor estático de conveniencia, no como
dependencia de la app):
```bash
python3 -m http.server 8080
```
Luego abrí `http://localhost:8080` en el navegador.

## Cómo subir a GitHub

```bash
git init
git add .
git commit -m "QA Shop: proyecto inicial"
git branch -M main
git remote add origin https://github.com/USUARIO/qa-testing-github-pages.git
git push -u origin main
```

Reemplazá `USUARIO` por tu usuario de GitHub y `qa-testing-github-pages` por
el nombre real del repositorio si lo cambiás.

## Cómo activar GitHub Pages

1. Entrá al repositorio en GitHub.
2. Andá a **Settings** → **Pages**.
3. En "Build and deployment", elegí **Deploy from a branch**.
4. Seleccioná la rama **main** y la carpeta **/ (root)**.
5. Guardá los cambios y esperá unos minutos.

La aplicación quedará publicada en:

```
https://USUARIO.github.io/qa-testing-github-pages/
```

---

Proyecto pensado para portafolio de **QA Automation Engineer**: sin pagos
reales, sin backend, 100% reproducible y listo para automatizar.
