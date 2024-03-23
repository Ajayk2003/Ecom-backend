import { NextFunction, Request, Response } from 'express'
import { IRequest } from '../libs/types'
import { userRegister, sellerRegister } from './auth.service'
import { db } from '../services/db'
import { CustomError } from '../utils/customError'
import { jwtSign } from '../utils/authentication'

export const loginController = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body

    let payload = await db[role].findUnique({ where: { email } })

    if (!payload) {
      throw new CustomError('Email doesnt exist', 400)
    }
    //Checking password
    if (!(password === payload.password)) {
      throw new CustomError('Incorrect Password', 400)
    }
    //Generating token
    const token = jwtSign({
      id: payload.id,
      email: payload.email,
      role,
    })
    //Sending token
    res.status(200).json({
      token,
      message: 'Logged in succesfully',
    })
  } catch (error) {
    next(error)
  }
}

export const currentUser = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user
    console.log(user)
    const details = await db[user?.role!].findUnique({
      where: { id: user?.id, isDeleted: false },
    })

    if (details == undefined) {
      throw new CustomError('Error getting ' + user?.role + ' details', 500)
    }
    console.log('hiii')
    console.log(details)
    res.status(200).json(details)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

//sending back token data
export const currentController = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { user } = req
    console.log(user)
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

//User registeration
export const userRegisterController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Reached the route')
    const { email, password, phone, firstName, lastName } = req.body
    console.log(req.body)
    const { id } = await userRegister({
      email,
      password,
      phone,
      firstName,
      lastName,
    })
    console.log('what happend')
    res.status(200).json({
      message: 'registered succesfully',
      user: {
        userId: id,
      },
    })
  } catch (error) {
    next(error)
  }
}

//Seller Registration
export const sellerRegisterController = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, description, email, phone, password } = req.body
    const { id } = await sellerRegister({ firstName, lastName, description, email, phone, password })
    console.log('what happend')
    res.status(200).json({
      message: 'registered succesfully',
      user: {
        userId: id,
      },
    })
  } catch (error) {
    next(error)
  }
}
