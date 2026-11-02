const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({

    Name:{
        type: String,
        required : true
    },
    experience:{
        type: Number,
        required : true
    },
    salary:{
        type: Number,
        required : true
    },
    email:{
        type: String,
        unique : true,
        required : true
    },

})
module.exports = mongoose.model('doctors1', doctorSchema);