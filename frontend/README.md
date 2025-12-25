# Asisya – Frontend (SPA React)

Frontend SPA para la gestión de productos, categorías e importaciones masivas, consumiendo la API REST de Asisya.

La aplicación está enfocada en:
- Experiencia de usuario clara
- Separación de responsabilidades
- Seguridad mediante JWT
- Escalabilidad y mantenibilidad

---

Tech Stack
- React 18
- TypeScript
- Vite
- React Router
- React Query
- Axios
- JWT Authentication
- Docker / Nginx

---

## Arquitectura Frontend

Se implementó una arquitectura feature-based, separando responsabilidades por dominio funcional.

```
src/
├── app/            # Configuración global (router, queryClient, error boundary)
├── api/            # API base / helpers compartidos
├── core/           # Infraestructura transversal (auth, http, errores)
├── features/       # Features por dominio
│   ├── auth/
│   ├── products/
│   ├── categories/
│   └── jobs/
├── shared/         # UI reutilizable y utils
├── store/          # Zustand stores (auth)
└── main.tsx
```

Decisiones clave
- Feature-based structure: facilita escalar el frontend por módulos.
- React Query: manejo eficiente de estado remoto, cache y refetch.
- Axios con interceptor:
  - Inyecta automáticamente el token JWT.
  - Maneja errores HTTP globales.
- Zustand: estado global mínimo (auth).
- Componentes UI desacoplados: reutilizables y simples.

---

Seguridad y Autenticación

JWT
- El usuario se autentica mediante /auth/login.
- El token JWT se guarda en memoria / storage controlado.
- Todas las requests al backend incluyen automáticamente el token mediante un Axios interceptor.

Protección de rutas

🔒 Todas las rutas de la aplicación están protegidas, excepto el login.
- Se implementó un AuthGuard que:
  - Verifica si existe token válido.
  - Redirige al login si el usuario no está autenticado.

Rutas protegidas:
- /products
- /products/create
- /products/:id/edit
- /categories
- /import
- /jobs/:id

Ruta pública:
- /login

---

Funcionalidades

Autenticación
- Login con usuario/contraseña.
- Manejo de sesión con JWT.
- Logout automático al expirar o recibir 401.

Productos
- Listado paginado.
- Filtros y búsqueda.
- Crear producto.
- Editar producto.
- Eliminar producto.

Categorías
- Crear categorías.
- Listado paginado.
- Selección en formularios de productos.

Importación masiva (CSV)
- Subida de archivo CSV.
- Creación de job asíncrono.
- Visualización de histórico de importaciones.
- Visualización de detalle del job:
- Estado
- Progreso
- Filas procesadas
- Errores

---

## Variables de entorno

Archivo .env (o .env.local):

VITE_API_URL=http://localhost:8080

En Docker, esta variable se inyecta en build-time.

---

## Ejecutar en local (sin Docker)

Requisitos:
- Node 18+
- Backend corriendo

```bash
cd frontend
npm install
npm run dev
```

App disponible en:

```
http://localhost:5173
```

---

## Build de producción

```bash
npm run build
```

Salida:

```
dist/
```

---

## Ejecutar con Docker (recomendado)

El frontend incluye un Dockerfile multi-stage con Nginx.

Build manual:

```bash
docker build -f frontend/Dockerfile -t asisya-frontend .
```

Normalmente se levanta desde el docker-compose.yml en la raíz del repo:

```bash
docker compose up --build
```

Frontend:

```bash
http://localhost:3000
```

Backend:

```bash
http://localhost:8080
```

---

Manejo de errores
- Errores HTTP se capturan globalmente.
- Mensajes amigables al usuario.
- Error Boundary para errores no controlados.

---

Notas finales
- El frontend está preparado para escalar:
- Nuevos features
- Nuevas rutas protegidas
- Nuevas APIs
- El diseño acompaña el modelo de jobs asíncronos del backend.
- Compatible con despliegue en cualquier cloud (S3 + CloudFront / Nginx / Docker).
