FROM node:8
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npm install pm2 -g
# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 2000
CMD [ "pm2-runtime", "server.js" ]
