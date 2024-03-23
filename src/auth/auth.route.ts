import { Router } from 'express'
import {
  loginController,
  userRegisterController,
  sellerRegisterController,
  currentController,
  currentUser,
} from './auth.controller'
import { AuthVerify } from '../middlewares/AuthVerify'

const router = Router()
router.route('/login').post(loginController)
router.route('/register/user').post(userRegisterController)
router.route('/register/seller').post(sellerRegisterController)
router.route('/current').post(AuthVerify, currentController)
router.route('/current/:id').get(AuthVerify, currentUser)

export default router
