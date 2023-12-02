const { Router } = require('express')
const userModel = require('../DAOs/models/userModel')

const sessionRouter = new Router()
const { createHash, isValidPassword } = require('../utils/passwordHash')
const passport = require('passport')

sessionRouter.get('/', (req, res) => {
  //return res.json(req.session)
  if (!req.session.counter) {
    req.session.counter = 1
    req.session.name = req.query.name

    return res.json(`Bienvenido ${req.session.name}`)
  } else {
    req.session.counter++

    return res.json(`${req.session.name} has visitado la página ${req.session.counter} veces`)
  }
})

sessionRouter.post('/register', 
  passport.authenticate('register', { failureRedirect: '/failregister' }), 
  async (req, res) => {
    return res.status(201).json(req.user)
  })

  sessionRouter.get('/failregister', (req, res) => {
    return res.json({
      error: 'Error al registrarse'
    })
  })
  
  sessionRouter.get('/faillogin', (req, res) => {
    return res.json({
      error: 'Error al iniciar sesión'
    })
  })
  
  sessionRouter.post('/userLogin', 
  passport.authenticate('userLogin', { failureRedirect: '/userLogin', failureFlash: true }), 
  async (req, res) => {
    console.log({
      user: req.user,
      session: req.session
    })
    
    return res.json(req.user)
  })
  
  sessionRouter.post('/recovery-password', async (req, res) => {
  
    let user = await userModel.findOne({ email: req.body.email })
  
    if (!user) {
      return res.status(401).json({
        error: 'El usuario no existe en el sistema'
      })
    }
  
    const newPassword = createHash(req.body.password)
    await userModel.updateOne({ email: user.email }, { password: newPassword })
  
    return res.redirect('/userLogin')
  })

  //INGRESO CON GITHUB
  sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
  })
     
  sessionRouter.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login'}), async (req, res) => {
  return res.json(res.user)
  })

module.exports = sessionRouter