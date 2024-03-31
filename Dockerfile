FROM alpine:3.19

# Set the desired Node.js version
ENV NODE_VERSION 20.12.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Node.js and npm
RUN apk add --update nodejs npm

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which your application will run
EXPOSE 8000

# Define the command to run your application
CMD [ "npm", "run", "dev" ]

