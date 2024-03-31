# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app/backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application code
COPY . .

# Expose port (adjust as needed)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]

# docker build -t backend_image ./backend
# docker run -p 3000:3000 backend_image
