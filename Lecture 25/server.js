const express = require('express')
const app = express()
const doctorsRoutes = require('./routes/doctors.routes')
const connectDB = require('./config/db.js')
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;
app.use(express.json())
app.use('/',doctorsRoutes)



connectDB();

app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})  