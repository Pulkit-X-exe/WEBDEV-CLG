const express = require('express');
const morgan = require('morgan')
const app = express()
app.use(morgan())
const PORT = 3000

const MiddleWare = (req,res,next)=>{
    req.name = "PULKIT"
    // res.send("hello from Middleware")
    // console.log(`${req.method} request for ${req.url}`)
    console.log('Middleware function is called')
    console.log("Request URL:", req.url,req.method,req.query,"TIME:",new Date().toLocaleString())
    next()
}

const apiMiddleWare = (req,res,next)=>{
    if(req.query.API_KEY === '12345'){
        console.log("authenticated")
        next()
    }else{
        res.send('API KEY is not valid')
    }
}

app.use(MiddleWare)
// app.use(apiMiddleWare)

app.get('/',(req,res)=>{
    console.log("Request by" ,req.name)
    res.send('Hello World')
})

app.get('/about',(req,res)=>{
    res.send('About Page')
})

app.get('/data',apiMiddleWare,(req,res)=>{
    // res.send('Data Page')
    res.json({
        name: "Pulkit",
        age: 21,
        city: "Delhi"
    })
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})