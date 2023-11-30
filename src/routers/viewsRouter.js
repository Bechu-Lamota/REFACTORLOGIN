const {Router} = require('express')
const ProductManager = require('../DAOs/manager/productManager')
const CartManager = require('../DAOs/manager/cartManager')
const viewsRouter = Router()

const productManager = new ProductManager()
const cartManager = new CartManager()


viewsRouter.get('/products', async (req, res) => {
    const products = await productManager.getProducts()

    res.render('products', {products})
})

viewsRouter.get('/products/:pid', async (req, res) => {
    const {pid} = req.params
	const user = req.user
    try {
        const product = await productManager.getProductById(pid)
        return res.render('productDetail',{ title: 'Detalle del producto',style:'styles.css', product ,user});
    } catch (error) {
        const errorMessage = req.query.message || 'Ha ocurrido un error';
        res.render('error',{ title: 'Error', errorMessage: errorMessage });
    }
})


//Carrito
viewsRouter.get('/carts/:cid', async (req, res) =>{
	const user = req.user
	const { cid } = req.params

	try {
		const cart = await cartManager.getCartById(cid);

		if (req.user.cart !== cid) {
			const errorMessage = 'No tienes permiso para ver este carrito'
			res.render('error',{ title: 'Error', errorMessage: errorMessage });
		}

		const productsCart = cart[0].products.map(p => p.toObject());
		let { totalQuantity, totalPrice } = productsCart.reduce((accumulator, item) => {
			accumulator.totalQuantity += item.quantity;
			accumulator.totalPrice += item.quantity * item.product.price;

			return accumulator;
		}, 
        { totalQuantity: 0, totalPrice: 0 });
		totalPrice = totalPrice.toFixed(2)

		if (cart[0].products.length === 0) {
			const noProducts = true;	
			return res.render('cartDetail', { title: 'Carrito', noProducts, user })
		}else{
			return res.render('cartDetail', { title:'Carrito', productsCart, user, totalPrice, totalQuantity })
		}
	}catch (error){
		res.render('error', { title:'Error', errorMessage: error.message })
	}
})


// Middleware se session y User
const sessionMiddleware = (req, res, next) => {
	if (req.session.user) {
	  return res.redirect('/profile')
	}
  
	return next()
  }

viewsRouter.get('/register', sessionMiddleware, (req, res) => {
	return res.render('register')
  })
  
  viewsRouter.get('/login', sessionMiddleware, (req, res) => {
	return res.render('login')
  })
  
  viewsRouter.get('/profile', (req, res, next) => {
	if (!req.session.user) {
	  return res.redirect('/login')
	}
  
	return next()
  }, (req, res) => {
	const user = req.session.user
	return res.render('profile', { user })
  })

module.exports = viewsRouter