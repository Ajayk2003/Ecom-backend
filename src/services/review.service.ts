import { CustomError } from '../utils/customError'
import { db } from './db'

export const getReviewsbyPid = async (productId: number) => {
  const reviews = await db.review.findMany({
    where: {
      productId,
    },
  })
  if (!reviews) {
    throw new CustomError('Reviews not available', 404)
  }
  return reviews
}

export const postReviews = async (
  productId: number,
  userId: number,
  review: {
    stars: number
    description: string
  },
) => {
  const userBought = await db.order.findFirst({
    where: {
      userId,
      items: {
        some: {
          productId,
        },
      },
    },
  })

  if (!userBought) {
    throw new CustomError('Reviewing not possible', 400)
  }

  const addedReview = await db.review.create({
    data: {
      stars: review.stars,
      description: review.description,
      productId,
      userId,
    },
  })

  if (!addedReview) {
    throw new CustomError('Error adding Review', 500)
  }
  return addedReview
}

export const updateReview = async (
  review: {
    reviewId: number
    stars: number
    description: string
  },
  userId: number,
) => {
  const updatedReview = await db.review.update({
    where: {
      id: review.reviewId,
    },
    data: {
      stars: review.stars,
      description: review.description,
    },
  })

  return updatedReview
}
