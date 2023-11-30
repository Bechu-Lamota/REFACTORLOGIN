const { Router } = require('express')
const UserManager = require('../DAOs/manager/userManager')
const sessionRouter = Router()

const userManager = new UserManager()

sessionRouter.get('/', async (req, res) => {
    if (!req.session.counter) {
        req.session.counter = 1
        req.session.name = req.query.name
        
        return res.status(200).json({ status: 'successful', message: `Bienvenido ${req.session.name}`})
    } else {
        req.session.counter++

        return res.status(200).json({ status: 'successful', message: `${req.session.name} has visitado ${req.session.counter} veces el website.`})
    }
})

sessionRouter.post('/register', async (req, res) => {
    try {
    const user = await userManager.addUser(req.body)
    return res.redirect('/login')
    } catch (error) {
        return res.status(500).json({ error: 'Error al registrar el usuario.'})
    }
})

sessionRouter.post('/login', async (req, res) => {
    try {
        const { uid } = req.params
        const user = await userManager.getUserByEmail(uid)

    if (!user) {
         return res.status(401).json({
            error: 'El usuario no existe en el sistema'
        })
    }

    if (user.password !== req.body.password) {
        return res.status(401).json({
            error: 'Datos incorrectos'
        })
    }

        const userAuthenticate = user.toObject();
        delete userAuthenticate.password;
         req.session.user = userAuthenticate;
         return res.redirect('/products');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al iniciar sesión.' });
    }
})



module.exports = sessionRouter