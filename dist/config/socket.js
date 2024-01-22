"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("./express"));
const http_1 = __importDefault(require("http"));
const redis_1 = require("./redis");
require("./database");
const user_1 = __importDefault(require("../models/user"));
const socket_io_1 = require("socket.io");
const server = http_1.default.createServer(express_1.default);
const io = new socket_io_1.Server(server, { /* options */});
exports.io = io;
// Handle user login
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    const req = socket.request;
    console.log('Socket ID:', socket.id); // برای اطمینان از درستی گرفتن socket.id
    // Load previous messages from Redis
    const messages = yield (0, redis_1.getAsync)('chat_messages');
    if (messages) {
        socket.emit('load messages', JSON.parse(messages));
    }
    // Listen for user login events
    socket.on('user login', (username) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = yield user_1.default.findOneAndUpdate({ username: socket.username }, { username, online: true, socketId: socket.id }, { upsert: true, new: true });
        // Store the socket ID in the database
        updatedUser.socketId = socket.id;
        yield updatedUser.save();
        // Emit user online/offline events
        io.emit('user online', updatedUser.username);
        // Send the list of online users to the newly logged-in user
        const onlineUsers = yield user_1.default.find({ online: true }).select('username');
        io.to(socket.id).emit('update user list', onlineUsers);
    }));
    // Listen for disconnect events
    socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('User disconnected');
        const currentUser = yield user_1.default.findOneAndUpdate({ socketId: socket.id }, { online: false, socketId: '' }, // Set online status to false and clear socketId
        { new: true });
        if (currentUser) {
            io.emit('user offline', currentUser.username);
        }
    }));
    // Handle chat messages
    socket.on('chat message', (msg, targetUsername) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Received message for target user:', targetUsername);
        // Save the message to Redis
        const existingMessages = yield (0, redis_1.getAsync)('chat_messages');
        const updatedMessages = existingMessages ? JSON.parse(existingMessages) : [];
        updatedMessages.push({ sender: socket.username, targetUser: targetUsername, message: msg });
        yield (0, redis_1.setAsync)('chat_messages', JSON.stringify(updatedMessages));
        // Get the target user's socket ID
        const targetUser = yield user_1.default.findOne({ username: targetUsername });
        if (targetUser) {
            const targetSocketId = targetUser.socketId;
            if (targetSocketId) {
                io.to(targetSocketId).emit('private chat message', { sender: socket.username, message: msg });
                // Send confirmation to the sender
                socket.emit('private chat message', { sender: socket.username, message: msg });
            }
            else {
                console.warn('Target user is not online.');
                // Optionally, notify the sender that the target user is not online
                socket.emit('private chat message', { sender: 'System', message: `User ${targetUsername} is not online.` });
            }
        }
        else {
            console.warn(`Target user ${targetUsername} not found.`);
            // Optionally, notify the sender that the target user is not found
            socket.emit('private chat message', { sender: 'System', message: `User ${targetUsername} not found.` });
        }
    }));
    // Handle clear chat request
    socket.on('clear chat', function () {
        return __awaiter(this, void 0, void 0, function* () {
            // Clear chat messages in Redis
            yield (0, redis_1.setAsync)('chat_messages', '[]');
            // Notify the specific client to clear their chat
            socket.emit('clear chat');
        });
    });
}));
// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
