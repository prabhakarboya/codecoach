# Base image with Ubuntu 22.04
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Remove conflicting packages and install system dependencies & language runtimes/compilers
RUN apt-get update && \
    apt-get remove -y nodejs libnode-dev npm && \
    apt-get install -y \
    curl \
    gnupg \
    python3 python3-pip \
    default-jdk \
    build-essential \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js latest version via Nodesource
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy package.json files for npm install caching
COPY package*.json ./

# Install node modules (using npm ci for consistency)
RUN npm ci --only=production

# Copy remaining application files
COPY . .

# Expose your backend port (adjust if needed)
EXPOSE 5000

# Default command to start your backend server
CMD ["node", "server.js"]
