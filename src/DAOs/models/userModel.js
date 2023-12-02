const { Schema, model } = require('mongoose')

const userSchema = Schema({
  name: String,
  lastname: String,
  email: {
    type: String,
    unique: true
  },
  age: Number,
  password: String,
  createdAt: Date
})

module.exports = model('users', userSchema)

/*
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
        ref: 'carts',
        default: []
    }
})

module.exports = model('users', userSchema)
*/