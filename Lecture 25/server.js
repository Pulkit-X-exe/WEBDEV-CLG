const express = require('express')
const app = express()
const port = 3000;
const doctorsRoutes = require('./routes/doctors.routes')
const connectDB = require('./config/db.js')
const dotenv = require('dotenv');
dotenv.config();


app.use(express.json())
app.use('/',doctorsRoutes)



connectDB();

app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})  