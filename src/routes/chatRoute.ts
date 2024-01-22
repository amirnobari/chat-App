// src/controllers/chatRoute.ts
import express, { Request, Response } from 'express'
import User from '../models/user'
const router = express.Router()

router.get('/chat', async (req: Request, res: Response) => {
    const users = await User.find({}).select('username')
    res.render('chat', { users })
})

export default router