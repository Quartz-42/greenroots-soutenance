'use strict';

/**
 * Fonctions de processeur pour Artillery
 */
module.exports = {
  // Fonction pour générer un email aléatoire
  generateRandomEmail: function(requestParams, context, ee, next) {
    const random = Math.floor(Math.random() * 100000);
    // On fixe directement dans context.vars et non dans une propriété avec $
    context.vars.randomEmail = `user${random}@test.com`;
    console.log(`Email généré: ${context.vars.randomEmail}`);
    return next();
  },

  // Fonction pour générer une chaîne aléatoire
  generateRandomString: function(requestParams, context, ee, next) {
    const length = 8;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // On fixe directement dans context.vars et non dans une propriété avec $
    context.vars.randomString = result;
    console.log(`Chaîne générée: ${context.vars.randomString}`);
    return next();
  },

  // Fonction pour stocker le cookie d'authentification
  storeAuthCookie: function(requestParams, response, context, ee, next) {
    if (response.headers['set-cookie']) {
      context.vars.authCookie = response.headers['set-cookie'];
      console.log(`Cookie stocké: ${context.vars.authCookie}`);
    } else {
      console.log('Aucun cookie trouvé dans la réponse');
    }
    return next();
  },

  // Fonction pour logger les réponses
  logResponse: function(requestParams, response, context, ee, next) {
    console.log(`Réponse de ${requestParams.url}: ${response.statusCode}`);
    if (response.statusCode >= 400) {
      console.log(`Erreur: ${response.statusCode} pour ${requestParams.url}`);
      if (response.body) {
        try {
          console.log(`Corps: ${JSON.stringify(response.body)}`);
        } catch (e) {
          console.log(`Corps: ${response.body}`);
        }
      }
    }
    return next();
  },
  
  // Fonction pour préparer une valeur à capturer
  beforeCapture: function(requestParams, response, context, ee, next) {
    if (response.body) {
      try {
        // Afficher le corps de la réponse pour le débogage
        console.log(`Réponse JSON: ${JSON.stringify(response.body)}`);
      } catch (e) {
        console.log('Impossible de parser le corps de la réponse');
      }
    }
    return next();
  }
}; 