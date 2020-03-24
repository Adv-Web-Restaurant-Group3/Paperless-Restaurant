let ordersObj = [
    {
        orderID: 19,
        tableNo: 3,
        orderTime: "12:45",
        items: [
            {
                itemNo: 22,
                name: "Chicken Chow Mein",
                quantity: 1,
                notes: "Well Done"
            },
            {
                itemNo: 20,
                name: "noodles",
                quantity: 1,
                notes: "No Sauce"
            },
            {
                itemNo: 22,
                name: "blah blah",
                quantity: 1,
                notes: "blah"
            }
        ]
    }
];
//using KitchenClient
var client = new KitchenClient();
var expandedOrders = false;


client.update();
/*
//updating a order status
for(i=0;i<20;i++){ 
    client.setStatus(i, OrderStatus.WAITING);
}
*/

function orderStatus(status, id) {
    switch (status) {
        case 1:
            return "Waiting to Cook";
        case 2:
            return "Cooking";
        case 3:
            return "Order Ready!";
        default:
            console.error("invalid status received");
            return "Undefined";
    }
}

function buildItem(obj) {

    var status = orderStatus(obj.status, obj.orderID);
    var orderID = obj.orderID;
    var item = $("<div class='orderBox'></div>");
    // TOP BAR
    var topBar = $("<div class='topBar'><div class='orderTitle'></div><span class='status'></span</div>");
    topBar.find(".orderTitle").append("Order " + orderID);
    topBar.find(".status").append(status);
    if (obj.status == 2) {
        $(topBar.find(".status")).css("background-color", "orange");
        $(topBar.find(".status")).hover(() => {
            $(topBar.find(".status")).css("background-color", "red");
        }, () => {
            $(topBar.find(".status")).css("background-color", "orange");
        });
    }
    item.append(topBar);
    item.append("<hr>");
    //ITEMS
    var itemsStr = "<div class='orderItems'><ul>";
    obj.items.forEach(el => {
        itemsStr += "<li>";
        itemsStr += "<div class='orderItem'>"
        itemsStr += "<span class='itemTXT'>" + el.itemName;
        if (el.quantity > 1) itemsStr += "  <span class='red'>x" + el.quantity + "</span></span>";
        else itemsStr += "</span>";
        if (el.notes) itemsStr += "<span class='itemNotes'>" + el.notes + "</span>";
        itemsStr += "</div>";
        itemsStr += "</li>";
    });
    itemsStr += "</ul></div>";
    item.append($(itemsStr));
    let additionalInfo = `
        <div id="moreInfo">
            <div id="tbl"><div class="txt">Table:</div><div class="data"> ${obj.tableNum}</div></div>
            <div id="timeWait"><div class="txt">Waiting:</div><div class="data"> 1</div></div>
        </div>
    `;
    item.append($(additionalInfo));
    $("#content").append(item);

}
function divName() {
    $(".orderBox").each((i, el) => {
        $(el).data("Info", ordersObj[i]);
        $(el).data("Status", ordersObj[i].status);
    });
}
function removeItem(orderID) {
    ordersObj = ordersObj.filter(el => el.orderID != orderID );
}

function alterOrderVal(orderID, attribute, newVal) {
    ordersObj.forEach(el => {
        if (el.orderID == orderID) {
            el[attribute] = newVal;
            switch (attribute) {
                case "status":
                    client.setStatus(orderID, OrderStatus[Object.keys(OrderStatus)[newVal - 1]]);
                    break;
            }
        }
    });
}

function ordersReceived() {

    ordersObj.sort((a, b) => a.orderTime - b.orderTime);
    ordersObj.forEach(el => {
        buildItem(el);
    });
    $(".status").click(event => {
        switch ($(event.target).parent().parent().data("Status")) {
            case 1:
                alterOrderVal($(event.target).parent().parent().data("Info").orderID, "status", 2);
                $(event.target).parent().parent().data("Status", 2);
                $(event.target).html("Cooking");
                $(event.target).hover(() => {
                    $(event.target).css("background-color", "red");
                }, () => {
                    $(event.target).css("background-color", "orange");
                });
                break;
            case 2:
                alterOrderVal($(event.target).parent().parent().data("Info").orderID, "status", 3);
                removeItem($(event.target).parent().parent().data("Info").orderID);
                $(event.target).parent().parent().remove();
                break;
            case 3:
                alterOrderVal($(event.target).parent().parent().data("Info").orderID, "status", 3);
                removeItem($(event.target).parent().parent().data("Info").orderID);
                $(event.target).parent().parent().remove();
                break;
        }
    });
    divName(); //ID all the divs with their respective data
}




client.onUpdate(function (orders) {
    if(JSON.stringify(ordersObj) !== JSON.stringify(orders)){
        console.log(orders,ordersObj);
        $("#content").html("");
        ordersObj = orders;
        ordersReceived();
    } 
});

$(document).ready(()=>{
    $("#toggleOrders").click(event=>{
        switch(expandedOrders){
            case true:
                $("#toggleOrders").html("Expand Orders");
                expandedOrders=false;
                break;
            case false:
                $("#toggleOrders").html("Minimise Orders");
                expandedOrders=true;
                break;
        }
    });
});


client.sync(5000);