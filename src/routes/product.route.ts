import { Router, Response, Request } from 'express'
import {
  createProductController,
  getProductController,
  updateProductController,
  deleteProductController,
} from '../controllers/product.controller'

import { upload } from '../controllers/product.controller'

export const router = Router()

router.route('/').post(upload.single('image'), createProductController).get(getProductController)
router.route('/:id').put(updateProductController).delete(deleteProductController)

router.all('*', (req: Request, res: Response) => {
  res.status(404).send('Not Found')
})
