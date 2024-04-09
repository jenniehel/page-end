 
const db = require("../utils/mysql2-connect.js");
const fs = require("fs");
const path = require("path");
 
//  import braintree from "braintree";
const braintree =require("braintree")
const gateway =require("../utils/paypayMoney.js")
module.exports = {  
     async   paypalPayMoney(req, res) {  
        console.log(req.body.nonce)
        gateway.transaction
            .sale({
                amount: "1.00",
                paymentMethodNonce: req.body.nonce,
                // paymentMethodNonce: "nonce-from-the-client",
                options: {
                submitForSettlement: true,
                },
            })
            .then(function (result) {
              console.log(result)
    
  })
  .catch(function (err) {
    console.error(err);
  });
   
    },
     async clientToken(req, res) { 
        console.log("dfsdd")
            gateway.clientToken.generate({}, (err, response) => {
              res.send({data:response.clientToken});
            }); 
   
    }
}
    