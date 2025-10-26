import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.property.count();
  if (count > 0) {
    console.log(`Seed skipped: ${count} properties already exist.`);
    return;
  }

  await prisma.property.createMany({
    data: [
      {
        type: 'apartment',
        address: '서울 강남구 테헤란로 123',
        dealType: 'jeonse',
        status: 'review',
        rooms: 3,
        baths: 2,
        areaSupply: 84.9
      },
      {
        type: 'officetel',
        address: '서울 서초구 서초대로 45',
        dealType: 'monthly',
        status: 'published',
        deposit: 10000000,
        rent: 1200000
      },
      {
        type: 'villa',
        address: '서울 성동구 왕십리로 200',
        dealType: 'sale',
        status: 'draft',
        price: 520000000
      }
    ]
  });

  const total = await prisma.property.count();
  console.log(`Seed done. properties=${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
