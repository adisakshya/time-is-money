# Dockerfile

# Base
FROM node:latest as BASE

# Create app directory
WORKDIR /usr/src/manager

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000
CMD [ "npm", "start", "--host", "0.0.0.0" ]