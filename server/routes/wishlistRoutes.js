import express from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { isAuthenticated, isAdminUser } from '../middlewares/auth.js';

const router = express.Router();

// Add a product to the wishlist
router.post('/addToWishlist', isAuthenticated, addToWishlist);

// Get all products in the user's wishlist
router.get('/getWishlist', isAuthenticated, getWishlist);

// Remove a product from the wishlist
router.delete('/deleteWishlist/:productId', isAuthenticated, removeFromWishlist);

export default router;
