const express = require('express')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const session = require('express-session')
const initializePassport = require('../config/passport.config')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//configuración handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.static('public'))

//configuración mongo
const MONGODB_CONNECT = 'mongodb+srv://lamotaas:bWSantGjgrt5fXQ5@cluster0.z23acmk.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.connect(MONGODB_CONNECT)
  .then(async _ => { 
    console.log('Conectado a la base de datos "ECOMMERCE 2023"')
  })

//cookie y session
app.use(cookieParser('secretkey'))
app.use(session({
  store: MongoStore.create({
    mongoUrl: MONGODB_CONNECT,
    ttl: 15
  }),
  secret: 'secretSession',
  resave: true,
  saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

const PORT = 8080
const httpServer = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))

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

    socket.broadcast.emit('notification', `${username} se ha unido al chat`)

    socket.emit('notification', `Bienvenid@ ${username}`)
    socket.emit('messages', JSON.stringify(messages))
  })

  socket.on('newMessage', message => {
    const user = users.find(user => user.socketId === socket.id)

    const newMessage = {
      message,
      user: user.name
    }
    messages.push(newMessage)

    io.emit('message', JSON.stringify(newMessage))
  }) 
})

module.exports = {
  app,
  io
}
