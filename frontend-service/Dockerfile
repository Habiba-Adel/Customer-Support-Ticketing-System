#this is called multistage build 


# ── Stage 1: Build the React app ──────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
# this produces /app/dist with all static files

# ── Stage 2: Serve with Nginx ──────────────────────────────────
FROM nginx:alpine

# copy built files from stage 1 into nginx's serving folder
COPY --from=builder /app/dist /usr/share/nginx/html

# copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]