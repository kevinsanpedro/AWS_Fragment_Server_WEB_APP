#use node version 16.15.0
FROM node:16.15.0 AS dependencies

LABEL maintainer="kevin san pedro <kpsanpedro@myseneca.ca>" 
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/

# Install node dependencies defined in package-lock.json
# using --mount=type=cache,target=/root/.npm,id=npm will help to increase the rebuild layer (building) was 10s to 4.8s
# using npm ci instead of npm install, it increase the speed and save a space 
# using npm cache clean to force it to clean out npm cache this will give extra space
RUN --mount=type=cache,target=/root/.npm,id=npm npm ci && \
npm cache clean --force

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD npm run dev

# We run our service on port 8080
EXPOSE 8080

#health check
HEALTHCHECK --interval=10s --timeout=30s --start-period=5s --retries=3 CMD  curl --fail localhost:8080 || exit 1 


