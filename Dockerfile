# Stage 1: Build Angular App
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app with production configuration
RUN npm run build -- --prod

# Stage 2: Serve Angular App
FROM nginx:alpine

# Copy the built Angular app from the previous stage to the NGINX folder
COPY --from=build /app/dist/PayDirectFrontend /usr/share/nginx/html

# Copy custom NGINX configuration file if you have one (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port that NGINX will serve on
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
