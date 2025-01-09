# Use the Puppeteer base image
FROM ghcr.io/puppeteer/puppeteer:20.8.1

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the entire project into the container
COPY . .

# Expose necessary ports (if needed for testing)
EXPOSE 3000

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Run tests as the default command
CMD ["pnpm", "run", "test:e2e"]
