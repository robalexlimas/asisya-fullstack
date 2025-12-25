# Asisya – Prueba Técnica Fullstack

Solución fullstack para la exposición y gestión de productos y categorías, diseñada con foco en arquitectura limpia, escalabilidad, seguridad y performance, cumpliendo los requerimientos de la prueba técnica.

El proyecto está dividido en Backend (API REST) y Frontend (SPA React), desplegables mediante Docker.

---

Estructura del repositorio

```
.
├── backend/        # API .NET (productos, categorías, auth, jobs)
├── frontend/       # SPA React
├── db/             # Scripts SQL (schema, SPs, jobs)
├── docker-compose.yml
└── README.md       # Este archivo
```

---

## Tech Stack

### Backend
- .NET 8 (compatible con .NET 7+)
- PostgreSQL 16
- Dapper
- JWT Authentication
- Docker
- Stored Procedures
- Background Jobs (Hosted Services)

### Frontend
- React
- React Router
- Fetch / Axios
- JWT (localStorage + interceptor)

### Testing
- xUnit
- Moq (unit tests)
- Testcontainers + PostgreSQL (integration tests)

---

## Arquitectura general

La solución sigue una arquitectura por capas (Clean / MVC):
- API: Controllers, Auth, Background Workers
- Application: DTOs, interfaces, servicios y validaciones
- Infrastructure: repositorios, acceso a datos, bulk import
- Domain: capa preparada para reglas de negocio (extensible)

Decisiones clave
- No se exponen entidades directamente (uso de DTOs).
- Acceso a datos optimizado con stored procedures.
- Procesos pesados (100k productos) ejecutados de forma asíncrona.
- Diseño preparado para escalado horizontal.

---

## Base de datos

Los scripts SQL viven en la carpeta /db y se ejecutan automáticamente al inicializar el contenedor PostgreSQL:
- Esquema de tablas
- Índices
- Stored procedures para lectura y escritura
- Tabla de seguimiento de jobs de importación

Para reinicializar completamente la base de datos:

```bash
docker compose down -v –remove-orphans
```

---

## Backend

El backend expone una API REST segura para gestionar productos y categorías.

Funcionalidades principales
- CRUD de categorías
- CRUD de productos
- Listado paginado con filtros y búsqueda
- Autenticación JWT
- Importación masiva de productos (100k+) mediante jobs asíncronos
- Seguimiento de progreso de jobs

Documentación detallada:
- Ver backend/README.md

---

Importación masiva de productos (100k)

Se implementó un flujo tipo Job para soportar cargas altas sin bloquear requests HTTP:
	1.	El cliente sube un archivo CSV
	2.	Se crea un job y se encola
	3.	Un background worker procesa el archivo en batches
	4.	Inserción masiva optimizada con COPY (PostgreSQL)
	5.	El progreso se persiste y puede ser consultado

Este diseño evita timeouts y permite escalar el procesamiento.

---

## Frontend

El frontend es una SPA en React que consume la API.

Funcionalidades
- Login (JWT)
- Protección de rutas (AuthGuard)
- Listado de productos
- Formularios de creación y edición
- Manejo de token en localStorage
- Interceptor para adjuntar JWT en requests

El código del frontend vive en:

```bash
/frontend
```

---

### Pruebas

La solución incluye pruebas automatizadas.

Unitarias
- Validación de servicios de aplicación
- Generación y validación de JWT
- Parsing y validación de CSV para importación masiva

Integración (E2E backend)
- PostgreSQL real levantado con Testcontainers
- Ejecución de scripts SQL reales
- Validación de repositorios y stored procedures

Ejecución de todas las pruebas:

```bash
dotnet test backend/Asisya.sln
```

---

### Docker y ejecución local

Ejecutar todo con Docker

```bash
docker compose up –build
```

Levanta:
- PostgreSQL
- Backend API
- Frontend (cuando se incluya en el compose final)

Ejecutar backend localmente

```bash
dotnet build backend/Asisya.sln
dotnet run –project backend/Asisya.Api
```

---

# CI/CD (pendiente)

El pipeline de CI/CD se implementará al final para incluir:
- Build
- Tests
- Docker build
- Despliegue del frontend

---

Notas finales
- El proyecto está diseñado para ser escalable y extensible.
- Las decisiones arquitectónicas están documentadas.
- Se priorizó performance y claridad sobre complejidad innecesaria.

---

Próximos pasos
- Implementar pipeline CI/CD (GitHub Actions)
- Integrar despliegue completo backend + frontend
- Hardening de seguridad y observabilidad
