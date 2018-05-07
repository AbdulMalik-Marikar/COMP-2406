var Product     = require('../models/product');
var User        = require('../models/user');
var mongoose    = require('mongoose');
var Cart          = require('../models/cart');
var Order       = require('../models/order');
mongoose.connect('mongodb://localhost/shoppingApp');


Order.remove({},function(err){
    if(err){
        console.log("ERROR:Remove Failed")
        return
    }
})

Product.remove({}, function(err){
    if(err){
        console.log("ERROR: Remove failed")
        return
    }
})

User.remove({}, function(err){
    if(err){
        console.log("ERROR: Remove failed")
        return
    }
})

var products = [
    new Product({
        imagePath   : 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/SIGAUS_aceite.jpg/1280px-SIGAUS_aceite.jpg',
        title       : 'Oil Change',
        description : 'Customers recieve a oil change which approximately takes 30 minutes.',
        price       : 40
    }),
    new Product({
        imagePath   : 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Flattire_with_screw.jpg/1280px-Flattire_with_screw.jpg',
        title       : 'Tire Change',
        description : 'Seasonal tire changes,flat tires, etc',
        price       : 35
    }),
    new Product({
        imagePath   : 'https://i.ytimg.com/vi/_-4q8hTTHZw/maxresdefault.jpg',
        title       : 'Matte Wrap + installation',
        description : 'Matte finished wrap and installation done in 45 minutes',
        price       : 100
    }),
    new Product({
        imagePath   : 'https://i.ytimg.com/vi/lNhSZjPCdWI/maxresdefault.jpg',
        title       : 'Glossy Wrap',
        description : 'Glossy finish wrap, installation done in 45 minutes',
        price       : 110
    }),
    new Product({
        imagePath   : 'https://www.cobbikeshop.ca/wp-content/uploads/2018/01/Autobody-vehicle-repair-300x150.jpg',
        title       : 'Tune up',
        description : 'Quick tune up done in 20 minutes.',
        price       : 30
    })
];

for (let i = 0; i < products.length; i++){
    products[i].save(function(err, result) {
        if (i === products.length - 1){
            exit();
        }
    });
}

var newUser = new User({
    username    : 'admin@admin.com',
    password    : 'admin',
    fullname    : 'Cuneyt Celebican',
    admin       : true
});

var newUser1 = new User({
    username    : 'abdul@admin.com',
    password    : 'admin',
    fullname    : 'Abdul-Malik Marikar',
    admin       : true
});
User.createUser(newUser1, function(err, user){
    if(err) throw err;
    console.log(user);
});

User.createUser(newUser, function(err, user){
    if(err) throw err;
    console.log(user);
});

function exit() {
    mongoose.disconnect();
}
