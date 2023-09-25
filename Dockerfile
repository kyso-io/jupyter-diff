# Builder image
FROM node:16.15.1-alpine3.16 AS builder
ENV PUBLIC_URL=/kyjupdiff
# Install rimraf
RUN npm install -g rimraf 
# Change the working directory to /app
WORKDIR /app
# Copy files required to build the application
COPY . .
# Execute `npm ci` with an externally mounted npmrc
RUN npm install
# Now do the build
RUN echo Using $PUBLIC_URL as public url
RUN npm run clean && npm run build
# Iff we are able to use the exported application we could add the following:
#   && npm run export
# and use the out/ dir as the exported application.

# production environment
FROM nginx:stable-alpine
ENV PUBLIC_URL=/kyjupdiff
# Set the NODE_ENV value from the args
ARG NODE_ENV=production
## Export the NODE_ENV to the container environment
ENV NODE_ENV=${NODE_ENV}
### Change the working directory to /app
COPY --from=builder /app/dist /usr/share/nginx/html$PUBLIC_URL
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
RUN echo Using $PUBLIC_URL as public url

CMD ["nginx", "-g", "daemon off;"]
