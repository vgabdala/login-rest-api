import express from 'express'
import {middlewareTokenValidation, signUp, authenticate, validateToken, getAllUsers} from '../controller/controller'

const routes = express.Router()

routes.post('/signup', signUp)

routes.post('/authenticate', authenticate)

routes.use(middlewareTokenValidation)

routes.get('/token', validateToken)

routes.get('/users', getAllUsers)

export default routes;