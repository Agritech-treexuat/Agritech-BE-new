FROM node:18.18.2
WORKDIR /app
COPY package.json /app
RUN npm install
COPY ./app /app/app
COPY server.js /app
EXPOSE 8080
CMD cd /app && npm start
