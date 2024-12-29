import { Hono } from 'hono'
import PostController from './controllers/posts'
const app = new Hono()

const api = app.basePath('/api')

api.get('/', (c) => {
  return c.text('Hello Hono!')
})

api.route('/posts', PostController)

export default app
