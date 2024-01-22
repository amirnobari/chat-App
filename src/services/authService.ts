import bcrypt from 'bcrypt'
import User, { UserDocument } from '../models/user'

export async function register(username: string, password: string): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(password, 10)
    return User.create({ username, password: hashedPassword })
}

export async function login(username: string, password: string): Promise<UserDocument | null> {
    const user = await User.findOne({ username })
    if (!user) return null

    const isPasswordValid = await bcrypt.compare(password, user.password)
    return isPasswordValid ? user : null
}


// authService.ts
export async function updateUserSocketAndStatus(user: UserDocument, socketId: string, online: boolean): Promise<void> {
    user.socketId = socketId
    user.online = online
    await user.save()
}