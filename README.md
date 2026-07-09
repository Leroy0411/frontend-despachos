# Frontend Despacho — Innovatech Chile

Sistema de gestión logística de despachos. Interfaz web construida con React 18 + Vite + Tailwind CSS, servida por Nginx 1.27, desplegada en AWS ECS Fargate.

## 🌐 URL Pública

```
http://despachos-alb-1656417120.us-east-1.elb.amazonaws.com
```

## 🏗️ Arquitectura

```
Usuario → ALB (puerto 80) → ECS Fargate: frontend-despacho (Nginx, puerto 80)
                                   ↓ proxy /api/*
                            ALB → ECS Fargate: backend-despachos (puerto 8081)
```

| Componente | Tecnología | Servicio AWS |
|---|---|---|
| UI | React 18 + Vite + Tailwind | ECS Fargate |
| Servidor | Nginx 1.27-alpine | ECS Fargate |
| Proxy API | Nginx proxy_pass + envsubst | — |
| Imágenes | Docker multi-stage | Amazon ECR |
| CI/CD | GitHub Actions | ECR + ECS update-service |
| Logs | awslogs driver | CloudWatch: /ecs/frontend-despacho |

## 📦 Estructura del Proyecto

```
frontend-despacho/
├── src/
│   ├── main.jsx
│   ├── index.css
│   ├── Routes/
│   │   └── AppRoutes.jsx
│   └── componentes/
│       ├── CrudAdmin.jsx          ← Componente principal CRUD
│       └── CrudAdmin/
│           ├── TableDespachos.jsx
│           ├── FormDespacho.jsx
│           ├── Modal.jsx
│           └── SearchBar.jsx
├── Dockerfile                     ← Multi-stage: Node build + Nginx runtime
├── nginx.conf.template            ← Proxy /api/* con envsubst
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── deploy.yml
└── README.md
```

## 🚀 Funcionalidades

- Listado de despachos con búsqueda en tiempo real
- Crear nuevo despacho (modal con formulario)
- Editar despacho existente
- Eliminar despacho con confirmación
- Estados: Pendiente / En tránsito / Entregado / Cancelado

## 🐳 Docker

### Build local

```bash
docker build -t frontend-despacho .
```

### Variables de entorno

| Variable | Descripción | Valor en producción |
|---|---|---|
| BACKEND_URL | URL del backend para proxy Nginx | http://despachos-alb-1656417120.us-east-1.elb.amazonaws.com |

### Proxy Nginx (nginx.conf.template)

El frontend usa `envsubst` para inyectar el BACKEND_URL en runtime, eliminando IPs hardcodeadas:

```nginx
location /api/ {
    resolver 8.8.8.8 valid=30s;
    set $backend "${BACKEND_URL}";
    proxy_pass $backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

En `CrudAdmin.jsx` la URL de la API es relativa:
```javascript
const API_URL = '/api/despachos'
```

### Levantar entorno local completo

```bash
# Requiere tener el backend corriendo primero
# Clonar repo backend y seguir sus instrucciones

# Levantar frontend
docker run -p 80:80 \
  -e BACKEND_URL=http://localhost:8081 \
  lerotype04/frontend-despacho:latest

# O con docker compose desde el repo backend:
docker compose up -d
```

## ⚙️ Pipeline CI/CD

El pipeline se dispara automáticamente con cada `push` a la rama `deploy`:

```
push a rama deploy
    → Checkout código
    → Configurar credenciales AWS (IAM)
    → Login en Amazon ECR
    → Docker build multi-stage (Node build → Nginx runtime)
    → Push a ECR (:latest + :sha-{commit})
    → aws ecs update-service (rolling update sin downtime)
```

### Secrets requeridos en GitHub

| Secret | Descripción |
|---|---|
| AWS_ACCESS_KEY_ID | Credencial IAM AWS |
| AWS_SECRET_ACCESS_KEY | Clave secreta IAM |
| AWS_SESSION_TOKEN | Token de sesión (AWS Academy) |

## ☁️ Infraestructura AWS

| Recurso | ID / Valor |
|---|---|
| Región | us-east-1 |
| Clúster ECS | despachos-cluster (Fargate) |
| Task Definition | frontend-despacho:6 |
| ECR Repository | 617217798110.dkr.ecr.us-east-1.amazonaws.com/frontend-despacho |
| ALB DNS | despachos-alb-1656417120.us-east-1.elb.amazonaws.com |
| Security Group | sg-0cbf79226ff625605 (TCP 80 solo desde ALB) |
| Log Group | /ecs/frontend-despacho (CloudWatch) |
| IAM Role | arn:aws:iam::617217798110:role/LabRole |

## 📊 Autoscaling

- Tipo: Target Tracking (ECSServiceAverageCPUUtilization)
- Umbral: 50% CPU
- Mínimo: 1 task — Máximo: 3 tasks
- Cooldown scale-out: 60s — Cooldown scale-in: 300s

## 🔒 Seguridad

- Imagen base: `nginx:1.27-alpine` (minimalista)
- Puerto único expuesto: 80
- BACKEND_URL inyectada en runtime (no hardcodeada en el código)
- Security Group: puerto 80 accesible únicamente desde el ALB
- Headers de seguridad Nginx: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- Gzip habilitado para assets estáticos
- Cache configurado para assets con hash (1 año)

## 📝 Ramas

| Rama | Propósito |
|---|---|
| main | Código estable |
| deploy | Trigger del pipeline CI/CD |

## 🛠️ Stack Tecnológico

- React 18 + Vite
- Tailwind CSS
- Nginx 1.27-alpine
- Docker (multi-stage: Node 20-alpine + Nginx)
- GitHub Actions
- Amazon ECS Fargate + ECR + ALB + CloudWatch

