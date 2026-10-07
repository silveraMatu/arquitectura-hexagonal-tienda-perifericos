# Contratos de la API — E-commerce de Periféricos

Base URL (local): `http://localhost:3000` (puerto configurable con `PORT` en `.env`, default `3000`).

Todas las respuestas son JSON. No hay autenticación en esta fase: el carrito es único por default (`cartId = "default-cart"`), pero todos los endpoints de carrito aceptan un `cartId` opcional para simular múltiples carritos.

---

## Índice

- [Productos](#productos)
  - [GET /products](#get-products)
  - [GET /products/search](#get-productssearch)
  - [GET /products/:id](#get-productsid)
- [Carrito](#carrito)
  - [POST /cart/items](#post-cartitems)
  - [DELETE /cart/items/undo](#delete-cartitemsundo)
  - [DELETE /cart/items/:productId](#delete-cartitemsproductid)
  - [POST /cart/checkout](#post-cartcheckout)
- [Formato de errores](#formato-de-errores)
- [Tabla de códigos de error](#tabla-de-códigos-de-error)

---

## Productos

### `GET /products`

Lista todos los productos disponibles.

**Request:** sin parámetros.

**Response `200 OK`:**
```json
[
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "name": "Mouse Óptico Gamer X200",
    "description": "Mouse óptico con sensor de 8000 DPI, 6 botones programables e iluminación RGB.",
    "price": 24.99,
    "stock": 50
  }
]
```

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador único del producto (UUID). |
| `name` | `string` | Nombre del producto. |
| `description` | `string` | Descripción del producto. |
| `price` | `number` | Precio unitario (siempre > 0). |
| `stock` | `number` | Unidades disponibles (siempre ≥ 0). |

---

### `GET /products/search`

Busca productos por nombre y/o rango de precio. Todos los filtros son opcionales y combinables.

**Query params:**

| Param | Tipo | Requerido | Descripción |
|---|---|---|---|
| `q` | `string` | No | Substring de búsqueda sobre el nombre (case-insensitive). |
| `min_price` | `number` | No | Precio mínimo (inclusive). |
| `max_price` | `number` | No | Precio máximo (inclusive). |

**Ejemplo:** `GET /products/search?q=mouse&min_price=10&max_price=30`

**Response `200 OK`:** mismo shape que `GET /products` (array, puede ser vacío `[]`).

**Errores posibles:** `400` si `min_price`/`max_price` no son numéricos (ver [formato de errores](#formato-de-errores)).

---

### `GET /products/:id`

Detalle de un producto puntual.

**Path params:**

| Param | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Id del producto. |

**Response `200 OK`:**
```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "Mouse Óptico Gamer X200",
  "description": "Mouse óptico con sensor de 8000 DPI, 6 botones programables e iluminación RGB.",
  "price": 24.99,
  "stock": 50
}
```

**Errores posibles:** `404 PRODUCT_NOT_FOUND` si no existe un producto con ese `id`.

---

## Carrito

El carrito responde siempre con el mismo shape (`CartResponse`):

```json
{
  "cartId": "default-cart",
  "items": [
    {
      "productId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "productName": "Mouse Óptico Gamer X200",
      "unitPrice": 24.99,
      "quantity": 2,
      "subtotal": 49.98
    }
  ],
  "total": 49.98,
  "isEmpty": false
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| `cartId` | `string` | Id del carrito. |
| `items` | `array` | Líneas del carrito (ver tabla abajo). |
| `items[].productId` | `string` | Id del producto. |
| `items[].productName` | `string` | Nombre del producto (snapshot al momento de agregarlo). |
| `items[].unitPrice` | `number` | Precio unitario (snapshot al momento de agregarlo; no cambia si el precio del producto cambia después). |
| `items[].quantity` | `number` | Cantidad de unidades en esa línea. |
| `items[].subtotal` | `number` | `unitPrice * quantity`. |
| `total` | `number` | Suma de todos los `subtotal`. `0` si el carrito está vacío. |
| `isEmpty` | `boolean` | `true` si no tiene items. |

---

### `POST /cart/items`

Agrega un producto al carrito. Si el producto ya está en el carrito, **suma** la cantidad a la línea existente (no la reemplaza).

**Body:**
```json
{
  "productId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "quantity": 2,
  "cartId": "default-cart"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `productId` | `string` | Sí | Id del producto a agregar. |
| `quantity` | `number` (entero, > 0) | Sí | Cantidad a agregar. |
| `cartId` | `string` | No | Si se omite, usa el carrito default. |

**Response `200 OK`:** `CartResponse` (ver arriba) con el carrito actualizado.

**Errores posibles:**
- `404 PRODUCT_NOT_FOUND` — el `productId` no existe.
- `409 INSUFFICIENT_STOCK` — la cantidad pedida (sumada a lo que ya había en el carrito) supera el stock disponible. El carrito **no se modifica**.
- `422 INVALID_QUANTITY` — `quantity` no es un entero positivo.
- `400 VALIDATION_ERROR` — body malformado (falta `productId`, tipos incorrectos, etc.).

---

### `DELETE /cart/items/undo`

Deshace la **última** adición al carrito (estrategia LIFO). Si la última adición fue de 3 unidades de un producto, revierte esas 3 unidades (elimina la línea si llega a 0; si se había agregado el mismo producto en más de una llamada, solo revierte la última).

**Query params:**

| Param | Tipo | Requerido | Descripción |
|---|---|---|---|
| `cartId` | `string` | No | Si se omite, usa el carrito default. |

**Ejemplo:** `DELETE /cart/items/undo?cartId=default-cart`

**Response `200 OK`:** `CartResponse` con el carrito actualizado.

**Errores posibles:**
- `404 CART_NOT_FOUND` — no existe un carrito con ese `cartId`.
- `422 NO_ACTIONS_TO_UNDO` — el carrito no tiene historial de adiciones para deshacer (está vacío de acciones, p. ej. recién creado o ya se deshizo todo).

---

### `DELETE /cart/items/:productId`

Elimina **directamente** la línea de un producto específico del carrito, sin importar el orden en que fue agregado.

**Path params:**

| Param | Tipo | Descripción |
|---|---|---|
| `productId` | `string` | Id del producto a quitar del carrito. |

**Query params:**

| Param | Tipo | Requerido | Descripción |
|---|---|---|---|
| `cartId` | `string` | No | Si se omite, usa el carrito default. |

**Response `200 OK`:** `CartResponse` con el carrito actualizado (sin esa línea).

**Errores posibles:**
- `404 CART_NOT_FOUND` — no existe un carrito con ese `cartId`.
- `404 CART_ITEM_NOT_FOUND` — el carrito existe pero no tiene una línea para ese `productId`.

---

### `POST /cart/checkout`

Confirma la compra: valida stock de **todos** los items, descuenta el stock de cada producto y vacía el carrito. Es todo-o-nada: si falta stock de cualquier item, no se descuenta nada.

**Body (opcional):**
```json
{
  "cartId": "default-cart"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `cartId` | `string` | No | Si se omite, usa el carrito default. |

**Response `200 OK`:**
```json
{
  "cartId": "default-cart",
  "purchasedItems": [
    {
      "productId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "productName": "Mouse Óptico Gamer X200",
      "unitPrice": 24.99,
      "quantity": 3,
      "subtotal": 74.97
    }
  ],
  "total": 74.97
}
```

Nota: después de un checkout exitoso, el carrito queda vacío (`GET` posterior al mismo `cartId` mostraría `items: [], isEmpty: true`).

**Errores posibles:**
- `404 CART_NOT_FOUND` — no existe un carrito con ese `cartId`.
- `422 EMPTY_CART` — el carrito está vacío, no hay nada que comprar.
- `404 PRODUCT_NOT_FOUND` — algún producto del carrito ya no existe (caso defensivo, no debería ocurrir en uso normal).
- `409 INSUFFICIENT_STOCK` — algún item del carrito no tiene stock suficiente al momento de confirmar la compra. **No se descuenta stock de ningún producto** en este caso.

---

## Formato de errores

Toda respuesta de error (cualquier status ≠ 2xx) tiene el mismo shape:

```json
{
  "error": "Descripción legible del error.",
  "code": "CODIGO_DEL_ERROR"
}
```

Para errores de validación (`400 VALIDATION_ERROR`) se agrega además `details`:

```json
{
  "error": "Invalid request data.",
  "code": "VALIDATION_ERROR",
  "details": [
    { "path": "quantity", "message": "Expected number, received string" }
  ]
}
```

---

## Tabla de códigos de error

| HTTP Status | `code` | Cuándo ocurre |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Body/query/params no cumplen el formato esperado. |
| 404 | `PRODUCT_NOT_FOUND` | El producto solicitado no existe. |
| 404 | `CART_NOT_FOUND` | El carrito solicitado no existe. |
| 404 | `CART_ITEM_NOT_FOUND` | No hay esa línea de producto en el carrito. |
| 404 | `ROUTE_NOT_FOUND` | La ruta/método solicitado no existe en la API. |
| 409 | `INSUFFICIENT_STOCK` | No hay stock suficiente para la operación pedida. |
| 422 | `INVALID_PRICE` | Precio inválido (≤ 0 o no numérico) — interno, no debería verse desde el frontend. |
| 422 | `INVALID_STOCK` | Stock inválido (negativo) — interno. |
| 422 | `INVALID_QUANTITY` | Cantidad inválida (no entero positivo). |
| 422 | `INVALID_PRODUCT_NAME` | Nombre de producto inválido — interno. |
| 422 | `EMPTY_CART` | Se intentó hacer checkout de un carrito vacío. |
| 422 | `NO_ACTIONS_TO_UNDO` | Se intentó deshacer sin historial de adiciones. |
| 500 | `INTERNAL_ERROR` | Error inesperado del servidor. |

---

## Nota sobre persistencia

En esta fase los datos (productos y carritos) viven **en memoria** del proceso del servidor: se resetean al reiniciar la API. Los productos semilla están fijos (5 periféricos con UUIDs conocidos, ver respuesta de `GET /products`). La persistencia real contra PostgreSQL llega en una fase posterior.
