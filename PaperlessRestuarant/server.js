const express = require("express");

const http = require("http");
var app = express();
var server = http.createServer(app);
const io = require("socket-io")(server);
app.use(express.static("webapp"));

/**
 * =================================
 *            SOCKET PLAN
 * =================================
 * 
 * 
 * 
 * {ORDER} :  
 * {
 * order:{
 *    orderNum:int,
 *    orderTime:datetime,
 *    items:[
 *      {
 *          itemNum:228,
 *          quantity:2,
 *          notes:"raRE MEEAT"
 * }
 * ],
 *    status:"queued" "cooking" "served" "waiting",
 *    price
 * },
 * 
 * }
 * 
 * 
 * {BILL} :
 * { 
 * subtotal,
 * discount,
 * total
 * }
 * 
 * 
 */


server.listen(8080, function() {
    console.log("Server running on port 8080");
});

const waiters = io.of("/waiter");
const kitchens = io.of("/kitchen");
const counters = io.of("/counter");

waiters.on("connection", function(socket) {
    //waiter/waitress view
    console.log("waiter connected");

});

kitchens.on("connection", function(socket) {
    //kitchen view
    console.log("kitchen connected");

});

counters.on("connection", function(socket) {
    //counter view
    console.log("counter connected");

});