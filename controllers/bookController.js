var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var Chapter = require('../models/chapter');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

exports.index = function(req, res) {
    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback);
        },
        chapter_count: function(callback) {
            Chapter.countDocuments({}, callback);
        },
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'My Library Home', error: err, data: results });
    });
};

// Display list of all books.
exports.book_list = function(req, res, next) {
    Book.find({}, 'title author')
        .populate('author')
        .exec(function (err, list_books) {
            if (err) { return next(err); }

            res.render('book_list', { title: 'Book List', book_list: list_books });
        });
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {

    async.parallel({

        book: function(callback) {
            Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(callback);
        },
        chapter: function (callback) {
            Chapter.find({ 'book': req.params.id })
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.book == null) {
            var err = new Error('Book not found.');
            err.status = 404;
            return next(err);
        }

        res.render('book_detail', { title: 'Book', book: results.book, chapterss: results.chapter });
    });
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    async.parallel({
        authors: function(callback) {
            Author.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }

        res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
    });
};

// Handle book create on POST.
exports.book_create_post = [
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)) {
            if(typeof req.body.genre === 'undefined') {
                req.body.genre = [];
            }
            else {
                req.body.genre = new Array(req.body.genre);
            }
        }
            next();
    },
    
    body('title', 'Title must not be empty.').isLength({ min: 1}).trim(),
    body('author', 'Title must not be empty.').isLength({ min: 1}).trim(),
    body('summary').optional({ checkFalsy: true }).trim(),
    body('rating').optional({ checkFalsy: true }).trim(),
    body('number_of_chapters').optional().trim(),

    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var book = new Book(
            {
                title: req.body.title,
                author: req.body.author,
                summary: req.body.summary, 
                rating: req.body.rating,
                number_of_chapters: req.body.number_of_chapters,
                genre: req.body.genre
            }
        );

        if (!errors.isEmpty()) {
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                for(let i = 0; i < results.genre.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked = 'true';
                    }
                }

                res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            book.save(function (err) {
                if (err) { return next(err); }
                res.redirect(book.url);
            });
        }
    }
];

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};