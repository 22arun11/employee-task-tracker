# Use the official Node.js image
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 4200
EXPOSE 4200

# Set environment to development
ENV NODE_ENV=development

# Start the Angular development server
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200"]