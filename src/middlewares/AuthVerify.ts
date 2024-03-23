import express, { Response, NextFunction } from 'express'
import { jwtVerify } from '../utils/authentication'
import { IRequest } from '../libs/types'
import { TokenExpiredError } from 'jsonwebtoken'

export const AuthVerify = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    let token: string
    const authHeader = req.headers.authorization
    if (!(authHeader && authHeader.startsWith('Bearer'))) {
      res.status(400)
      throw new Error('NO Authorization token')
    }

    token = authHeader.split(' ')[1]
    const user = jwtVerify(token)

    if (!user) {
      res.status(401)
      throw new Error('Authorization failed')
    }

    req.user = user
    next()
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(307).json({
        message: 'token expired',
      })
    }
  }
}

type userRole = 'seller' | 'customer' | 'admin'

export const checkRole = (requiredRole: userRole[]) => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role // Assuming you have a "role" property in your user object

      // Check if user has the required role
      if (!userRole || userRole in requiredRole) {
        res.status(403)
        throw new Error('Access denied')
      }

      // User has the required role, proceed to the next middleware or route handler
      next()
    } catch (error) {
      next(error)
    }
  }
}
