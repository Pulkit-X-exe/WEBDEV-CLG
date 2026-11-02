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

//doctors by id
app.get('/doctors/:id',async(req,res)=>{
    try{
        const doctor = await 'doctors1'.findById(req.params.id);
        res.send(doctor);
    }catch(err){
        res.status(500).json({success: false, message: err.message})
    }
})

//new doctor
app.post('/doctors',async(req,res)=>{
    try{
        const doctor = new 'doctors1'(req.body);
        await doctor.save();
        res.status(201).json({success: true, data: doctor});
    }catch(err){
        res.status(500).json({success: false, message: err.message})
    }
})

//update doctor
app.put('/doctors/:id',async(req,res)=>{
    try{
        const doctor = await 'doctors1'.findByIdAndUpdate(req.params.id,req.body,{new: true});
        res.json({success: true, data: doctor});
    }catch(err){
        res.status(500).json({success: false, message: err.message})
    }
})

//delete doctor
app.delete('/doctors/:id',async(req,res)=>{
    try{
        const doctor = await 'doctors1'.findByIdAndDelete(req.params.id);
        res.json({success: true, data: doctor});
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