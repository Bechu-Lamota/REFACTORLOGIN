const { Schema, model, default: mongoose } = require('mongoose')

const userSchema = Schema({
    name: String,
    lastname: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    adress: String,
    password: String,
    rol: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: Date,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    }
})

module.exports = model('users', userSchema)