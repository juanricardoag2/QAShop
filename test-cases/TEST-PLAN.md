# Plan de Pruebas — QA Shop

## 1. Introducción

QA Shop es una tienda web ficticia, 100% estática (HTML, CSS y JavaScript puro,
sin backend), pensada como entorno de práctica para QA Manual, Testing y QA
Automation. Este documento define el alcance, la estrategia y los criterios de
prueba de la aplicación.

## 2. Objetivo

Validar que las funcionalidades principales de QA Shop (login, catálogo,
búsqueda, carrito, checkout y pedidos) funcionan correctamente y detectar
defectos antes de considerarlas "aptas" para practicar automatización.

## 3. Alcance

### Dentro de alcance
- Login y persistencia de sesión.
- Listado y búsqueda de productos.
- Gestión del carrito (agregar, modificar, eliminar).
- Checkout y validación de datos, incluida la tarjeta.
- Historial de pedidos.
- Diseño responsive (desktop, tablet, móvil).

### Fuera de alcance
- Procesamiento real de pagos (no existe, es simulado).
- Pruebas de carga o performance a gran escala.
- Seguridad avanzada (pentesting), dado que no hay backend ni datos reales.

## 4. Estrategia de pruebas

| Tipo de prueba       | Descripción                                                        |
|-----------------------|---------------------------------------------------------------------|
| Smoke Testing         | Verificar que la app carga y las funciones críticas responden.     |
| Functional Testing    | Validar cada funcionalidad contra su comportamiento esperado.       |
| Regression Testing    | Re-ejecutar casos clave tras cada cambio de código.                  |
| UI Testing            | Revisar consistencia visual, textos y estados de los componentes.   |
| Exploratory Testing   | Sesiones libres para encontrar defectos no cubiertos por casos.     |
| Test Case Design      | Documentar casos formales en `TEST-CASES.md`.                       |
| Bug Reporting         | Registrar defectos con la plantilla de `bugs/BUG-TEMPLATE.md`.      |
| QA Automation         | Automatizar los flujos críticos con Selenium (ver `/automation`).   |

## 5. Ambiente de pruebas

- **Aplicación:** archivo estático servido vía GitHub Pages o localmente
  (doble clic en `index.html`, o un servidor estático simple).
- **Navegadores sugeridos:** Chrome, Firefox, Edge (últimas versiones).
- **Dispositivos:** desktop (≥1200px), tablet (~768px), móvil (~375px).
- **Datos de prueba:** ver credenciales y catálogo en `README.md`.

## 6. Criterios de entrada

- La aplicación se despliega sin errores en consola.
- El catálogo de productos se muestra correctamente en la vista Productos.

## 7. Criterios de salida

- El 100% de los casos críticos (login, carrito, checkout) están ejecutados.
- No existen bugs de severidad **Crítica** o **Alta** abiertos sin justificación.

## 8. Roles

- **QA Engineer:** diseña y ejecuta los casos de prueba, reporta bugs.
- **QA Automation Engineer:** automatiza los flujos definidos en `/automation`.

## 9. Riesgos

| Riesgo                                             | Mitigación                                           |
|-----------------------------------------------------|-------------------------------------------------------|
| Datos guardados en `localStorage` del navegador     | Documentar cómo limpiar el estado antes de cada suite |
| Diferencias de comportamiento entre navegadores     | Ejecutar smoke tests en al menos 2 navegadores        |

## 10. Entregables

- `TEST-CASES.md`: casos de prueba documentados.
- `bugs/BUG-TEMPLATE.md`: plantilla de reporte de bugs.
- `automation/README.md`: guía para automatizar con Selenium.
