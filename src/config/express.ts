import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import authRoutes from '../routes/authRoutes'
import User from '../models/user'
import chatRoute from '../routes/chatRoute'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Set the view engine to EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))

// Routes
app.get('/', (req, res) => {
    res.render('login') // نشان دادن صفحه لاگین به جای ثبت نام
})

app.get('/register', (req, res) => {
    res.render('register') // تنظیم مسیر صحیح برای نمایش صفحه ریجیستر
})

app.get('/chat', async (req, res) => {
    const users = await User.find({}).select('username')
    res.render('chat', { users })
})

app.use('/', authRoutes)
app.use('/', chatRoute)

// Add other middleware or configurations as needed

export default app