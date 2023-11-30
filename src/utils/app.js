const express = require('express')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const mongoose = require('mongoose')
const MongoConnect = require('connect-mongo')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', ('views/layouts'))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

const MONGODB_CONNECT = 'mongodb+srv://lamotaas:bWSantGjgrt5fXQ5@cluster0.z23acmk.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.connect(MONGODB_CONNECT)
    .then(() => console.log('BD conectada al servidor 8080'))
    .catch((e) => console.log(e))

const PORT = 8080
const httpServer = app.listen( PORT, () => console.log(`Servidor corriendo correctamente en el puerto ${PORT}`))

const io = new Server(httpServer)
const users = []
const messages = []

io.on('connection', socket => {
	console.log('Nuevo cliente conectado')

	socket.on('joinChat', username => {
		users.push({
			name: username,
			socketId: socket.id
		})

		socket.broadcast.emit('notification', `${username} se ha unido a la conversacion`)
		socket.emit('notification', `Te has unido a la conversacion ${username}`)
		socket.emit('messages', JSON.stringify(messages))
	})

	//Ahora cachamos el mensaje del front end desde el backend:
	socket.on('newMessage', message => {
		const user = users.find(user => user.socketId === socket.id)
		
		const newMessage = {
			message,
			user: user.name
		}
		messages.push(newMessage)
		console.log(newMessage)

		io.emit('message', JSON.stringify(newMessage))
	})
})

//AGREGO
app.use(cookieParser('secrekey'))
app.use(session({
	store: MongoConnect.create({
		mongoUrl: MONGODB_CONNECT,
		ttl: 15
	}),
	secret: 'secretSession',
	resave: true,
	saveUninitialized: true
}))

const sessionRouter = require('../routers/sessionRouter')
app.use('/api/session', sessionRouter)

module.exports = {
    app,
    io
}