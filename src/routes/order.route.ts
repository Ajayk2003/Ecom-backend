import { Router } from 'express'
import { createOrderController, getAllOrders, orderStatusController } from '../controllers/order.controller'
import { AuthVerify } from '../middlewares/AuthVerify'

const router = Router()

router.route('/').post(createOrderController).get(getAllOrders).put(orderStatusController)

router.all('*', (req, res) => {
  res.status(404)
  throw new Error('ROUTE NOT FOUND')
})

export default router
