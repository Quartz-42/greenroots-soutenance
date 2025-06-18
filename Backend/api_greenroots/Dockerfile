FROM node:lts-alpine3.18

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances en deux étapes pour tirer parti du cache Docker
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste de l'application
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Exposer le port utilisé par l'application
EXPOSE 3000

# Commande de démarrage
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start:dev"]

