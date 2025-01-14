import { Hono } from 'hono'
import PostController from './controllers/post'
import UserController from './controllers/user'
import AuthController, { authMiddleware } from './controllers/auth'


export type Env = {
  MY_VAR: string
  PRIVATE: string
  DB: D1Database
}

const app = new Hono<{ Bindings: Env }>()

const api = app.basePath('/api')

api.use('/post/*', authMiddleware)

api.route('/auth', AuthController)
api.route('/post', PostController)
api.route('/user', UserController)

export default app
