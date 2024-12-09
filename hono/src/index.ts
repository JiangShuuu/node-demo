import { Hono } from 'hono'
import accounts from './accounts'
import products from './products'
import upload from './upload'

const app = new Hono().basePath('/api')

const routes = app
  .route('/accounts', accounts)
  .route('/products', products)
  .route('/upload', upload)
export default routes
