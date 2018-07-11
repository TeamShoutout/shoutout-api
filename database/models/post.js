var mongoose = require('mongoose');
var autopopulate = require('mongoose-autopopulate');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  message: { type: String, required: false },
  // from: { type: Schema.Types.ObjectId, ref: 'User', required: true} ,
  // to: { type: Schema.Types.ObjectId, ref: 'User', required: true} ,
  // categories: [{ type: Scehma.Types.ObjectId, ref: 'Categegory '}],
}, { timestamps: true });

PostSchema.plugin(autopopulate);

PostSchema.methods.toJSON = function() {
  return {
    message: this.message,
    from: this.from,
    to: this.to,
    categories: this.categories,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
}

module.exports = mongoose.model('Post', PostSchema);
