# Frontend Despacho — Innovatech Chile

Aplicación web para gestión de despachos, desarrollada con React + Vite + Tailwind CSS.

## Stack
- React 18 + React Router 6
- Vite 5 (bundler)
- Tailwind CSS 3
- Nginx (producción)
- Docker (multi-stage build)
- GitHub Actions (CI/CD)

## Levantar localmente

```bash
# Instalar dependencias
npm install

# Desarrollo (con hot reload)
npm run dev
# → http://localhost:5173

# Build de producción
npm run build
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_BASE_URL` | URL del backend de despachos | `http://IP-PRIVADA-EC2:8081` |

Crear un archivo `.env` local (no subir al repo):
```
VITE_API_BASE_URL=http://localhost:8081
```

## Levantar con Docker

```bash
# Build de la imagen
docker build --build-arg VITE_API_BASE_URL=http://localhost:8081 -t frontend-despacho .

# Correr el contenedor
docker run -p 80:80 frontend-despacho

# → http://localhost:80
```

## CI/CD Pipeline

Se activa con `push` a la rama `deploy`:

```
push → deploy
  ├── Build imagen Docker (Node→Nginx, multi-stage)
  ├── Inyecta VITE_API_BASE_URL en tiempo de build
  ├── Push a Docker Hub
  └── SSH a EC2 → docker pull + docker compose up
```

### Secrets requeridos en GitHub

| Secret | Descripción |
|---|---|
| `DOCKERHUB_USERNAME` | Usuario Docker Hub |
| `DOCKERHUB_TOKEN` | Token de acceso Docker Hub |
| `EC2_HOST_FRONTEND` | IP pública de EC2 Frontend |
| `EC2_USER` | Usuario SSH (ec2-user / ubuntu) |
| `EC2_SSH_KEY` | Clave privada PEM |
| `VITE_API_BASE_URL` | IP privada del backend en EC2 |

## Dockerfile — Decisiones técnicas

- **Multi-stage build**: etapa `builder` con Node genera el `dist/`; etapa `runtime` usa solo Nginx Alpine (~23MB)
- **VITE_API_BASE_URL como ARG**: la URL del backend se inyecta en tiempo de build (no en runtime), porque Vite la embebe en el JS compilado
- **Usuario no-root**: `nginxuser:nginxgroup` por seguridad
- **SPA routing en Nginx**: `try_files $uri $uri/ /index.html` permite que React Router maneje todas las rutas



---
*ISY1101 — Introducción a Herramientas DevOps | DuocUC 2025*



