# Base image
FROM node:19.6-alpine3.17

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy the rest of the application code
COPY . .

# Build the TypeScript project
RUN npm run build

# Start the application
CMD ["node", "dist/index.js"]