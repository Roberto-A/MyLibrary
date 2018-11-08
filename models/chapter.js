var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ChapterSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, //reference to the associated book
    title: {type: String, required: true},
    summary: {type: String, default: 'Summary needed.'},
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

ChapterSchema
.virtual('character_list')
.get(function () {

  var characs = this.characters.toString().split(',');
  characters_list = '';

  for (var i = 0; i < characs.length; ++i) {
    characters_list += characs[i];

    if (i < characs.length - 1) {
      characters_list += ', ';

    }
  } 
  return characters_list;
});

//Export model
module.exports = mongoose.model('Chapter', ChapterSchema);