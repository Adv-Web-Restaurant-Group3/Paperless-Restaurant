const express = require("express");
const mysql = require("mysql");
const http = require("http");
var app = express();
var server = http.createServer(app);
var fs = require("fs");
const io = require("socket.io")(server);
app.use(express.static(__dirname + "/webapp"));

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
 *    tableNum,
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
 *    status: "waiting" "cooking" "served" ,
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


fs.readFile("credentials.json", function (err, data) {
    if (err) {
        console.log("credentials.json is required for this script. Refer to the documentation for help.");
        process.exit();
    } else {
        DB = JSON.parse(data);
        console.log("using DB connection information in 'credentials.json', with DB_HOST '" + DB.HOST + "'");
    }
});


server.listen(8080, function () {
    console.log("Server running on port 8080");
});




const waiters = io.of("/waiter");
const kitchens = io.of("/kitchen");
const counters = io.of("/counter");

waiters.on("connection", function (socket) {
    function getPartyNum(tableNum, callback) {
        let conn = createConnection();
        conn.connect(function (err) {
            if (err) console.log(err);
            let sql = `SELECT partyID FROM Party WHERE tableNum = ${mysql.escape(tableNum)} AND inHouse = TRUE;`;
            conn.query(sql, function (err, results) {
                if (err) console.log(err);
                else {
                    if (results.length > 0) {
                        console.log("party found: ", results[0]);
                        callback(results[0].partyID);
                    } else {
                        console.log("generating new party for table " + tableNum);
                        let sql = `INSERT INTO Party (tableNum, inHouse) VALUES (${mysql.escape(tableNum)}, TRUE)`;
                        let conn2 = createConnection();
                        conn2.query(sql, function (err, results) {
                            if (err) console.log(err);
                            else {
                                callback(results.insertId);
                            }
                            conn2.end();
                        });
                    }
                }
                conn.end();
            });
        })
    }

    function getNextOrderNum(party, callback) {
        console.log(party)
        let conn = createConnection();
        conn.connect(function (err) {
            if (err) console.log(err);
            let sql = `SELECT COUNT(orderNum)+1 AS 'orderNum' FROM PartyOrder WHERE party = ${mysql.escape(party)};`;
            conn.query(sql, function (err, results) {
                if (err) console.log(err);
                else {
                    callback(results[0].orderNum);
                }
                conn.end();
            });
        });
    }

    //waiter/waitress view
    console.log("waiter connected");

    socket.on("get_orders", function (data) {
        let tableNum = data.tableNum;
        if (tableNum) {
            let conn = createConnection();
            getPartyNum(tableNum, function (party) {
                console.log("using partyId " + party)
                conn.connect(function (err) {
                    if (err) console.log(1, err);
                    let sql = `SELECT orderID, orderNum, itemNum, quantity, notes, itemName, (SELECT catName FROM MenuCategory WHERE catID = MenuItem.category) AS 'category', price, isVegetarian, isVegan, glutenFree, containsNuts, estTime FROM PartyOrder INNER JOIN OrderItem USING (orderID) INNER JOIN MenuItem USING (itemNum) WHERE party = ${mysql.escape(party)};`;
                    conn.query(sql, function (err, results) {
                        if (err) console.log(2, err);
                        else {
                            console.log("res!", results);
                            let outputArray = [];
                            for (let result of results) {
                                let index;
                                if (index = outputArray.find(i => i.orderID === result.orderID) >= 0) {
                                    //add to existing object
                                    console.log("adding to order", outputArray)
                                    outputArray[index].items.push({
                                        itemNum: result.itemNum,
                                        quantity: result.quantity,
                                        notes: result.notes,
                                        itemName: result.itemName,
                                        category: result.category,
                                        price: result.price,
                                        isVegetarian: result.isVegetarian == 0 ? false : true,
                                        isVegan: result.isVegan == 0 ? false : true,
                                        glutenFree: result.glutenFree == 0 ? false : true,
                                        containsNuts: result.containsNuts == 0 ? false : true,
                                        estTime: result.estTime
                                    });
                                } else {
                                    console.log("creating order")
                                    //create new object
                                    outputArray.push({
                                        orderID: result.orderID,
                                        orderNum: result.orderNum,
                                        items: [{
                                            itemNum: result.itemNum,
                                            quantity: result.quantity,
                                            notes: result.notes,
                                            itemName: result.itemName,
                                            category: result.category,
                                            price: result.price,
                                            isVegetarian: result.isVegetarian == 0 ? false : true,
                                            isVegan: result.isVegan == 0 ? false : true,
                                            glutenFree: result.glutenFree == 0 ? false : true,
                                            containsNuts: result.containsNuts == 0 ? false : true,
                                            estTime: result.estTime
                                        }]
                                    });
                                }
                            }
                            socket.emit("get_orders_result", { success: true, orders: outputArray });
                        }
                        conn.end();
                    });
                });
            });
        } else socket.emit("get_orders_result", { success: false, reason: "invalid tableNum" })
    });


    //simplified order object for add order:
    /*
    {
        tableNum,
        orderNum,
        items:[{itemNum, quantity, notes}, ...],
    }
    */

    function validateOrder(order) {
        if (order) {
            if (order.tableNum && typeof order.tableNum === "number" && order.tableNum > 0) {
                if (order.items && order.items instanceof Array) {
                    return true;
                }

            }
        }
        return false;
    }
    socket.on("order", function (data) {
        console.log("order received:", data);
        //add order to DB.
        if (data && data.order) {
            let order = data.order;
            getPartyNum(order.tableNum, function (party) {
                getNextOrderNum(party, function (orderNum) {
                    //validate order
                    if (validateOrder(order)) {
                        if (order.items.length > 0) {
                            let conn = createConnection();
                            conn.connect(function (err) {
                                if (err) console.log(3, err);
                                let sql = `INSERT INTO PartyOrder(party, orderNum) VALUES (${mysql.escape(party)}, ${mysql.escape(orderNum)})`;
                                conn.query(sql, function (err, results) {
                                    if (err) console.log(err);
                                    else {
                                        let orderID = results.insertId;
                                        let orderItems = order.items;
                                        let successes = 0; //number of successful inserts to OrderItem
                                        //event-driven(?) notify method that continues when ALL items have been added.
                                        function notifySuccess() {
                                            successes++;
                                            if (successes >= orderItems.length) {
                                                console.log("order added for table " + order.tableNum + ", party " + party + " with orderID " + orderID);
                                                //all queries success. emit response.
                                                socket.emit("order_result", {
                                                    success: true, order_details: {
                                                        orderID: orderID
                                                    }
                                                });
                                            }
                                        }

                                        for (item of orderItems) {
                                            let conn2 = createConnection();
                                            let sql = `INSERT INTO OrderItem (orderID, itemNum, quantity, notes) VALUES (${mysql.escape(orderID)}, ${mysql.escape(item.itemNum)}, ${mysql.escape(item.quantity)}, ${mysql.escape(item.notes)});`;
                                            conn2.query(sql, function (err) {
                                                if (err) { console.log(4, err) } else {
                                                    console.log("added item for order " + orderID + " to database:", item);
                                                    notifySuccess();
                                                }
                                                conn2.end();
                                            });
                                        }
                                    }
                                    conn.end();
                                });
                            });
                        } else socket.emit("order_result", { success: false, reason: "order has zero items" });
                    } else socket.emit("order_result", { success: false, reason: "invalid order supplied" });
                })

            });

        } else socket.emit("order_result", { success: false, reason: "order object was not given" });
    });

});

kitchens.on("connection", function (socket) {
    //kitchen view
    console.log("kitchen connected");

});

counters.on("connection", function (socket) {
    //counter view
    console.log("counter connected");

});