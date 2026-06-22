# 🚗 Web App Automóviles — API de búsqueda y recomendación de vehículos

API backend para **buscar, comparar y recibir recomendaciones de automóviles** a través de un
agente conversacional inteligente. El usuario mantiene una conversación en lenguaje natural (por
ejemplo: _"quiero un SUV familiar a nafta hasta 20 millones para la ciudad"_) y el agente
interpreta la intención, filtra el catálogo de vehículos y devuelve recomendaciones personalizadas.

## 🎯 ¿Qué hace y cuál es su objetivo?

El objetivo del proyecto es ofrecer una experiencia de búsqueda de autos similar a conversar con un
asesor experto, en lugar de navegar manualmente listados y filtros. Para lograrlo, el backend
combina varias piezas:

- **Catálogo de vehículos** alimentado por un módulo de _scraping_ que descubre y recolecta
  publicaciones de autos.
- **Agente recomendador** construido sobre LangGraph + Gemini, que entiende el mensaje del usuario,
  detecta su intención, aplica filtros y busca candidatos.
- **Búsqueda híbrida**: combina consultas relacionales (datos estructurados de los vehículos) con
  búsqueda semántica/vectorial (descripciones y conocimiento no estructurado).
- **Chat persistente**: cada usuario tiene sus conversaciones y mensajes guardados.
- **Autenticación y autorización** mediante JWT, gestionadas con Supabase.

## 🧱 Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Framework | NestJS 11 (TypeScript) |
| Base de datos relacional | MySQL 8 (TypeORM) |
| Caché / colas | Redis 8 (BullMQ + blacklist de tokens) |
| Base de datos vectorial | ChromaDB |
| Autenticación | Supabase Auth (JWT) |
| Agente / LLM | LangGraph + Google Gemini |
| Documentación de la API | Swagger / OpenAPI |
| Contenedores | Docker + Docker Compose |

---

## ✅ Prerrequisitos

Antes de empezar, asegurate de tener instalado en tu equipo:

| Herramienta | Versión mínima | Verificar con |
| --- | --- | --- |
| **Node.js** | `22.14.0` o superior | `node -v` |
| **Docker** (con Docker Compose v2) | `29.1.5` o superior | `docker -v` |

> **Nota:** `npm` se instala junto con Node.js. Todos los comandos de este README se ejecutan desde
> la carpeta `backend/` del proyecto, y Docker debe estar **en ejecución** antes de levantar los
> servicios.

---

## 🚀 Puesta en marcha paso a paso

Seguí estos pasos **en orden**. Cada uno es indispensable para que el proyecto funcione.

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone <URL-DEL-REPOSITORIO>
cd web-app-automoviles/backend
npm install
```

> A partir de aquí, **todos los comandos se ejecutan dentro de la carpeta `backend/`**.

### 2. Solicitar los recursos al administrador

Algunos recursos no se incluyen en el repositorio por seguridad. Antes de continuar, **solicitame a
mí (el administrador del proyecto)** lo siguiente:

1. 📦 **El archivo de backup `tar.gz`** de la base de datos relacional. Esto te permite arrancar con
   el catálogo de vehículos ya cargado, **sin tener que inicializar la base de datos desde cero**.
2. 🔑 **Las credenciales del proyecto de Supabase** (`SUPABASE_URL` y `SUPABASE_ANON_KEY`). Son
   necesarias para que funcionen los endpoints de **autenticación y autorización**.
3. 🤖 **La API key de Google Gemini** (`GEMINI_API_KEY`), que utiliza el agente recomendador para
   generar las respuestas del chat.

### 3. Configurar las variables de entorno

> ⚠️ **Leé esta sección con atención.** El proyecto **no usa un único `.env`**, sino **varios**: uno
> para la aplicación backend y **uno por cada servicio de Docker** (MySQL, Redis y ChromaDB). Cada
> servicio lee su **propio** archivo `.env`, ubicado dentro de su subcarpeta. Todos estos archivos
> deben configurarse de forma **coherente entre sí**: si un valor no coincide entre el backend y el
> servicio correspondiente, la aplicación no podrá conectarse y el contenedor podría no levantarse.

A continuación se detallan, uno por uno, los archivos `.env` que tenés que crear.

#### 3.1. Archivo `.env` del backend (la aplicación NestJS)

En la carpeta `backend/` ya existe un archivo de ejemplo llamado `.env.example`. Creá tu propio
archivo `.env` a partir de él:

```bash
cp .env.example .env
```

Luego, abrí el archivo `backend/.env` y completá los valores. Este archivo lo consume **la
aplicación NestJS** (no los contenedores):

```env
# --- Conexión a la base de datos relacional (MySQL) ---
DB_HOST=localhost
DB_PORT=3306
DB_USER=dev_name                       # usuario de la aplicación
DB_PASSWORD=db_password_strong         # contraseña del usuario root de MySQL
DB_USER_PASSWORD=user_password_strong  # contraseña del usuario de la aplicación
DB_NAME=car_app_db                     # nombre de la base de datos

# --- Supabase (te las provee el administrador) ---
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_anon_key_de_supabase

# --- Conexión a Redis (caché / colas) ---
REDIS_HOST=localhost
REDIS_PASSWORD=redis_password
REDIS_PORT=6379

# --- Conexión a la base de datos vectorial (ChromaDB) ---
VECTOR_DB_HOST=localhost
VECTOR_DB_PORT=8000

# --- Agente / LLM (la API key te la provee el administrador) ---
GEMINI_API_KEY=tu_api_key_de_gemini
AGENT_LLM_MODEL=gemini-3.1-flash-lite
AGENT_LLM_MODEL_FAST=gemini-3.1-flash-lite
AGENT_CONTEXT_SUMMARY_THRESHOLD=12
AGENT_RELATIONAL_TOP_K=20
AGENT_VECTOR_TOP_K=6
```

#### 3.2. Archivos `.env` de cada servicio de Docker

Cada servicio de base de datos se levanta con su propio `docker-compose`, ubicado en una subcarpeta
de `backend/`, y **cada uno lee el archivo `.env` que esté en esa misma subcarpeta**. Estos archivos
**no existen** todavía: tenés que **crearlos manualmente**, uno por servicio.

> ⚠️ Si estos archivos faltan, al ejecutar los comandos `npm run db:up`, `npm run cache:db:up`, etc.,
> Docker fallará porque no encontrará el `.env` del servicio.

Los valores de estos archivos **deben coincidir exactamente** con los del `backend/.env`, según esta
tabla de equivalencias:

| Variable del servicio | Debe ser idéntica a (en `backend/.env`) |
| --- | --- |
| `MYSQL_ROOT_PASSWORD` (mysql) | `DB_PASSWORD` |
| `MYSQL_DATABASE` (mysql) | `DB_NAME` |
| `MYSQL_USER` (mysql) | `DB_USER` |
| `MYSQL_PASSWORD` (mysql) | `DB_USER_PASSWORD` |
| `REDIS_PASSWORD` (redis) | `REDIS_PASSWORD` |

**a) Crear `backend/mysql/.env`** → variables que el contenedor de MySQL usa para inicializarse:

```env
MYSQL_ROOT_PASSWORD=db_password_strong   # debe ser igual a DB_PASSWORD del backend
MYSQL_DATABASE=car_app_db                # debe ser igual a DB_NAME del backend
MYSQL_USER=dev_name                      # debe ser igual a DB_USER del backend
MYSQL_PASSWORD=user_password_strong      # debe ser igual a DB_USER_PASSWORD del backend
```

**b) Crear `backend/redis/.env`** → contraseña con la que se protege Redis:

```env
REDIS_PASSWORD=redis_password            # debe ser igual a REDIS_PASSWORD del backend
```

**c) Crear `backend/chromadb/.env`** → ChromaDB funciona con su configuración por defecto y no
requiere credenciales, pero su `docker-compose` referencia este archivo, por lo que **debés crearlo
igual** (aunque sea para mantener la coherencia con el resto de los servicios). Podés dejarlo con los
datos de conexión:

```env
VECTOR_DB_HOST=localhost
VECTOR_DB_PORT=8000
```

> **Regla de oro de la coherencia:** pensá en la contraseña root de MySQL, el usuario, su contraseña,
> el nombre de la base y la contraseña de Redis como **un solo valor compartido** entre el backend y
> su servicio. Es decir: `DB_PASSWORD` = `MYSQL_ROOT_PASSWORD`, `DB_NAME` = `MYSQL_DATABASE`,
> `DB_USER` = `MYSQL_USER`, `DB_USER_PASSWORD` = `MYSQL_PASSWORD` y `REDIS_PASSWORD` (backend) =
> `REDIS_PASSWORD` (redis). Si cambiás uno, **cambialo en ambos lugares**.

> 💡 **Tip:** si más adelante vas a correr la suite de tests, los servicios de prueba
> (`npm run test:db:up`, `npm run test:vector:db:up`) usan archivos `.env.test` en
> `backend/mysql/` y `backend/chromadb/`. Creálos de la misma forma cuando los necesites.

### 4. Crear las redes de Docker

El proyecto utiliza dos redes externas de Docker. Creá ambas **una sola vez** con:

```bash
docker network create web-app-automoviles
docker network create web-app-automoviles-test
```

> La red `web-app-automoviles` es la de uso normal; `web-app-automoviles-test` se utiliza para los
> entornos de pruebas. Si una red ya existe, Docker te avisará y podés ignorar el mensaje.

### 5. Levantar los servicios de bases de datos

Con Docker en ejecución, levantá los tres servicios (relacional, caché y vectorial) con los
siguientes comandos:

```bash
npm run db:up          # MySQL (base de datos relacional)
npm run cache:db:up    # Redis (caché y colas)
npm run vector:db:up   # ChromaDB (base de datos vectorial)
```

Podés verificar que los contenedores estén corriendo con `docker ps`. Deberías ver, al menos,
`automoviles_db`, `redis` y `chromadb_service`.

### 6. Restaurar el backup de la base de datos

Una vez levantado el contenedor de MySQL (paso anterior), colocá el archivo `tar.gz` que te
proporcioné dentro de la carpeta `backend/backups/` y restauralo con:

```bash
npm run db:restore nombre_del_archivo.tar.gz
```

Por ejemplo:

```bash
npm run db:restore backup_mysql_2026-06-20_10-30-00.tar.gz
```

> Este comando detiene momentáneamente el contenedor de MySQL, reemplaza el contenido de la base de
> datos con el del backup y vuelve a levantarlo automáticamente. Así arrancás con el catálogo de
> vehículos ya cargado.

### 7. Levantar el servidor backend

Con las bases de datos arriba y el backup restaurado, iniciá la API en modo desarrollo (con recarga
automática):

```bash
npm run start:dev
```

Cuando veas que la aplicación quedó escuchando, el servidor estará disponible en
**`http://localhost:3000`**.

---

## 📖 Uso de la API desde Swagger

La API está completamente documentada con **Swagger**. No necesitás Postman ni ninguna herramienta
externa: podés probar todos los endpoints desde el navegador.

Con el servidor corriendo, abrí:

👉 **`http://localhost:3000/docs`**

Seguí este flujo completo para probar el agente recomendador:

### Paso 1 — Registrarte

En la sección **`auth`**, ejecutá el endpoint **`POST /api/auth/register`** con un cuerpo como:

```json
{
  "email": "usuario@ejemplo.com",
  "password": "MiClaveSegura1"
}
```

> La contraseña debe tener **al menos 8 caracteres**.

### Paso 2 — Iniciar sesión y obtener el token

Ejecutá **`POST /api/auth/login`** con el mismo email y contraseña. La respuesta incluirá una sesión
de Supabase con un **`access_token`** (un JWT). **Copiá ese `access_token`.**

> Según la configuración de Supabase, el registro puede requerir verificación por correo antes de
> poder iniciar sesión. Si es tu caso, confirmá tu email y luego volvé a ejecutar el login.

### Paso 3 — Autorizar tus peticiones

En la parte superior derecha de Swagger hay un botón **`Authorize`** (con un ícono de candado 🔒).
Hacé clic en él, **pegá únicamente el `access_token`** (sin el prefijo `Bearer`) y confirmá. A
partir de este momento, todas tus peticiones a endpoints protegidos viajarán autenticadas.

### Paso 4 — Crear una conversación (chat)

En la sección **`chat`**, ejecutá **`POST /api/chat`** con un título para la conversación:

```json
{
  "title": "Busco un SUV familiar"
}
```

La respuesta incluye el **`id`** de la conversación (un UUID). **Copialo**, lo vas a necesitar en el
siguiente paso.

### Paso 5 — Enviar un mensaje al agente

Ejecutá **`POST /api/chat/{sessionId}/messages`**, reemplazando `{sessionId}` por el `id` de la
conversación que copiaste. En el cuerpo enviá tu consulta:

```json
{
  "content": "Quiero un SUV familiar a nafta, automático, hasta 25 millones, para uso en ciudad. ¿Qué me recomendás?"
}
```

El agente procesará tu mensaje y devolverá su recomendación junto con metadata (la intención
detectada, los filtros aplicados, la cantidad de candidatos encontrados, etc.). Podés seguir
enviando más mensajes a la misma conversación para refinar la búsqueda.

### Paso 6 — Cerrar sesión (logout)

Cuando termines, cerrá la sesión ejecutando **`POST /api/auth/logout`**. Este endpoint usa el token
que configuraste en el botón `Authorize` y lo revoca (lo agrega a una _blacklist_ en Redis), de modo
que ya no podrá volver a utilizarse.

---

## 🛑 Detener el proyecto

Cuando termines de trabajar, bajá todo en el siguiente orden:

### 1. Detener el servidor backend

En la terminal donde corre `npm run start:dev`, presioná **`Ctrl + C`**.

### 2. Bajar los servicios de bases de datos

Detené y eliminá los contenedores de las bases de datos:

```bash
npm run db:down          # MySQL
npm run cache:db:down    # Redis
npm run vector:db:down   # ChromaDB
```

---

## 💾 Crear un backup de la base de datos

Si querés generar tu propia copia de seguridad de la base de datos relacional, usá:

```bash
npm run db:backup
```

> **Prerrequisito:** el contenedor de la base de datos relacional (`automoviles_db`) debe estar
> **activo** antes de ejecutar el comando.

El script detiene momentáneamente el contenedor (para garantizar una copia consistente), genera un
archivo comprimido `backup_mysql_<fecha>.tar.gz` dentro de la carpeta `backend/backups/` y vuelve a
levantar el contenedor automáticamente.

---

## 📋 Referencia de comandos disponibles

Todos se ejecutan desde la carpeta `backend/`:

| Comando | Descripción |
| --- | --- |
| `npm install` | Instala las dependencias del proyecto. |
| `npm run start:dev` | Levanta el servidor backend en modo desarrollo (con recarga automática). |
| `npm run start:prod` | Levanta el servidor backend en modo producción. |
| `npm run db:up` / `npm run db:down` | Levanta / baja el contenedor de MySQL. |
| `npm run cache:db:up` / `npm run cache:db:down` | Levanta / baja el contenedor de Redis. |
| `npm run vector:db:up` / `npm run vector:db:down` | Levanta / baja el contenedor de ChromaDB. |
| `npm run db:backup` | Crea un backup de la base de datos relacional. |
| `npm run db:restore <archivo.tar.gz>` | Restaura un backup de la base de datos relacional. |

---

## 🧭 Resumen del flujo completo

```text
1.  npm install
2.  Solicitar al administrador: backup .tar.gz + credenciales de Supabase + API key de Gemini
3.  Configurar los .env:
       - backend/.env  (a partir de .env.example)
       - backend/mysql/.env  +  backend/redis/.env  +  backend/chromadb/.env
       (todos coherentes entre sí)
4.  docker network create web-app-automoviles
    docker network create web-app-automoviles-test
5.  npm run db:up  +  npm run cache:db:up  +  npm run vector:db:up
6.  npm run db:restore <archivo.tar.gz>
7.  npm run start:dev
8.  Usar la API en http://localhost:3000/docs
       → register → login → Authorize → crear chat → enviar mensaje → logout
9.  Ctrl + C para detener el servidor
10. npm run db:down  +  npm run cache:db:down  +  npm run vector:db:down
```
