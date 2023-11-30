const userModel = require('../models/user.model');

class UserManager {
    constructor() {
        this.model = userModel
    }

async addUser(userData) {
    try{ 
        if (userData.email.startsWith('admin')) {
            userData.rol = 'admin';
        }

        const newUser = await this.model.create({
            name: userData.name,
            lastname: userData.lastname,
            email: userData.email,
            age: userData.age,
            adress: userData.adress,
            password: userData.password
        })
        return newUser

    } catch (e) {
        console.log('Error al cargar el usuario a la Base de Datos', e)
    }
}
async getUserByEmail(email) {
    try {
        return this.model.findOne(email)
    } catch (e) {
        console.log('Error al obtener el usuario por su mail', e)
    }
}
}

module.exports = UserManager
