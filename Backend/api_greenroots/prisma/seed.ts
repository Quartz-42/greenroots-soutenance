import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [{ name: 'Admin' }, { name: 'User' }],
    skipDuplicates: true, // évite les erreurs si déjà présent
  });

  console.log('✔ Rôles insérés avec succès');
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
