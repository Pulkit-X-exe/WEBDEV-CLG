const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctors1.model');
const { getDoctor, getDoctorById, createDoctor, updateDoctor, deleteDoctor } = require('../controller/doctors.controller');

router.get('/api/doctors',getDoctor)

//doctors by id
router.get('/api/doctors/:id',getDoctorById)

//new doctor
router.post('/api/doctors',createDoctor)

//update doctor
router.put('/api/doctors/:id',updateDoctor)

//delete doctor
router.delete('/api/doctors/:id',deleteDoctor)

module.exports = router;