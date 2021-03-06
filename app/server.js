import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import mongoose from 'mongoose'
import config from './config'
import routes from './routes/routes'

const app = express()

// Configuration
var env = app.get('env')
var secret = config.mongo.default.secret
var dbPort = config.mongo.default.port
var dbHost = (env == 'production') ? config.mongo.production.host : config.mongo.development.host
var dbName = (env == 'production') ? config.mongo.production.db : config.mongo.development.db

// Database connection
mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, { useMongoClient: true })
app.set('superSecret', process.env.MONGO_SECRET)

// Enable parameter parsing through POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Enable logging of requests
app.use(morgan('dev'))

// Start server
app.get('/login-service', function(req, res) {
    res.send(`login-rest-api'`)
});

app.use('/login-service', routes)

const port = process.env.NODE_PORT || 8081
app.listen(port)

console.log(`login-rest-api is running on ${env} environment on port ${port}`)