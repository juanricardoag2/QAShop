# Casos de Prueba — QA Shop

> Completá "Resultado obtenido" y "Estado" cada vez que ejecutes la suite.
> Estado posible: **PASS** / **FAIL** / **BLOCKED**.

---

## TC-001 — Login válido

- **Precondiciones:** el usuario no tiene sesión iniciada; está en la vista Login.
- **Datos de prueba:** email `qa.user@example.com`, contraseña `Qa12345!`.
- **Pasos:**
  1. Abrir QA Shop.
  2. Ir a "Iniciar sesión".
  3. Completar email y contraseña con los datos de prueba.
  4. Presionar "Ingresar".
- **Resultado esperado:** se muestra un mensaje de éxito, el header pasa a
  mostrar "Hola, qa.user@example.com" y el botón "Cerrar sesión".
- **Resultado obtenido:** _pendiente_
- **Estado:** _pendiente_

---

## TC-002 — Login inválido

- **Precondiciones:** el usuario no tiene sesión iniciada; está en la vista Login.
- **Datos de prueba:** email `qa.user@example.com`, contraseña `incorrecta123`.
- **Pasos:**
  1. Ir a "Iniciar sesión".
  2. Completar email correcto y una contraseña incorrecta.
  3. Presionar "Ingresar".
- **Resultado esperado:** se muestra el mensaje de error "Email o contraseña
  incorrectos" y la sesión permanece cerrada.
- **Resultado obtenido:** _pendiente_
- **Estado:** _pendiente_

---

## TC-003 — Buscar producto

- **Precondiciones:** el usuario está en la vista Productos.
- **Datos de prueba:** términos `mouse`, `xyz123` (inexistente), `mon` (parcial).
- **Pasos:**
  1. Escribir `mouse` en el buscador.
  2. Verificar el resultado.
  3. Limpiar y escribir `xyz123`.
  4. Verificar el resultado.
  5. Limpiar y escribir `mon`.
  6. Presionar "Limpiar".
- **Resultado esperado:**
  - `mouse` muestra el producto "Mouse gamer".
  - `xyz123` muestra el mensaje de "sin resultados".
  - `mon` muestra "Monitor 34\" 2K" (coincidencia parcial).
  - "Limpiar" restablece el catálogo completo (8 productos).
- **Resultado obtenido:** _pendiente_
- **Estado:** _pendiente_

---

## TC-004 — Agregar producto al carrito

- **Precondiciones:** el usuario está en la vista Productos; el carrito está vacío.
- **Datos de prueba:** producto "Teclado mecánico".
- **Pasos:**
  1. Ubicar el producto "Teclado mecánico".
  2. Presionar "Agregar".
  3. Ir a la vista Carrito.
- **Resultado esperado:** el contador del carrito en el header pasa a 1, y el
  producto aparece en el carrito con cantidad 1 y el subtotal correcto.
- **Resultado obtenido:** _pendiente_
- **Estado:** _pendiente_

---

## TC-005 — Modificar cantidad en el carrito

- **Precondiciones:** hay al menos un producto en el carrito (ver TC-004).
- **Datos de prueba:** producto ya agregado, cantidad inicial 1.
- **Pasos:**
  1. Ir a la vista Carrito.
  2. Presionar "+" dos veces sobre el producto.
  3. Presionar "−" una vez.
  4. Presionar "−" hasta llegar a 0.
- **Resultado esperado:** la cantidad sube a 3, luego baja a 2, y al llegar a 0
  el producto se elimina del carrito automáticamente. Los totales se
  recalculan en cada paso.
- **Resultado obtenido:** _pendiente_
- **Estado:** _pendiente_

---

## TC-006 — Checkout sin login

- **Precondiciones:** el usuario NO tiene sesión iniciada; el carrito tiene
  al menos un producto.
- **Datos de prueba:** N/A.
- **Pasos:**
  1. Agregar un producto al carrito sin iniciar sesión.
  2. Ir a la vista Carrito.
  3. Presionar "Ir a checkout".
- **Resultado esperado:** la aplicación bloquea el acceso al checkout, muestra
  un aviso solicitando iniciar sesión y redirige a la vista Login.
- **Resultado obtenido:** _pendiente_
- **Estado:** _pendiente_

---

## TC-007 — Tarjeta inválida en checkout

- **Precondiciones:** el usuario tiene sesión iniciada y al menos un producto
  en el carrito; está en la vista Checkout.
- **Datos de prueba:** nombre `Juan Pérez`, dirección `Av. Siempre Viva 123`,
  ciudad `Lima`, tarjeta `4111 1111 111` (13 dígitos, inválida).
- **Pasos:**
  1. Completar el formulario de checkout con los datos de prueba.
  2. Presionar "Confirmar pedido".
- **Resultado esperado:** se muestra el mensaje de error "El número de
  tarjeta debe tener exactamente 16 dígitos" y el pedido no se crea.
- **Resultado obtenido:** _pendiente_
- **Estado:** _pendiente_

---

## TC-008 — Checkout válido

- **Precondiciones:** el usuario tiene sesión iniciada y al menos un producto
  en el carrito; está en la vista Checkout.
- **Datos de prueba:** nombre `Juan Pérez`, dirección `Av. Siempre Viva 123`,
  ciudad `Lima`, tarjeta `4111111111111111` (16 dígitos, válida).
- **Pasos:**
  1. Completar el formulario de checkout con los datos de prueba.
  2. Presionar "Confirmar pedido".
- **Resultado esperado:** se muestra la vista de confirmación con un ID de
  pedido y el total; el carrito queda vacío; el pedido aparece en
  "Pedidos".
- **Resultado obtenido:** _pendiente_
- **Estado:** _pendiente_

---

## TC-009 — Persistencia del carrito

- **Precondiciones:** el usuario agregó al menos un producto al carrito.
- **Datos de prueba:** N/A.
- **Pasos:**
  1. Agregar 2 productos distintos al carrito.
  2. Recargar la página (F5).
  3. Ir a la vista Carrito.
- **Resultado esperado:** el carrito conserva los mismos productos y
  cantidades después de recargar, ya que se guardan en `localStorage`.
- **Resultado obtenido:** _pendiente_
- **Estado:** _pendiente_

---

## TC-010 — Diseño responsive

- **Precondiciones:** ninguna.
- **Datos de prueba:** anchos de viewport 1440px (desktop), 768px (tablet),
  375px (móvil).
- **Pasos:**
  1. Abrir QA Shop en modo desktop.
  2. Cambiar a resolución de tablet (DevTools > Toggle device toolbar).
  3. Cambiar a resolución de móvil.
- **Resultado esperado:** en cada resolución el contenido se reordena sin
  overlaps ni scroll horizontal, y el menú de navegación se colapsa en un
  botón hamburguesa en anchos móviles.
- **Resultado obtenido:** _pendiente_
- **Estado:** _pendiente_
