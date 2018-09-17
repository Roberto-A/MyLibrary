#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and chapters to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Book = require('./models/book')
var Author = require('./models/author')
var Genre = require('./models/genre')
var Chapter = require('./models/chapter')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var authors = []
var genres = []
var books = []
var chapters = []

function authorCreate(first_name, last_name, d_birth, d_death, cb) {
  authordetail = {first_name:first_name , last_name: last_name }
  if (d_birth != false) authordetail.date_of_birth = d_birth
  if (d_death != false) authordetail.date_of_death = d_death
  
  var author = new Author(authordetail);
       
  author.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Author: ' + author);
    authors.push(author)
    cb(null, author)
  }  );
}

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });
       
  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  }   );
}

function bookCreate(title, author, summary, rating, genre, number_of_chapters, cb) {
  bookdetail = { 
    title: title,
    author: author,
    summary: summary,
    rating: rating,
  }
  if (genre != false) bookdetail.genre = genre
  if (number_of_chapters != false) bookdetail.number_of_chapters = number_of_chapters

    
  var book = new Book(bookdetail);    
  book.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Book: ' + book);
    books.push(book)
    cb(null, book)
  }  );
}


function chapterCreate(book, title, summary, notes, characters, cb) {
  chapterdetail = { 
    book: book,
    title: title,
    summary: summary 
  }    
  if (notes != false) chapterdetail.notes = notes 
  if (characters != false) chapterdetail.characters = characters
    
  var chapter = new Chapter(chapterdetail);    
  chapter.save(function (err) {
    if (err) {
      console.log('ERROR CREATING Chapter: ' + chapter);
      cb(err, null)
      return
    }
    console.log('New Chapter: ' + chapter);
    chapters.push(chapter)
    cb(null, book)
  }  );
}


function createGenreAuthors(cb) {
    async.parallel([
        function(callback) {
          authorCreate('J.K.', 'Rowling', '1965-07-31', false, callback);
        },
        function(callback) {
          authorCreate('Brandon', 'Sanderson', '1975-12-19', false, callback);
        },
        function(callback) {
          authorCreate('J.R.R.', 'Tolkien', '1892-01-03', '1973-09-02', callback);
        },
        function(callback) {
          genreCreate("Fantasy", callback);
        },
        function(callback) {
          genreCreate("Adventure", callback);
        },
        function(callback) {
          genreCreate("High fantasy", callback);
        },
        ],
        // optional callback
        cb);
}


function createBooks(cb) {
    async.parallel([
        function(callback) {
          bookCreate(
            'Harry Potter and the Order of the Phoenix', 
            authors[0], 
            'There is a door at the end of a silent corridor. And it\'s aunting Harry Potter\'s dreams. Why else would he be waking in the middle of the night, screaming in terror? Here are just a few things on Harry\'s mind: - A Defense Against the Dark Arts teacher with a personality like poisoned honey. - A venomous, disgruntled house-elf. - Ron as a Keeper of the Gryffindor Quidditch team. -The looking terror of the end-of-term Ordinary Wizarding Level exams. ... and of course, the growing threat of He-Who-Must-Not-Be-Named. In the richest installment yet of J.K. Rowling\'s seven-part story, Harry Potter is faced with the unreliability of the very government of the magical world and the impotence of the authorities at Hogwarts. Despite this (or perhaps because of it), he finds depth and strength in his friends, beyond what even he knew; boundless loyalty; and unbearable sacrifice. Though thick runs the plot (as well as the spine), readers will race through these pages and leave Hogwarts, like Harry, wishing only for the next train back.', 
            '***', 
            [genres[0]], 
            38, 
            callback);
        },
        function(callback) {
          bookCreate(
            "The Way of Kings", 
            authors[1], 
            'I long for the days before the Last Desolation. Before the Heralds abandoned us and the Kights Radiant turned against us. When there was still magic in Roshar and honor in hearts of men. In the end, not was but victory proved the greatest test. Did our foes see that the harder they fought, the fiercer our resistance? Fire and hammer forge a sword; time and neglect rust it away. So we won the world, yet lost it. Now there are four whom we watch: the surgeon, forced to forsake healing and fight in the most brutal war of our time; the assassin, who weeps as he kills; the liar, who wears her scholar\'s mantle over a thief\'s heart; and the prince, whose eyes open to the ancient past as his thirst for battle wanes. One of them may redeem us. One of them will destroy us.', 
            '***', 
            [genres[2]], 
            87, 
            callback);
        },
        function(callback) {
          bookCreate(
            "The Fellowship of the Ring", 
            authors[2], 
            'Frodo inherits The Ring of power. Him and eight others make their way to Mordor, the only place that can destroy the Ring.', 
            '***', 
            [genres[0], genres[1]], 
            27, 
            callback);
        }
        ],
        // optional callback
        cb);
}

function createChapters(cb) {
    async.parallel([
        function(callback) {
          chapterCreate(
            books[0], 
            'Dudley Demented', 
            'Dudley gets demented.', 
            ['This chapter is cool.', 'Good opening chapter!', 'Wow!'], 
            ['Harry Potter', 'Dudley Dursley', 'Aunt Petunia', 'Uncle Vernon', 'Gordon', 'Mrs. Figg', 'Dementor'], 
            callback);
        },
        function(callback) {
          chapterCreate(
            books[0], 
            'A Peck of Owls', 
            'Chaos ensues after the Dementor attack!', 
            ['This is crazy!', 'Wowowow!'], 
            ['Harry Potter', 'Dudley Dursley', 'Aunt Petunia', 'Uncle Vernon', 'Mrs. Figg', 'Owl'], 
            callback)
        },
        function(callback) {
          chapterCreate(
            books[1], 
            'Prelude to The Stormlight Archive', 
            'Jezrien informs Kalak that him and seven of the other Heralds have decided to end the Oathpact. Talenel is left alone to suffer pain and torture. The Heralds will lie to the people and tell them that they have won against the enemy. Jezrien and Kalak slam their Blades into the ground along with the other seven. They walk away, and Kalak thinks, "Forgive us ...."', 
            ['Who are the Heralds??', 'What is the Oathpact??', 'Radiants??????'], 
            ['Kalak', 'Jezrien'], 
            callback)
        },
        function(callback) {
          chapterCreate(
            books[1], 
            'Prologue: To Kill', 
            'Szeth kills Gavilar, king of Alethkar. He does not know why and is only following the orders of the Parshendi. He uses abilities knows as Surgebinding, as well as his Shardblade.', 
            ['Why??', 'What will happen??', 'What is surgebinding??'], 
            ['Szeth', 'Gavilar', 'Dalinar', 'Elhokar', 'Sadeas'], 
            callback)
        },
        function(callback) {
          chapterCreate(
            books[2], 
            'A Long-expected Party', 
            'Gandalf arrives in the Shire for Bilbo\'s Farewell Birthday Party. Bilbo leaves the Shire permanently willing Bag End and the One Ring to his nephew Frodo Baggins.', 
            ['What does the Ring do??', 'Is Frodo in danger??'], 
            ['Gandalf','Bilbo Baggins', 'Frodo Baggins', 'Ham Gamgee', 'Sam Gamgee', 'Merry Brandybuck'], 
            callback)
        },
        function(callback) {
          chapterCreate(
            books[2], 
            'The Shadow of the Past', 
            'Gandalf explains to Frodo the true nature of Bilbo\'s (now Frodo\'s) magic ring, how it is the One Ring and must be destroyed for the good of the Shire and all the Free Peoples of the world.', 
            ['Uh oh!', 'Here we go!'], 
            ['Gandalf', 'Frodo', 'Bilbo', 'Peregrin', 'Merry', 'Sam'], 
            callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createGenreAuthors,
    createBooks,
    createChapters
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Chapters: '+chapters);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});

