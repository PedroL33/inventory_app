var express = require('express');
var router = express.Router();

var category_controller = require('../Controllers/categoryController');
var item_controller = require('../Controllers/itemController');

//front page
router.get('/', category_controller.category_list);
//item routes
//items list
router.get('/items', item_controller.item_list);
//item create get
router.get('/item/create', item_controller.get_item_create);
//item create post
router.post('/item/create', item_controller.post_item_create)
//item update get
router.get('/item/:id/update', item_controller.get_item_update);
//item update post
router.post('/item/:id/update', item_controller.post_item_update);
//item delete get
router.get('/item/:id/delete', item_controller.get_item_delete);
//item delete post
router.post('/item/:id/delete', item_controller.post_item_delete);
//item details
router.get('/item/:id', item_controller.item_detail);

//category routes
//category list
router.get('/categories', category_controller.category_list);
//category create get
router.get('/category/create', category_controller.get_category_create);
//category create post
router.post('/category/create', category_controller.post_category_create);
//category update get
router.get('/category/:id/update', category_controller.get_category_update);
//category update post
router.post('/category/:id/update', category_controller.post_category_update);
//category delete get
router.get('/category/:id/delete', category_controller.get_category_delete);
//category delete post
router.post('/category/:id/delete', category_controller.post_category_delete);
//category detail
router.get('/category/:id', category_controller.category_detail);


module.exports = router;