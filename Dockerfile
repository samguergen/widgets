FROM node:14 as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.21-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
