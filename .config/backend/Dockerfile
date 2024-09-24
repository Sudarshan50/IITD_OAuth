# Use Node.js version 18 as the base image
FROM node:18

# Set the working directory inside the container to /app
WORKDIR /app

# Install pm2 globally
RUN npm install pm2@latest -g

# Copy package.json and package-lock.json from the src folder to the /app directory
COPY ./src/package*.json ./

# Install the dependencies
RUN npm install

# Copy all the source code from the src directory to the /app directory
COPY ./src .

# Expose the port on which the application runs (adjust if needed)
EXPOSE 3000

# Start the app using PM2 in runtime mode and use all available CPU cores (-i 0)
CMD ["pm2-runtime", "start", "index.js", "-i", "0"]