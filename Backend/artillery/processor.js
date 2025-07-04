"use strict";

/**
 * Fonctions de processeur pour Artillery
 */
module.exports = {
  // Fonction pour générer un email aléatoire
  generateRandomEmail: function (context, events, done) {
    // Initialiser context.vars s'il n'existe pas
    if (!context.vars) {
      context.vars = {};
    }

    const random = Math.floor(Math.random() * 100000);
    context.vars.randomEmail = `user${random}@test.com`;
    console.log(`Email généré: ${context.vars.randomEmail}`);
    return done();
  },
  // Fonction pour stocker le cookie d'authentification
  storeAuthCookie: function (requestParams, response, context, events, done) {
    // Initialiser context.vars s'il n'existe pas
    if (!context.vars) {
      context.vars = {};
    }

    if (response.headers["set-cookie"]) {
      context.vars.authCookie = response.headers["set-cookie"];
      console.log(`Cookie stocké: ${context.vars.authCookie}`);
    } else {
      console.log("Aucun cookie trouvé dans la réponse");
    }
    return done();
  },
  // Fonction pour logger les réponses
  logResponse: function (requestParams, response, context, events, done) {
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
    return done();
  },
};
