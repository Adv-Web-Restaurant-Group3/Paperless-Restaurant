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
 *    status: "waiting" "cooking" "serving" "served" ,
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

const waiters = io.of("/waiter");
const kitchens = io.of("/kitchen");
const counters = io.of("/counter");

waiters.on("connection", function(socket) {
    //waiter/waitress view
    console.log("waiter connected");

    socket.on("get_menu", function() {
        //get Menu from DB and send to client.
        let conn = createConnection();
        conn.connect(function(err) {
            if (err) console.log(11, err)
            else {
                let sql = "SELECT catID, catName FROM MenuCategory";
                conn.query(sql, function(err, results) {
                    if (err) console.log(12, err)
                    else {
                        let categories = [];
                        for (category of results) {
                            categories.push({ catID: category.catID, catName: category.catName });
                        }
                        let conn2 = createConnection();

                        conn2.connect(function(err) {
                            if (err) console.log(13, err)
                            else {
                                let sql = "SELECT category, itemNum, itemName, estTime FROM MenuItem";
                                conn2.query(sql, function(err, results) {
                                    if (err) console.log(13, err);
                                    else {
                                        let items = [];
                                        for (item of results) {
                                            items.push({
                                                category: item.category,
                                                itemNum: item.itemNum,
                                                itemName: item.itemName,
                                                estTime: item.estTime
                                            });
                                        }
                                        socket.emit("menu", { items, categories });
                                        conn2.end();
                                    }
                                });
                            }
                        })
                        conn.end();
                    }
                });
            }
        });
    });

    socket.on("get_orders", function(data) {
        //get orders from DB for given tableNum and send to client.
        let tableNum = data.tableNum;
        if (tableNum) {
            let conn = createConnection();
            getPartyID(tableNum, function(party) {
                conn.connect(function(err) {
                    if (err) console.log(1, err);
                    let sql = `SELECT orderID, orderNum, orderTime, orderStatus, itemNum, quantity, notes, itemName, (SELECT catName FROM MenuCategory WHERE catID = MenuItem.category) AS 'category', price, isVegetarian, isVegan, glutenFree, containsNuts, estTime FROM PartyOrder INNER JOIN OrderItem USING (orderID) INNER JOIN MenuItem USING (itemNum) WHERE party = ${mysql.escape(party)};`;
                    conn.query(sql, function(err, results) {
                        if (err) console.log(2, err);
                        else {
                            let outputArray = [];
                            for (let result of results) {
                                let index = -1;
                                if ((index = outputArray.findIndex(i => i.orderID === result.orderID)) >= 0) {
                                    //add to existing object
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
                                    //create new object
                                    outputArray.push({
                                        orderNum: result.orderNum,
                                        orderID: result.orderID,
                                        orderTime: new Date(result.orderTime * 1000),
                                        status: result.orderStatus,
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
        } else socket.emit("get_orders_result", { success: false, reason: "invalid tableNum" });
    });


    //simplified order object for add order:
    /*
    {
        tableNum,
        orderNum,
        items:[{itemNum, quantity, notes}, ...],
    }
    */


    socket.on("order", function(data) {
        console.log("order received:", data);
        //add order to DB.
        if (data && data.order) {
            let order = data.order;
            getPartyID(order.tableNum, function(party) {
                getNextOrderNum(party, function(orderNum) {
                    //validate order
                    if (validateOrder(order)) {
                        if (order.items.length > 0) {
                            let conn = createConnection();
                            conn.connect(function(err) {
                                if (err) console.log(3, err);
                                let sql = `INSERT INTO PartyOrder(party, orderNum, orderTime, orderStatus) VALUES (${mysql.escape(party)}, ${mysql.escape(orderNum)}, ${Math.floor(new Date().getTime()/1000)}, 1)`;
                                conn.query(sql, function(err, results) {
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
                                                    success: true,
                                                    order_details: {
                                                        orderID: orderID
                                                    }
                                                });
                                            }
                                        }

                                        for (item of orderItems) {
                                            let conn2 = createConnection();
                                            let sql = `INSERT INTO OrderItem (orderID, itemNum, quantity, notes) VALUES (${mysql.escape(orderID)}, ${mysql.escape(item.itemNum)}, ${mysql.escape(item.quantity)}, ${mysql.escape(item.notes)});`;
                                            conn2.query(sql, function(err) {
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
                });
            });
        } else socket.emit("order_result", { success: false, reason: "order object was not given" });
    });


});

kitchens.on("connection", function(socket) {
    //kitchen view
    console.log("kitchen connected");

    socket.on("get_orders", function() {
        //get all orders from DB and send to client.
        let conn = createConnection();
        conn.connect(function(err) {
            if (err) console.log(1, err);
            //get all orders either waiting or cooking.
            let sql = `SELECT tableNum, orderID, orderNum, orderTime, orderStatus, itemNum, quantity, notes, itemName FROM Party INNER JOIN PartyOrder ON Party.partyID = PartyOrder.party INNER JOIN OrderItem USING (orderID) INNER JOIN MenuItem USING (itemNum) WHERE orderStatus < 3;`;
            conn.query(sql, function(err, results) {
                if (err) console.log(2, err);
                else {
                    let outputArray = [];
                    for (let result of results) {
                        let index = -1;
                        if ((index = outputArray.findIndex(i => i.orderID === result.orderID)) >= 0) {
                            //add to existing object
                            outputArray[index].items.push({
                                itemNum: result.itemNum,
                                quantity: result.quantity,
                                notes: result.notes,
                                itemName: result.itemName
                            });
                        } else {
                            //create new object
                            outputArray.push({
                                tableNum: result.tableNum,
                                orderID: result.orderID,
                                orderNum: result.orderNum,
                                orderTime: new Date(result.orderTime * 1000),
                                status: result.orderStatus,
                                items: [{
                                    itemNum: result.itemNum,
                                    quantity: result.quantity,
                                    notes: result.notes,
                                    itemName: result.itemName
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

    socket.on("order_status", function(data) {
        //changes the status of a given orderID.
        let orderID = data.orderID;
        let newStatus = data.status;

        if (typeof newStatus === "number") {
            let conn = createConnection();
            conn.connect(function(err) {
                if (err) console.log(err);
                else {
                    let sql = `UPDATE PartyOrder SET orderStatus = ${mysql.escape(newStatus)} WHERE orderID = ${mysql.escape(orderID)};`;
                    conn.query(sql, function(err, results) {
                        if (err) console.log(err);
                        else {
                            if (results.affectedRows === 1) {
                                socket.emit("order_status_result", { success: true });
                            } else socket.emit("order_status_result", { success: false, reason: "given orderID does not match an order!" });
                        }
                        conn.end();
                    });
                }
            });
        }
    });

});

counters.on("connection", function(socket) {
    //counter view
    console.log("counter connected");

});


/*
 * GLOBAL FUNCTIONS - used in all views.
 */
function validateOrder(order) {
    //returns true if the given order is a valid order (as supplied by the client; server-side orders do not need validation)
    if (order) {
        if (order.tableNum && typeof order.tableNum === "number" && order.tableNum > 0) {
            if (order.items && order.items instanceof Array) {
                return true;
            }
        }
    }
    return false;
}

function getPartyID(tableNum, callback) {
    //retrieves the partyID for the given tableNum and passes it to the given callback.
    let conn = createConnection();
    conn.connect(function(err) {
        if (err) console.log(err);
        let sql = `SELECT partyID FROM Party WHERE tableNum = ${mysql.escape(tableNum)} AND inHouse = TRUE;`;
        conn.query(sql, function(err, results) {
            if (err) console.log(err);
            else {
                if (results.length > 0) {
                    console.log("party found for table " + tableNum + ": ", results[0]);
                    callback(results[0].partyID);
                } else {
                    let sql = `INSERT INTO Party (tableNum, inHouse) VALUES (${mysql.escape(tableNum)}, TRUE)`;
                    let conn2 = createConnection();
                    conn2.query(sql, function(err, results) {
                        if (err) console.log(err);
                        else {
                            console.log("new party generated for table " + tableNum + ": " + results.insertId);
                            callback(results.insertId);
                        }
                        conn2.end();
                    });
                }
            }
            conn.end();
        });
    });
}

function getNextOrderNum(party, callback) {
    //retrieves the next orderNum for the given party (1+number of orders) and passes it to the given callback.
    let conn = createConnection();
    conn.connect(function(err) {
        if (err) console.log(err);
        let sql = `SELECT COUNT(orderNum)+1 AS 'orderNum' FROM PartyOrder WHERE party = ${mysql.escape(party)};`;
        conn.query(sql, function(err, results) {
            if (err) console.log(err);
            else {
                callback(results[0].orderNum);
            }
            conn.end();
        });
    });
}