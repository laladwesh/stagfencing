FROM node:22-alpine AS client-build
WORKDIR /app/client
ARG REACT_APP_GOOGLE_CLIENT_ID
ARG REACT_APP_STRIPE_PUBLISHABLE_KEY
ENV REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_STRIPE_PUBLISHABLE_KEY=$REACT_APP_STRIPE_PUBLISHABLE_KEY
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

COPY server.js ./
COPY server/ ./server/
COPY --from=client-build /app/client/build ./client/build

EXPOSE 3000
CMD ["node", "server.js"]
