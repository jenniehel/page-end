// braintreeConnection.js 
const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'xdk66bxgj8w6cdbf',
    publicKey:    'crmczsjvcjpvqrxh',
    privateKey:   '4fa7abe423ebe01d1bd2c063fdec1afa'
});

module.exports =gateway;