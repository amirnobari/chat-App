import { Document, Schema, model } from 'mongoose'

export interface UserDocument extends Document {
    username: string
    password: string
    socketId: string // Add socketId field
    online: boolean // Add online field
}

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    socketId: { type: String, default: '' }, // Add default value
    online: { type: Boolean, default: false }, // Add default value
    // ...
})

export default model<UserDocument>('User', userSchema)
