const socket = io() 

const messageContainer = document.getElementById('messageContainer')
const messageInput = document.getElementById('messageInput')
const messageButton = document.getElementById('messageButton')
const notificationContainer = document.getElementById('notificationContainer')

console.log({ messageContainer, messageInput, messageButton, notificationContainer })

const params = Qs.parse(window.location.search, {
	ignoreQueryPrefix: true
})

console.log(params)

socket.emit('joinChat', params.username) 

socket.on('notification', notif => { 
	notificationContainer.innerHTML = notif 
})

messageButton.addEventListener('click', (e) => {
	const message = messageInput.value

	if (message) {
		socket.emit('newMessage', message)
	}

	console.log({ message })
})

socket.on('message', messageString => {
	const message = JSON.parse(messageString)
	messageContainer.innerHTML += `
	<div>${message.user}: ${message.message} </div>
	`
})

socket.on('messages', messagesString => {
	const messages = JSON.parse(messagesString)
	messageContainer.innerHTML = ''
	messages.forEach(message => {
		messageContainer.innerHTML += `
		<div>${message.user}: ${message.message} </div>
		`
	})
})