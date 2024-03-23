import { Product } from '@prisma/client'
import { CustomError } from '../utils/customError'
import { db } from './db'
import { Decimal } from '@prisma/client/runtime/library'

// Getting All products

export const getProducts = async () => {
  const products = await db.product.findMany()
  if (!products) {
    throw new CustomError('Error getting products', 500)
  }
  return products
}

export const createProduct = async (data: Product) => {
  const product = await db.product.create({
    data,
  })
  if (!product) {
    throw new CustomError('Could not add Product ', 500)
  }
  return product
}

// Check whether product existed
export const productExisting = async (id: number, userId: number) => {
  const productExist = await db.product.findUnique({
    where: { id, sellerId: userId },
  })
  if (!productExist) {
    throw new CustomError('Product doesnt exist', 404)
  }
  return true
}

//
export const deleteProduct = async (id: number, sellerId: number) => {
  const product = await db.product.update({
    where: { id, sellerId },
    data: { isDeleted: true },
  })
  if (!product) {
    throw new CustomError('Error deleting the product', 500)
  }
  return product
}

export const updateProduct = async (id: number, sellerId: number, data: Product) => {
  const product: Product = await db.product.update({
    where: { id },
    data,
  })
  if (!product) {
    throw new CustomError('Error deleting the product', 500)
  }
  return product
}

export const getProductsByReview = async (category: string) => {
  const products = db.product.findMany({
    where: {
      review: {
        some: {
          stars: {
            gte: 4,
          },
        },
      },
    },
  })
  if (!products) {
    throw new Error('Error getting products')
  }
  return products
}

export const getProductsBySeller = async (sellerId: number) => {
  const products = db.product.findMany({
    where: { sellerId },
  })
  if (!products) {
    throw new CustomError('Cant fetch Products', 500)
  }
  return products
}
export const getProductsbySearch = async (searchParams: string[]) => {
  const products = db.product.findMany({
    where: { name: { in: searchParams } },
  })
  if (!products) {
    throw new Error('Error getting products')
  }
  return products
}
