import express, { NextFunction, Request, Response } from 'express'
import { router } from './routes/product.route'
import orderRouter from './routes/order.route'
import authRouter from './auth/auth.route'
import sellerRouter from './routes/sellers.route'
import userRouter from './routes/user.route'
import cors from 'cors'
import { errorHandler } from './middlewares/ErrorHandler'
import { AuthVerify } from './middlewares/AuthVerify'
import path from 'path'

const app = express()

const loggerFn = async (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req
  console.log(method + ' ' + url)
  next()
}

app.use(cors())
app.use(express.json())
app.use(loggerFn)
app.use(express.static('public'))
app.use('/api/auth', authRouter)
app.use('/api/sellers', AuthVerify, sellerRouter)
app.use('/api/users', AuthVerify, userRouter)
app.use('/api/products', AuthVerify, router)
app.use('/api/orders', AuthVerify, orderRouter)
// app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))
// app.use('/api/reviews')

app.use(errorHandler)

export default app
