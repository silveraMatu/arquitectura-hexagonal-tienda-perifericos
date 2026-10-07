# Brief: Frontend — E-commerce de Periféricos

> Instrucción para Claude Code. El backend y los contratos de la API YA EXISTEN
> (ver `ENDPOINTS-CONTRACTS.md`). Tu tarea es generar el frontend que los consume,
> replicando visualmente el template (sección 5). No uses ninguna skill de diseño:
> seguí este brief.

## 1. Objetivo
Generar el frontend de un e-commerce de periféricos en **Next.js** que consume la API REST
local, replicando casi exactamente el template de referencia (que también es Next.js).
No rediseñes ni "mejores" el template: replicalo y conectale los datos reales.

## 2. Stack
- Framework: **Next.js (App Router)**
- Lenguaje: **TypeScript** (nada de `any`)
- Estilos: **Tailwind** (reusá `template/tailwind.config.ts` tal cual).
- Data fetching: **TanStack Query** en Client Components (el carrito es interactivo).
  El listado de productos puede ser Server Component; las acciones (agregar, deshacer,
  eliminar, checkout) van en Client Components con `"use client"`.
- Gestor de paquetes: << npm / pnpm >>

## 3. Punto de partida: el proyecto y el template
- Trabajás en la carpeta `client/` (acá están este brief, `ENDPOINTS-CONTRACTS.md`,
  la carpeta `template/` y un `package.json`).
- **Primero revisá el estado del proyecto**: si `client/` ya es un proyecto Next funcional,
  trabajá sobre él; si el `package.json` está vacío/mínimo, inicializá Next en `client/`
  conservando `template/`, `brief-frontend.md` y `ENDPOINTS-CONTRACTS.md`.
- No hay repo exportable ni sitio en vivo del template. Fuentes disponibles:

**Código del template copiado a mano** (úsalo como base real, NO lo rehagas):
- `template/tailwind.config.ts` — tokens de diseño: colores, tipografía, spacing, radios.
- `template/tailwind.css` — estilos globales: fuentes (`@font-face`/imports) y variables de
  color. Importalo en `app/layout.tsx`.
- `template/components/header.tsx` y `template/components/footer.tsx` — integralos en el layout.
  Revisá `header.tsx`: si arrastra algún bug del template (hidratación / markup roto), dejalo
  andando limpio. El header NO debe verse duplicado ni encimado.
- `template/home/components/HeroSection.tsx` — reusá el hero en la home (cambiale el contenido).
- `template/home/components/BentoProductGrid.tsx` — **es la base del grid del catálogo**:
  adaptalo para renderizar los productos reales de `GET /products`.

**Captura** en `template/screen/` (una sola imagen full-page de la landing): referencia de
ESTÉTICA y del layout de la home. OJO: el header puede verse encimado o duplicado en la imagen
— es un artefacto de capturar un nav sticky de página completa, NO un bug a reproducir.

El resto de la UI (card de producto, botones, líneas del carrito, formularios, etc.) NO está
copiada: construila usando los tokens de `tailwind.config.ts`/`tailwind.css`, coherente con el
header, el footer y el hero.

Las vistas de **detalle de producto, carrito y checkout NO están en el template** (es una
landing): diseñalas de cero con la misma estética (mismos tokens, mismos patrones de card/botón).

No hace falta copiar las PÁGINAS del template: construís las vistas (sección 6) de nuevo
conectadas a la API, reusando lo anterior.

## 4. Backend y endpoints
- URL base (dev): `http://localhost:3000` — leer de `process.env.NEXT_PUBLIC_API_BASE_URL`, no hardcodear.
  (Ojo: la API usa :3000; levantá el front de Next en otro puerto, ej. `next dev -p 3001`.)
- **Sin autenticación** en esta fase.
- Carrito único por default: `cartId = "default-cart"`. Los endpoints de carrito aceptan un
  `cartId` opcional; por ahora trabajá siempre con el default.
- **Fuente de verdad del contrato:** `ENDPOINTS-CONTRACTS.md`. Ante cualquier duda, ese archivo manda.

### Resumen de endpoints
| Método | Ruta | Qué hace | Respuesta |
|---|---|---|---|
| GET | `/products` | Lista todos los productos | `Product[]` |
| GET | `/products/search?q=&min_price=&max_price=` | Busca por nombre y/o rango de precio (filtros opcionales y combinables) | `Product[]` (puede ser `[]`) |
| GET | `/products/:id` | Detalle de un producto | `Product` |
| POST | `/cart/items` | Agrega producto (si ya está, **suma** cantidad) | `CartResponse` |
| DELETE | `/cart/items/undo` | Deshace la **última** adición (LIFO) | `CartResponse` |
| DELETE | `/cart/items/:productId` | Elimina directo la línea de ese producto | `CartResponse` |
| POST | `/cart/checkout` | Confirma compra (todo-o-nada), descuenta stock y vacía carrito | `{ cartId, purchasedItems, total }` |

### Shapes
```ts
type Product = { id: string; name: string; description: string; price: number; stock: number };

type CartItem = {
  productId: string;
  productName: string;   // snapshot al agregar
  unitPrice: number;     // snapshot al agregar: NO cambia si el precio del producto cambia
  quantity: number;
  subtotal: number;      // unitPrice * quantity
};

type CartResponse = { cartId: string; items: CartItem[]; total: number; isEmpty: boolean };

type CheckoutResponse = { cartId: string; purchasedItems: CartItem[]; total: number };

type ApiError = {
  error: string;
  code: string;                  // ej. INSUFFICIENT_STOCK
  details?: { path: string; message: string }[]; // solo en VALIDATION_ERROR
};
```

### Errores a manejar (por `code`)
Mapear cada `code` a un mensaje amigable (no mostrar el error crudo):
- `PRODUCT_NOT_FOUND` (404) → producto inexistente (en detalle, pantalla "no encontrado").
- `INSUFFICIENT_STOCK` (409) → "No hay stock suficiente". **El carrito/stock no se modifica.**
- `INVALID_QUANTITY` (422) → cantidad debe ser entero positivo.
- `VALIDATION_ERROR` (400) → usar `details[].message` si está.
- `CART_NOT_FOUND` / `CART_ITEM_NOT_FOUND` (404) → la línea/carrito no existe.
- `NO_ACTIONS_TO_UNDO` (422) → nada para deshacer (deshabilitar el botón si corresponde).
- `EMPTY_CART` (422) → checkout con carrito vacío (deshabilitar botón si `isEmpty`).

## 5. Replicar el template (reglas de fidelidad)
- Fuente de verdad visual: los tokens de `tailwind.config.ts` y `tailwind.css` copiados.
  Para todo lo que no esté en el código, guiate por la captura de `template/screen/`.
- Respetá: paleta, tipografía, estilo de botones/cards, grillas y espaciados del template.
- El acento **púrpura** y el fondo oscuro son la identidad del template: preservalos.
- No reinventes la estética ni cambies la tipografía del template.
- Si un valor no está en el código copiado y la captura no alcanza, preguntame antes de inventarlo.
- Como el front consume la API en el cliente, no vas a tener "hydration mismatch" si los
  componentes interactivos están bien marcados con `"use client"`.

## 6. Vistas a generar (App Router)
1. **Catálogo / home** — `app/page.tsx` → `GET /products`. Grid de productos (nombre, precio, stock),
   reusando `BentoProductGrid`. Botón "Agregar al carrito". Incluir **búsqueda + filtros de precio**
   que peguen a `GET /products/search` (q, min_price, max_price). Estado vacío cuando no hay resultados.
2. **Detalle** — `app/products/[id]/page.tsx` → `GET /products/:id`. Info + selector de cantidad +
   "Agregar al carrito". Manejar `404` con pantalla de "producto no encontrado".
3. **Carrito** — `app/cart/page.tsx` → mostrar `CartResponse` (líneas con subtotal, total, `isEmpty`).
   - Agregar: `POST /cart/items` (recordá que **suma** si ya existe).
   - **Deshacer última adición**: `DELETE /cart/items/undo` (deshabilitar si no hay acciones).
   - **Eliminar línea**: `DELETE /cart/items/:productId`.
   - Botón "Finalizar compra" (deshabilitado si `isEmpty`).
4. **Checkout** — `app/checkout/page.tsx` → `POST /cart/checkout`. Mostrar resumen
   (`purchasedItems`, `total`). Tras éxito el carrito queda vacío: reflejarlo.
   Manejar `EMPTY_CART` e `INSUFFICIENT_STOCK` (todo-o-nada: si falla, no se descontó nada).

## 7. Requisitos transversales y de calidad
- Estados de **loading / error / vacío** en toda llamada a la API (nada de "solo el caso feliz").
- Mapear errores por `code` (sección 4); nunca mostrar el error crudo.
- Respetar el **snapshot de precios** del carrito (`unitPrice` no se recalcula).
- Tipado fuerte de todos los request/response.
- `NEXT_PUBLIC_API_BASE_URL` en `.env` (incluir `.env.example`).
- Invalidar/refrescar el carrito con TanStack Query después de cada mutación.
- **Responsive**: declará el comportamiento mobile (`< 768px`) en cada layout multi-columna.
- **Dark mode**: el template es oscuro; mantené un tema consistente, no mezcles secciones claras.
- **Accesibilidad**: contraste WCAG AA, labels en inputs, foco visible, texto alternativo en imágenes.
- **Reduced motion**: si reusás animaciones del template (hero, etc.), respetá `prefers-reduced-motion`.
- Imágenes con `next/image`. Componentes con estado o eventos → `"use client"` en el tope.

## 8. Restricciones / qué NO hacer
- No usar skills de diseño (design-taste-frontend ni otras): seguí este brief.
- No tocar el backend ni los contratos de los endpoints.
- No rediseñar el template ni cambiar su tipografía/paleta.
- No recalcular precios del carrito contra el producto (usar el snapshot).
- No hardcodear la URL base ni agregar dependencias innecesarias.

## 9. Criterios de aceptación
- Levanta con `npm run dev` sin errores de tipos ni de consola.
- El header anda limpio (no duplicado/encimado).
- Las 4 vistas existen, navegan y consumen el endpoint correcto.
- Búsqueda y filtros de precio funcionan y combinan.
- Carrito muestra subtotales y total correctos; undo y eliminar línea funcionan.
- Checkout vacía el carrito y muestra el resumen de compra.
- Errores de stock/validación se muestran con mensajes claros.
- La UI coincide visualmente con el template (paleta, tipografía, patrones).
- No quedan datos mockeados donde debería haber datos de la API.

## 10. Cómo trabajar (orden sugerido)
1. Leé este brief, `ENDPOINTS-CONTRACTS.md` y todo lo de `template/`.
2. Revisá el estado del proyecto en `client/` (package.json) y revisá `header.tsx` por bugs.
3. Proponé la estructura de carpetas y esperá mi OK antes de generar las vistas.
4. Generá primero el cliente API tipado + los types + el mapeo de errores.
5. Después, vista por vista: Catálogo → Detalle → Carrito → Checkout.
6. Al terminar cada vista, listame qué asumiste o qué quedó pendiente.
