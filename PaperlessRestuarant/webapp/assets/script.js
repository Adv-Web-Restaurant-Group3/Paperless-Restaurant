

var orderDate = [{
    "orderNum" : 1,
    "orderTime" : 1300,
    "item" : {
        "itemNum" : 1,
        "quantity" : 1,
        "notes" : "hi"
    }
}];

function updateOrder() {

    for(var i=0;i<orderDate.length;i++) {
        orderNum = orderDate[i].orderNum;
        orderTime = orderDate[i].orderTime;
        
        for(var x=0;x<orderDate[i].item.length;x++) {
            itemNum = orderDate[i].item[x].itemNum;
            quantity = orderDate[i].item[x].quantity;
            notes = orderDate[i].item[x].notes;
        }

        status = orderDate[i].status;
        price = orderDate[i].price;

    }
    


}