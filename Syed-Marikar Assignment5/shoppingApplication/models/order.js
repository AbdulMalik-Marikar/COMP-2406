var mongoose    = require('mongoose');

var orderSchema  = mongoose.Schema({
    orderID: {
        type    : String,
        index   : true
    },
    username: {
        type    : String
    },
    address: {
        type    : String
    },
    orderDate: {
        type    : String
    },
    shipping: {
        type    : Boolean
    }
});

var Order = module.exports = mongoose.model('Order', orderSchema);