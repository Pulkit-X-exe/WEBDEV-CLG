//-----------COMMON MODULE===========================

// function add (a,b){
//     return a+b;
// }
// function subtract (a,b){
//     return a-b;
// }
// function multiply (a,b){
//     return a*b;
// }

// module.exports = {
//     add,
//     subtract,
//     multiply
// }

//======================ES MODULE=====================================
function add (a,b){
    return a+b;
}
function subtract (a,b){
    return a-b;
}
function multiply (a,b){
    return a*b;
}
export {add,subtract,multiply};