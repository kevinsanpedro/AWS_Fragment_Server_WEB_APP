#stage 0. install alpine linux + node

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

WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/


###########################################################################
# Stage 1: use dependencies to build the site
# Use /app as our working directory
FROM node:16.15.0 AS builder

WORKDIR /app
# Copy cached dependencies from previous stage so we don't have to download
COPY --from=dependencies /app /app


# Install node dependencies defined in package-lock.json
# using --mount=type=cache,target=/root/.npm,id=npm will help to increase the rebuild layer (building) was 10s to 4.8s
# using npm ci instead of npm install, it increase the speed and save a space 
# using npm cache clean to force it to clean out npm cache this will give extra space
RUN --mount=type=cache,target=/root/.npm,id=npm npm ci && \
  npm cache clean --force

################################################################################
# stage 2
# Start the container by running our server
#

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

CMD npm run dev

# We run our service on port 8080
EXPOSE 8080

#health check
#interval this will run every 10 second 
#timeout this is how long for the machine to wait when the app did not responce 
#start-period this is long for the container first booting up how long to wait 
#retries how many times it will try doing the health check before it gives up
#CMD  curl --fail localhost:8080 || exit 1  if localhost doesnt responce with a 200 it will exit code 1
HEALTHCHECK --interval=10s --timeout=20s --start-period=5s --retries=2 \ 
CMD  curl --fail localhost:8080 || exit 1 


