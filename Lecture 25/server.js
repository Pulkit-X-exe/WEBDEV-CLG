const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000;
const doctorsRoutes = require('./routes/doctors.routes')

app.use(express.json())
app.use('/',doctorsRoutes)


mongoose.connect('mongodb://localhost:27017/HospitalDB').then(()=>{
    console.log('Dataabse connected');
}).catch((err)=>{
    console.log(err) 
})
app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})  