var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ChapterSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, //reference to the associated book
    title: {type: String, required: true},
    summary: {type: String, required: true, default: 'Summary needed.'},
    notes: [String],
    characters: [String]
  }
);

// Virtual for bookinstance's URL
ChapterSchema
.virtual('url')
.get(function () {
  return '/catalog/chapter/' + this._id;
});

//Export model
module.exports = mongoose.model('Chapter', ChapterSchema);