const express = require('express');
const app = express();
const PORT = 3000;


app.get("/",(req,res)=>{
    console.log("HELLO")
    res.end("Hello from Express")
})

app.get("/age-check/:age",(req,res)=>{
    let age = parseInt(req.params.age)
    try{
        if(age < 18){
            throw new Error("You are not eligible to vote")
        }else{
            res.send("You are eligible to vote")
        }
    }catch(error){
        // res.status(400).json({success:false,message:"Age is not valid",error:error.message})
        next(error) //passing error to error handling middleware
    }
})

app.use((err,req,res,next)=>{  //error handling middleware
    res.status(400).json({success:false,message:"Age is not valid",error:err.message})
})

app.use((req,res)=>{ //invalid route middleware
    res.status(404).json({success:false,message:"Route not found"})
})

app.listen(PORT,()=>console.log(`Server is running on Port ${PORT}`));