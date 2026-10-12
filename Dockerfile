# Use official lightweight Node.js 22 image
FROM node:22-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy package configuration
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy application files
COPY . .

# Run as non-root user for security
USER node

# Expose port (Cloud Run sets PORT automatically, defaults to 3000)
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
