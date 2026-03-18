FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production

# Install OpenSSL 3.x for Prisma (Alpine 3.17+ only has openssl 3.x)
RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Use a dummy PostgreSQL URL for prisma generate (it only needs the provider, not a real connection)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"

# Generate Prisma client (uses linux-musl-openssl-3.0.x binary) and build Next.js
RUN npx prisma generate && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install OpenSSL 3.x for Prisma runtime (compatible with linux-musl-openssl-3.0.x binary target)
RUN apk add --no-cache openssl

# Create a non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy standalone server and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy messages directory for next-intl (required at runtime)
COPY --from=builder /app/messages ./messages

# Copy Prisma schema and generated client (required at runtime)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
