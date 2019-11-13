#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Category = require('./models/category')
var Item = require('./models/item')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var items = []

function categoryCreate(name, description, cb) {
  categorydetail = {name:name , description: description }
  
  var category = new Category(categorydetail);
       
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}

function itemCreate(name, description, category, price, stock, cb) {
  itemDetail = { 
    name: name, 
    category: category, 
    price: price, 
    stock: stock 
  };
  if (description != false) itemDetail.description = description;
  var item = new Item(itemDetail);
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New item: ' + item);
    items.push(item)
    cb(null, item);
  }   );
}



function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('Clothing', 'Cloth things', callback);
        },
        function(callback) {
          categoryCreate('Electronics', 'Electronic things', callback);
        },
        function(callback) {
          categoryCreate('Personal Care', 'Personal Care things', callback);
        },
        function(callback) {
          categoryCreate('Pet Supplies', 'Pet Supply things', callback);
        },
        function(callback) {
          categoryCreate('Office', 'Office things', callback);
        },
        function(callback) {
          categoryCreate("Video Games", 'Video Game things', callback);
        },
        function(callback) {
          categoryCreate('Outdoors', 'Outdoor things', callback);
        },
        function(callback) {
          categoryCreate('Sports', 'Sports things', callback);
        },
        ],
        // optional callback
        cb);
}

function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Shirt', 'Blue shirt', categories[0], 14.99, 1, callback)
        },
        function(callback) {
          itemCreate('Computer', 'Nice computer', categories[1], 200.00, 1, callback)
        },
        function(callback) {
          itemCreate('Shampoo', 'Cleaning shampoo', categories[2], 5.99, 1, callback)
        },
        function(callback) {
          itemCreate('Dog Food', 'Healthy dog food', categories[3], 14.99, 1, callback)
        },
        function(callback) {
          itemCreate('Stapler', 'Sturdy stapler', categories[4], 9.99, 1, callback)
        },
        function(callback) {
          itemCreate('Computer game', 'Fun computer game', categories[5], 19.99, 1, callback)
        },
        function(callback) {
          itemCreate('Tent', 'Reliable tent', categories[6], 29.99, 1, callback)
        },
        function(callback) {
          itemCreate('Football', 'Professional football', categories[7], 11.99, 1, callback)
        },
        ],
        // Optional callback
        cb);
}



async.series([
    createCategories,
    createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('items: '+items);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});