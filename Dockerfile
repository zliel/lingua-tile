# Slim Node.js image as the base image
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies and devDependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set the environment variable to work with cicd workflow
ARG VITE_APP_API_BASE
ARG VITE_FARO_URL
ARG VITE_FARO_APP_NAME
ARG VITE_FARO_API_ENDPOINT
ARG VITE_FARO_APP_ID
ARG VITE_FARO_STACK_ID
ARG VITE_FARO_API_KEY
ENV VITE_APP_API_BASE=$VITE_APP_API_BASE
ENV VITE_FARO_URL=$VITE_FARO_URL
ENV VITE_FARO_APP_NAME=$VITE_FARO_APP_NAME
ENV VITE_FARO_API_ENDPOINT=$VITE_FARO_API_ENDPOINT
ENV VITE_FARO_APP_ID=$VITE_FARO_APP_ID
ENV VITE_FARO_STACK_ID=$VITE_FARO_STACK_ID
ENV VITE_FARO_API_KEY=$VITE_FARO_API_KEY

RUN npm run build

# Use Nginx to serve the application
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
