import { Hono } from 'hono'
import accounts from './accounts'

const app = new Hono().basePath('/api')

const routes = app.route('/accounts', accounts)

export default routes
