# Arquitectura Hexagonal — E-commerce de Periféricos

Proyecto de ejemplo de un e-commerce de periféricos, implementado con **arquitectura hexagonal** (puertos y adaptadores) en el backend. Está compuesto por tres servicios orquestados con Docker Compose:

| Servicio   | Descripción                              | Puerto local |
|------------|-------------------------------------------|--------------|
| `postgres` | Base de datos PostgreSQL                  | `5432`       |
| `backend`  | API REST (Node.js + Express + TypeORM)    | `3000`       |
| `frontend` | Cliente web (Next.js)                     | `3001`       |

## Estructura del proyecto

```
.
├── docker-compose.yml   # Orquesta los 3 servicios
├── .env.example         # Variables de entorno para Docker Compose (raíz)
├── server/              # API (arquitectura hexagonal: domain / application / infrastructure)
│   └── .env.example     # Variables para correr el backend SIN Docker
└── client/               # Frontend Next.js
    └── .env.example     # Variables para correr el frontend SIN Docker
```

> Hay **tres** archivos `.env.example` distintos: uno en la raíz (el que usa `docker-compose.yml`) y uno dentro de cada carpeta (`server/`, `client/`) por si querés correr esos proyectos de forma individual, sin Docker. Para levantar todo con Docker Compose solo necesitás el de la **raíz**.

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/) instalados.
- No es necesario tener Node.js ni PostgreSQL instalados localmente: todo corre dentro de contenedores.

## Puesta en marcha con Docker Compose

### 1. Clonar el repositorio

```bash
git clone https://github.com/silveraMatu/arquitectura-hexagonal-tienda-perifericos.git
cd arquitectura-hexagonal-tienda-perifericos
```

### 2. Crear el archivo `.env`

Docker Compose necesita un archivo `.env` en la raíz del proyecto. Copiá el ejemplo provisto y completalo:

```bash
cp .env.example .env
```

Abrí el `.env` recién creado y revisá/completá estas variables:

```dotenv
POSTGRES_USER=postgres_user       # Usuario de la base de datos
POSTGRES_PASSWORD=change_me       # Contraseña de la base de datos (cambiala por una propia)
POSTGRES_DB=perifericos           # Nombre de la base de datos
POSTGRES_PORT=5432                # Puerto en el que se expone Postgres en tu máquina
PORT=3000                         # Puerto en el que corre la API (backend)
```

Notas sobre estas variables:

- **`POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB`**: credenciales con las que se inicializa el contenedor de Postgres. Podés dejar los valores de ejemplo para desarrollo local, pero **cambiá `POSTGRES_PASSWORD`** si vas a usar esto en un entorno compartido.
- **`POSTGRES_PORT`**: puerto expuesto hacia tu máquina (host). Cambialo solo si ya tenés algo corriendo en el `5432`.
- **`PORT`**: puerto en el que escucha el backend. El `docker-compose.yml` lo usa también para exponer el puerto hacia el host.
- No necesitás definir `POSTGRES_HOST`: dentro de la red de Docker, el `docker-compose.yml` ya apunta el backend al servicio `postgres` automáticamente.
- El frontend se construye apuntando a `http://localhost:${PORT}` para poder llamar a la API desde el navegador (fuera de la red interna de Docker), así que si cambiás `PORT`, ese cambio se propaga solo.

### 3. Levantar los contenedores

```bash
docker compose up --build
```

Esto va a:
1. Levantar PostgreSQL y esperar a que esté saludable (`healthcheck`).
2. Construir y levantar el backend (Express + TypeORM), que se conecta a Postgres.
3. Construir y levantar el frontend (Next.js), que llama a la API del backend.

Para correrlo en segundo plano, agregá `-d`:

```bash
docker compose up --build -d
```

### 4. Acceder a la aplicación

- **Frontend:** [http://localhost:3001](http://localhost:3001)
- **Backend / API:** [http://localhost:3000](http://localhost:3000) (ver endpoints en `server/ENDPOINTS-CONTRACTS.md`)
- **Base de datos:** accesible en `localhost:5432` con las credenciales definidas en tu `.env` (útil para conectarte con un cliente como DBeaver o `psql`).

### 5. Detener los contenedores

```bash
docker compose down
```

Si además querés borrar los datos persistidos de la base (el volumen `postgres_data`):

```bash
docker compose down -v
```

## Correr cada parte por separado (sin Docker)

Si preferís desarrollar sin Docker, cada subproyecto tiene su propio `.env.example`:

### Backend (`server/`)

```bash
cd server
cp .env.example .env
# completá POSTGRES_HOST=localhost y apuntá a una instancia de Postgres propia
npm install
npm run dev
```

### Frontend (`client/`)

```bash
cd client
cp .env.example .env
# NEXT_PUBLIC_API_BASE_URL debe apuntar a la URL donde corre el backend
npm install
npm run dev
```

## Arquitectura del backend

El backend (`server/src`) sigue el patrón de **arquitectura hexagonal**:

- `domain/`: entidades y reglas de negocio puras, sin dependencias externas.
- `application/`: casos de uso que orquestan el dominio a través de puertos (interfaces).
- `infrastructure/`: adaptadores concretos (controladores HTTP, repositorios TypeORM/PostgreSQL, etc.) que implementan esos puertos.

El contrato completo de la API (endpoints, request/response, códigos de error) está documentado en [`server/ENDPOINTS-CONTRACTS.md`](./server/ENDPOINTS-CONTRACTS.md).
