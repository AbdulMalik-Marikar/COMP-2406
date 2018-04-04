var Product     = require('../models/product');
var User        = require('../models/user');
var mongoose    = require('mongoose');
var Order       = require('../models/order');
mongoose.connect('mongodb://localhost/shoppingApp');


Order.remove({},function(err){
    if(err){
        console.log("ERROR:Remove Failed")
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
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/92/79/92793aba86092b2ff450a47a50a985c9e488db29.jpg],origin[dam],category[ladies_maternity_bottoms],type[LOOKBOOK],hmver[1]&call=url[file:/product/zoom]&zoom=zoom',
        title       : 'MAMA Denim Bib Overalls',
        description : 'Bib overalls in washed stretch denim with distressed details and adjustable suspenders. Bib pocket, side and back pockets, buttons at sides, and tapered legs.',
        price       : 69.99
    }),
    new Product({
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/87/ec/87ec6ca9ec5ca3a2042dabe1f0bfe73e1f6c51a0.jpg],origin[dam],category[],type[LOOKBOOK],hmver[1]&call=url[file:/product/zoom]&zoom=zoom',
        title       : 'V-neck Cotton Sweater',
        description : 'Fine-knit sweater in cotton with a V-neck, long sleeves, and ribbing at neckline, cuffs, and hem.',
        price       : 14.99
    }),
    new Product({
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/75/36/7536c52c6107e54b4d29bc5e82b6e2fd23ee2dc6.jpg],origin[dam],category[ladies_jacketscoats_jackets],type[LOOKBOOK],hmver[2]&call=url[file:/product/zoom]&zoom=zoom',
        title       : 'Skinny Low Jeans',
        description : '5-pocket low-rise jeans in washed stretch denim with a button fly and skinny legs.',
        price       : 34.99
    }),
    new Product({
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/2e/9e/2e9ecfe6c88bfd83e3c2dd85cae981d3a068b075.jpg],origin[dam],category[men_trousers_trousers_skinny_all],type[LOOKBOOK],hmver[1]&call=url[file:/product/zoom]&zoom=zoom',
        title       : 'Twill trousers Skinny fit',
        description : '5-pocket trousers in washed, slightly stretchy twill with a regular waist, zip fly and skinny legs. Skinny fit.',
        price       : 29.99
    }),
    new Product({
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/ac/27/ac27d3ae1fa155d3ad1e7aa61a3cdd8dcf7d534d.jpg],origin[dam],category[ladies_jacketscoats_biker],type[LOOKBOOK],hmver[1]&call=url[file:/product/zoom]&zoom=zoom',
        title       : 'Faux Suede Biker Jacket',
        description : 'Biker jacket in faux suede. Notched lapels with decorative snap fasteners, diagonal zip at front, and side pockets with zip. Long sleeves with zip at cuffs. Attached, adjustable belt at hem with a metal fastener. Lined.',
        price       : 79.99
    })
];

for (var i = 0; i < products.length; i++){
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
