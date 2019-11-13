var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true}
    }
)

CategorySchema
.virtual('url')
.get(function() {
    return '/catalog/category/'+ this.id;
})

module.exports = mongoose.model('Category', CategorySchema);