# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /home/node/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the remaining application code
COPY --chown=node:node . .

# Build the TypeScript code
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["node", "dist/index.js"]
