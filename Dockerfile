# Random node base
FROM node:slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and its variants (maybe lock?)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . /app

# Build the TypeScript project
RUN npm run build

# Expose the port for the app
EXPOSE 5000

# Start the application
CMD ["node", "dist/app.js"]