const mongoose = require('mongoose')

const massageSchema = mongoose.Schema({
    user: String, 
    message: {
        type: String,
        unique: true
    }, 
    timerecord: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('messages', massageSchema)