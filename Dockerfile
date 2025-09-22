# Étape 1 : Build de l'app
FROM node:22 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_URL_API
ENV VITE_URL_API=${VITE_URL_API}
RUN npm run build

# Étape 2 : Serveur nginx
FROM nginx:stable-alpine

# Copie du build vers nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copie d'une config nginx (optionnelle mais conseillé)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
