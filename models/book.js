var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new Schema(
  {
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
    summary: {type: String, required: true},
    rating: {type: String, required: true, enum: ['*', '**', '***', '****', '*****'], default: '***'},
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}],
    chapters: [{type: Schema.Types.ObjectId, ref: 'Chapter'}],
    favorite_chapters: [{type: Schema.Types.ObjectId, ref: 'Chapter'}],
    number_of_chapters: Number
  }
);

// Virtual for book's URL
BookSchema
.virtual('url')
.get(function () {
  return '/catalog/book/' + this._id;
});

//Export model
module.exports = mongoose.model('Book', BookSchema);