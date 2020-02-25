

var orderDate = [{
    "orderNum" : 1,
    "orderTime" : 1300,
    "item" : [{
        "itemNum" : 1,
        "itemName" : "Chicken Chow Mein",
        "quantity" : 1,
        "notes" : "notes"
    },
    {
        "itemNum" : 2,
        "itemName" : "Chicken Chow Mein",
        "quantity" : 1,
        "notes" : "notes"
    }],
    "status" : "Cooking",
    "price" : 50
},
{
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

    var content = "";

    for(var i=0;i<orderDate.length;i++) {
        orderNum = orderDate[i].orderNum;
        orderTime = orderDate[i].orderTime;

        status = orderDate[i].status;
        price = orderDate[i].price;

        content += `
        <div class='container-a'>
        <span class='text-a'>Order ${orderNum}</span>
        <span class='text-b'>Est wait time<br><span class='estWait'>${orderTime}</span></span>
        <span class='text-c'>Time waiting<br><span class='waitTime'>${orderTime}</span></span>
        <span class='text-d'>${status}</span>
        <span class='text-e'>${orderDate[i].item.length} Items</span>
        <span class='dropDown' data-value='${i}'>open</span>
        <div class='openBox' style='display:none'>`;
        
        for(var x=0;x<orderDate[i].item.length;x++) {
            itemNum = orderDate[i].item[x].itemNum;
            itemName = orderDate[i].item[x].itemName;
            quantity = orderDate[i].item[x].quantity;
            notes = orderDate[i].item[x].notes;

            content += `
            <div class='container-b'>
            <span class='itemName'><b>${itemNum}.</b>${itemName}</span>
            <span class='itemQuantity'>x${quantity}</span>
            <span class='notes'>${notes}</span>
            </div>
            `;
        }


        content += `
        <div class='served'>Starters Served</div>
        <div class='edit'>edit</div>
        </div>
        </div>
        `;

        sectionA.innerHTML = content;
        



    }
    


}




var myFunction = function() {
    var attribute = this.getAttribute("data-myattribute");
    alert(attribute);
};

var dropDown = document.getElementsByClassName("dropDown");
var openBox = document.getElementsByClassName("openBox");
for (var i = 0; i < dropDown.length; i++) {
    dropDown[i].addEventListener('click', function() {
        var num = this.getAttribute("data-value");
        var show = true;
        if (openBox[num].style.display === "none") {
            show = false;
        }

        for (var x = 0; x < openBox.length; x++) {
            openBox[x].style.display = "none";
        }
        for (var x = 0; x < openBox.length; x++) {
            dropDown[x].innerHTML = "Open";
        }
        
        if(!show) {
            openBox[num].style.display = "block";
            this.innerHTML = "Close";
        }
        
    });
}