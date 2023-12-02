const { Router } = require('express')
const { io } = require('../utils/app')

	const viewsRouter = new Router()
	const usersnames = []

	viewsRouter.get('/login', (req, res) => {
		return res.render('login')
	})

	viewsRouter.post('/login', (req, res) => {
		const user = req.body
		const username = user.name

		usersnames.push(username)
        console.log({ username })
		io.emit('newUser', username) 

		return res.redirect(`/chat?username=${username}`)
	})

	viewsRouter.get('/chat', (req, res) => {
		return res.render('index')
	})

    //SESSIONS
    const sessionMiddleware = (req, res, next) => {
        if (req.session.user) {
          return res.redirect('/profile')
        }
      
        return next()
      }
      
      viewsRouter.get('/register', sessionMiddleware, (req, res) => {
        return res.render('register')
      })
      
      viewsRouter.get('/userLogin', sessionMiddleware, (req, res) => {
        return res.render('userLogin')
      })
      
      viewsRouter.get('/profile', (req, res, next) => {
        if (!req.session.user) { //Nos verifica la session, la autenticacion
          return res.redirect('/userLogin')
        }
        return next()
      }, (req, res) => {
        const user = req.session.user
        return res.render('profile', { user })
      })
      
      //ACTIVIDAD RECUPERO DE CONTRASEÑA
      viewsRouter.get('/recovery-password', sessionMiddleware, (req, res) => {
        return res.render('recovery-password')
      }) 


module.exports = viewsRouter