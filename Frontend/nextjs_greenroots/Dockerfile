FROM node:18

WORKDIR /app

RUN npm install next@latest react@latest react-dom@latest

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5556

CMD ["npm", "run", "dev"]