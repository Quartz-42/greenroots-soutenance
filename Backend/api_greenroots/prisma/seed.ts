import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Vérifier si des objets existent deja
  const existingCategories = await prisma.category.count();
  const existingRoles = await prisma.role.count();
  const existingProducts = await prisma.product.count();
  const existingImages = await prisma.image.count();
  const existingUsers = await prisma.user.count();
  const existingUserRoles = await prisma.userRole.count();

  if (
    existingCategories === 0 &&
    existingRoles === 0 &&
    existingProducts === 0 &&
    existingImages === 0 &&
    existingUsers === 0 &&
    existingUserRoles === 0
  ) {
    console.log('Première exécution - création des données...');

    //seeding des roles
    await prisma.role.createMany({
      data: [
        { name: 'Admin' },
        { name: 'User' }
      ],
      skipDuplicates: true,
    });

    // Récupérer le rôle Admin pour l'associer à l'utilisateur
    const adminRole = await prisma.role.findUniqueOrThrow({
      where: { name: 'Admin' }
    });

    //on cree un user admin pour test
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@test.fr',
        password: 'admin123'
      }
    });

    // on associe le user admin au role admin
    await prisma.userRole.create({
      data: {
        user_id: adminUser.id,
        role_id: adminRole.id
      }
    });

    //seeding des catégories (SÉQUENTIELLEMENT pour garantir l'ordre des IDs)
    const category1 = await prisma.category.create({
      data: {
        name: 'Arbres à fleurs',
        description:
          'Des arbres magnifiques qui illuminent votre jardin de leurs fleurs éclatantes.',
        image: '/Database/IMG/arbres_a_fleurs.webp',
      },
    });

    const category2 = await prisma.category.create({
      data: {
        name: 'Arbres persistants',
        description:
          "Gardez un coin de verdure toute l'année avec nos arbres au feuillage persistant.",
        image: '/Database/IMG/arbres_persistants.webp',
      },
    });

    const category3 = await prisma.category.create({
      data: {
        name: 'Grands arbres',
        description:
          "Apportez de la majesté et de l'ombre à votre jardin avec nos grands arbres.",
        image: '/Database/IMG/grands_arbres.webp',
      },
    });

    const category4 = await prisma.category.create({
      data: {
        name: 'Petits arbres',
        description:
          'Parfaits pour les petits espaces ou pour structurer vos massifs, découvrez nos petits arbres.',
        image: '/Database/IMG/petits_arbres.webp',
      },
    });

    const category5 = await prisma.category.create({
      data: {
        name: 'Acacias',
        description:
          'Élégance et légèreté avec les acacias, aux fleurs souvent parfumées.',
        image: '/Database/IMG/arbre_de_judee.webp',
      },
    });

    const category6 = await prisma.category.create({
      data: {
        name: 'Bouleaux',
        description:
          "L'écorce décorative et le feuillage léger des bouleaux pour un jardin lumineux.",
        image: '/Database/IMG/bouleau_betula_lat.webp',
      },
    });

    const category7 = await prisma.category.create({
      data: {
        name: 'Cerisiers du Japon',
        description:
          'La féerie des cerisiers en fleurs, symbole emblématique du printemps japonais.',
        image: '/Database/IMG/cerisier_du_japon.webp',
      },
    });

    const category8 = await prisma.category.create({
      data: {
        name: 'Conifères',
        description:
          'Structure et verdure persistante, les conifères sont les alliés de votre jardin en toute saison.',
        image: '/Database/IMG/pexels-aratuc-nash.webp',
      },
    });

    const category9 = await prisma.category.create({
      data: {
        name: 'Chênes',
        description:
          'Force et noblesse du chêne, un arbre emblématique et durable.',
        image: '/Database/IMG/chene_quercus_lat.webp',
      },
    });

    const category10 = await prisma.category.create({
      data: {
        name: 'Érables',
        description:
          "Des couleurs flamboyantes à l'automne et des formes variées, découvrez les érables.",
        image: '/Database/IMG/pexels-lerkrat-tangsri.webp',
      },
    });

    const categoryImages = {
      [category1.id]: '/Database/IMG/arbres_a_fleurs.webp',
      [category2.id]: '/Database/IMG/arbres_persistants.webp',
      [category3.id]: '/Database/IMG/grands_arbres.webp',
      [category4.id]: '/Database/IMG/petits_arbres.webp',
      [category5.id]: '/Database/IMG/arbre_de_judee.webp',
      [category6.id]: '/Database/IMG/bouleau_betula_lat.webp',
      [category7.id]: '/Database/IMG/cerisier_du_japon.webp',
      [category8.id]: '/Database/IMG/pexels-aratuc-nash.webp',
      [category9.id]: '/Database/IMG/chene_quercus_lat.webp',
      [category10.id]: '/Database/IMG/pexels-lerkrat-tangsri.webp',
    };

    const productsData = [
      // Arbres à fleurs
      {
        name: 'Magnolia de Soulanges',
        category: category1.id,
        price: 45.9,
        stock: 12,
        short_description:
          'Magnifique magnolia aux grandes fleurs rose et blanc.',
        detailed_description:
          'Le Magnolia de Soulanges offre une floraison spectaculaire au printemps avec ses grandes fleurs parfumées. Idéal en isolé dans un jardin.',
      },
      {
        name: 'Pommier à fleurs Red Sentinel',
        category: category1.id,
        price: 32.5,
        stock: 18,
        short_description:
          'Pommier décoratif aux fleurs roses et fruits rouges.',
        detailed_description:
          'Arbre ornemental produisant de belles fleurs roses au printemps suivies de petites pommes décoratives rouges persistant en hiver.',
      },
      {
        name: 'Prunier à fleurs Pissardii',
        category: category1.id,
        price: 28.9,
        stock: 15,
        short_description:
          'Prunier décoratif au feuillage pourpre et fleurs roses.',
        detailed_description:
          'Remarquable pour son feuillage pourpre et sa floraison rose tendre au printemps. Très décoratif toute la saison.',
      },
      {
        name: 'Lilas des Indes',
        category: category1.id,
        price: 24.9,
        stock: 20,
        short_description: 'Floraison estivale généreuse en grappes colorées.',
        detailed_description:
          'Arbuste vigoureux offrant une longue floraison estivale en panicules roses, blanches ou mauves. Très résistant à la sécheresse.',
      },
      {
        name: 'Catalpa boule',
        category: category1.id,
        price: 65.0,
        stock: 8,
        short_description:
          'Arbre boule aux grandes feuilles et fleurs blanches.',
        detailed_description:
          'Forme en boule parfaite avec de grandes feuilles cordiformes et une floraison blanche parfumée en juin.',
      },

      // Arbres persistants
      {
        name: 'Laurier-cerise Novita',
        category: category2.id,
        price: 18.9,
        stock: 25,
        short_description: 'Arbuste persistant idéal pour haies denses.',
        detailed_description:
          "Feuillage vert brillant toute l'année, croissance rapide. Parfait pour créer des haies occultantes et brise-vent.",
      },
      {
        name: 'Photinia Red Robin',
        category: category2.id,
        price: 22.5,
        stock: 30,
        short_description: 'Feuillage rouge flamboyant au printemps.',
        detailed_description:
          'Jeunes pousses rouge vif au printemps devenant vert brillant. Floraison blanche parfumée. Très décoratif en haie.',
      },
      {
        name: 'Eleagnus ebbingei',
        category: category2.id,
        price: 16.9,
        stock: 22,
        short_description: 'Arbuste persistant aux feuilles argentées.',
        detailed_description:
          'Feuillage panaché vert et crème, très lumineux. Fleurs parfumées en automne. Résistant au vent et aux embruns.',
      },
      {
        name: 'Viburnum tinus',
        category: category2.id,
        price: 19.9,
        stock: 28,
        short_description: 'Floraison hivernale blanche et parfumée.',
        detailed_description:
          'Arbuste persistant fleurissant de novembre à mars. Fleurs blanches parfumées suivies de baies bleues décoratives.',
      },
      {
        name: 'Abelia grandiflora',
        category: category2.id,
        price: 21.9,
        stock: 18,
        short_description: "Floraison longue et parfumée tout l'été.",
        detailed_description:
          'Petit arbuste semi-persistant à la floraison blanche rosée très parfumée de juin aux gelées. Port gracieux et léger.',
      },

      // Grands arbres
      {
        name: 'Platane commun',
        category: category3.id,
        price: 85.0,
        stock: 6,
        short_description: 'Arbre majestueux pour grands espaces.',
        detailed_description:
          "Arbre vigoureux au port étalé, idéal pour l'ombrage. Écorce décorative se desquamant. Résistant à la pollution urbaine.",
      },
      {
        name: 'Tilleul de Hollande',
        category: category3.id,
        price: 75.5,
        stock: 8,
        short_description: "Arbre d'alignement au parfum enivrant.",
        detailed_description:
          "Grand arbre au port pyramidal, floraison parfumée en juin attirant les abeilles. Excellent pour l'alignement et les parcs.",
      },
      {
        name: 'Marronnier blanc',
        category: category3.id,
        price: 68.9,
        stock: 10,
        short_description: 'Spectaculaire floraison printanière en chandelles.',
        detailed_description:
          'Arbre emblématique aux grandes feuilles palmées et floraison en épis blancs dressés. Production de marrons décoratifs.',
      },
      {
        name: 'Liquidambar',
        category: category3.id,
        price: 72.0,
        stock: 7,
        short_description: "Couleurs d'automne exceptionnelles.",
        detailed_description:
          'Arbre au feuillage palmé prenant des teintes flamboyantes en automne : jaune, orange, rouge, pourpre. Très décoratif.',
      },
      {
        name: 'Tulipier de Virginie',
        category: category3.id,
        price: 89.9,
        stock: 5,
        short_description: 'Arbre rare aux fleurs en forme de tulipe.',
        detailed_description:
          'Arbre majestueux aux feuilles lobées originales et fleurs jaune-vert en forme de tulipe. Croissance rapide, très ornemental.',
      },

      // Petits arbres
      {
        name: 'Érable du Japon Bloodgood',
        category: category4.id,
        price: 45.0,
        stock: 15,
        short_description: 'Feuillage rouge pourpre toute la saison.',
        detailed_description:
          "Petit érable au feuillage finement découpé rouge pourpre. Port gracieux, idéal en bac ou petit jardin. Couleurs d'automne flamboyantes.",
      },
      {
        name: 'Cornouiller à fleurs',
        category: category4.id,
        price: 38.5,
        stock: 12,
        short_description: 'Floraison blanche spectaculaire au printemps.',
        detailed_description:
          'Petit arbre aux grandes bractées blanches très décoratives. Feuillage prenant de belles teintes automnales rouge orangé.',
      },
      {
        name: 'Amélanchier du Canada',
        category: category4.id,
        price: 32.9,
        stock: 18,
        short_description: 'Floraison blanche suivie de baies comestibles.',
        detailed_description:
          "Petit arbre à la floraison blanche abondante au printemps. Baies comestibles et feuillage aux couleurs d'automne remarquables.",
      },
      {
        name: 'Arbre de Judée',
        category: category4.id,
        price: 42.0,
        stock: 14,
        short_description: 'Fleurs roses directement sur le tronc.',
        detailed_description:
          'Spectaculaire floraison rose violet au printemps, directement sur le tronc et les branches. Feuilles en forme de cœur très décoratives.',
      },
      {
        name: 'Savonnier de Chine',
        category: category4.id,
        price: 36.9,
        stock: 16,
        short_description: 'Floraison jaune et fruits décoratifs roses.',
        detailed_description:
          'Petit arbre original aux fleurs jaunes parfumées et fruits roses en forme de lanternes. Très résistant à la sécheresse.',
      },

      // Acacias
      {
        name: 'Acacia dealbata Mimosa',
        category: category5.id,
        price: 29.9,
        stock: 20,
        short_description: "Floraison jaune parfumée en fin d'hiver.",
        detailed_description:
          "Feuillage persistant finement découpé bleu-vert. Floraison jaune d'or très parfumée dès février. Croissance rapide.",
      },
      {
        name: 'Robinier faux-acacia',
        category: category5.id,
        price: 34.5,
        stock: 16,
        short_description: 'Grappes de fleurs blanches parfumées.',
        detailed_description:
          'Arbre vigoureux aux feuilles composées et floraison blanche en grappes pendantes très parfumées. Mellifère exceptionnel.',
      },
      {
        name: 'Acacia Baileyana',
        category: category5.id,
        price: 31.9,
        stock: 18,
        short_description: 'Feuillage bleu argenté et fleurs jaunes.',
        detailed_description:
          'Mimosa au feuillage persistant bleu argenté très décoratif. Floraison jaune vif parfumée en hiver. Port gracieux.',
      },
      {
        name: 'Sophora japonica',
        category: category5.id,
        price: 38.9,
        stock: 12,
        short_description: 'Arbre pagode aux fleurs blanches tardives.',
        detailed_description:
          'Grand arbre au port étalé, floraison blanche parfumée en août-septembre. Très résistant à la pollution et à la sécheresse.',
      },
      {
        name: 'Gleditsia triacanthos',
        category: category5.id,
        price: 42.5,
        stock: 10,
        short_description: 'Févier sans épines au feuillage léger.',
        detailed_description:
          'Arbre au feuillage finement composé créant une ombre légère. Très résistant aux conditions urbaines difficiles.',
      },

      // Bouleaux
      {
        name: "Bouleau blanc de l'Himalaya",
        category: category6.id,
        price: 48.9,
        stock: 12,
        short_description: 'Écorce blanche exceptionnellement pure.',
        detailed_description:
          "Bouleau remarquable par son écorce d'un blanc pur. Feuillage vert tendre devenant jaune doré en automne. Très décoratif.",
      },
      {
        name: 'Bouleau verruqueux',
        category: category6.id,
        price: 35.5,
        stock: 18,
        short_description: "Bouleau commun à l'écorce caractéristique.",
        detailed_description:
          "Arbre élégant à l'écorce blanche marquée de lenticelles noires. Feuillage léger et port gracieux. Très rustique.",
      },
      {
        name: "Bouleau pleureur Young's",
        category: category6.id,
        price: 52.9,
        stock: 8,
        short_description: 'Port pleureur très décoratif.',
        detailed_description:
          "Bouleau au port pleureur marqué, branches retombantes jusqu'au sol. Écorce blanche et feuillage fin très gracieux.",
      },
      {
        name: 'Bouleau pubescent',
        category: category6.id,
        price: 32.9,
        stock: 15,
        short_description: 'Bouleau des sols calcaires.',
        detailed_description:
          'Bouleau adapté aux sols calcaires, écorce blanche moins marquée. Feuillage duveteux et port élégant. Très résistant.',
      },
      {
        name: 'Bouleau noir',
        category: category6.id,
        price: 41.5,
        stock: 10,
        short_description: 'Écorce décorative brun-rouge.',
        detailed_description:
          "Bouleau original à l'écorce brun-rouge se desquamant en lamelles. Feuillage vert brillant, très ornemental et résistant.",
      },

      // Cerisiers du Japon
      {
        name: 'Cerisier Kanzan',
        category: category7.id,
        price: 45.9,
        stock: 14,
        short_description: 'Fleurs doubles roses spectaculaires.',
        detailed_description:
          'Cerisier à fleurs doubles rose vif, floraison abondante en avril-mai. Port étalé et feuillage bronze au débourrement.',
      },
      {
        name: 'Cerisier Shirotae',
        category: category7.id,
        price: 42.5,
        stock: 16,
        short_description: 'Fleurs blanches doubles parfumées.',
        detailed_description:
          'Cerisier aux grandes fleurs blanches doubles très parfumées. Port étalé horizontal très décoratif. Floraison précoce.',
      },
      {
        name: 'Cerisier pleureur',
        category: category7.id,
        price: 65.0,
        stock: 6,
        short_description: 'Port pleureur et floraison rose.',
        detailed_description:
          'Cerisier greffé sur tige au port pleureur très gracieux. Floraison rose tendre abondante couvrant les branches retombantes.',
      },
      {
        name: 'Cerisier Yoshino',
        category: category7.id,
        price: 38.9,
        stock: 18,
        short_description: 'Floraison blanche nuagée de rose.',
        detailed_description:
          'Cerisier vigoureux aux fleurs simples blanc rosé très abondantes. Feuillage prenant de belles teintes automnales.',
      },
      {
        name: 'Cerisier Amanogawa',
        category: category7.id,
        price: 48.9,
        stock: 12,
        short_description: 'Port colonnaire et fleurs roses parfumées.',
        detailed_description:
          'Cerisier au port colonnaire unique, idéal pour petits espaces. Fleurs semi-doubles roses parfumées. Très décoratif.',
      },

      // Conifères
      {
        name: 'Épicéa de Norvège',
        category: category8.id,
        price: 28.9,
        stock: 25,
        short_description: 'Conifère traditionnel de croissance rapide.',
        detailed_description:
          'Grand conifère au port pyramidal régulier. Aiguilles vert foncé persistantes. Parfait pour haies brise-vent et grands espaces.',
      },
      {
        name: 'Pin sylvestre',
        category: category8.id,
        price: 32.5,
        stock: 20,
        short_description: "Pin rustique à l'écorce orangée.",
        detailed_description:
          'Conifère très rustique reconnaissable à son écorce orange-rouge dans la partie haute. Aiguilles bleu-vert, très résistant.',
      },
      {
        name: 'Thuya géant',
        category: category8.id,
        price: 24.9,
        stock: 30,
        short_description: 'Conifère idéal pour haies persistantes.',
        detailed_description:
          'Thuya à croissance rapide, feuillage vert brillant persistant. Parfait pour créer des haies occultantes denses et régulières.',
      },
      {
        name: 'Cèdre du Liban',
        category: category8.id,
        price: 55.0,
        stock: 8,
        short_description: 'Conifère majestueux aux branches étagées.',
        detailed_description:
          'Arbre emblématique au port tabulaire caractéristique. Aiguilles persistantes vert sombre. Très longévif et décoratif.',
      },
      {
        name: 'Sapin de Nordmann',
        category: category8.id,
        price: 35.9,
        stock: 22,
        short_description: 'Sapin aux aiguilles non piquantes.',
        detailed_description:
          'Conifère aux aiguilles plates vert brillant non piquantes. Port pyramidal régulier. Très apprécié comme sapin de Noël.',
      },

      // Chênes
      {
        name: 'Chêne pédonculé',
        category: category9.id,
        price: 58.9,
        stock: 12,
        short_description: 'Chêne emblématique de nos forêts.',
        detailed_description:
          'Grand arbre au port majestueux, feuillage lobé vert devenant brun doré en automne. Glands sur pédoncules. Très longévif.',
      },
      {
        name: "Chêne rouge d'Amérique",
        category: category9.id,
        price: 52.5,
        stock: 15,
        short_description: "Couleurs d'automne flamboyantes.",
        detailed_description:
          'Chêne à croissance rapide, feuillage lobé prenant des teintes rouge écarlate en automne. Très décoratif et résistant.',
      },
      {
        name: 'Chêne vert',
        category: category9.id,
        price: 45.9,
        stock: 18,
        short_description: 'Chêne persistant méditerranéen.',
        detailed_description:
          'Chêne au feuillage persistant vert sombre, adapté aux climats secs. Port arrondi, très résistant à la sécheresse.',
      },
      {
        name: 'Chêne fastigié',
        category: category9.id,
        price: 68.0,
        stock: 8,
        short_description: 'Port colonnaire pour espaces restreints.',
        detailed_description:
          'Chêne au port colonnaire étroit, idéal pour alignements et petits espaces. Feuillage traditionnel du chêne pédonculé.',
      },
      {
        name: 'Chêne sessile',
        category: category9.id,
        price: 55.9,
        stock: 10,
        short_description: 'Chêne des terrains secs et calcaires.',
        detailed_description:
          'Chêne rustique aux glands sessiles, adapté aux sols calcaires et secs. Feuillage lobé vert sombre, port élégant.',
      },

      // Érables )
      {
        name: 'Érable plane',
        category: category10.id,
        price: 48.9,
        stock: 16,
        short_description: 'Grand érable aux feuilles palmées.',
        detailed_description:
          'Grand arbre vigoureux aux larges feuilles palmées. Floraison jaune-vert printanière et couleurs automnales dorées.',
      },
      {
        name: 'Érable champêtre',
        category: category10.id,
        price: 32.5,
        stock: 20,
        short_description: 'Érable indigène de petite taille.',
        detailed_description:
          'Petit érable indigène au feuillage lobé fin. Couleurs automnales jaune-orange. Parfait pour haies champêtres.',
      },
      {
        name: 'Érable sycomore',
        category: category10.id,
        price: 42.9,
        stock: 14,
        short_description: 'Érable robuste à grandes feuilles.',
        detailed_description:
          'Grand érable aux feuilles palmées vert sombre. Très résistant au vent et aux embruns. Croissance rapide.',
      },
      {
        name: 'Érable à sucre',
        category: category10.id,
        price: 55.0,
        stock: 12,
        short_description: 'Couleurs automnales exceptionnelles.',
        detailed_description:
          'Érable nord-américain aux couleurs automnales flamboyantes : jaune, orange, rouge écarlate. Croissance lente mais remarquable.',
      },
      {
        name: 'Érable negundo panaché',
        category: category10.id,
        price: 38.9,
        stock: 18,
        short_description: 'Feuillage panaché très lumineux.',
        detailed_description:
          'Érable au feuillage composé panaché vert et blanc-crème. Très lumineux, croissance rapide. Idéal pour éclairer un coin sombre.',
      },
    ];

    // Créer chaque produit avec son image correspondante
    for (const productData of productsData) {
      const product = await prisma.product.create({
        data: productData,
      });

      // Créer l'image pour ce produit spécifique
      await prisma.image.create({
        data: {
          name: categoryImages[product.category],
          alt: product.name,
          product_id: product.id,
        },
      });
    }

    console.log('Seed terminé avec succès');
  } else {
    console.log('Données déjà présentes - skip du seed');
    return;
  }
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
