/**
 * data.js
 * Datos estáticos de QA Shop: catálogo de productos y credenciales
 * de prueba. No hay backend: todo vive en memoria + localStorage.
 */

const PRODUCTS = [
  {
    id: 1,
    name: "Monitor 34\" 2K",
    price: 349.99,
    description: "Monitor ultrawide de 34 pulgadas, resolución 2K, ideal para productividad y multitarea.",
    icon: "🖥️"
  },
  {
    id: 2,
    name: "Smartphone Pro",
    price: 899.99,
    description: "Smartphone de gama alta con cámara triple, pantalla AMOLED y batería de larga duración.",
    icon: "📱"
  },
  {
    id: 3,
    name: "Teclado mecánico",
    price: 79.99,
    description: "Teclado mecánico retroiluminado con switches azules y estructura de aluminio.",
    icon: "⌨️"
  },
  {
    id: 4,
    name: "Mouse gamer",
    price: 39.99,
    description: "Mouse óptico gamer con 6 botones programables, iluminación RGB y sensor de alta precisión.",
    icon: "🖱️"
  },
  {
    id: 5,
    name: "Laptop Developer",
    price: 1299.99,
    description: "Laptop pensada para desarrollo: 32GB de RAM, SSD NVMe y procesador de última generación.",
    icon: "💻"
  },
  {
    id: 6,
    name: "Audífonos inalámbricos",
    price: 129.99,
    description: "Audífonos Bluetooth con cancelación activa de ruido y 30 horas de batería.",
    icon: "🎧"
  },
  {
    id: 7,
    name: "Webcam 4K",
    price: 89.99,
    description: "Webcam 4K con autoenfoque, corrección de luz automática y micrófono integrado.",
    icon: "📷"
  },
  {
    id: 8,
    name: "SSD 1 TB",
    price: 99.99,
    description: "Unidad de estado sólido NVMe de 1TB con velocidades de lectura de hasta 3500MB/s.",
    icon: "💾"
  }
];

// Credenciales de prueba únicas y válidas para el login de QA Shop.
const VALID_USER = {
  email: "qa.user@example.com",
  password: "Qa12345!"
};

// Nombres de claves usadas en localStorage, centralizados para
// evitar strings mágicos repetidos por el resto de la app.
const STORAGE_KEYS = {
  session: "qaShop_session",
  cart: "qaShop_cart",
  orders: "qaShop_orders"
};
