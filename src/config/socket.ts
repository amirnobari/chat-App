
import app from './express'
import http from 'http'
import { getAsync, setAsync } from './redis'
import './database'
import { Document } from 'mongoose'
import User from '../models/user'
import { Server } from 'socket.io'

const server = http.createServer(app)
const io = new Server(server, { /* options */ })

// Handle user login
io.on('connection', async (socket: any) => {
    const req = socket.request as Request
    console.log('Socket ID:', socket.id) // برای اطمینان از درستی گرفتن socket.id


    // Load previous messages from Redis
    const messages = await getAsync('chat_messages')
    if (messages) {
        socket.emit('load messages', JSON.parse(messages))
    }

    // Listen for user login events
    socket.on('user login', async (username: string) => {
        const updatedUser = await User.findOneAndUpdate(
            { username: socket.username },
            { username, online: true, socketId: socket.id }, 
            { upsert: true, new: true }
        )

        // Store the socket ID in the database
        updatedUser.socketId = socket.id
        await updatedUser.save()

        // Emit user online/offline events
        io.emit('user online', updatedUser.username)
        

        // Send the list of online users to the newly logged-in user
        const onlineUsers = await User.find({ online: true }).select('username')
        io.to(socket.id).emit('update user list', onlineUsers)
    })

    // Listen for disconnect events
    socket.on('disconnect', async () => {
        console.log('User disconnected')
        const currentUser = await User.findOneAndUpdate(
            { socketId: socket.id },
            { online: false, socketId: '' }, // Set online status to false and clear socketId
            { new: true }
        )
        if (currentUser) {
            io.emit('user offline', currentUser.username)
        }
    })

    // Handle chat messages
    socket.on('chat message', async (msg: any, targetUsername: any) => {
        console.log('Received message for target user:', targetUsername)

        // Save the message to Redis
        const existingMessages = await getAsync('chat_messages')
        const updatedMessages = existingMessages ? JSON.parse(existingMessages) : []
        updatedMessages.push({ sender: socket.username, targetUser: targetUsername, message: msg })
        await setAsync('chat_messages', JSON.stringify(updatedMessages))

        // Get the target user's socket ID
        const targetUser = await User.findOne({ username: targetUsername })
        if (targetUser) {
            const targetSocketId = targetUser.socketId

            if (targetSocketId) {
                io.to(targetSocketId).emit('private chat message', { sender: socket.username, message: msg })
                // Send confirmation to the sender
                socket.emit('private chat message', { sender: socket.username, message: msg })
            } else {
                console.warn('Target user is not online.')
                // Optionally, notify the sender that the target user is not online
                socket.emit('private chat message', { sender: 'System', message: `User ${targetUsername} is not online.` })
            }
        } else {
            console.warn(`Target user ${targetUsername} not found.`)
            // Optionally, notify the sender that the target user is not found
            socket.emit('private chat message', { sender: 'System', message: `User ${targetUsername} not found.` })
        }
    })

    // Handle clear chat request
    socket.on('clear chat', async function () {
        // Clear chat messages in Redis
        await setAsync('chat_messages', '[]')

        // Notify the specific client to clear their chat
        socket.emit('clear chat')
    })
})

// Start the server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

export { io }