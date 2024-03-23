import { Router } from 'express'
import { getSellers, deleteSeller, updateSeller } from '../controllers/seller.controller'

const router = Router()

router.route('/').get(getSellers)
router.route('/:id').put(updateSeller).delete(deleteSeller)

export default router
