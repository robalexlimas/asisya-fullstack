# Asisya – Backend (API Productos y Categorías)

API REST para exponer productos y categorías a clientes y procesos internos, con foco en rendimiento, escalabilidad y seguridad.

## Tech Stack

- **.NET 8** (compatible con requerimiento .NET 7+)
- **PostgreSQL 16**
- **Dapper** (acceso a datos eficiente)
- **JWT** Authentication
- **Docker / Docker Compose**
- **Stored Procedures** para lectura/escritura y consultas paginadas

---

## Arquitectura

Se implementó una arquitectura MVC por capas (estilo Clean Architecture):

- **Asisya.Api**: capa de presentación (Controllers, Auth, Worker/HostedService).
- **Asisya.Application**: contratos (interfaces), DTOs, validaciones y servicios de aplicación.
- **Asisya.Infrastructure**: acceso a datos (repositorios Dapper, factories, bulk importer).
- **Asisya.Domain**: (placeholder) entidades/reglas del dominio si se expandiera el modelo.

### Decisiones
- **DTOs**: La API no expone entidades directamente; usa DTOs y modelos de request/response.
- **Stored Procedures**: se usan para garantizar consultas consistentes y optimizar paginación/búsqueda.
- **Carga masiva (100k)**: se implementó un flujo asíncrono tipo **Job** para evitar timeouts y soportar cargas altas.
- **Bulk insert**: en PostgreSQL se usa **COPY (binary import)** para inserción masiva de alto rendimiento.

---

## Base de datos

Los scripts SQL viven en `/db` y se ejecutan automáticamente en el primer arranque del volumen PostgreSQL mediante Docker:

- `001_extensions.sql` (uuid/crypto)
- `002_schema.sql` (tablas)
- `003_indexes.sql` (índices)
- `010_sp_categories.sql`
- `020_sp_products_write.sql`
- `030_sp_products_read.sql`
- `040_sp_products_mutations.sql`
- `050_jobs.sql` (tabla `import_jobs` para jobs de importación)

> Nota: si el volumen `pgdata` ya existe, los scripts no se re-ejecutan. Para reinicializar: `docker compose down -v`.

---

## Ejecutar con Docker (recomendado)

Este proyecto incluye un Dockerfile para el backend ubicado en:

```
backend/Asisya.Api/Dockerfile
```
Build manual del backend

```bash
docker build -f backend/Asisya.Api/Dockerfile -t asisya-backend .
```

> Normalmente este build se ejecuta desde docker-compose.yml ubicado en la raíz del repositorio.

## Ejecutar en local (sin Docker)

Requisitos:
- PostgreSQL corriendo localmente
- Connection string en backend/Asisya.Api/appsettings.json

```bash
dotnet build backend/Asisya.sln
dotnet run --project backend/Asisya.Api
```

Swagger: http://localhost:5198/swagger (puede variar según entorno)

---

Seguridad (JWT)

Se expone un endpoint de login que retorna un JWT.
Credenciales (configuradas en appsettings.json / env vars):
- user: admin
- password: admin123

Configuradas vía:
- appsettings.json (local)
- Variables de entorno (Docker / CI)

La mayoría de endpoints están protegidos con [Authorize].

---

Endpoints principales

### Auth
- POST /auth/login

### Categories
- POST /category
- GET /category (paginado)

### Products
- POST /product (generación masiva vía SP)
- GET /product (paginado + filtros + search)
- GET /product/{id} (detalle + foto de categoría)
- PUT /product/{id}
- DELETE /product/{id}

### Importación asíncrona (Job)
- POST /products/import (multipart/form-data con archivo CSV)
- GET /jobs/{jobId} (estado/progreso del job)

---

## Importación masiva (100.000 productos) vía Job async

Formato CSV esperado

Encabezado:

```csv
name,sku,price,category
```

Ejemplo:

```csv
Product A,SKU-1001,10.50,CLOUD
Product B,SKU-1002,25.99,SERVIDORES
```

Crear el job (Postman)
- Method: POST
- URL: http://localhost:5198/products/import
- Authorization: Bearer <token>
- Body: form-data
- key: file (type: File) → seleccionar CSV

Respuesta:
```json
{ "jobId": "<guid>", "status": "Queued" }
```

### Consultar progreso

```
GET http://localhost:5198/jobs/<jobId>
```

Estados:
- Queued → Processing → Completed / Failed

Campos:
- totalRows, processedRows, insertedRows, failedRows, error

---

Performance y escalabilidad

Estrategias implementadas
- Procesamiento en background (HostedService) para evitar timeouts HTTP.
- Lectura streaming del CSV (sin cargar 100k filas en memoria).
- Inserción masiva con COPY (PostgreSQL) por batches.
- Seguimiento de progreso en tabla import_jobs.

Cómo escalar horizontalmente en cloud

En una arquitectura cloud, el diseño se puede escalar reemplazando la cola en memoria por:
- SQS / RabbitMQ / Kafka
- Almacenamiento del archivo en S3 / GCS / Azure Blob
- Workers desacoplados consumiendo jobs desde la cola
- Estado del job persistido en PostgreSQL (ya implementado)

Esto permite múltiples instancias de API y múltiples workers procesando en paralelo.

---

Pruebas

Pendiente de incluir:
- Unit tests
- Al menos un integration test

---

Notas
- Para reiniciar completamente el esquema (re-ejecutar SQL): docker compose down -v --remove-orphans.
- Si cambias scripts SQL y quieres aplicarlos desde cero, debes borrar el volumen pgdata.

---
