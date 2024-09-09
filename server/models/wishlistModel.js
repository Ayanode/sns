import mongoose from 'mongoose';

const { Schema } = mongoose;

const wishlistSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserSns',  // Reference to the User model
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductSns',  // Reference to the Product model
        required: true,
    },
    addedAt: {
        type: Date,
        default: Date.now,  // Automatically set the timestamp when added to the wishlist
    },
}, { 
    timestamps: true,
    versionKey: false  // Disable the __v field for cleaner documents
});

// Ensure that the combination of user and product is unique
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
