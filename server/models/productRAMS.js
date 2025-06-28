const mongoose = require('mongoose');

const productRamsSchema = mongoose.Schema({
    name: {
        type: String,
        default: null
    }
})

productRamsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productRamsSchema.set('toJSON', {
    virtuals: true,
});

exports.ProductRamsSchema = mongoose.model('ProductRamsSchema', productRamsSchemasSchema);
exports.productRamsSchema = productRamsSchema;