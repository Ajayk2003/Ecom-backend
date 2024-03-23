import { NextFunction, Response } from 'express'
import { IRequest } from '../libs/types'
import { CustomError } from '../utils/customError'
import { getReviewsbyPid, postReviews, updateReview } from '../services/review.service'

export const getReviewsController = async (req: IRequest, res: Response, next: NextFunction) => {
  const data = req.body
  if (!data.productId) {
    throw new CustomError('Invalid product', 400)
  }
  const result = await getReviewsbyPid(data.productId)
  res.status(200).json({ result })
}

export const postReviewController = async (req: IRequest, res: Response, next: NextFunction) => {
  const data = req.body
  if (!req.user) {
    return
  }
  const result = await postReviews(data.productId, req.user?.id, data.review)
  res.status(200).json(result)
}

export const updateReviewController = async (req: IRequest, res: Response, next: NextFunction) => {
  const data = req.body
  if (!req.user) {
    throw new Error('Authentication failed')
  }

  const result = await updateReview(data.review, req.user.id)
  res.status(200).json(result)
}
