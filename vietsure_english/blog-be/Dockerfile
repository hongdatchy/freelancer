FROM node:18-alpine
# Cài đặt các thư viện hệ thống cần thiết cho các package ảnh của Strapi
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Cấu hình public-hoist-pattern cho pnpm thông qua .npmrc để chạy phẳng node_modules
RUN npm install -g pnpm && echo "public-hoist-pattern[]=" > .npmrc && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 1337

CMD ["pnpm", "start"]
