

var orderDate = [{
    "orderNum" : 1,
    "orderTime" : 1300,
    "item" : [{
        "itemNum" : 1,
        "itemName" : "Chicken Chow Mein",
        "quantity" : 1,
        "notes" : "notes"
    }],
    "status" : "Cooking",
    "price" : 50
}];



updateOrder();

function updateOrder() {

    var sectionA = document.getElementById("section-a");

    sectionA.innerHTML = "";

    for(var i=0;i<orderDate.length;i++) {
        orderNum = orderDate[i].orderNum;
        orderTime = orderDate[i].orderTime;

        
        for(var x=0;x<orderDate[i].item.length;x++) {
            itemNum = orderDate[i].item[x].itemNum;
            itemName = orderDate[i].item[x].itemName;
            quantity = orderDate[i].item[x].quantity;
            notes = orderDate[i].item[x].notes;
        }

        status = orderDate[i].status;
        price = orderDate[i].price;

        sectionA.innerHTML += `
        <div class='container-a'>
        <span class='text-a'>Order ${orderNum}</span>
        <span class='text-b'>Est wait time<br><span class='estWait'>${orderTime}</span></span>
        <span class='text-c'>Time waiting<br><span class='waitTime'>${orderTime}</span></span>
        <span class='text-d'>${status}</span>
        <span class='text-e'>${orderDate[i].item.length} Items</span>
        <div class='openBox'>
        <div class='container-b'>
        <span class='itemName'><b>${itemNum}.</b>${itemName}</span>
        <span class='itemQuantity'>x${quantity}</span>
        <span class='notes'>${notes}</span>
        </div>
        <div class='served'>Starters Served</div>
        <div class='edit'>edit</div>
        </div>
        </div>
        `;


    }
    


}