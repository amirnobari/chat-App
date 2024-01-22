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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const user_1 = __importDefault(require("../models/user"));
const chatRoute_1 = __importDefault(require("../routes/chatRoute"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '../views'));
// Routes
app.get('/', (req, res) => {
    res.render('login'); // نشان دادن صفحه لاگین به جای ثبت نام
});
app.get('/register', (req, res) => {
    res.render('register'); // تنظیم مسیر صحیح برای نمایش صفحه ریجیستر
});
app.get('/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({}).select('username');
    res.render('chat', { users });
}));
app.use('/', authRoutes_1.default);
app.use('/', chatRoute_1.default);
// Add other middleware or configurations as needed
exports.default = app;
