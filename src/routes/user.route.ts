import { Router } from 'express'
import { getUsers, deleteUser, updateUser, getUserById } from '../controllers/user.controller'
import { checkRole } from '../middlewares/AuthVerify'

const router = Router()

// router.use(checkRole(['admin']))
router.route('/').get(getUsers)
router.route('/:id').put(updateUser).delete(deleteUser).get(getUserById)

export default router
