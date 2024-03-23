import { NextFunction, Response } from 'express'
import { IRequest } from '../../libs/types'
import { Product } from '@prisma/client'
import { ZodError } from 'zod'
import { CustomError } from '../../utils/customError'
import { db } from '../../services/db'

export const getSellers = async (req: IRequest, res: Response, next: NextFunction) => {
  const sellers = await db.seller.findMany()
  if (sellers) {
    throw new CustomError('Error getting sellers Information', 500)
  }

  res.status(200).json(sellers)
}

export const getUsers = async (req: IRequest, res: Response, next: NextFunction) => {
  const users = await db.user.findMany()
  res.status(200).json(users)
}
