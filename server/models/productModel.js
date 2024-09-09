import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
    productID: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
        unique: true,
        required: true,
    },
    title: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v.trim().length > 0;
            },
            message: 'Title cannot be empty',
        },
    },
    desc: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v.trim().length > 0;
            },
            message: 'Description cannot be empty',
        },
    },
    img1: {
        type: String, // Storing base64 or URL as a string
        required: true,
    },
    img2: {
        type: String,
        required: false,
    },
    img3: {
        type: String,
        required: false,
    },
    totalPrice: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v > 0;
            },
            message: 'Total price must be a positive number',
        },
    },
    sellingPrice: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v > 0;
            },
            message: 'Selling price must be a positive number',
        },
    },
    category: {
        type: String,
        enum: ['rings', 'earrings', 'bracelets', 'bangles', 'mangalsutras', 'nosePins', 'headJewelleries', 'pendantSets', 'weddingSets', 'pendants', 'anklets', 'toeRings', 'homeDecors'],
        required: true,
    },
    size: {
        type: [String], // Array of strings for sizes
        required: true,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'Size cannot be empty',
        },
    },
    weight: {
        type: [String], // Array of strings for weights
        required: true,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'Weight cannot be empty',
        },
    },
    purity: {
        type: [String], // Array of strings for purities
        required: true,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'Purity cannot be empty',
        },
    },
    gender: {
        type: String,
        enum: ['men', 'women', 'kids'],
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: 'Stock must be an integer',
        },
    },
    availableState: {
        type: Boolean,
        default: true,
        required: true,
    },
    madeToOrder: {
        type: Boolean,
        default: false,
        required: true,
    },
    popular: {
        type: Boolean,
        default: false,
        required: true,
    },
    labor: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v > 0;
            },
            message: 'Labor cost must be a positive number',
        },
    },
    packaging: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v > 0;
            },
            message: 'Packaging cost must be a positive number',
        },
    },
    countryTax: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return v > 0;
            },
            message: 'Country tax must be a positive number',
        },
    },
    country: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v.trim().length > 0;
            },
            message: 'Country cannot be empty',
        },
    },
    active: {
        type: String,
        enum: ['freeze', 'active'],
        default: 'active',
        required: true,
    },
}, { timestamps: true });

// Check if the model is already compiled
const Product = mongoose.models.ProductSns || mongoose.model('ProductSns', productSchema);

export default Product;
