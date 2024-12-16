import { Hono } from 'hono'
import accounts from './accounts'
import products from './products'
import upload from './upload'
import payment from './payment'

const app = new Hono().basePath('/api')

const routes = app
  .route('/accounts', accounts)
  .route('/products', products)
  .route('/upload', upload)
  .route('/payment', payment)
export default routes
