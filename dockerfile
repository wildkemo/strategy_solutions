FROM node:24-alpine

WORKDIR /app

# Install dependencies for both root and frontend
COPY package*.json ./
RUN npm install

COPY Frontend/Strategy-Solution/package*.json ./Frontend/Strategy-Solution/
RUN npm install --prefix Frontend/Strategy-Solution
   
# Copy source code and build
COPY . .
RUN npm run build --prefix Frontend/Strategy-Solution

EXPOSE 3000

# Run migrations and start the server
CMD npx prisma migrate deploy && node index.js
