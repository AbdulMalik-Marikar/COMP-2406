var express                 = require('express');
var router                  = express.Router();
var Cart                    = require('../models/cart');
var Order                   = require('../models/order');
var paypal                  = require('paypal-rest-sdk');
var time;


//Paypal configuration
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AZu7W3NLEXv7mz0KRcL0xJJm5Odm24NffMWj3IN4fofKNjJ1XeydyGMZl_2sCnkg9HiQcT37iBfDGS1b',
  'client_secret': 'EB0MDZxxccPKcueyIfZf2wbP1M6JAPFLzZKeWJQdoJWS7SjM5dEroLb1pIRW7hWkx-t4iSRiZBYe-eIG'
});


// GET checkout page
router.get('/', ensureAuthenticated, function(req, res, next){
    console.log(`ROUTE: GET CHECKOUT PAGE`)
    var cart = new Cart(req.session.cart)
    var totalPrice = cart.totalPrice
    res.render('checkout', {title: 'Checkout Page', items: cart.generateArray(), totalPrice: cart.totalPrice, bodyClass: 'registration', containerWrapper: 'container', userFirstName: req.user.fullname});
})

// POST checkout-process
router.post('/checkout-process', function(req, res){
   console.log(`ROUTE: POST CHECKOUT-PROGRESS`)
    var cart = new Cart(req.session.cart);
    var totalPrice = cart.totalPrice;
    var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/checkout/checkout-success",
        "cancel_url": "http://localhost:3000/checkout/checkout-cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "item",
                "sku": "item",
                "price": totalPrice,
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": totalPrice
        },
        "description": "This is the payment description."
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for (var i = 0; i < payment.links.length; i++){
            if(payment.links[i].rel=== 'approval_url'){
                time= payment.create_time;
                res.redirect(payment.links[i].href);
            }
        }
    }
});
    console.log('ROUTE: POST CHECKOUT_PROGRESS')

    });


// GET checkout-success
router.get('/checkout-success', ensureAuthenticated, function(req, res){
    req.session.cart={};
    var newOrder= new Order({
        orderID             :req.query.paymentId,
        username            :req.user.username,
        address             :"1234 Main Street, Ottawa ON K2Y 7D6",
        orderDate           : time,
        shipping            : true
    });
    newOrder.save();

    console.log(`ROUTE: GET CHECKOUT-SUCCESS`)

    res.render('checkoutSuccess', {title: 'Successful', containerWrapper: 'container', userFirstName: req.user.fullname})
});

// PAYMENT CANCEL
router.get('/checkout-cancel', ensureAuthenticated, function(req, res){
    console.log(`ROUTE: GET CHECKOUT-CANCEL`)
    res.render('checkoutCancel', {title: 'Successful', containerWrapper: 'container', userFirstName: req.user.fullname});
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        console.log(`ERROR: USER IS NOT AUTHENTICATED`)
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/');
    }
}

module.exports = router;
