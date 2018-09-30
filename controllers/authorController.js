var Author = require('../models/author');
var Book = require('../models/book');
var async = require('async');const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Display list of all Authors.
exports.author_list = function(req, res, next) {

    Author.find()
        .sort([['last_name', 'ascending']])
        .exec(function (err, list_authors) {
            if (err) { return next(err); }

            res.render('author_list', { title: 'Author List', author_list: list_authors });
        });
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {
    async.parallel({
        author: function(callback) {
            Author.findById(req.params.id)
                .exec(callback)
        },

        authors_books: function(callback) {
            Book.find({ 'author': req.params.id }, 'title summary')
                .exec(callback)
        },

    }, function(err, results) {
        if (err) { return next(err); }

        if (results.author == null) {
            var err = new Error('Author not found');

            err.status = 404;

            return next(err);
        }

        res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books });
    });
};

// Handle Author create on POST.
exports.author_create_get = function(req, res) {
    res.render('author_form', { title: 'Create Author'});
};

// Display Author create form on GET.
exports.author_create_post = [
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAscii().withMessage('First name has non-ASCII characters.'),
    body('last_name').isLength({ min: 1 }).trim().withMessage('Last name must be specified.')
        .isAscii().withMessage('Last name has non-ASCII characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('last_name').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
        }
        else {
            var author = new Author(
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death
                });
            author.save(function (err) {
                if (err) { return next(err); }

                res.redirect(author.url);
            });
        }
    }
];


// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};