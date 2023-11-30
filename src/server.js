const chatRouter = require('./routers/chatRouter')
const { app } = require('./utils/app')
const productRouter = require('./routers/productsRouter')
const viewsRouter = require('./routers/viewsRouter')
const cartRouter = require('./routers/cartRouter')
const productModel = require('./DAOs/models/product.model') //Este productModel corresponde??

app.use(chatRouter)
app.use('/api/products' ,productRouter)
app.use(viewsRouter)
app.use('/api/cart', cartRouter)
app.use(productModel)


app.get('/healtcheck', (req, res) => {
	return res.json ({
		Status: 'Running',
		date: new Date()
	})
})

app.get('/home', (req, res) => { //home me muestra el listado de productos
    return res.render('home')
})

app.get('/realTimeProducts', (req, res) => {
    return res.render('realtimeproducts')
})

;(async () => {
//No comprendo porque no funciona mi paginate
	app.get('/products', async (req, res) => {
		const page = req.query.page || 1
		const limit = req.query.limit || 5
	
		const params = { limit, page }
	
		if (req.params.sort) {
			params.sort = { title: 1 }
		}
	
		const products = await productModel.paginate({ }, params )
		products.docs = products.docs.map(product => product.toObject())
	
		return res.render('products', products)
	})
})()

app.get('/api/products', (req, res) => {//Devuelve los productos en formato json
	return res.json(productos)
})

app.get('/api/carts', (req, res) => {//Devuelve los carritos en formato json
	return res.render('carts')
})
