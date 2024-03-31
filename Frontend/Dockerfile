# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application code
COPY . .

# Expose port
EXPOSE 5173

# Command to run the application
CMD ["npm", "run", "dev"]

# docker build -t frontend_image ./frontend
# docker run -p 5173:5173 frontend_image

