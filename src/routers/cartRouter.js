const {Router} = require('express')
const CartManager = require('../DAOs/manager/cartManager')
const cartRouter = Router()

const cartManager = new CartManager()

cartRouter.get('/', async (req, res) => {
    const carts = await cartManager.getCarts()

    res.json(carts)
})

cartRouter.get('/:cid', async (req, res) => {
    const cid = req.params.cid

    const carts = await cartManager.getCartById(cid)

    res.json(carts)
})

cartRouter.post('/', async (req, res) => {
    const body = req.body

    const cart = await cartManager.addCart(body)

    res.status(201).json(cart)
})

cartRouter.put('/:cid', async (req, res) => { // updateCartProducts
    const { cid } = req.params
    const body = req.body
    
    const carts = await cartManager.updateCart(cid, body)

    res.json(carts)
})

cartRouter.put('/:cid', async (req, res) => { // Solo la cantidad
    const { cid } = req.params
    const { newProducts } = req.body

    try {
        if (!newProducts) return res.status(500)

        const cart = await cartManager.updateCartProducts(cid, newProducts)

        res.status(200).json(cart)
    } catch (error) {
        res.status(404).json({
            cart: e.cart
            })
    }
})

cartRouter.put('/:cid/products/:pid', async (req, res) => { // Solo la cantidad
    const { cid, pid } = req.params
    const { quantity } = req.body

    try {
        if (quantity === null || quantity === undefined) return res.status(500)
        if (quantity < 0) return res.status(500)

        const cart = await cartManager.updateCartProduct(cid, pid, quantity)
        res.status(200).json(cart)
    } catch (err) {
        res.status(404).json({
            cart: e.cart
        })
    }
})

cartRouter.delete('/:cid', async (req, res) => {
    const { cid } = req.params

    try {
        const cart = await cartManager.deleteCart(cid)

        res.status(201).json(cart)
    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params

    try {
        const cart = await cartManager.deleteProductCart(cid, pid)

        res.status(201).json(cart)
    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

cartRouter.delete('/:cid/products', async (req, res) => { 
    const { cid } = req.params

    try {
        const cart = await cartManager.deleteProductsCart(cid)

        res.status(201).json(cart)
    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})



module.exports = cartRouter