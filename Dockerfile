# Global Dockerfile Arguments (in our CI can be overriden in ./.build-args)
ARG BUILDER_IMG=registry.kyso.io/kyso-io/microfrontends/jupyter-diff
ARG BUILDER_TAG=builder
ARG SERVICE_IMG=registry.kyso.io/docker/node
ARG SERVICE_TAG=latest

# Builder image
FROM ${BUILDER_IMG}:${BUILDER_TAG} AS builder
# Install rimraf
RUN npm install -g rimraf 
# Change the working directory to /app
WORKDIR /app
# Copy files required to build the application
COPY . .
# Execute `npm ci` with an externally mounted npmrc
RUN --mount=type=secret,id=npmrc,target=/app/.npmrc,required npm ci
# Now do the build
RUN npm run clean && npm run build
# Iff we are able to use the exported application we could add the following:
#   && npm run export
# and use the out/ dir as the exported application.

# production environment
FROM nginx:stable-alpine
# Set the NODE_ENV value from the args
ARG NODE_ENV=production
## Export the NODE_ENV to the container environment
ENV NODE_ENV=${NODE_ENV}
### For security reasons don't run as root
USER node

### Change the working directory to /app
COPY --chown=node:node from=build /app/dist /usr/share/nginx/html
COPY --chown=node:node from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
