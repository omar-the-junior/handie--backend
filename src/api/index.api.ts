import { Router } from 'express';
import auth from './auth.api.js';
import product from './product.api.js';
import cart from './cart.api.js';
import user from './user.api.js';
import wishlist from './wishlist.api.js';

const apiRouter = Router();

apiRouter.use('/products/', product);
apiRouter.use('/cart/', cart);
apiRouter.use('/user/', user);
apiRouter.use('/wishlist/', wishlist);
export { auth, apiRouter };
