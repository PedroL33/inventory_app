var Item = require('../models/item');
var Category = require('../models/category');
var async = require('async')

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.item_list = function(req, res, next) {
    Item.find({user: res.locals.currentUser.id})
    .exec(function(err, results) {
        if(err) { return next(err); }
        res.render('item_list', {title: 'Items', item_list: results})
    })
}

exports.item_detail = function(req, res, next) {
    Item.findById(req.params.id)
    .populate('category')
    .exec(function(err, results) {
        if(err) { return next(err); }
        res.render('item_detail', {title: results.name, item: results})
    })
};

exports.get_item_create = function(req, res, next) {
    Category.find()
    .exec(function(err, results) {
        if(err) { return next(err); }
        res.render('item_form', {title: 'Create Item', category_list: results});
    })
}

exports.post_item_create = [
    body('name', 'Name must not be empty').isLength({min:1}).trim(),
    body('description', 'Description must not be empty').isLength({min:1}).trim(),
    body('stock', 'Stock must not be empty and must be a number').isLength({min:1}).isNumeric().trim(),
    body('price', 'Price must not be empty and must be a number').isLength({min:1}).isNumeric().trim(),

    sanitizeBody('name').escape(),
    sanitizeBody('description').escape(),
    sanitizeBody('category').escape(),
    sanitizeBody('stock').escape(), 
    sanitizeBody('price').escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var item = new Item(
            { name: req.body.name,
              description: req.body.description, 
              stock: req.body.stock,
              price: req.body.price, 
              category: req.body.category,
              user: req.body.currentUser
            });

        if(!errors.isEmpty()) {
            Category.find()
            .exec(function(err, results) {
                if(err) { return next(err); }
                res.render('item_form', {title: 'Create Item', category_list: results, item: item, errors: errors.array()})
            })
        }
        else {
            item.save(function(err) {
                if(err) { return next(err); }
                res.redirect('/catalog/items');
            })
        }
    }

]

exports.get_item_update = function(req, res, next) {
    async.parallel({
        categories: function(callback) {
            Category.find()
            .exec(callback);
        },
        item: function(callback) {
            Item.findById(req.params.id)
            .exec(callback);
        },

    }, function(err, results) {
        if(err) { return next(err); }
        res.render('item_form', {title: 'Update Item', category_list: results.categories, item: results.item})
    })
}

exports.post_item_update = [
    body('name', 'Name must not be empty').isLength({min:1}).trim(),
    body('description', 'Description must not be empty').isLength({min:1}).trim(),
    body('category', 'Category must not be empty').isLength({min:1}).trim(),
    body('stock', 'Stock must not be empty and must be a number').isLength({min:1}).isNumeric().trim(),
    body('price', 'Price must not be empty and must be a number').isLength({min:1}).isNumeric().trim(),

    sanitizeBody('name').escape(),
    sanitizeBody('description').escape(),
    sanitizeBody('category').escape(),
    sanitizeBody('stock').escape(), 
    sanitizeBody('price').escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        var item = new Item(
            {
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                stock: req.body.stock,
                price: req.body.price,
                user: req.body.currentUser,
                _id: req.params.id
            }
        )
        
        if(!errors.isEmpty()) {
            async.parallel({
                categories: function(callback) {
                    Category.find()
                    .exec(callback)
                },
                item: function(callback) {
                    Item.findById(req.params.id)
                    .exec(callback)
                }
            }, function(err, results) {
                if(err) { return next(err); }
                res.render('item_form', {title: 'Update Item', category_list: results.category, item:results.item, errors: errors.array()})
            })
        }
        else {
            Item.findByIdAndUpdate(req.params.id, item, {}, function(err, theItem) {
                if(err) { return next(err); }
                res.redirect('/catalog/items');
            })
        }
    }
]

exports.get_item_delete = function(req, res, next) {
    Item.findById(req.params.id)
    .exec(function(err, results) {
        if(err) { return next(err); }
        res.render('item_delete', {title: 'Delete Item', item: results})
    })
}

exports.post_item_delete = function(req, res, next) {
    Item.findByIdAndRemove(req.params.id)
    .exec(function(err, results) {
        if(err) { return next(err); }
        res.redirect('/catalog/items')
    })
}