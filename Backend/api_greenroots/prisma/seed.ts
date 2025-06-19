import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  //seeding des roles
  await prisma.role.createMany({
    data: [{ name: 'Admin' }, { name: 'User' }],
    skipDuplicates: true, // évite les erreurs si déjà présent
  });

  console.log('✔ Rôles insérés avec succès');

  //seeding des catégories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Arbres à fleurs',
        description:
          'Des arbres magnifiques qui illuminent votre jardin de leurs fleurs éclatantes.',
        image: 'Database/IMG/arbres_a_fleurs.webp',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Arbres persistants',
        description:
          "Gardez un coin de verdure toute l'année avec nos arbres au feuillage persistant.",
        image: 'Database/IMG/arbres_persistants.webp',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Grands arbres',
        description:
          "Apportez de la majesté et de l'ombre à votre jardin avec nos grands arbres.",
        image: 'Database/IMG/grands_arbres.webp',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Petits arbres',
        description:
          'Parfaits pour les petits espaces ou pour structurer vos massifs, découvrez nos petits arbres.',
        image: 'Database/IMG/petits_arbres.webp',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Acacias',
        description:
          'Élégance et légèreté avec les acacias, aux fleurs souvent parfumées.',
        image: 'Database/IMG/arbre_de_judee.webp',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bouleaux',
        description:
          "L'écorce décorative et le feuillage léger des bouleaux pour un jardin lumineux.",
        image: 'Database/IMG/bouleau_betula_lat.webp',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Cerisiers du Japon',
        description:
          'La féerie des cerisiers en fleurs, symbole emblématique du printemps japonais.',
        image: 'Database/IMG/cerisier_du_japon.webp',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Conifères',
        description:
          'Structure et verdure persistante, les conifères sont les alliés de votre jardin en toute saison.',
        image: 'Database/IMG/pexels-aratuc-nash.webp',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Chênes',
        description:
          'Force et noblesse du chêne, un arbre emblématique et durable.',
        image: 'Database/IMG/chene_quercus_lat.webp',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Érables',
        description:
          "Des couleurs flamboyantes à l'automne et des formes variées, découvrez les érables.",
        image: 'Database/IMG/pexels-lerkrat-tangsri.webp',
      },
    }),
  ]);

  console.log('Categories créées:', categories.length);

  //seeding des produits (5 par catégorie)
  const products = await Promise.all([
    // Arbres à fleurs (catégorie 1)
    prisma.product.create({
      data: {
        name: 'Magnolia de Soulanges',
        category: 1,
        price: 45.9,
        stock: 12,
        short_description:
          'Magnifique magnolia aux grandes fleurs rose et blanc.',
        detailed_description:
          'Le Magnolia de Soulanges offre une floraison spectaculaire au printemps avec ses grandes fleurs parfumées. Idéal en isolé dans un jardin.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pommier à fleurs Red Sentinel',
        category: 1,
        price: 32.5,
        stock: 18,
        short_description:
          'Pommier décoratif aux fleurs roses et fruits rouges.',
        detailed_description:
          'Arbre ornemental produisant de belles fleurs roses au printemps suivies de petites pommes décoratives rouges persistant en hiver.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Prunier à fleurs Pissardii',
        category: 1,
        price: 28.9,
        stock: 15,
        short_description:
          'Prunier décoratif au feuillage pourpre et fleurs roses.',
        detailed_description:
          'Remarquable pour son feuillage pourpre et sa floraison rose tendre au printemps. Très décoratif toute la saison.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Lilas des Indes',
        category: 1,
        price: 24.9,
        stock: 20,
        short_description: 'Floraison estivale généreuse en grappes colorées.',
        detailed_description:
          'Arbuste vigoureux offrant une longue floraison estivale en panicules roses, blanches ou mauves. Très résistant à la sécheresse.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Catalpa boule',
        category: 1,
        price: 65.0,
        stock: 8,
        short_description:
          'Arbre boule aux grandes feuilles et fleurs blanches.',
        detailed_description:
          'Forme en boule parfaite avec de grandes feuilles cordiformes et une floraison blanche parfumée en juin.',
      },
    }),

    // Arbres persistants (catégorie 2)
    prisma.product.create({
      data: {
        name: 'Laurier-cerise Novita',
        category: 2,
        price: 18.9,
        stock: 25,
        short_description: 'Arbuste persistant idéal pour haies denses.',
        detailed_description:
          "Feuillage vert brillant toute l'année, croissance rapide. Parfait pour créer des haies occultantes et brise-vent.",
      },
    }),
    prisma.product.create({
      data: {
        name: 'Photinia Red Robin',
        category: 2,
        price: 22.5,
        stock: 30,
        short_description: 'Feuillage rouge flamboyant au printemps.',
        detailed_description:
          'Jeunes pousses rouge vif au printemps devenant vert brillant. Floraison blanche parfumée. Très décoratif en haie.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Eleagnus ebbingei',
        category: 2,
        price: 16.9,
        stock: 22,
        short_description: 'Arbuste persistant aux feuilles argentées.',
        detailed_description:
          'Feuillage panaché vert et crème, très lumineux. Fleurs parfumées en automne. Résistant au vent et aux embruns.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Viburnum tinus',
        category: 2,
        price: 19.9,
        stock: 28,
        short_description: 'Floraison hivernale blanche et parfumée.',
        detailed_description:
          'Arbuste persistant fleurissant de novembre à mars. Fleurs blanches parfumées suivies de baies bleues décoratives.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Abelia grandiflora',
        category: 2,
        price: 21.9,
        stock: 18,
        short_description: "Floraison longue et parfumée tout l'été.",
        detailed_description:
          'Petit arbuste semi-persistant à la floraison blanche rosée très parfumée de juin aux gelées. Port gracieux et léger.',
      },
    }),

    // Grands arbres (catégorie 3)
    prisma.product.create({
      data: {
        name: 'Platane commun',
        category: 3,
        price: 85.0,
        stock: 6,
        short_description: 'Arbre majestueux pour grands espaces.',
        detailed_description:
          "Arbre vigoureux au port étalé, idéal pour l'ombrage. Écorce décorative se desquamant. Résistant à la pollution urbaine.",
      },
    }),
    prisma.product.create({
      data: {
        name: 'Tilleul de Hollande',
        category: 3,
        price: 75.5,
        stock: 8,
        short_description: "Arbre d'alignement au parfum enivrant.",
        detailed_description:
          "Grand arbre au port pyramidal, floraison parfumée en juin attirant les abeilles. Excellent pour l'alignement et les parcs.",
      },
    }),
    prisma.product.create({
      data: {
        name: 'Marronnier blanc',
        category: 3,
        price: 68.9,
        stock: 10,
        short_description: 'Spectaculaire floraison printanière en chandelles.',
        detailed_description:
          'Arbre emblématique aux grandes feuilles palmées et floraison en épis blancs dressés. Production de marrons décoratifs.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Liquidambar',
        category: 3,
        price: 72.0,
        stock: 7,
        short_description: "Couleurs d'automne exceptionnelles.",
        detailed_description:
          'Arbre au feuillage palmé prenant des teintes flamboyantes en automne : jaune, orange, rouge, pourpre. Très décoratif.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Tulipier de Virginie',
        category: 3,
        price: 89.9,
        stock: 5,
        short_description: 'Arbre rare aux fleurs en forme de tulipe.',
        detailed_description:
          'Arbre majestueux aux feuilles lobées originales et fleurs jaune-vert en forme de tulipe. Croissance rapide, très ornemental.',
      },
    }),

    // Petits arbres (catégorie 4)
    prisma.product.create({
      data: {
        name: 'Érable du Japon Bloodgood',
        category: 4,
        price: 45.0,
        stock: 15,
        short_description: 'Feuillage rouge pourpre toute la saison.',
        detailed_description:
          "Petit érable au feuillage finement découpé rouge pourpre. Port gracieux, idéal en bac ou petit jardin. Couleurs d'automne flamboyantes.",
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cornouiller à fleurs',
        category: 4,
        price: 38.5,
        stock: 12,
        short_description: 'Floraison blanche spectaculaire au printemps.',
        detailed_description:
          'Petit arbre aux grandes bractées blanches très décoratives. Feuillage prenant de belles teintes automnales rouge orangé.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Amélanchier du Canada',
        category: 4,
        price: 32.9,
        stock: 18,
        short_description: 'Floraison blanche suivie de baies comestibles.',
        detailed_description:
          "Petit arbre à la floraison blanche abondante au printemps. Baies comestibles et feuillage aux couleurs d'automne remarquables.",
      },
    }),
    prisma.product.create({
      data: {
        name: 'Arbre de Judée',
        category: 4,
        price: 42.0,
        stock: 14,
        short_description: 'Fleurs roses directement sur le tronc.',
        detailed_description:
          'Spectaculaire floraison rose violet au printemps, directement sur le tronc et les branches. Feuilles en forme de cœur très décoratives.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Savonnier de Chine',
        category: 4,
        price: 36.9,
        stock: 16,
        short_description: 'Floraison jaune et fruits décoratifs roses.',
        detailed_description:
          'Petit arbre original aux fleurs jaunes parfumées et fruits roses en forme de lanternes. Très résistant à la sécheresse.',
      },
    }),

    // Acacias (catégorie 5)
    prisma.product.create({
      data: {
        name: 'Acacia dealbata Mimosa',
        category: 5,
        price: 29.9,
        stock: 20,
        short_description: "Floraison jaune parfumée en fin d'hiver.",
        detailed_description:
          "Feuillage persistant finement découpé bleu-vert. Floraison jaune d'or très parfumée dès février. Croissance rapide.",
      },
    }),
    prisma.product.create({
      data: {
        name: 'Robinier faux-acacia',
        category: 5,
        price: 34.5,
        stock: 16,
        short_description: 'Grappes de fleurs blanches parfumées.',
        detailed_description:
          'Arbre vigoureux aux feuilles composées et floraison blanche en grappes pendantes très parfumées. Mellifère exceptionnel.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Acacia Baileyana',
        category: 5,
        price: 31.9,
        stock: 18,
        short_description: 'Feuillage bleu argenté et fleurs jaunes.',
        detailed_description:
          'Mimosa au feuillage persistant bleu argenté très décoratif. Floraison jaune vif parfumée en hiver. Port gracieux.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sophora japonica',
        category: 5,
        price: 38.9,
        stock: 12,
        short_description: 'Arbre pagode aux fleurs blanches tardives.',
        detailed_description:
          'Grand arbre au port étalé, floraison blanche parfumée en août-septembre. Très résistant à la pollution et à la sécheresse.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Gleditsia triacanthos',
        category: 5,
        price: 42.5,
        stock: 10,
        short_description: 'Févier sans épines au feuillage léger.',
        detailed_description:
          'Arbre au feuillage finement composé créant une ombre légère. Très résistant aux conditions urbaines difficiles.',
      },
    }),

    // Bouleaux (catégorie 6)
    prisma.product.create({
      data: {
        name: "Bouleau blanc de l'Himalaya",
        category: 6,
        price: 48.9,
        stock: 12,
        short_description: 'Écorce blanche exceptionnellement pure.',
        detailed_description:
          "Bouleau remarquable par son écorce d'un blanc pur. Feuillage vert tendre devenant jaune doré en automne. Très décoratif.",
      },
    }),
    prisma.product.create({
      data: {
        name: 'Bouleau verruqueux',
        category: 6,
        price: 35.5,
        stock: 18,
        short_description: "Bouleau commun à l'écorce caractéristique.",
        detailed_description:
          "Arbre élégant à l'écorce blanche marquée de lenticelles noires. Feuillage léger et port gracieux. Très rustique.",
      },
    }),
    prisma.product.create({
      data: {
        name: "Bouleau pleureur Young's",
        category: 6,
        price: 52.9,
        stock: 8,
        short_description: 'Port pleureur très décoratif.',
        detailed_description:
          "Bouleau au port pleureur marqué, branches retombantes jusqu'au sol. Écorce blanche et feuillage fin très gracieux.",
      },
    }),
    prisma.product.create({
      data: {
        name: 'Bouleau pubescent',
        category: 6,
        price: 32.9,
        stock: 15,
        short_description: 'Bouleau des sols calcaires.',
        detailed_description:
          'Bouleau adapté aux sols calcaires, écorce blanche moins marquée. Feuillage duveteux et port élégant. Très résistant.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Bouleau noir',
        category: 6,
        price: 41.5,
        stock: 10,
        short_description: 'Écorce décorative brun-rouge.',
        detailed_description:
          "Bouleau original à l'écorce brun-rouge se desquamant en lamelles. Feuillage vert brillant, très ornemental et résistant.",
      },
    }),

    // Cerisiers du Japon (catégorie 7)
    prisma.product.create({
      data: {
        name: 'Cerisier Kanzan',
        category: 7,
        price: 45.9,
        stock: 14,
        short_description: 'Fleurs doubles roses spectaculaires.',
        detailed_description:
          'Cerisier à fleurs doubles rose vif, floraison abondante en avril-mai. Port étalé et feuillage bronze au débourrement.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cerisier Shirotae',
        category: 7,
        price: 42.5,
        stock: 16,
        short_description: 'Fleurs blanches doubles parfumées.',
        detailed_description:
          'Cerisier aux grandes fleurs blanches doubles très parfumées. Port étalé horizontal très décoratif. Floraison précoce.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cerisier pleureur',
        category: 7,
        price: 65.0,
        stock: 6,
        short_description: 'Port pleureur et floraison rose.',
        detailed_description:
          'Cerisier greffé sur tige au port pleureur très gracieux. Floraison rose tendre abondante couvrant les branches retombantes.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cerisier Yoshino',
        category: 7,
        price: 38.9,
        stock: 18,
        short_description: 'Floraison blanche nuagée de rose.',
        detailed_description:
          'Cerisier vigoureux aux fleurs simples blanc rosé très abondantes. Feuillage prenant de belles teintes automnales.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cerisier Amanogawa',
        category: 7,
        price: 48.9,
        stock: 12,
        short_description: 'Port colonnaire et fleurs roses parfumées.',
        detailed_description:
          'Cerisier au port colonnaire unique, idéal pour petits espaces. Fleurs semi-doubles roses parfumées. Très décoratif.',
      },
    }),

    // Conifères (catégorie 8)
    prisma.product.create({
      data: {
        name: 'Épicéa de Norvège',
        category: 8,
        price: 28.9,
        stock: 25,
        short_description: 'Conifère traditionnel de croissance rapide.',
        detailed_description:
          'Grand conifère au port pyramidal régulier. Aiguilles vert foncé persistantes. Parfait pour haies brise-vent et grands espaces.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pin sylvestre',
        category: 8,
        price: 32.5,
        stock: 20,
        short_description: "Pin rustique à l'écorce orangée.",
        detailed_description:
          'Conifère très rustique reconnaissable à son écorce orange-rouge dans la partie haute. Aiguilles bleu-vert, très résistant.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Thuya géant',
        category: 8,
        price: 24.9,
        stock: 30,
        short_description: 'Conifère idéal pour haies persistantes.',
        detailed_description:
          'Thuya à croissance rapide, feuillage vert brillant persistant. Parfait pour créer des haies occultantes denses et régulières.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cèdre du Liban',
        category: 8,
        price: 55.0,
        stock: 8,
        short_description: 'Conifère majestueux aux branches étagées.',
        detailed_description:
          'Arbre emblématique au port tabulaire caractéristique. Aiguilles persistantes vert sombre. Très longévif et décoratif.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sapin de Nordmann',
        category: 8,
        price: 35.9,
        stock: 22,
        short_description: 'Sapin aux aiguilles non piquantes.',
        detailed_description:
          'Conifère aux aiguilles plates vert brillant non piquantes. Port pyramidal régulier. Très apprécié comme sapin de Noël.',
      },
    }),

    // Chênes (catégorie 9)
    prisma.product.create({
      data: {
        name: 'Chêne pédonculé',
        category: 9,
        price: 58.9,
        stock: 12,
        short_description: 'Chêne emblématique de nos forêts.',
        detailed_description:
          'Grand arbre au port majestueux, feuillage lobé vert devenant brun doré en automne. Glands sur pédoncules. Très longévif.',
      },
    }),
    prisma.product.create({
      data: {
        name: "Chêne rouge d'Amérique",
        category: 9,
        price: 52.5,
        stock: 15,
        short_description: "Couleurs d'automne flamboyantes.",
        detailed_description:
          'Chêne à croissance rapide, feuillage lobé prenant des teintes rouge écarlate en automne. Très décoratif et résistant.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Chêne vert',
        category: 9,
        price: 45.9,
        stock: 18,
        short_description: 'Chêne persistant méditerranéen.',
        detailed_description:
          'Chêne au feuillage persistant vert sombre, adapté aux climats secs. Port arrondi, très résistant à la sécheresse.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Chêne fastigié',
        category: 9,
        price: 68.0,
        stock: 8,
        short_description: 'Port colonnaire pour espaces restreints.',
        detailed_description:
          'Chêne au port colonnaire étroit, idéal pour alignements et petits espaces. Feuillage traditionnel du chêne pédonculé.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Chêne sessile',
        category: 9,
        price: 55.9,
        stock: 10,
        short_description: 'Chêne des terrains secs et calcaires.',
        detailed_description:
          'Chêne rustique aux glands sessiles, adapté aux sols calcaires et secs. Feuillage lobé vert sombre, port élégant.',
      },
    }),

    // Érables (catégorie 10)
    prisma.product.create({
      data: {
        name: 'Érable plane',
        category: 10,
        price: 48.9,
        stock: 16,
        short_description: 'Grand érable aux feuilles palmées.',
        detailed_description:
          'Grand arbre vigoureux aux larges feuilles palmées. Floraison jaune-vert printanière et couleurs automnales dorées.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Érable champêtre',
        category: 10,
        price: 32.5,
        stock: 20,
        short_description: 'Érable indigène de petite taille.',
        detailed_description:
          'Petit érable indigène au feuillage lobé fin. Couleurs automnales jaune-orange. Parfait pour haies champêtres.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Érable sycomore',
        category: 10,
        price: 42.9,
        stock: 14,
        short_description: 'Érable robuste à grandes feuilles.',
        detailed_description:
          'Grand érable aux feuilles palmées vert sombre. Très résistant au vent et aux embruns. Croissance rapide.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Érable à sucre',
        category: 10,
        price: 55.0,
        stock: 12,
        short_description: 'Couleurs automnales exceptionnelles.',
        detailed_description:
          'Érable nord-américain aux couleurs automnales flamboyantes : jaune, orange, rouge écarlate. Croissance lente mais remarquable.',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Érable negundo panaché',
        category: 10,
        price: 38.9,
        stock: 18,
        short_description: 'Feuillage panaché très lumineux.',
        detailed_description:
          'Érable au feuillage composé panaché vert et blanc-crème. Très lumineux, croissance rapide. Idéal pour éclairer un coin sombre.',
      },
    }),
  ]);

  console.log('✔ Produits créés:', products.length);

  // Mapping des catégories vers leurs images
  const categoryImages = {
    1: 'Database/IMG/arbres_a_fleurs.webp',
    2: 'Database/IMG/arbres_persistants.webp',
    3: 'Database/IMG/grands_arbres.webp',
    4: 'Database/IMG/petits_arbres.webp',
    5: 'Database/IMG/arbre_de_judee.webp',
    6: 'Database/IMG/bouleau_betula_lat.webp',
    7: 'Database/IMG/cerisier_du_japon.webp',
    8: 'Database/IMG/pexels-aratuc-nash.webp',
    9: 'Database/IMG/chene_quercus_lat.webp',
    10: 'Database/IMG/pexels-lerkrat-tangsri.webp',
  };

  // Créer les images pour chaque produit
  const imagePromises = products.map((product, index) => {
    return prisma.image.create({
      data: {
        name: categoryImages[product.category],
        alt: product.name,
        product_id: product.id,
      },
    });
  });

  const images = await Promise.all(imagePromises);
  console.log('✔ Images créées:', images.length);
}

//doc de prisma
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
