const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const helmet = require('helmet')
const morgan = require('morgan')
const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')

const app = express()

// database connection
mongoose.connect(
	process.env.MONGO_CONNECTION_STRING,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	() => {
		console.log('Connected to the remote mongo database')
	}
)

// middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

/** handle potential CORS issues */
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	)

	if (req.method == 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT')
	}

	next()
})

// routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
	return res.json({
		message: 'Welcome to the social media REST api'
	})
})

// listen
app.listen(8800, () => {
	console.log('Backend server running on port 8800')
})
