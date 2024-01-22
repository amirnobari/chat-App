import express from 'express'
import authController from '../controllers/authController'

const router = express.Router()

router.use('/api/auth', authController)

export default router
