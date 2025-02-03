# Use an official Node.js runtime as a base image
FROM node:18

# Create a new user with a specific UID and GID
RUN groupadd -r cwuser && useradd -r -m -g cwuser cwuser

# Set the working directory inside the container
WORKDIR /home/cwuser/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the remaining application code and set ownership
COPY --chown=cwuser:cwuser . .

# Ensure the /home/cwuser/app directory is writable
RUN chown -R cwuser:cwuser /home/cwuser/app

# Build the TypeScript code
RUN npm run build

# Change to the cwuser user
USER cwuser

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["node", "dist/index.js"]
