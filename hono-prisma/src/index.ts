import { Hono } from 'hono'
import PostController from './controllers/posts'
import UserController from './controllers/users'

const app = new Hono()

const api = app.basePath('/api')

api.get('/', (c) => {
  return c.text('Hello Hono!')
})

api.route('/posts', PostController)
api.route('/users', UserController)

export default app
