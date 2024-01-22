"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAsync = exports.getAsync = void 0;
const redis_1 = __importDefault(require("redis"));
const util_1 = require("util");
const redisOptions = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
};
const redisClient = redis_1.default.createClient(redisOptions);
exports.getAsync = (0, util_1.promisify)(redisClient.get).bind(redisClient);
exports.setAsync = (0, util_1.promisify)(redisClient.set).bind(redisClient);
