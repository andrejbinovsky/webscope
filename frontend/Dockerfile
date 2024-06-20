FROM node:21

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm install --global pnpm@latest && \
    pnpm config set store-dir /root/.local/share/pnpm/store


WORKDIR /app
