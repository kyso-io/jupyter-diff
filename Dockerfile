# Global Dockerfile Arguments (in our CI can be overriden in ./.build-args)
ARG BUILDER_IMG=registry.kyso.io/kyso-io/microfrontends/jupyter-diff
ARG BUILDER_TAG=builder
ARG SERVICE_IMG=registry.kyso.io/docker/node
ARG SERVICE_TAG=latest
ENV PUBLIC_URL=/kyjupdiff

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
RUN echo Using $PUBLIC_URL as public url
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
### Change the working directory to /app
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
RUN echo Using $PUBLIC_URL as public url

CMD ["nginx", "-g", "daemon off;"]
