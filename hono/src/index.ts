import { Hono } from 'hono'
import accounts from './accounts'
import products from './products'

const app = new Hono().basePath('/api')

const routes = app
  .route('/accounts', accounts)
  .route('/products', products)

export default routes
