const express = require("express");
const mysql = require("mysql");
const http = require("http");
var app = express();
var server = http.createServer(app);
var fs = require("fs");
const io = require("socket.io")(server);
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






let DB = {};
fs.readFile("credentials.json", function(err, data) {
    if (err) throw err;
    console.log(data);
    DB = data;
});


function createConnection() {
    let conn = mysql.connect({

    });
}


server.listen(8080, function() {
    console.log("Server running on port 8080");
});

const waiters = io.of("/waiter");
const kitchens = io.of("/kitchen");
const counters = io.of("/counter");

waiters.on("connection", function(socket) {
    //waiter/waitress view
    console.log("waiter connected");

    socket.on("order", function(data) {
        let order = data.order;

    });

});

kitchens.on("connection", function(socket) {
    //kitchen view
    console.log("kitchen connected");

});

counters.on("connection", function(socket) {
    //counter view
    console.log("counter connected");

});