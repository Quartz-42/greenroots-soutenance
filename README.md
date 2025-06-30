# PROJET GREENROOTS

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et démarré
- [Git](https://git-scm.com/) installé
- [Node.js](https://nodejs.org/) v18+ (optionnel, pour développement local)

## Initialisation du projet

Cloner le projet depuis le repository Git

Créer un fichier docker.env à la racine du projet en s'inspirant du fichier .env.example présent dans le repo

Lancer Docker Desktop

Dans le terminal, à la racine, lancer la commande : "docker compose up --build"

Les images des différents services vont se créer et le projet va démarrer

!! Il peut manquer certaines dépendances qu'il faut réinstaller une fois le projet démarré. Dans le terminal faire :

```
 cd .\Backend\api_greenroots\
 npx prisma generate
 npx prisma generate --sql
```

**Explication :**

- `npx prisma generate` : Génère le client Prisma TypeScript standard
- `npx prisma generate --sql` : Génère les fonctions TypeScript type-safe pour les requêtes SQL brutes (feature TypedSQL)

> Le projet utilise **TypedSQL** (preview feature) qui permet d'écrire des requêtes SQL dans des fichiers `.sql` et de générer automatiquement des fonctions TypeScript type-safe pour ces requêtes.

Ensuite faire :

```
 cd .\Frontend\nextjs_greenroots\
npm i --save-dev @types/node @types/react @types/react-dom --force
```

**Explication :**

Cela permet de réinstaller les dépendances TypeScript pour le dev. Le passage en mode force est pour éviter les conflits entre certains sytèmes d'exploitation (Linux/Windows)

## Test du projet

Une fois ces étapes réalisées on peut accéder aux différents services :

- Le frontend à l'adresse : http://localhost:5556/
- Le backend à l'adresse : http://localhost:3000/api
- La BDD à l'adresse : http://localhost:8080/

La base de données est livrée ave un jeu de données comportant des Produits, des Catégories et des Images. Un utilisateur test est créé avec un rôle défini.
