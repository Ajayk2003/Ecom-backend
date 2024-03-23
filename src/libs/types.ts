import { Request } from 'express'

export type TProduct = {
  name: string
  description: string
  price: number
  sellerId: number
  category?: string
}

export type TtablesProps = {
  tableName: String
  id?: number
}

export type TUserJwt = {
  id: number
  email: string
  role: 'seller' | 'user' | 'admin'
}

export interface IRequest extends Request {
  user?: TUserJwt
}
