const messageModel = require("../models/message.model")

class messageManager {
    constructor(io) {
        this.model = messageModel
        this.io = io
    }

    async getMessages() {
        try {
            const messages = this.model.find()

            return messages.map((m) => m.toObjec())
        } catch (e) {
            throw e
        }
    }

    async addMessage(user, message) {
        try {
            const newMessage = await this.model.create({
                user: user,
                message: message
            })
        
            await newMessage.save()

            this.io.emit('newMessage', {
                user: newMessage.user,
                message: newMessage.message,
                timerecord: newMessage.timerecord
            })

            return newMessage.toObject()
        } catch (e) {
            throw e
        }
    } 
}

module.exports = messageManager