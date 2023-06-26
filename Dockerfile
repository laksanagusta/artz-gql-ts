FROM node:16-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock .env.example .env ./
RUN yarn install

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner

# ENV DATABASE_URL postgresql://postgres:tQLJGKjsFVzmzN2IA02P@containers-us-west-207.railway.app:5673/railway

ENV JWT_SECRET_KEY rabbit

ENV PORT 4000

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.example .
COPY --from=builder /app/.env .
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

USER node

EXPOSE 4000

CMD ["yarn", "start"]