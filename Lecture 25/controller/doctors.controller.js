const doctors1 = require('../models/doctors.model');

const getDoctor = async(req,res)=>{
    try{
        const doctors = await doctors1.find();
        res.send(doctors);
    }catch(err){
        res.status(500).json({success: false, message: err.message})
    }
}

const getDoctorById = async(req,res)=>{
    try{
        const doctor = await doctors1.findById(req.params.id);
        res.send(doctor);
    }catch(err){
        res.status(500).json({success: false, message: err.message})
    }
}

const createDoctor = async(req,res)=>{
    try{
        const doctor = new doctors1(req.body);
        await doctor.save();
        res.status(201).json({success: true, data: doctor});
    }catch(err){
        res.status(500).json({success: false, message: err.message})
    }
}

const updateDoctor = async(req,res)=>{
    try{
        const doctor = await doctors1.findByIdAndUpdate(req.params.id,req.body,{new: true});
        res.json({success: true, data: doctor});
    }catch(err){
        res.status(500).json({success: false, message: err.message})
    }
}

const deleteDoctor = async(req,res)=>{
    try{
        const doctor = await doctors1.findByIdAndDelete(req.params.id);
        res.json({success: true, data: doctor});
    }catch(err){
        res.status(500).json({success: false, message: err.message})
    }
}

module.exports = {
    getDoctor,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
}