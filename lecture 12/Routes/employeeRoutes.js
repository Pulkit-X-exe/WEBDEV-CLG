const express = require('express');
const { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } = require('../controller/employeeController.js');
const router = express.Router();

//Read
router.get("/employees", getEmployees);

router.get("/employees/:id", getEmployeeById);

//CREATE
router.post("/employees", createEmployee);

//UPDATE
router.put("/employees/:id", updateEmployee); 

//DELETE
router.delete("/employees/:id", deleteEmployee);

module.exports = router;
    