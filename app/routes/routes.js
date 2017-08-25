import express from 'express'
import {
	middlewareTokenValidation, 
	signUp, 
	authenticate, 
	validateToken, 
	getAllUsers, 
	getUserById, 
	updateUser, 
	deleteUser
} from '../controller/controller'

const routes = express.Router()

routes.post('/signup', signUp)

routes.post('/authenticate', authenticate)

routes.use(middlewareTokenValidation)

routes.get('/token', validateToken)

routes.get('/user', getAllUsers)

routes.get('/user/:userId', getUserById)

routes.patch('/user/:userId', updateUser)

routes.delete('/user/:userId', deleteUser)

export default routes;