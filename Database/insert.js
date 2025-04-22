const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'greenroots',
  host: 'postgres', 
  database: 'greenroots',
  password: 'greenroots',
  port: 5432,
});

function cleanPrice(price) {
  if (typeof price === 'string') {
    return parseFloat(price.replace('€', '').trim().replace(',', '.'));
  }
  return null;
}

let categoryDataMap;
try {
  const categoryDataObject = require('./categories_img.js');
  categoryDataMap = categoryDataObject;
  console.log(`Données catégories chargées: ${Object.keys(categoryDataMap).length} catégories trouvées.`);
} catch (err) {
  console.error(`Erreur lors du chargement de ./categories_img.js: ${err.message}. Les images/descriptions ne seront pas ajoutées.`);
  categoryDataMap = {};
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function connectWithRetry(pool, maxRetries = 5, delay = 3000) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      const client = await pool.connect();
      console.log('Connexion à la base de données réussie.');
      return client;
    } catch (err) {
      if (err.code === '57P03') { 
        retries++;
        console.warn(`Base de données en cours de démarrage. Tentative ${retries}/${maxRetries} dans ${delay / 1000}s...`);
        await sleep(delay);
      } else {
        console.error('Erreur de connexion à la base de données:', err);
        throw err;
      }
    }
  }
  throw new Error(`Impossible de se connecter à la base de données après ${maxRetries} tentatives.`);
}

async function getOrCreateCategory(client, categoryName) {
  const formattedName = categoryName
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  try {
    const existingCategory = await client.query(
      `SELECT id, image, description FROM "Category" WHERE name = $1`,
      [formattedName]
    );

    if (existingCategory.rows.length > 0) {
      const categoryId = existingCategory.rows[0].id;
      const currentImage = existingCategory.rows[0].image;
      const currentDescription = existingCategory.rows[0].description;

      const categoryData = categoryDataMap[categoryName];
      const imageUrlFromMap = categoryData?.image;
      const descriptionFromMap = categoryData?.description;

      let updates = [];
      let values = [];
      let valueIndex = 1;

      if (currentImage === null && imageUrlFromMap) {
        updates.push(`image = $${valueIndex}`);
        values.push(imageUrlFromMap);
        valueIndex++;
      }
      if (currentDescription === null && descriptionFromMap) {
        updates.push(`description = $${valueIndex}`);
        values.push(descriptionFromMap);
        valueIndex++;
      }

      if (updates.length > 0) {
        values.push(categoryId);
        const updateQuery = `UPDATE "Category" SET ${updates.join(', ')} WHERE id = $${valueIndex}`;
        await client.query(updateQuery, values);
      }
      return categoryId;
    }

    // La catégorie n'existe pas, on la crée
    const categoryData = categoryDataMap[categoryName];
    const imageUrlFromMap = categoryData?.image;
    const descriptionFromMap = categoryData?.description;

    const newCategory = await client.query(
      `INSERT INTO "Category" (name, image, description) VALUES ($1, $2, $3) RETURNING id`,
      [formattedName, imageUrlFromMap || null, descriptionFromMap || null]
    );
    return newCategory.rows[0].id;

  } catch (err) {
    console.error(`Erreur lors de la gestion de la catégorie ${formattedName}:`, err);
    throw err;
  }
}

async function isDataBaseEmpty(client) {
  try {
    const result = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM "Category") as category_count,
        (SELECT COUNT(*) FROM "Product") as product_count
    `);
    
    const { category_count, product_count } = result.rows[0];
    return parseInt(category_count) === 0 && parseInt(product_count) === 0;
  } catch (err) {
    console.error('Erreur lors de la vérification des tables:', err);
    throw err;
  }
}

// Fonction pour parser le fichier categories_img.js
function parseImageFile(filePath) {
  const imageMap = new Map();
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    lines.forEach(line => {
      const parts = line.split('=');
      if (parts.length === 2) {
        const slug = parts[0].trim();
        const url = parts[1].trim().replace(/^'|'$/g, ''); // Nettoyer les apostrophes
        imageMap.set(slug, url);
      }
    });
  } catch (err) {
    console.error(`Erreur lors de la lecture ou du parsing de ${filePath}:`, err);
    // Continuer sans les images si le fichier est manquant ou corrompu
  }
  return imageMap;
}

async function insertData() {
  let client; // Déclarer client ici

  try {
    client = await connectWithRetry(pool);
  } catch (connectionError) {
    console.error('Échec de la connexion initiale à la base de données après plusieurs tentatives. Arrêt du script.');
    await pool.end(); // Fermer le pool si la connexion échoue
    return; // Arrêter l'exécution
  }

  try {
    const isEmpty = await isDataBaseEmpty(client);
    
    if (!isEmpty) {
      console.log('La base de données contient déjà des données. Arrêt de l\'import.');
      return;
    }

    console.log('Base de données vide, début de l\'import...');
    await client.query('BEGIN');

    // Charger la correspondance des images
    const imageMap = parseImageFile(path.join(__dirname, 'categories_img.js'));
    console.log(`Correspondance d'images chargée: ${imageMap.size} catégories trouvées.`);

    const fileContent = fs.readFileSync(__dirname + '/Data/arbres-willemse.jsonl', 'utf8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    
    console.log(`Nombre de produits à traiter: ${lines.length}`);
    let count = 0;

    for (const line of lines) {
      const data = JSON.parse(line);
      const characteristics = data.characteristics || {};
      const esthetique = characteristics.Esthétique || {};
      const jardinage = characteristics.Jardinage || {};
      const emplacement = characteristics.Emplacement || {};

      try {
        const categoryId = await getOrCreateCategory(client, data.category);

        const productResult = await client.query(`
          INSERT INTO "Product" (
            name,
            category,
            price,
            stock,
            short_description,
            detailed_description,
            height,
            flower_color,
            flowering_period,
            planting_distance,
            watering_frequency,
            planting_period,
            exposure,
            hardiness
          ) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          RETURNING id
        `, [
          data.name,
          categoryId,
          cleanPrice(data.price),
          data.stock,
          characteristics['Description courte'] || null,
          characteristics['Description détaillée'],
          esthetique['Hauteur à maturité'],
          esthetique['Couleur de la fleur'],
          esthetique['Période de floraison'],
          jardinage['Distance de plantation'],
          jardinage['Fréquence d\'arrosage'],
          jardinage['Période de plantation'],
          emplacement['Exposition'],
          jardinage['Rusticité']
        ]);

        const productId = productResult.rows[0].id;

        if (data.images && data.images.length > 0) {
          for (const image of data.images) {
            await client.query(
              `INSERT INTO "Image" (product_id, url, alt)
               VALUES ($1, $2, $3)`,
              [productId, image.url, image.alt]
            );
          }
        }

        count++;
        console.log(`Produit inséré: ${data.name} (${count}/${lines.length})`);
      } catch (err) {
        console.error(`Erreur lors de l'insertion de ${data.name}:`, err.message);

      }
    }

    await client.query('COMMIT');
    console.log(`Import terminé. ${count} produits insérés`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de l\'import:', err);
  } finally {
    if (client) { // Vérifier si client a été défini avant de release
        client.release();
    }
    await pool.end();
  }
}

console.log('Démarrage de la vérification et de l\'import...');
insertData().catch(console.error);
