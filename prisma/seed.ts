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
      image: '/images/image1.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Seed Categories
  const category1 = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
      name: 'Electronics',
    },
  });

  const category2 = await prisma.category.upsert({
    where: { name: 'Books' },
    update: {},
    create: {
      name: 'Books',
    },
  });

  // Seed Products
  const product1 = await prisma.product.create({
    data: {
      title: 'Smartphone',
      description: 'A high-end smartphone with a great camera',
      price: 699.99,
      discount: 0.1,
      stock: 50,
      sellerId: user2.id,
      categoryId: category1.id,
      images: {
        create: [
          { path: '/images/image2.png', isPrimary: true },
          { path: '/images/image3.png', isPrimary: false },
        ],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const product2 = await prisma.product.create({
    data: {
      title: 'Laptop',
      description: 'A powerful laptop for professionals',
      price: 1299.99,
      discount: 0.15,
      stock: 30,
      sellerId: user2.id,
      categoryId: category1.id,
      images: {
        create: [
          { path: '/images/image4.png', isPrimary: true },
          { path: '/images/image5.png', isPrimary: false },
        ],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const product3 = await prisma.product.create({
    data: {
      title: 'Novel',
      description: 'A best-selling novel',
      price: 19.99,
      discount: 0.05,
      stock: 100,
      sellerId: user2.id,
      categoryId: category2.id,
      images: {
        create: [{ path: '/images/image6.png', isPrimary: true }],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Seed Cart for User1
  const cart1 = await prisma.cart.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Seed Cart Items for User1
  await prisma.cartItem.createMany({
    data: [
      {
        cartId: cart1.id,
        productId: product1.id,
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cartId: cart1.id,
        productId: product3.id,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  console.log({ user2, sellerProfile1, product1, product2, product3, cart1 });
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
