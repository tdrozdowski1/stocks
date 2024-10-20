FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the Angular app
RUN npm run build

# Expose the app on port 8080
EXPOSE 8080

# Serve the Angular app using http-server
RUN npm install -g http-server
CMD ["http-server", "dist/your-app-name"]
