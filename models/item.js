var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
    {
        name: {type: String, required: true, max: 20},
        description: {type: String},
        category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        price: {type: Number, required: true},
        stock: {type: Number, required: true}
    }
)

ItemSchema
.virtual('url')
.get(function() {
    return '/catalog/item/'+ this.id;
});

//export model
module.exports = mongoose.model('Item', ItemSchema);