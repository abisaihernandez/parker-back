# Development stage
FROM node:23-alpine AS development

WORKDIR /usr/src/app

COPY . .
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

ENV PATH=/usr/src/app/node_modules/.bin:$PATH

EXPOSE 3000

ENV NODE_ENV=development


CMD ["sh", "./entrypoint.sh"]

#########################################

# Production stage
FROM node:23-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

ENV PATH=/usr/src/app/node_modules/.bin:$PATH

# Copy built source code
COPY ./dist ./dist
COPY ./entrypoint.sh .
COPY ./drizzle.config.ts .
COPY ./src/db/schema ./src/db/schema
COPY ./drizzle ./drizzle

EXPOSE 3000

ENV NODE_ENV=production

CMD ["sh", "./entrypoint.sh"]
