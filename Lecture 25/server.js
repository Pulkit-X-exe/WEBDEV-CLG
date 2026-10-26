const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000;


app.get('/doctors',async(req,res)=>{
    try{
        const doctors = await 'doctors1'.find();
        res.send(doctors);
    }catch(err){
        res.status(500).json({success: false, message: err.message})
    }
})


mongoose.connect('mongodb://localhost:27017/HospitalDB').then(()=>{
    console.log('Dataabse connected');
}).catch((err)=>{
    console.log(err) 
})
app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})