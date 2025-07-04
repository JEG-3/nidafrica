const mongoose = require('mongoose');

const productSizeSchema = mongoose.Schema({
    name: {
        type: String,
        default: null
    }
})

productSizeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSizeSchema.set('toJSON', {
    virtuals: true,
});

exports.ProductSizeSchema = mongoose.model('ProductSizeSchema', productSizeSchema);
exports.productSizeSchema = productSizeSchema;