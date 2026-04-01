# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY src ./src

RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g http-server

COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["http-server", "dist", "-p", "5173"]
