FROM node:24-alpine

# Install dependencies for sharp and other native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install backend dependencies and generate Prisma Client
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Install frontend dependencies
COPY Frontend/Strategy-Solution/package*.json ./Frontend/Strategy-Solution/
RUN npm install --prefix Frontend/Strategy-Solution

# Copy the rest of the application code (except what's in .dockerignore)
COPY . .

# Build the frontend
RUN npm run build --prefix Frontend/Strategy-Solution

# Ensure uploads directory exists and is writable
RUN mkdir -p uploads && chmod 777 uploads

# Expose the application port
EXPOSE 3000

# Run migrations and start the server
CMD npx prisma migrate deploy && node index.js
