const socket = io() //ya con esto y el index, nuestro front end ya se esta conectando a nuestro servidor.

const messageContainer = document.getElementById('messageContainer')
const messageInput = document.getElementById('messageInput')
const messageButton = document.getElementById('messageButton')
const notificationContainer = document.getElementById('notificationContainer')

const params = Qs.parse(window.location.search, { //Lo que hace esta libreria que importamos en index.handlebars es parsear todos mis parametros en este caso los users.
	ignoreQueryPrefix: true
})

socket.emit('joinChat', params.username) //cuando mi archivo cargue, quiero que me ingrese al chat

socket.on('notification', notif => { //De esta manera todas las veces que iniciemos sesion de distintas pestañas nos va avisar que se conecto el cliente.
	notificationContainer.innerHTML = notif //Es como una notificacion.
})

messageButton.addEventListener('click', () => {
	const message = messageInput.value
	if (message) {
		socket.emit('newMessage', message)
	}
})

socket.on('message', message => {
	const parsedMessage = JSON.parse(message)
	messageContainer.innerHTML += `<div>${parsedMessage.user}: ${parsedMessage.message} </div>`
})

socket.on('newUser', user => {
	console.log({ user })
  })

//Para tener el arreglo de los mensajes anteriores:
socket.on('messages', messages => {
	const parsedMessages = JSON.parse(messages);
	messageContainer.innerHTML = '';
	parsedMessages.forEach(msg => {
		messageContainer.innerHTML += `<div>${msg.user}: ${msg.message} </div>`
	})
})