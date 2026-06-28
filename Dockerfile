# =========================================================
# STAGE 1 — BUILD
# =========================================================
FROM node:20-alpine AS builder

LABEL stage="builder"

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ARG VITE_API_BASE_URL=http://localhost:8081
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# =========================================================
# STAGE 2 — RUNTIME (Nginx)
# =========================================================
FROM nginx:1.27-alpine AS runtime

LABEL maintainer="Innovatech Chile"
LABEL service="frontend-despacho"
LABEL version="1.0"

RUN rm /etc/nginx/conf.d/default.conf

# Copiamos como template para que envsubst inyecte BACKEND_URL al arrancar
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

COPY --from=builder /app/dist /usr/share/nginx/html

# Usuario no-root
RUN addgroup -S nginxgroup && adduser -S nginxuser -G nginxgroup \
    && chown -R nginxuser:nginxgroup /usr/share/nginx/html \
    && chown -R nginxuser:nginxgroup /var/cache/nginx \
    && chown -R nginxuser:nginxgroup /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown -R nginxuser:nginxgroup /var/run/nginx.pid

# Valor por defecto, se sobreescribe en docker-compose
ENV BACKEND_URL=http://localhost:8081

USER nginxuser

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]