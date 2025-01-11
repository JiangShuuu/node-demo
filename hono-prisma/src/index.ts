import { Hono } from 'hono'
import PostController from './controllers/posts'
import UserController from './controllers/users'
import TransactionController from './controllers/tramsaction'
import AuthController from './controllers/auth'
import { authMiddleware } from "./controllers/auth";

const app = new Hono()

const api = app.basePath('/api')

api.get('/', (c) => {
  return c.text('Hello Hono!')
})

api.use('/post/*', authMiddleware)

api.route('/post', PostController)
api.route('/user', UserController)
api.route('/transaction', TransactionController)
api.route('/auth', AuthController)

export default app
