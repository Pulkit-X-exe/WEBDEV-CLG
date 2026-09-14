const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const employees = [
    { id: 1, name: "Aarav Sharma", salary: "30000", department: "IT" },
    { id: 2, name: "Rohan Verma", salary: "35000", department: "HR" },
    { id: 3, name: "Aditya Singh", salary: "40000", department: "Finance" },
    { id: 4, name: "Arjun Mehta", salary: "45000", department: "IT" },
    { id: 5, name: "Karan Gupta", salary: "50000", department: "HR" },
    { id: 6, name: "Yash Malhotra", salary: "55000", department: "Finance" },
]
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

//Read
app.get("/employees", (req, res) => {
    res.json(employees);
});

app.get("/employees/:id", (req, res) => {
    const id = req.params.id;
    const employee = employees.find((employee) => employee.id == Number(id));  
    if(!employee) {
        return res.status(404).json({ error: "Employee not found" });
        console.log("Employee not found");
    }
    res.json(employee);

});

//CREATE
app.post("/employees", (req, res) => {
    const employee = req.body;
    employees.push({ id: employees.length + 1, ...employee });
    res.status(201).json(employee);
});

//UPDATE

app.put("/employees/:id", (req, res) => {
    const id = req.params.id;
    const employee=req.body;
    const result = employees.find((employee) => employee.id == Number(id));
    if(!result) {
        return res.status(404).json({ error: "Employee not found" });
    }
    result.name = employee.name;
    result.salary = employee.salary;
    result.department = employee.department;
    res.json({ success: true ,employee: result });
}); 

//DELETE
app.delete("/employees/:id", (req, res) => {
    const id = req.params.id;
    const result = employees.findIndex((employee) => employee.id == Number(id));
    if(!result) {
        return res.status(404).json({ error: "Employee not found" });
    }
    employees.splice(id -1, 1);
    res.json({ success: true, message: "Employee deleted successfully" });
});