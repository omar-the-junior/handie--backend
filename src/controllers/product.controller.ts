import type { Request, Response, NextFunction } from 'express';
import prisma from '../client.js';
import { unlink } from 'fs/promises';
import path from 'path';

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        ProductAttribute: { include: { values: true } },
        images: true,
      },
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        ProductAttribute: { include: { values: true } },
        images: true,
      },
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    title,
    description,
    price,
    discount,
    discountFrom,
    discountTo,
    stock,
    sellerId,
    categoryId,
    attributes,
  } = req.body;
  const images = req.files as Express.Multer.File[];
  try {
    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price,
        discount,
        discountFrom,
        discountTo,
        stock,
        sellerId,
        categoryId,
        ProductAttribute: {
          create: attributes.map((attr: { key: string; values: string[] }) => ({
            key: attr.key,
            values: {
              create: attr.values.map((value) => ({ value })),
            },
          })),
        },
        images: {
          create: images.map((img, index) => ({
            path: img.filename,
            isPrimary: index === 0,
          })),
        },
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const {
    title,
    description,
    price,
    discount,
    discountFrom,
    discountTo,
    stock,
    sellerId,
    categoryId,
    attributes,
  } = req.body;
  const images = req.files as Express.Multer.File[];
  try {
    // Delete existing images from the file system
    const existingImages = await prisma.productImage.findMany({
      where: { productId: Number(id) },
    });
    await Promise.all(
      existingImages.map((img) =>
        unlink(path.join(__dirname, '..', 'uploads', img.path)),
      ),
    );

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        price,
        discount,
        discountFrom,
        discountTo,
        stock,
        sellerId,
        categoryId,
        ProductAttribute: {
          deleteMany: {}, // Delete existing attributes
          create: attributes.map((attr: { key: string; values: string[] }) => ({
            key: attr.key,
            values: {
              create: attr.values.map((value) => ({ value })),
            },
          })),
        },
        images: {
          deleteMany: {}, // Delete existing images
          create: images.map((img, index) => ({
            path: img.filename,
            isPrimary: index === 0,
          })),
        },
      },
    });
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    // Delete images from the file system
    const images = await prisma.productImage.findMany({
      where: { productId: Number(id) },
    });
    await Promise.all(
      images.map((img) =>
        unlink(path.join(__dirname, '..', 'uploads', img.path)),
      ),
    );

    await prisma.product.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
