import { IRequest } from '../libs/types'
import { db } from '../services/db'
import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../utils/customError'

// Getting all users
export const getUsers = async (req: IRequest, res: Response, next: NextFunction) => {
  const users = await db.user.findMany()

  if (users == null || undefined) {
    throw new CustomError('Error getting users', 500)
  }

  res.status(200).json(users)
}

export const getUserById = async (req: IRequest, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)
  const user = await db.user.findUnique({
    where: { id },
  })

  if (!user) throw new CustomError('User doesnt exist', 400)

  res.status(200).json(user)
}

// Updating an User
export const updateUser = async (req: IRequest, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id)
  const data = req.body

  const updatedUser = await db.user.update({
    where: {
      id,
    },
    data,
  })

  if (!updatedUser) throw new CustomError('Error updating customer', 500)

  res.status(200).json({
    message: 'Updated Successfully',
    updatedUser,
  })
}

// Deleting an existing User
export const deleteUser = async (req: IRequest, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id)
  const deletedUser = await db.user.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  })

  if (deletedUser) throw new CustomError('Error deleting user', 500)

  res.status(200).json({
    message: 'Deleted Successfully',
    deletedUser,
  })
}
