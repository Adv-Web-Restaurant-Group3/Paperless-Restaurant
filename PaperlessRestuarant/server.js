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
 *    party,
 *    orderNum:int,
 *    orderTime:datetime,
 *    items:[
 *      {
 *          itemNum:228,
 *          name:"CHOW CHICKEN MEIN"
 *          quantity:2,
 *          notes:"raRE MEEAT"
 *      }
 *    ],
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






var DB = {
    HOST: undefined,
    PORT: undefined,
    USER: undefined,
    DATABASE: undefined,
    PASS: undefined
};

function createConnection() {
    return mysql.createConnection({
        host: DB.HOST,
        user: DB.USER,
        password: DB.PASS,
        port: DB.PORT,
        database: DB.DATABASE
    });
}


fs.readFile("credentials.json", function(err, data) {
    if (err) {
        console.log("credentials.json is required for this script. Refer to the documentation for help.");
        process.exit();
    } else {
        DB = JSON.parse(data);
        console.log("using DB connection information in 'credentials.json', with DB_HOST '" + DB.HOST + "'");
    }
});


server.listen(8080, function() {
    console.log("Server running on port 8080");
});

function validateOrder(order) {
    if (order) {
        if (order.party && typeof order.party === "number")
            if (order.orderNum && order.orderNum > 0) {
                if (order.orderTime && order.orderTime instanceof Date) {
                    if (order.items && order.items instanceof Array) {
                        if (order.status && ["queued", "cooking", "served", "waiting"].find(s => s === order.status)) {
                            if (order.price && order.price >= 0) {
                                return true;
                            }
                        }
                    }
                }
            }
    }
    return false;
}


const waiters = io.of("/waiter");
const kitchens = io.of("/kitchen");
const counters = io.of("/counter");

waiters.on("connection", function(socket) {
    //waiter/waitress view
    console.log("waiter connected");

    socket.on("order", function(data) {

        //add order to DB.
        if (data && data.order) {
            let order = data.order;

            //validate order
            if (validateOrder(order)) {
                if (order.items.length > 0) {
                    let conn = createConnection();
                    conn.connect(function(err) {
                        if (err) console.log(err);
                        else {
                            let sql = `INSERT INTO PartyOrder(party, orderNum) VALUES (${mysql.escape(order.party)}, ${mysql.escape(order.orderNum)})`
                        }
                    })
                } else socket.emit("order_result", { success: false, reason: "order has zero items" })
            } else socket.emit("order_result", { success: false, reason: "invalid order supplied" });
        } else socket.emit("order_result", { success: false, reason: "order object was not given" });
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