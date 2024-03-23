import { constants } from '../utils/constants'
import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../utils/customError'

interface ErrorResponse {
  title: string
  message?: string
  stackTrace?: string
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  //Error status code
  const statusCode = err.statusCode ? err.statusCode : res.statusCode ? res.statusCode : 500

  //defining Error type by its status code
  const errorType =
    Object.keys(constants).find(key => constants[key as keyof typeof constants] === statusCode) || 'unknown Error'

  let errorResponse
  //Response based on production
  if (process.env.NODE_ENV === 'production') {
    errorResponse = {
      title: errorType,
    }
  } else {
    errorResponse = {
      title: errorType,
      message: err.message,
      stackTrace: err.stack,
    }
  }
  res.status(statusCode).json(errorResponse)
}
