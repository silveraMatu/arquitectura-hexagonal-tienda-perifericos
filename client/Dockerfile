# ---- builder: install dependencies and build the Next.js app ----
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

# NEXT_PUBLIC_* vars are inlined into the browser bundle at build time, so this
# must be set here (not at container runtime) and must point to a host-reachable
# URL, since it's the user's browser (not the Docker network) that calls it.
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

COPY . .
RUN npm run build

# ---- runtime: only the standalone output (own pruned node_modules, no npm install here) ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
