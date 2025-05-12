# Flux de Paiement Stripe Simplifié (Sans Webhooks)

Ce document décrit le processus de paiement avec Stripe pour une application avec un front-end en Next.js et un back-end en Nest.js. L'objectif est de gérer la redirection vers Stripe, la création d'une commande en base de données avec l'ID de session Stripe, et la gestion basique des retours succès/annulation.

## Contexte

*   **Front-end**: Next.js
*   **Back-end**: Nest.js
*   **Base de données**: PostgreSQL (avec une table `Purchase` contenant une colonne `stripe_id` pour stocker l'ID de session de checkout Stripe).

## Étapes du Flux de Paiement

### 1. Page Checkout (Front-end)

*   L'utilisateur se trouve sur la page de checkout (`/checkout`) et a rempli les informations nécessaires (panier, adresse, etc.).
*   Un bouton "Procéder au paiement" est affiché.

### 2. Appel à l'API pour Créer la Session Stripe (Front-end vers Back-end)

*   Lorsque l'utilisateur clique sur "Procéder au paiement" :
    *   Le front-end effectue un appel API (par exemple, `POST /api/payments/create-checkout-session`) vers le back-end.
    *   Cet appel envoie les informations nécessaires, notamment le montant total à payer et potentiellement les informations pour créer ou identifier la commande (`Purchase`) en base de données.

### 3. Création de la Session de Checkout Stripe (Back-end)

*   Le back-end reçoit la requête du front-end.
*   Il interagit avec l'API Stripe pour créer une session de checkout :
    *   Il fournit à Stripe le montant à payer, les devises, et les URLs de redirection.
    *   `success_url: ${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}` (Stripe remplacera `{CHECKOUT_SESSION_ID}` par le véritable ID de session).
    *   `cancel_url: ${process.env.FRONTEND_URL}/payment/cancel`
*   Stripe retourne les détails de la session créée, y compris son ID (`id`) et l'URL de redirection (`url`).
*   Le back-end **doit** :
    1.  Créer une nouvelle entrée dans la table `Purchase` (ou mettre à jour une commande existante) en y stockant l'ID de la session Stripe (`id` retourné par Stripe) dans la colonne `stripe_id`. Il est important que la commande soit initialisée (avec `user_id`, `address`, `postalCode`, `city`, `total` etc.) avant cette étape.
    2.  Retourner l'URL de la session de checkout Stripe (`url` retournée par Stripe) au front-end.

### 4. Redirection vers Stripe (Front-end)

*   Le front-end reçoit l'URL de la session de checkout Stripe depuis la réponse de l'API back-end.
*   Le front-end redirige l'utilisateur vers cette URL. L'utilisateur quitte alors le site pour aller sur la page de paiement sécurisée de Stripe.

### 5. Processus de Paiement sur Stripe

*   L'utilisateur complète le formulaire de paiement sur le site de Stripe.
*   Selon le résultat du paiement, Stripe redirige l'utilisateur vers l'une des deux URLs fournies (`success_url` ou `cancel_url`).

### 6. Gestion du Retour de Stripe (Front-end)

#### a. Cas de Succès (`/payment/success?session_id=...`)

*   L'utilisateur est redirigé vers la page `/payment/success` du front-end, avec l'ID de session Stripe dans les paramètres de l'URL (par exemple, `?session_id=cs_test_xxxx`).
*   Sur cette page, le front-end doit :
    1.  Récupérer la `session_id` depuis l'URL.
    2.  **Simuler une vérification** : Idéalement, cette étape impliquerait un appel au back-end pour vérifier la session. Pour cette première version simplifiée, on peut imaginer une vérification où le front-end (ou le back-end si un appel est fait) compare cette `session_id` avec celle qui a été stockée en base de données pour la commande associée (il faudra un moyen de retrouver cette commande, potentiellement via l'utilisateur connecté ou un identifiant de commande transmis).
        *   *Note : Cette vérification côté client est basique. La validation robuste via webhooks sera implémentée plus tard pour confirmer le paiement de manière sécurisée et mettre à jour le statut de la commande en `payé`.*
    3.  Si la `session_id` (ou la vérification simulée) est considérée comme valide :
        *   L'utilisateur est redirigé vers la page de récapitulatif de commande : `${process.env.FRONTEND_URL}/recapitulatif?id=${purchase.id}` (où `${purchase.id}` est l'ID de la commande en base de données).

#### b. Cas d'Annulation/Échec (`/payment/cancel`)

*   L'utilisateur est redirigé vers la page `/payment/cancel` du front-end.
*   Cette page affiche un message indiquant que le paiement a été annulé ou a échoué, et propose à l'utilisateur de réessayer ou de retourner au panier.

## Prochaines Étapes (Non couvertes ici)

*   Implémentation des webhooks Stripe pour une confirmation de paiement robuste et la mise à jour du statut de la commande côté back-end.
*   Gestion plus détaillée des erreurs et des statuts de commande.
