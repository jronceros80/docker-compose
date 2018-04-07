FROM node:8
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install -g @angular/cli@latest && npm cache clean
COPY . /usr/src/app
EXPOSE 4200
CMD ["npm","start"]
