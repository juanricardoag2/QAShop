# Automatización — QA Shop

Esta carpeta es el punto de partida para automatizar QA Shop con **Selenium**.
Todavía no incluye scripts ejecutables: primero define la estructura,
los selectores estables y los flujos a automatizar, para que puedas ir
agregando tests de forma incremental.

> QA Shop no depende de Python ni de ningún backend para funcionar — eso
> se mantiene 100% estático para GitHub Pages. Python/Selenium se usan
> únicamente como **herramienta externa de testing**, igual que lo harías
> contra cualquier sitio web público.

## 1. Selectores estables

Todos los elementos interactivos tienen un atributo `data-testid` pensado
para que los localizadores de Selenium no dependan de clases de estilo
(que pueden cambiar) ni de texto visible (que puede traducirse). Usá
`By.CSS_SELECTOR, '[data-testid="..."]'` (Python) o el equivalente en tu
lenguaje.

| Elemento                          | `data-testid`                        |
|------------------------------------|----------------------------------------|
| Link de navegación "Productos"     | `nav-productos`                        |
| Link de navegación "Carrito"       | `nav-carrito`                          |
| Link de navegación "Pedidos"       | `nav-pedidos`                          |
| Botón "Iniciar sesión" (header)    | `btn-login-open`                       |
| Botón "Cerrar sesión"              | `btn-logout`                           |
| Input email (login)                | `login-email`                          |
| Input contraseña (login)           | `login-password`                       |
| Botón "Ingresar"                   | `login-submit`                         |
| Mensaje de login                   | `login-message`                        |
| Input de búsqueda                  | `search-input`                         |
| Botón "Limpiar" búsqueda           | `search-clear`                         |
| Tarjeta de producto (por ID)       | `product-card-{id}`                    |
| Botón "Agregar" (por ID)           | `add-to-cart-{id}`                     |
| Badge del carrito (header)         | `cart-badge`                           |
| Fila de producto en el carrito     | `cart-item-{id}`                       |
| Botón aumentar cantidad            | `qty-increase-{id}`                    |
| Botón disminuir cantidad           | `qty-decrease-{id}`                    |
| Botón "Ir a checkout"              | `btn-go-checkout`                      |
| Input nombre (checkout)            | `checkout-name`                        |
| Input dirección (checkout)         | `checkout-address`                     |
| Input ciudad (checkout)            | `checkout-city`                        |
| Input tarjeta (checkout)           | `checkout-card`                        |
| Botón "Confirmar pedido"           | `checkout-submit`                      |
| Mensaje de checkout                | `checkout-message`                     |
| ID de pedido (confirmación)        | `confirm-order-id`                     |
| Tabla de pedidos                   | `orders-table`                         |

El catálogo de IDs de producto (1 al 8) está definido en `js/data.js`.

## 2. Flujos a automatizar

Sugerencia de orden, de menor a mayor complejidad:

1. **Smoke test:** abrir la web y verificar que el título y el catálogo cargan.
2. **Login:** válido e inválido (TC-001, TC-002).
3. **Búsqueda:** producto existente, inexistente y parcial (TC-003).
4. **Carrito:** agregar producto y verificar el badge (TC-004).
5. **Carrito:** modificar cantidades y verificar que llegar a 0 elimina el ítem (TC-005).
6. **Checkout sin login:** verificar el bloqueo y la redirección (TC-006).
7. **Checkout con tarjeta inválida:** verificar el mensaje de error (TC-007).
8. **Checkout completo:** login → agregar producto → checkout → validar pedido (TC-008).

Estos flujos corresponden 1 a 1 con los casos documentados en
`../test-cases/TEST-CASES.md`.

## 3. Estructura sugerida para los tests (a futuro)

```
automation/
├── README.md               <- este archivo
├── requirements.txt        <- (a crear) selenium, pytest, webdriver-manager
├── conftest.py             <- (a crear) fixture del driver y base_url
├── pages/                  <- (a crear) Page Objects
│   ├── login_page.py
│   ├── products_page.py
│   ├── cart_page.py
│   └── checkout_page.py
└── tests/                  <- (a crear) casos de prueba automatizados
    ├── test_login.py
    ├── test_search.py
    ├── test_cart.py
    └── test_checkout.py
```

## 4. Ejemplo de configuración inicial (Python + Selenium + pytest)

Cuando quieras empezar a automatizar, este es un punto de partida típico.

`requirements.txt`:

```
selenium>=4.20
pytest>=8.0
webdriver-manager>=4.0
```

`conftest.py`:

```python
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

BASE_URL = "https://USUARIO.github.io/qa-testing-github-pages/"
# Para correr contra tu copia local: "file:///ruta/a/index.html"

@pytest.fixture
def driver():
    service = Service(ChromeDriverManager().install())
    drv = webdriver.Chrome(service=service)
    drv.get(BASE_URL)
    yield drv
    drv.quit()
```

`tests/test_login.py` (esqueleto, TC-001 y TC-002):

```python
from selenium.webdriver.common.by import By

def test_login_valido(driver):
    driver.find_element(By.CSS_SELECTOR, '[data-testid="btn-login-open"]').click()
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-email"]').send_keys("qa.user@example.com")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-password"]').send_keys("Qa12345!")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-submit"]').click()

    message = driver.find_element(By.CSS_SELECTOR, '[data-testid="login-message"]')
    assert "exitoso" in message.text.lower()

def test_login_invalido(driver):
    driver.find_element(By.CSS_SELECTOR, '[data-testid="btn-login-open"]').click()
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-email"]').send_keys("qa.user@example.com")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-password"]').send_keys("clave-incorrecta")
    driver.find_element(By.CSS_SELECTOR, '[data-testid="login-submit"]').click()

    message = driver.find_element(By.CSS_SELECTOR, '[data-testid="login-message"]')
    assert "incorrectos" in message.text.lower()
```

Este esqueleto es intencionalmente mínimo: a medida que avances, migralo a un
patrón **Page Object Model** (una clase por vista, con métodos como
`login_page.login(email, password)`) para que los tests queden legibles y
mantenibles.

## 5. Notas importantes

- Como no hay backend, cada test que dependa del carrito o de pedidos
  previos debería limpiar `localStorage` al inicio (`driver.execute_script("window.localStorage.clear()")`)
  para partir de un estado conocido.
- Si corrés los tests contra la versión publicada en GitHub Pages, recordá
  que `localStorage` persiste por navegador/perfil, no por usuario.
