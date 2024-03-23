import { NextFunction, Request, Response } from 'express'
import { IRequest } from '../libs/types'
import { CustomError } from '../utils/customError'
import { db } from '../services/db'
import json from '../utils/json.helper'

export const getSellers = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const sellers = await db.seller.findMany()
    if (!sellers) {
      throw new CustomError('Error getting sellers Information', 500)
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
      throw new CustomError('Error updating Seller data', 500)
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
      throw new CustomError('Error Deleting Seller', 500)
    }
    res.status(200).json({
      message: 'Deleted succesfully',
    })
  } catch (error) {
    next(error)
  }
}
