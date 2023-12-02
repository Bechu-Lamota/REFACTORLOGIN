const { app } = require('./utils/app')
const viewsRouter = require('./routers/viewsRouter')
const sessionRouter = require('./routers/sessionRouter')

app.get('/check', (req,res) => {
    return res.json({
        status: 'running',
        date: new Date()
    })
})

app.use('/', viewsRouter)
app.use('/api/sessions', sessionRouter)