FROM node:lts-alpine

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances
COPY package*.json ./

COPY prisma ./prisma/

RUN npm ci

#Générer le client Prisma
RUN npx prisma generate

# Copier le reste de l'application
COPY . .

# Exposer le port utilisé par l'application
EXPOSE 3000

# Variables d'environnement pour le hot reload sous Windows
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Commande de démarrage
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start:dev"]