# # Build stage
# FROM node:22-alpine AS builder
# WORKDIR /app
# COPY package.json ./
# # RUN npm install --production
# RUN npm install
# COPY . .
# RUN npm run build

# # Production stage
# FROM node:22-alpine
# WORKDIR /app
# COPY --from=builder /app ./
# EXPOSE 3000
# CMD ["npm", "start"]
# # CMD ["node", "node_modules/next/dist/bin/next", "start"]


FROM node:22-alpine AS base
RUN mkdir -p /app
WORKDIR /app

ENV NODE_ENV=production

USER root

COPY public ./public
COPY .next/standalone .
COPY .next/static ./.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]