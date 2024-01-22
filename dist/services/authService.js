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
exports.updateUserSocketAndStatus = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
function register(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        return user_1.default.create({ username, password: hashedPassword });
    });
}
exports.register = register;
function login(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_1.default.findOne({ username });
        if (!user)
            return null;
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        return isPasswordValid ? user : null;
    });
}
exports.login = login;
// authService.ts
function updateUserSocketAndStatus(user, socketId, online) {
    return __awaiter(this, void 0, void 0, function* () {
        user.socketId = socketId;
        user.online = online;
        yield user.save();
    });
}
exports.updateUserSocketAndStatus = updateUserSocketAndStatus;
