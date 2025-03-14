const fs = require('fs');
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

async function getOrCreateCategory(client, categoryName) {
  const formattedName = categoryName
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  try {
    const existingCategory = await client.query(
      `SELECT id FROM "Category" WHERE name = $1`,
      [formattedName]
    );

    if (existingCategory.rows.length > 0) {
      return existingCategory.rows[0].id;
    }

    const newCategory = await client.query(
      `INSERT INTO "Category" (name) VALUES ($1) RETURNING id`,
      [formattedName]
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

async function insertData() {
  const client = await pool.connect();
  
  try {
    const isEmpty = await isDataBaseEmpty(client);
    
    if (!isEmpty) {
      console.log('La base de données contient déjà des données. Arrêt de l\'import.');
      return;
    }

    console.log('Base de données vide, début de l\'import...');
    await client.query('BEGIN');

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
    client.release();
    await pool.end();
  }
}

console.log('Démarrage de la vérification...');
insertData().catch(console.error);
