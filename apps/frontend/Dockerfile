FROM node:18-bullseye

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build
EXPOSE 5173
CMD ["pnpm", "dev", "--host"]
