-- Requete de recherche des produits limite a 10 resultats
SELECT 
  p.*,
  c."name" as category_name
FROM "Product" p
LEFT JOIN "Category" c ON p.category = c.id
WHERE 
  LOWER(TRANSLATE(p."name", 'àáâçèéêëÇÈÉ', 'aaaceeeeCEE')) 
  LIKE LOWER(TRANSLATE($1, 'àáâçèéêëÇÈÉ', 'aaaceeeeCEE'))
  OR
  LOWER(TRANSLATE(c."name", 'àáâçèéêëÇÈÉ', 'aaaceeeeCEE')) 
  LIKE LOWER(TRANSLATE($1, 'àáâçèéêëÇÈÉ', 'aaaceeeeCEE'))
ORDER BY p."name"
LIMIT $2          