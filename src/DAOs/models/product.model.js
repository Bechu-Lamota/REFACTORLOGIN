const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const productSchema = mongoose.Schema({
    id: String,
    title: {
        type: String,
        unique: true
    },
    price: Number,
    code: String,
    stock: Number
})

productSchema.plugin(paginate)

module.exports = mongoose.model('products', productSchema)