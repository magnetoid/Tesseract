FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

ENV VITE_API_URL=http://localhost:3001

CMD ["npm", "run", "dev"]
