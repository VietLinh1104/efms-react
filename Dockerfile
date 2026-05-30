# ==========================================
# STAGE 1: Build stage
# ==========================================
# Using slim image instead of alpine to avoid memory fragmentation issues with musl libc
FROM node:22-slim AS build

# Install pnpm
RUN corepack enable && corepack prepare pnpm@11.5.0 --activate

WORKDIR /app

# Copy package configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Limit memory and network concurrency to prevent exit code 228 (Out of Memory / Disk Space) on low-resource VPS
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Declare Build Arguments (Vite requires variables at build time)
ARG VITE_PUBLIC_API_URL_IDENTITY
ARG VITE_PUBLIC_API_URL_CORE
ARG VITE_PUBLIC_API_URL_COMMON
ARG VITE_R2_ACCOUNT_ID
ARG VITE_R2_ACCESS_KEY_ID
ARG VITE_R2_SECRET_ACCESS_KEY
ARG VITE_R2_BUCKET_NAME
ARG VITE_R2_PUBLIC_URL

# Expose them to Node environment for the bundler (Vite)
ENV VITE_PUBLIC_API_URL_IDENTITY=$VITE_PUBLIC_API_URL_IDENTITY
ENV VITE_PUBLIC_API_URL_CORE=$VITE_PUBLIC_API_URL_CORE
ENV VITE_PUBLIC_API_URL_COMMON=$VITE_PUBLIC_API_URL_COMMON
ENV VITE_R2_ACCOUNT_ID=$VITE_R2_ACCOUNT_ID
ENV VITE_R2_ACCESS_KEY_ID=$VITE_R2_ACCESS_KEY_ID
ENV VITE_R2_SECRET_ACCESS_KEY=$VITE_R2_SECRET_ACCESS_KEY
ENV VITE_R2_BUCKET_NAME=$VITE_R2_BUCKET_NAME
ENV VITE_R2_PUBLIC_URL=$VITE_R2_PUBLIC_URL

# Build the React application
RUN pnpm run build

# ==========================================
# STAGE 2: Production environment
# ==========================================
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from Stage 1 to Nginx default public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose Nginx container port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
