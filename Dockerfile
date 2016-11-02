FROM node:6-onbuild
ARG PORT
# replace this with your application's default port
EXPOSE ${PORT}
