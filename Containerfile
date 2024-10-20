# Use a base image that runs as a non-root user
FROM node:16

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install all Angular dependacies
RUN npm install

# Bundle app source
COPY . .

# Build the Angular app for production
RUN npm run build

# Set permision of .angular file in container
VOLUME ["/project/.angular"]

# Expose the app on port 8080
EXPOSE 8080

# Serve the Angular app using http-server
CMD ["npm", "start"]
