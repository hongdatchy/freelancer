FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN echo "public-hoist-pattern[]=" > .npmrc && pnpm install --frozen-lockfile

COPY . .

# Khi build trên server, chép file .env.prod thành .env để Next.js đóng gói cứng
COPY .env.prod .env

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
