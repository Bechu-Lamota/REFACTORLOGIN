const { Router } = require('express')
const { io } = require('../utils/app')
const messageModel = require('../DAOs/models/message.model')

const chatRouter = new Router()
const usersnames = []

chatRouter.get('/chatLogin', (req, res) => {
	return res.render('chatLogin')
})

chatRouter.post('/chatLogin', (req, res) => {
	const user = req.body
	const username = user.name

	usersnames.push(username)//una vez que agregamos el usuario a la BD
	io.emit('newUser', username) // con el broadcast.emit del server ya estamos haciendo esto//Estamos mandando que se emita un nuevo usuario 

	res.redirect(`/chat?username=${username}`)//`/chat?username=${userName}`=> es para que se vea en el buscador el usuario sino con ('chat') ya estaba bien.
})

chatRouter.get('/chat', (req, res) => {
	return res.render('chat')
})

chatRouter.post('/chat', async (req, res) => {
	const messageData = req.body;
  
	try {
	  console.log('Intentando guardar el mensaje en la base de datos:', messageData);
  
	  const result = await messageModel.create({
		user: messageData.user,
		message: messageData.message,
	  });
  
	  console.log('Mensaje guardado en la base de datos:', result);
  
	  io.emit('message', result);
	  return res.status(201).json(result);
	} catch (error) {
	  console.error('Error al guardar el mensaje:', error);
	  return res.status(500).json({ error: 'Error al guardar el mensaje en la base de datos.' });
	}
  });


module.exports = chatRouter