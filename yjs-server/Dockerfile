# syntax=docker/dockerfile:1

FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm install --no-save --no-package-lock esbuild \
    && npx esbuild src/index.ts \
        --bundle \
        --platform=node \
        --format=esm \
        --target=node22 \
        --packages=external \
        --outfile=dist/index.js


FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

EXPOSE 1234

CMD ["node", "dist/index.js"]
