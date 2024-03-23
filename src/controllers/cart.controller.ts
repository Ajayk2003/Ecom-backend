import { NextFunction, Response } from 'express'
import { IRequest } from '../libs/types'
import { db } from '../services/db'
import { CustomError } from '../utils/customError'

export const getCartItems = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id

    const cartItems = await db.cartItem.findMany({
      where: {
        userId,
        isDeleted: false,
      },
    })

    if (cartItems == undefined) {
      throw new CustomError('Error getting cartItems', 500)
    }

    res.status(200).json(cartItems)
  } catch (err) {
    next(err)
  }
}
