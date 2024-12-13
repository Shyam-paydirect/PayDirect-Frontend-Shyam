FROM node:lts

WORKDIR /usr/src/app

COPY . /usr/src/app

EXPOSE 80

RUN npm install

CMD ["npm", "run", "dev"]