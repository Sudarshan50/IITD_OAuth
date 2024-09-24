# Use Node.js version 18 as the base image
FROM node:18

# Set the working directory inside the container to /app/src
WORKDIR /app/src

# Install pm2 globally
RUN npm install pm2@latest -g

# Copy only the package.json and package-lock.json to the working directory
COPY ./src/package*.json ./

# Install the dependencies
RUN npm install

# Copy all source code from the src directory to the /app/src directory inside the container
COPY ./src .

# Start the app using PM2 in runtime mode and use all available CPU cores (-i 0)
CMD ["pm2-runtime", "start", "index.js", "-i", "0"]