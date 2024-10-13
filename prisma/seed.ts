import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'User One',
      phone: '123-456-7890',
      userType: 'BUYER',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'User Two',
      phone: '098-765-4321',
      userType: 'SELLER',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Seed Seller Profiles
  const sellerProfile1 = await prisma.sellerProfile.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
      businessName: 'Business One',
      businessDescription: 'Description for Business One',
      businessEmail: 'business1@example.com',
      businessPhone: '123-456-7890',
      image: 'https://example.com/business1.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log({ user1, user2, sellerProfile1 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
