
import mongoose from 'mongoose'


mongoose.connect("mongodb://localhost/mychatapp").then(
    (res) => {
        console.log("Connected to Database Successfully.")
    }
).catch(() => {
    console.log("Connection to database failed.")
})