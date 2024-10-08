import Wishlist from '../models/wishlistModel.js';
import Product from '../models/productModel.js';

// Add a product to the wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product is already in the wishlist
        const existingWishlistItem = await Wishlist.findOne({ user: userId, product: productId });
        if (existingWishlistItem) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        // Add product to the wishlist
        const wishlistItem = new Wishlist({
            user: userId,
            product: productId,
        });
        await wishlistItem.save();

        res.status(201).json({ message: 'Product added to wishlist', wishlistItem });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all products in the user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch the wishlist items with populated product details
        const wishlistItems = await Wishlist.find({ user: userId }).populate('product');

        res.status(200).json(wishlistItems);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Remove a product from the wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        // Check if the product is in the wishlist
        const wishlistItem = await Wishlist.findOneAndDelete({ user: userId, product: productId });

        if (!wishlistItem) {
            return res.status(404).json({ message: 'Product not found in wishlist' });
        }

        res.status(200).json({ message: 'Product removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
