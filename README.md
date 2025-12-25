# Asisya – Prueba Técnica Fullstack

Solución fullstack para la gestión y exposición de productos y categorías, diseñada con foco en arquitectura limpia, escalabilidad, seguridad y performance, cumpliendo los requerimientos de la prueba técnica.

El proyecto está dividido en Backend (API REST) y Frontend (SPA React), ambos preparados para ejecución local y despliegue mediante Docker / Docker Compose.

---

Estructura del repositorio

```
.
├── backend/        # API .NET (productos, categorías, auth, jobs)
├── frontend/       # SPA React
├── db/             # Scripts SQL (schema, SPs, jobs)
├── docker-compose.yml
└── README.md       # Documentación general del proyecto
```

---

Tech Stack

Backend
- .NET 8 (compatible con .NET 7+)
- PostgreSQL 16
- Dapper (acceso a datos performante)
- JWT Authentication
- Docker
- Stored Procedures
- Background Jobs (Hosted Services)

Frontend
- React
- React Router
- TypeScript
- Axios / Fetch
- JWT (localStorage + interceptor)
- Vite

Testing
- xUnit
- Moq (unit tests)
- Testcontainers + PostgreSQL (integration / E2E backend)

---

## Arquitectura general

La solución sigue una arquitectura por capas inspirada en Clean Architecture / MVC, separando claramente responsabilidades:

Backend
- API
- Controllers
- Autenticación y autorización
- Background Workers (jobs de importación)
- Application
- DTOs
- Interfaces
- Servicios de aplicación
- Validaciones
- Infrastructure
- Repositorios Dapper
- Acceso a datos
- Bulk import (COPY)
- Domain
- Capa preparada para reglas de negocio futuras

Frontend
- App / Router
- Definición de rutas
- Layouts protegidos y públicos
- Features
- Productos
- Categorías
- Auth
- Core
- API client
- Manejo de errores
- Guards de seguridad
- Shared
- Componentes UI reutilizables
- Utilidades

---

## Decisiones técnicas y razones

1. Uso de DTOs (no exponer entidades)

Razón
- Evitar acoplar la API a la estructura interna del dominio.
- Facilitar versionado y cambios futuros.
- Control explícito de lo que se expone al cliente.

2. Stored Procedures + Dapper

Razón
- Performance superior para:
	- Paginación
	- Búsquedas
	- Escritura masiva
	- Menor overhead que ORMs completos.
	- Mayor control del SQL ejecutado.

Trade-off
- Menor portabilidad de DB.
- Se acepta porque PostgreSQL es un requerimiento explícito.

3. Importación masiva mediante Jobs asíncronos

Problema
- Importar 100.000+ productos en un request HTTP produce:
	- Timeouts
	- Alto consumo de memoria
	- Bloqueo de threads

Solución propuesta
- Flujo tipo Job:
	1.	El cliente sube el CSV
	2.	Se crea un job
	3.	Un worker procesa el archivo en background
	4.	Inserción por batches usando COPY
	5.	Persistencia del progreso

Beneficios
- No bloquea requests
- Escalable
- Tolerante a errores

4. COPY (PostgreSQL) para bulk insert

Razón
- Es el método más rápido de inserción masiva en PostgreSQL.
- Reduce overhead de roundtrips.
- Ideal para cargas de 100k+ filas.

5. JWT Authentication

Razón
- Stateless
- Fácil de escalar horizontalmente
- Compatible con SPA + API REST

Implementación
- Login → JWT
- Token almacenado en localStorage
- Interceptor adjunta Authorization header
- Todas las rutas (excepto login) están protegidas

6. Docker como entorno principal

Razón
- Homogeneidad entre entornos
- Facilidad de evaluación
- Reproducibilidad

7. Testing con Testcontainers

Razón
- Evita mocks irreales de base de datos.
- Pruebas contra PostgreSQL real.
- Misma infraestructura que producción.

---

## Base de datos

Los scripts SQL viven en /db y se ejecutan automáticamente al inicializar el contenedor PostgreSQL:

Incluyen:
- Esquema de tablas
- Índices
- Stored procedures
- Tabla de jobs (import_jobs)

Reinicializar completamente la DB:

```bash
docker compose down -v --remove-orphans
```

---

## Backend

La API expone endpoints REST seguros para productos, categorías y jobs.

Funcionalidades
- CRUD de categorías
- CRUD de productos
- Listado paginado con filtros y búsqueda
- Autenticación JWT
- Importación masiva asíncrona
- Seguimiento de jobs

📄 Documentación completa:
👉 backend/README.md

### Importación masiva (100k+ productos)

Flujo:
1.	Upload de CSV
2.	Creación de job
3.	Procesamiento en background
4.	Inserción masiva optimizada
5.	Consulta de progreso

Estados:
- Queued
- Processing
- Completed
- Failed

---

## Frontend

SPA en React que consume la API.

Funcionalidades
- Login
- Protección de rutas (AuthGuard)
- Gestión de productos y categorías
- Importación masiva y visualización de jobs
- Manejo centralizado de errores
- Interceptor JWT

📄 Documentación completa:
👉 frontend/README.md

---

## Pruebas

Unitarias
- Servicios de aplicación
- JWT
- Parsing y validación de CSV

Integración (E2E Backend)
- PostgreSQL real (Testcontainers)
- Stored procedures reales
- Repositorios Dapper

Ejecutar todas:

```bash
dotnet test backend/Asisya.sln
```

---

## Docker y ejecución

Ejecutar todo

```bash
docker compose up --build
```

Levanta:
- PostgreSQL
- Backend API
- Frontend

---

## CI/CD (pendiente)

Pipeline planeado:
- Build
- Tests
- Docker build
- Deploy

---

## Notas finales
- Proyecto diseñado para escalar horizontalmente
- Código organizado por responsabilidad
- Performance priorizada sobre abstracción innecesaria
- Decisiones técnicas documentadas y justificadas
