var Chapter = require('../models/chapter');

// Display list of all chapters.
exports.chapter_list = function(req, res) {
    res.send('NOT IMPLEMENTED: chapter list');
};

// Display detail page for a specific chapter.
exports.chapter_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: chapter detail: ' + req.params.id);
};

// Display chapter create form on GET.
exports.chapter_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: chapter create GET');
};

// Handle chapter create on POST.
exports.chapter_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: chapter create POST');
};

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