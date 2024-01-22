// authController.ts
import express, { Request, Response } from 'express'
import * as authService from '../services/authService'
import {io} from '../config/socket'
const router = express.Router()

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        const user = await authService.register(username, password)
        res.redirect('/') // پس از ریجیستر، هدایت به صفحه لاگین
    } catch (error) {
        console.error(error)

        // Handle specific error messages
        if (error instanceof Error && error.message.includes('duplicate key error')) {
            res.render('register', { errors: { register: 'Username already exists.' } })
        } else {
            res.render('register', { errors: { register: 'Internal Server Error.' } })
        }
    }
})

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        const user = await authService.login(username, password)
        if (user) {
            // Update user's socketId and online status
            await authService.updateUserSocketAndStatus(user, (req.socket as any).id, true)

            // Emit user online/offline events
            io.emit('user online', user.username)

            res.redirect('/chat') // اگر لاگین درست بود، هدایت به صفحه چت
        } else {
            res.render('login', { errors: { login: 'Invalid credentials.' } })
        }
    } catch (error) {
        console.error(error)
        res.render('login', { errors: { login: 'Internal Server Error.' } })
    }
})


export default router
