-- Requete de recherche et de comptage des produits

SELECT 
  p.*,
  c."name" as category_name,
  (COUNT(*) OVER())::INTEGER as total_count
FROM "Product" p
LEFT JOIN "Category" c ON p.category = c.id
WHERE 
  LOWER(TRANSLATE(p."name", 'àáâçèéêëÇÈÉ', 'aaaceeeeCEE')) 
  LIKE LOWER(TRANSLATE($1, 'àáâçèéêëÇÈÉ', 'aaaceeeeCEE'))
  OR
  LOWER(TRANSLATE(c."name", 'àáâçèéêëÇÈÉ', 'aaaceeeeCEE')) 
  LIKE LOWER(TRANSLATE($1, 'àáâçèéêëÇÈÉ', 'aaaceeeeCEE'))
LIMIT $2
OFFSET $3