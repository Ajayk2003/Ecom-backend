import jwt from 'jsonwebtoken'
import { TUserJwt } from '../libs/types'

// Verifying the JWT token we obtain from request headers
export const jwtVerify = (token: string) => jwt.verify(token, process.env.SECRET_KEY as string) as TUserJwt

// Sign a new token with User creditianls
export const jwtSign = (Payload: TUserJwt) => jwt.sign(Payload, process.env.SECRET_KEY as string, { expiresIn: '1hr' })
