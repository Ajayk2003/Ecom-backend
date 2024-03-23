import { NextFunction, Response } from 'express'
import { changeOrderStatus, updateData, placeOrder, cancelOrder, getOrderByUser } from '../services/order.service'
import { IRequest } from '../libs/types'
import { CustomError } from '../utils/customError'
import { db } from '../services/db'

// Controller for creating an order
export const createOrderController = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { items } = req.body
    const userId = req.user?.id

    // Check if user is authorized
    if (!userId) {
      throw new CustomError('User is unauthorized', 401)
    }

    // Getting Prices from the server
    const { totalPrice, updatedData } = await updateData(items)

    // Placing the order
    const result = await placeOrder({ userId, totalPrice, updatedData })

    // Handle order placement failure
    if (!result) {
      res.status(500)
      throw new Error('Cannot place your order')
    }
    res.status(201).json({
      message: 'Order placed',
      result,
    })
  } catch (error) {
    next(error)
  }
}

// Controller for changing the order status
export const orderStatusController = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { id, status } = req.body
    const result = await changeOrderStatus(id, status)

    // Respond with success message
    res.status(200).json({
      message: 'Order status successfully changed',
    })
  } catch (error) {
    throw error
  }
}

export const deleteOrderController = async (req: IRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id
}

export const getAllOrders = async (req: IRequest, res: Response, next: NextFunction) => {
  const { role, id } = req.user!
  let orders
  if (role == 'admin') {
    orders = await db.order.findMany({
      include: {
        items: true,
      },
    })
  } else if (role == 'seller') {
    orders = await db.orderItem.findMany({
      where: {
        product: {
          sellerId: id,
        },
      },
    })
  } else if (role == 'user') {
    orders = await db.order.findMany({
      where: { isDeleted: false, userId: id },
    })
  }

  if (orders == undefined) {
    throw new CustomError('Error getting orders', 500)
  }
  console.log(orders)
  res.status(200).json(orders)
}
