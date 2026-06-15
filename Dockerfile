# Base image with Node.js
FROM node:18-bullseye-slim

# Install system dependencies (GCC/G++, Python, Java JDK)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    openjdk-17-jdk-headless \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package descriptors first to leverage caching
COPY package.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies for backend and frontend
RUN npm run install-backend
# Ensure frontend devDependencies (vite, plugins) are installed during build
# Some build systems set production=true during Docker builds which skips devDeps.
# Force npm to install devDependencies for the frontend step.
RUN npm_config_production=false npm install --prefix frontend --no-package-lock

# Copy the rest of the source files
COPY . .

# Build the frontend assets
RUN npm run build-frontend

# Expose backend port
EXPOSE 5000

# Start unified server
CMD ["npm", "start"]
