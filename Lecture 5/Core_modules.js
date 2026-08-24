// const { log } = require('console');
// const os = require('os');

// console.log(os.platform());
// console.log(os.arch());
// console.log(os.hostname());
// console.log(os.version());
// console.log(os.type());
// console.log(os.cpus().length);
// console.log(os.homedir());
// console.log(os.totalmem()/(1024*1024*1024)+"GB")
// console.log(os.freemem()/(1024*1024)+"MB")

// console.log(os.machine())
// console.log(os.availableParallelism())   
// console.log(os.platform())   
// console.log(os.uptime())   
// console.log(os.type())   
// console.log(os.type())   


const { log } = require('console');
const path = require('path');
const fs = require('fs');


const file = path.resolve("Core_modules.js");
console.log(file);
console.log(__dirname);

const joint = path.join("AIML","PADHAI")
console.log(joint)

const filename = "D:\college stuff\third sem clg\WEBDEV\Core_modules.js";
console.log(path.basename(filename))
console.log(path.extname(filename))
console.log(path.dirname(filename))

const data = fs.readFileSync("Lecture 5\\sample.txt","utf-8")
console.log(data)

fs.readFile("Lecture 5\\sample.txt","utf-8",(err,data)=>{
    if(err){
        console.log(err);
    }else{
        console.log(data);
    }
})