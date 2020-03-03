

var orderDate = [{
    "table" : 1,
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
    "price" : 40
},
{
    "table" : 1,
    "orderNum" : 2,
    "orderTime" : 1300,
    "item" : [{
        "itemNum" : 1,
        "itemName" : "Chicken Chow Mein",
        "quantity" : 1,
        "notes" : "notes"
    }],
    "status" : "Queued",
    "price" : 20
}];



var total = 0;

updateOrder();
function updateOrder() {

    var sectionA = document.getElementById("section-a");

    var content = "";

    for(var i=0;i<orderDate.length;i++) {
        orderNum = orderDate[i].orderNum;
        orderTime = orderDate[i].orderTime;

        status = orderDate[i].status;
        price = orderDate[i].price;

        total = total + price;

        content += `
        <div class='container-a'>
        <div class='topBox'>
        <span class='text-a'>Order ${orderNum}</span>
        <span class='text-b'>Est wait time<br><span class='estWait'>${orderTime}</span></span>
        <span class='text-c'>Time waiting<br><span class='waitTime'>${orderTime}</span></span>
        <span class='text-d'>${status}</span>
        <span class='text-e'>${orderDate[i].item.length} Items</span>
        <span class='dropDown' data-value='${i}'>Open</span>
        </div>
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
        <div class='served'>Order ${orderNum} is Served</div>
        <div class='edit'>edit</div>
        </div>
        </div>
        `;

        sectionA.innerHTML = content;

    }

    finalTotal();

}
// Displays Total of all items and deals with discount
document.getElementById("discount").addEventListener("input", finalTotal);
function finalTotal() {
    document.getElementById("subTotal").innerHTML = "&#163;" + parseFloat(total).toFixed(2);
    var discount = document.getElementById("discount").value;
    var finalTotal = 0;
    if(discount === "") {
        finalTotal = total;
    } else {
        finalTotal = total * ( (100-discount) / 100 )
    }
    
    document.getElementById("finalTotal").innerHTML = "&#163;" + parseFloat(finalTotal).toFixed(2);
}



// var myFunction = function() {
//     var attribute = this.getAttribute("data-myattribute");
//     alert(attribute);
// };



// Open/Close buttons opening Order details
var dropDown = document.getElementsByClassName("dropDown");
var openBox = document.getElementsByClassName("openBox");
var topBox = document.getElementsByClassName("topBox");
for (var i = 0; i < dropDown.length; i++) {
    dropDown[i].addEventListener('click', function() {
        var num = this.getAttribute("data-value");
        var show = true;
        if (openBox[num].style.display === "none") {
            show = false;
        }

        for (var x = 0; x < openBox.length; x++) {
            openBox[x].style.display = "none";
            topBox[x].style.borderBottom = "none";
        }
        for (var x = 0; x < openBox.length; x++) {
            dropDown[x].innerHTML = "Open";
        }
        
        if(!show) {
            openBox[num].style.display = "block";
            topBox[num].style.borderBottom = "1px solid #000";
            this.innerHTML = "Close";
        }
        
    });
}


document.getElementById("tableClear").addEventListener('click', function() {
    document.getElementById("section-a").innerHTML = "<div class='container-a' id='addOrder'>+ Add Order</div>";

    document.getElementById("addOrder").addEventListener('click', function() {
        alert("Add order");
    });

    total = 0;
    finalTotal();
    document.getElementById("discount").value = 0;
});


