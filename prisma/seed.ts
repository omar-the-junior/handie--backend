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
      image: '/images/sellerImg1.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Seed Categories
  const categories = [
    'Electronics',
    'Books',
    'Jewelry & Accessories',
    'Clothing & Apparel',
    'Home Décor',
    'Art & Prints',
    'Toys & Baby Items',
    'Wellness & Beauty',
  ];

  const categoryRecords = await Promise.all(
    categories.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  // Seed Products
  const products = [
    {
      title: 'Smartphone',
      description: 'A high-end smartphone with a great camera',
      price: 699.99,
      discount: 0.1,
      stock: 50,
      sellerId: sellerProfile1.id,
      categoryId: categoryRecords[0].id, // Electronics
      images: [
        { path: '/images/image2.jpg', isPrimary: true },
        { path: '/images/image3.jpg', isPrimary: false },
      ],
    },
    {
      title: 'Laptop',
      description: 'A powerful laptop for professionals',
      price: 1299.99,
      discount: 0.15,
      stock: 30,
      sellerId: sellerProfile1.id,
      categoryId: categoryRecords[0].id, // Electronics
      images: [
        { path: '/images/image4.jpg', isPrimary: true },
        { path: '/images/image5.jpg', isPrimary: false },
      ],
    },
    {
      title: 'Novel',
      description: 'A best-selling novel',
      price: 19.99,
      discount: 0.05,
      stock: 100,
      sellerId: sellerProfile1.id,
      categoryId: categoryRecords[1].id, // Books
      images: [{ path: '/images/image6.jpg', isPrimary: true }],
    },
    {
      title: 'Necklace',
      description: 'A beautiful gold necklace',
      price: 199.99,
      discount: 0.2,
      stock: 20,
      sellerId: sellerProfile1.id,
      categoryId: categoryRecords[2].id, // Jewelry & Accessories
      images: [{ path: '/images/image7.jpg', isPrimary: true }],
    },
    {
      title: 'T-shirt',
      description: 'A comfortable cotton t-shirt',
      price: 29.99,
      discount: 0.1,
      stock: 100,
      sellerId: sellerProfile1.id,
      categoryId: categoryRecords[3].id, // Clothing & Apparel
      images: [{ path: '/images/image8.jpg', isPrimary: true }],
    },
    {
      title: 'Wall Art',
      description: 'A beautiful piece of wall art',
      price: 49.99,
      discount: 0.15,
      stock: 50,
      sellerId: sellerProfile1.id,
      categoryId: categoryRecords[4].id, // Home Décor
      images: [{ path: '/images/image9.jpg', isPrimary: true }],
    },
    {
      title: 'Painting',
      description: 'An original painting',
      price: 299.99,
      discount: 0.1,
      stock: 10,
      sellerId: sellerProfile1.id,
      categoryId: categoryRecords[5].id, // Art & Prints
      images: [{ path: '/images/image10.jpg', isPrimary: true }],
    },
    {
      title: 'Toy Car',
      description: 'A fun toy car for kids',
      price: 14.99,
      discount: 0.05,
      stock: 200,
      sellerId: sellerProfile1.id,
      categoryId: categoryRecords[6].id, // Toys & Baby Items
      images: [{ path: '/images/image11.jpg', isPrimary: true }],
    },
    {
      title: 'Face Cream',
      description: 'A moisturizing face cream',
      price: 24.99,
      discount: 0.1,
      stock: 100,
      sellerId: sellerProfile1.id,
      categoryId: categoryRecords[7].id, // Wellness & Beauty
      images: [{ path: '/images/image12.jpg', isPrimary: true }],
    },
  ];

  const productRecords = await Promise.all(
    products.map((product) =>
      prisma.product.create({
        data: {
          ...product,
          images: {
            create: product.images,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }),
    ),
  );

  // Seed Reviews
  const reviews = [
    {
      productId: productRecords[0].id,
      userId: user1.id,
      rating: 5,
      comment: 'Excellent product!',
    },
    {
      productId: productRecords[1].id,
      userId: user1.id,
      rating: 4,
      comment: 'Very good laptop.',
    },
    {
      productId: productRecords[2].id,
      userId: user1.id,
      rating: 5,
      comment: 'Loved the novel!',
    },
    {
      productId: productRecords[3].id,
      userId: user1.id,
      rating: 4,
      comment: 'Beautiful necklace.',
    },
    {
      productId: productRecords[4].id,
      userId: user1.id,
      rating: 3,
      comment: 'Comfortable t-shirt.',
    },
    {
      productId: productRecords[5].id,
      userId: user1.id,
      rating: 4,
      comment: 'Nice wall art.',
    },
    {
      productId: productRecords[6].id,
      userId: user1.id,
      rating: 5,
      comment: 'Amazing painting.',
    },
    {
      productId: productRecords[7].id,
      userId: user1.id,
      rating: 4,
      comment: 'Kids love the toy car.',
    },
    {
      productId: productRecords[8].id,
      userId: user1.id,
      rating: 5,
      comment: 'Great face cream.',
    },
  ];

  await prisma.productReview.createMany({
    data: reviews.map((review) => ({
      ...review,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
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
        productId: productRecords[0].id,
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        cartId: cart1.id,
        productId: productRecords[2].id,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  // Seed Wishlist for User1
  const wishlist1 = await prisma.wishlist.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Seed Wishlist Items for User1
  await prisma.wishlistItem.createMany({
    data: [
      {
        wishlistId: wishlist1.id,
        productId: productRecords[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        wishlistId: wishlist1.id,
        productId: productRecords[3].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        wishlistId: wishlist1.id,
        productId: productRecords[5].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  console.log({ user2, sellerProfile1, productRecords, cart1, wishlist1 });
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
