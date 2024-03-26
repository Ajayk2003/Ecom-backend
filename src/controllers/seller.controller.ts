import { NextFunction, Request, Response } from "express"
import { IRequest } from "../libs/types"
import { CustomError } from "../utils/customError"
import { db } from "../services/db"
import json from "../utils/json.helper"

export const getSellers = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const sellers = await db.seller.findMany()
    if (!sellers) {
      throw new CustomError("Error getting sellers Information", 500)
    }

    res.status(200).json(sellers)
  } catch (error) {
    next(error)
  }
}

export const updateSeller = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const data = req.body
    const updatedData = await db.seller.update({
      where: {
        id: data.seller.id,
      },
      data: req.body,
    })

    if (!updatedData) {
      throw new CustomError("Error updating Seller data", 500)
    }

    res.status(201).json(updatedData)
  } catch (error) {
    next(error)
  }
}

export const deleteSeller = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const data = req.body
    const deletedSeller = await db.seller.update({
      where: {
        id: data.seller.id,
      },
      data: {
        isDeleted: true,
      },
    })
    if (!deletedSeller) {
      throw new CustomError("Error Deleting Seller", 500)
    }
    res.status(200).json({
      message: "Deleted succesfully",
    })
  } catch (error) {
    next(error)
  }
}

export const getSellerInfo = async (req: IRequest, res: Response, next: NextFunction) => {
  const sellerId = req.user?.id

  const totalOrders = await getTotalOrders(sellerId!)
  const totalRevenue = await getTotalRevenue(sellerId!)
  const inventory = await getInventory(sellerId!)

  res.status(200).json({
    inventory: inventory._sum.stock,
    revenue: totalRevenue._sum.price,
    sales: totalRevenue._sum.quantity,
    orders: totalOrders._count,
  })
}

//gets SELLER's TOTAL REVENUE
const getTotalRevenue = async (id: number) => {
  const orders = await db.orderItem.aggregate({
    _sum: {
      price: true,
      quantity: true,
    },

    where: {
      product: {
        sellerId: id,
      },
    },
  })
  return orders
}

// Gets SELLER's TOTAL ORDERS
const getTotalOrders = async (id: number) => {
  return await db.order.aggregate({
    _count: true,
    where: {
      items: {
        every: {
          product: {
            sellerId: id,
          },
        },
      },
    },
  })
}

// get SELLER's TOTAL STOCKS
const getInventory = async (id: number) => {
  return await db.product.aggregate({
    _sum: {
      stock: true,
    },

    where: {
      sellerId: id,
    },
  })
}
