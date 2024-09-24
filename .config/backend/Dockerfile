FROM node:18
WORKDIR /app
RUN npm install pm2@latest -g
COPY ./src/package*.json ./
RUN npm install
COPY ./src .
EXPOSE 3000
CMD ["pm2-runtime", "start", "index.js", "-i", "0"]