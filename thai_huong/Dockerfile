FROM node:20-alpine

WORKDIR /app

# Cài đặt libc6-compat để tương thích tốt nhất với Next.js trên Alpine
RUN apk add --no-cache libc6-compat

# Cài đặt pnpm bản 9 (cố định bản v9 ổn định, tránh chính sách supply-chain của v10)
RUN npm install -g pnpm@9

# Copy package metadata để cache layer dependencies
COPY package.json pnpm-lock.yaml* ./

# Cài đặt dependencies
RUN pnpm install --no-frozen-lockfile

# Copy toàn bộ source code
COPY . .

# Khi build trên server, chép file .env.prod thành .env để Next.js đóng gói cứng các biến NEXT_PUBLIC_
COPY .env.prod .env

# Build dự án bản production
RUN pnpm build

EXPOSE 3001

ENV PORT=3001
ENV NODE_ENV=production

CMD ["pnpm", "start"]
