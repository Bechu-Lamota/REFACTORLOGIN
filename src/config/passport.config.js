const passport = require('passport')
const passportLocal = require('passport-local')
const userModel = require('../DAOs/models/userModel')
const { createHash, isValidPassword } = require('../utils/passwordHash')
const GitHubStrategy = require('passport-github2')

const LocalStrategy = passportLocal.Strategy

const initializePassport = () => {
  passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username })
  
        if (user) {
          console.log('Usuario ya existe')
          return done(null, false)
        }
  
        const body = req.body
        body.password = createHash(body.password)
        console.log({ body })
        
        const newUser = await userModel.create(body)
  
        return done(null, newUser)
      } catch (e) {
        return done(e)
      }
    }
  ))

  passport.use('userLogin', new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        let user = await userModel.findOne({ email: email })

        if (!user) {
          console.log('El usuario no existe en el sistema')
          return done(null, false, { message: 'El usuario no existe en el sistema' })
        }

        if (!isValidPassword(password, user.password)) {
          // console.log('Datos incorrectos')
          return done(null, false, { message: 'Datos incorrectos' })
        }

        user = user.toObject()
        delete user.password
        done(null, user)
      } catch (e) {
        return done(e)
      }
    }
  ))

  passport.use('github', new GitHubStrategy({ 
    clientID: 'Iv1.326fe12ae6221d33',
    clientSecret: '2c08da9a1b5e6ced187beed93b0355221d446489',
    callbackURL: 'http://localhost:8080/api/sessions/github-callback'
    }, async (accsessToken, refreshToken, profile, done) => {

    try {
    let user = await userModel.findOne({ username: profile._json.login })

    if (user) {
      console.log('Usuario ya existe')
      return done(null, user)
    }
      const newUser = await userModel.create({
        username: profile._json.login,
        name: profile._json.name
      })

      return done(null, newUser) //luego lo usamos/traemos para el inicio
    } catch (error) {
        return done(error)
            }
        }))

  passport.serializeUser((user, done) => {
    console.log('serializeUser')
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    console.log('deserializeUser')
    const user = await userModel.findOne(id)
    done(null, user)
  })
}

module.exports = initializePassport
