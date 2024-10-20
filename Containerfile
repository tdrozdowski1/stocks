FROM registry.access.redhat.com/ubi8/nodejs-12:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Install all Angular dependacies
RUN npm ci

# Bundle app source
COPY . .

# Set permision of .angular file in container
VOLUME ["/project/.angular"]

# Expose the app on port 8080
EXPOSE 8080

# Serve the Angular app using http-server
CMD ["npm", "start"]
