const { app } = require('./utils/app')

app.get('/healtcheck', (req, res) => {
	return res.json ({
		Status: 'Running',
		date: new Date()
	})
})