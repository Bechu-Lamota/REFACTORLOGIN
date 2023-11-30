const { Schema, model } = require('mongoose')

const cartSchema = Schema({
    id: String,
    products: {
        type:[
            {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
                },
            quantity: {
                type: Number,
                default: 1
                },
            }
        ],
        default: []
    },
})

cartSchema.pre('findProduct', function () {
    this.populate('products.product')
})

module.exports = model('carts', cartSchema)