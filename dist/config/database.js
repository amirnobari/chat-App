"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect("mongodb://localhost/mychatapp").then((res) => {
    console.log("Connected to Database Successfully.");
}).catch(() => {
    console.log("Connection to database failed.");
});
