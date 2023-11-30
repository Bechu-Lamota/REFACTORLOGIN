const cartModel = require('../models/cart.model')

class cartManager {
    constructor() {
        this.model = cartModel
    }
    
    async getCart() {
        try{
            const carts = await this.model.find()
 
            return carts.map(p => p.toObject())
            
         } catch (e) {
             console.log('Error al obtener los carritos', e )
             return []
         }
     }

    async getCartById(cid) {
        try{
            return this.model.findById(cid)
        } catch (e) {
            console.log('Error al obtener el carrito', e )
        }
    }

    async addCart() {
        try{
            return this.model.create({
                products: []
            })
        } catch (e) {
            console.log('Error al obtener el producto', e )
        }
    }

    async updateCart(cid, pid) {
        const cart = await this.getProductById(cid)

        if (!cart) {
            throw new Error('Carrito inexistente')
        }

        const cartUpdate = {
            _id: cart._id,
            products: { products: pid }
        }
        await this.model.updateOne({ _id: cid }, cartUpdate)

        return cartUpdate
    }

    async updateCartProduct(cid, pid, quantity) {
        const cart = await this.getProductById(cid)

        try {
            await this.model.updateOne({ _id: cart._id , 'products.product':pid}, { $set: {'products.$.quantity': quantity } })
        } catch (e) {
            throw e
        }
    }

    async updateCartProducts(cid, newProducts) {
        const cart = await this.model.findById(cid)
        
        try {
            await this.model.updateOne(
                { _id: cart._id },
                { $set: { products: newProducts }}
            )
        } catch (e) { 
            throw e }
    }

    async getCartProductById() {

    }

    async deleteCart(cid) {
        try {
            const cart = await this.getCartById(cid)
            
            if (!cart) {
                 throw new Error('Carrito inexistente')
                }
                
                await this.model.deleteOne({ _id: cid })
            } catch (e) {
                throw e
            }
        }

        async deleteProductCart (cid, pid) { //elimina el producto del carrito
            try {
                const cart = await this.getCartById(cid)

                await this.model.updateOne(
                    {_id: cart.id},
                    { $pull: { products: { product: pid }}}
                )
            } catch (e) {
                throw e
            }
        }

        async deleteProductsCart (cid) { //elimina todos los productos del carrito
            try {
                const cart = await this.model.findById(cid);

                await this.model.updateOne(
                    {_id: cart.id},
                    { $pull: { products: [] }}
                )
            } catch (e) {
                throw e
            }
        }
}

module.exports = cartManager