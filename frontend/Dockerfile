# Build stage
FROM node:16-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install ALL dependencies, including devDependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
