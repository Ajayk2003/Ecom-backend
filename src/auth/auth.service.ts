import { TUserJwt } from '../libs/types'
import { db } from '../services/db'
import { jwtSign } from '../utils/authentication'
import { CustomError } from '../utils/customError'
import { equal } from 'assert'

type TUserLoginSchema = {
  email: string
  password: string
}

type TUserRegistrationSchema = {
  firstName: string
  lastName: string
  email: string
  phone: number
  password: string
}

// User Login route
export const userLogin = async ({ email, password }: TUserLoginSchema) => {
  console.log(email)
  const user = await db.user.findUnique({ where: { email } })
  if (!user) {
    throw new CustomError('Incorrect email', 400)
  }

  if (!(password === user.password)) {
    throw new CustomError('Incorrect password', 400)
  }

  const token = jwtSign({
    id: user.id,
    email: user.email,
    role: 'user',
  })
  return token
}

// User register
export const userRegister = async (data: TUserRegistrationSchema) => {
  const { firstName, lastName, password, email, phone } = data
  // Check for existing user with the same email
  const existingEmail = await db.user.findFirst({
    where: {
      email: email,
    },
  })
  if (existingEmail) {
    throw new CustomError('User already exists with the provided email', 400)
  }

  // Check for existing user with the same phone
  const existingPhone = await db.user.findUnique({
    where: {
      phone,
    },
  })
  if (existingPhone) throw new CustomError('User already exists with the provided phone', 400)

  // Create the new user with a generated ID
  const newUser = await db.user.create({
    data,
  })
  // Return the registered user's information
  return newUser
}

type TSellerRegistrationProps = {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: number
  description: string
}

export const sellerRegister = async (data: TSellerRegistrationProps) => {
  const { firstName, lastName, password, email, phone } = data

  const existingEmail = await db.seller.findFirst({
    where: { email },
  })
  if (existingEmail) throw new CustomError('User already exists with the provided email', 403)

  const existingPhone = await db.seller.findFirst({
    where: { phone },
  })
  if (existingPhone) throw new CustomError('User already exists with the provided phone', 403)

  const newSeller = await db.seller.create({
    data,
  })
  // Return the registered user's information
  return newSeller
}

type TSellerLogin = {
  email: string
  password: string
}

export const sellerLogin = async ({ email, password }: TSellerLogin) => {
  try {
    const seller = await db.seller.findFirst({
      where: {
        email,
        password,
      },
    })
    if (!seller) {
      throw new CustomError('seller not available', 404)
    }
    const token = jwtSign({
      id: seller.id,
      email: seller.email,
      role: 'seller',
    })
    return token
  } catch (e) {
    return e
  }
}
