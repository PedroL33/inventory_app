var Category = require('../models/category');
var Item = require('../models/item');
var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.category_list = function(req, res, next) {
    Category.find()
    .exec(function(err, results) {
        if(err) { return next(err); }
        res.render('category_list', {title: 'Categories', category_list: results})
    })
}

exports.category_detail = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id).exec(callback);
        },
        item_list: function(callback) {
            Item.find({'category': req.params.id}).exec(callback);
        }
    },
    function(err, results) {
        if(err) { return next(err); }
        res.render('category_detail', {title: results.category.name, category: results.category, item_list: results.item_list});
    })
};

exports.get_category_create = function(req, res, next) {
    res.render('category_form', {title: 'Create category'})
};

exports.post_category_create = [
    body('name', 'Name must be provided').isLength({min:1}),
    body('description', 'Description must be provided').isLength({min:1}),

    sanitizeBody('name').escape().trim(),
    sanitizeBody('description').escape().trim(),

    (req, res, next) => {
        const errors = validationResult(req);

        var category = new Category(
            {
                name: req.body.name,
                description: req.body.description
            }
        )

        if(!errors.isEmpty()) {
            res.render('category_form', {title: 'Create category', category: category, errors: errors.toArray()})
        }
        else {
            category.save(function(err) {
                if(err) { return next(err); }
                res.redirect('/catalog/categories')
            })
        }
    }
]

exports.get_category_update = function(req, res, next) {
    Category.findById(req.params.id)
    .exec(function(err, results) {
        if(err) { return next(err); }
        res.render('category_form', {title: 'Update Category', category: results})
    })
};

exports.post_category_update = [
    body('name', 'Name must be provided').isLength({min:1}),
    body('description', 'Description must be provided').isLength({min:1}),

    sanitizeBody('name').escape().trim(),
    sanitizeBody('description').escape().trim(),

    (req, res, next) => {
        const errors = validationResult(req);

        var category = new Category(
            {
                name: req.body.name, 
                description: req.body.description,
                _id: req.params.id
            }
        )

        if(!errors.isEmpty()) {
            res.render('category_form', {title: 'Update Category', category: category, errors: errors.array()})
        }
        else {
            Category.findByIdAndUpdate(req.params.id, category, {}, function(err, results) {
                if(err) { return next(err); }
                res.redirect(results.url)
            })
        }
    }
];

exports.get_category_delete = function(req, res, next) {
    async.parallel({
        item_list: function(callback) {
            Item.find({category: req.params.id}).exec(callback)
        },
        category: function(callback) {
            Category.findById(req.params.id).exec(callback)
        }
    }, function(err, results) {
        if(err) { return next(err); }
        res.render('category_delete', {title: 'Delete '+ results.category.name, item_list: results.item_list, category: results.category})
    })
};

exports.post_category_delete = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.body.id).exec(callback)
        },
        item_list: function(callback) {
            Item.find({category: req.body.id}).exec(callback)
        }
    },function(err, results) {
        if(err) { return next(err); }
        if(results.item_list.length > 0) {
            res.render('category_delete', {title: 'Delete '+ results.category.name, category: results.category, item_list: results.item_list});
        }
        else {
          Category.findByIdAndDelete(req.body.id)
          .exec(function(err, results) {
            if(err) { return next(err); }
            res.redirect('/catalog/categories')
          })
        }
    })
};
