FROM node:18-bullseye

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build 
# Especify environment
CMD ["sh", "-c", "pnpm start:${NODE_ENV:-prod}"]
