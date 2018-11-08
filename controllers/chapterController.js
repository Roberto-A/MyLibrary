var Chapter = require('../models/chapter');
var Book = require('../models/book');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Display list of all chapters.
exports.chapter_list = function(req, res) {
    res.send('NOT IMPLEMENTED: chapter list');
};

// Display detail page for a specific chapter.
exports.chapter_detail = function(req, res, next) {
    Chapter.findById(req.params.id)
    .populate('book')
    .exec(function (err, chapter) {
        if (err) { return next(err); }
        if (chapter == null) {
            var err = new Error('Chapter not found');
            err.status = 404;
            return next(err);
        }

        res.render('chapter_detail', { title: 'Chapter:', chapter: chapter});
    });
};

// Display chapter create form on GET.
exports.chapter_create_get = function(req, res, next) {

    // Get all book titles
    Book.find({}, 'title')
    .exec(function (err, books) {
        if (err) { return next(err); }

        // Pass list of titles to view.
        res.render('chapter_form', {title: 'Create Chapter', book_list: books });
    });
};

// Handle chapter create on POST.
exports.chapter_create_post = [
    body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
    body('title', 'Chapter title must be specified').isLength({ min: 1 }).trim(),
    body('summary').optional({ checkFalsy: true }). trim(),

    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var chapter = new Chapter(
            {
                book: req.body.book,
                title: req.body.title,
                summary: req.body.summary,
                notes: [],
                characters: []
            }
        );

        if (!errors.isEmpty()) {
            Book.find({}, 'title')
                .exec(function (err, books) {
                    if (err) { return next(err); }

                    res.render('chapter_form', { title: 'Create Chapter', book_list: books, selected_book: chapter.book._id, errors: errors.array(), chapter: chapter });
                });
                return;
        }
        else {
            chapter.save(function (err) {
                if (err) { return next(err); }
                 res.redirect(chapter.url);
            });
        }
    }
];

// Display chapter delete form on GET.
exports.chapter_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: chapter delete GET');
};

// Handle chapter delete on POST.
exports.chapter_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: chapter delete POST');
};

// Display chapter update form on GET.
exports.chapter_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: chapter update GET');
};

// Handle chapter update on POST.
exports.chapter_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: chapter update POST');
};