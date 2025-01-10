# Use the Puppeteer base image
FROM ghcr.io/puppeteer/puppeteer:latest

# Set the user to root
USER root

# Set working directory
WORKDIR /app

# Install Node.js and npm (make sure to install a version that includes npx)
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Verify installation of node and npx
RUN node -v && npm -v && npx -v

# Copy package.json and lock file
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Download the latest available Chrome for Testing binary corresponding to the Stable channel.
RUN npx @puppeteer/browsers install chrome@stable

# Copy the entire project into the container
COPY . .

# Expose necessary ports (if needed for testing)
EXPOSE 3000

# Run tests as the default command
CMD ["pnpm", "run", "test:e2e"]
