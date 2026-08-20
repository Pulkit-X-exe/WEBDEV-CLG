const { log } = require('console');
const os = require('os');

console.log(os.platform());
console.log(os.arch());
console.log(os.hostname());
console.log(os.version());
console.log(os.type());
console.log(os.cpus().length);
console.log(os.homedir());
console.log(os.totalmem()/(1024*1024*1024)+"GB")
console.log(os.freemem()/(1024*1024)+"MB")

console.log(os.machine())
console.log(os.availableParallelism())   
console.log(os.platform())   
console.log(os.uptime())   
console.log(os.type())   
console.log(os.type())   