"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    socketId: { type: String, default: '' }, // Add default value
    online: { type: Boolean, default: false }, // Add default value
    // ...
});
exports.default = (0, mongoose_1.model)('User', userSchema);
