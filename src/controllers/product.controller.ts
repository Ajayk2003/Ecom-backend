import { NextFunction, Response } from "express"
import { IRequest } from "../libs/types"
import { Product } from "@prisma/client"
import { ZodError } from "zod"
import { CustomError } from "../utils/customError"
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsByReview,
  getProductsBySeller,
  getProductsbySearch,
  productExisting,
  updateProduct,
} from "../services/product.service"
import { db } from "../services/db"
import multer from "multer"

export const upload = multer({ dest: "./public/uploads" })

export const createProductController = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user?.id
    let data = req.body
    if (sellerId) data = { ...data, sellerId: sellerId, stock: parseInt(data.stock) }
    console.log(req.file)
    if (req.file) {
      const imageUrl = `http://localhost:5002/uploads/${req.file.filename}`
      data = { ...data, imageUrl }
    }
    console.log(data)
    const { id, name, price } = await createProduct(data)
    return res.status(203).json({
      id,
      name,
      price,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400)
      console.log(error.errors)
    }
    next(error)
  }
}

export const deleteProductController = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const productId = Number(req.params.id)
    const sellerId = req.user?.id
    if (!sellerId) {
      res.status(401)
      throw new Error("Seller is not authorized")
    }

    if (!(await productExisting(productId, sellerId))) {
      throw new CustomError("Product doesnt exist", 404)
    }
    const { name, id, imageUrl } = await deleteProduct(productId, sellerId)
    res.status(200).json({
      id,
      name,
      imageUrl,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProductController = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const productId = Number(req.params.id)
    const sellerId = req.user?.id
    let data = req.body
    if (req.file) {
      data = { ...data, imageUrl: req.file.path }
    }

    if (!sellerId) {
      res.status(401)
      throw new Error("Seller is not authorized")
    }

    if (!(await productExisting(productId, sellerId))) {
      throw new CustomError("Product doesnt exist", 404)
    }

    const { name, id, imageUrl } = await updateProduct(productId, sellerId, data)
    res.status(200).json({
      status: "success",
      message: "Order updated successfully",
    })
  } catch (error) {
    next(error)
  }
}

export const getProductController = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.user?.id!
    const userRole = req.user?.role!
    console.log(req.user)
    // if () throw new CustomError('unauthorized user', 400)
    let resData
    switch (userRole) {
      case "admin":
      case "user":
        resData = await getProducts()
        break

      case "seller":
        resData = await getProductsBySeller(id)
        break

      default:
        break
    }
    console.log(resData)
    res.status(200).json(resData)
  } catch (error) {
    next(error)
  }
}

export const getProductBySearchController = async (req: IRequest, res: Response, next: NextFunction) => {
  let searchParams = req.params.toString()

  const products = await db.product.findMany({
    where: {
      name: {
        contains: searchParams,
        startsWith: searchParams.charAt(0),
      },
    },
  })

  if (!products) {
    res.status(200).json({
      message: "no results found",
    })
    return
  }
  res.status(200).json({
    results: products,
  })
}
