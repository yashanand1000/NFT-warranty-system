# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN chown -R node.node /app
COPY . .
EXPOSE 3000
CMD ["npm", "start"]