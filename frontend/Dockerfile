# ---- сборка ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# --outDir переопределяет ../src/main/resources/static из vite.config.ts
RUN npx vite build --outDir dist --emptyOutDir

# ---- раздача (nginx без root, порт 8080) ----
FROM nginxinc/nginx-unprivileged:1.27-alpine
# адрес бэкенда подставляется при старте контейнера (envsubst для /etc/nginx/templates)
ENV BACKEND_URL=http://backend:1488
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
