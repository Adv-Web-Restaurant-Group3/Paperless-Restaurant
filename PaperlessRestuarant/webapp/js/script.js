var orderDate = [{
    "table": 1,
    "orderNum": 1,
    "orderTime": 1300,
    "item": [{
        "itemNum": 1,
        "itemName": "Chicken Chow Mein",
        "quantity": 1,
        "notes": "notes"
    },
    {
        "itemNum": 2,
        "itemName": "Chicken Chow Mein",
        "quantity": 1,
        "notes": "notes"
    }
    ],
    "status": "Cooking",
    "price": 40
},
{
    "table": 1,
    "orderNum": 2,
    "orderTime": 1300,
    "item": [{
        "itemNum": 1,
        "itemName": "Chicken Chow Mein",
        "quantity": 1,
        "notes": "notes"
    }],
    "status": "Queued",
    "price": 20
}
];

var currentView = 0;
var currentTable = 1;
var tableSet = false;
let client = new WaiterClient();
//client.setTable(currentTable);



function toggleView(){
    console.log(currentView);
    switch(currentView){
        case 2:
            $("#tablesBox").hide();
            $(".wrapperMenu").hide();
            $(".wrapperOrders").show();
            $("#openMenu").text("Open Menu");
            currentView = 1;
            tableSet = true;
            break;
        case 1:
            $("#tablesBox").hide();
            $(".wrapperOrders").hide();
            $(".wrapperMenu").show();
            $("#openMenu").text("View Orders");
            currentView = 2;
            tableSet = true;
            break;
        case 0:
            $("#tablesBox").show();
            $(".wrapperMenu").hide();
            $(".wrapperOrders").hide();
            $("#currentTable").text("Current Table: None");
            currentView = 0;
            tableSet = false;
    }   
}
toggleView();

function buildTableList(callback){
    let items = "";
    for(let i=1;i<21;i++){
        let item = `
        <div class="tableItem">
            Table ${i}
        </div>
        `;
        items = items.concat(item);
       
    }
    callback(items);
}

function tableSelectEvent(el){
    $(el).click(event=>{
        $("#tablesBox").hide();
        $(".wrapperMenu").hide();
        $(".wrapperOrders").show();
        currentTable=$(el).data("tNum");
        $("#currentTable").text("Current Table: "+currentTable);
        currentView=1;
        tableSet = true;
        client.setTable(currentTable);
        document.getElementById("section-a").innerHTML = "";
    });
}

function tableList(){
    $("#tablesBox").html("");
    let top = `<div id="titleBox">Select a table</div>`;
    $("#tablesBox").append(top);
    buildTableList(data=>{
        let string = data
        $("#tablesBox").append(string);
        $(".tableItem").each((i,el)=>{
            $(el).data("tNum", i+1);
            tableSelectEvent(el);
        });
    });
}

$(document).ready(()=>{
    tableList();
    $("#setTable").click(event=>{
        $("#openMenu").text("Open Menu");
        currentView = 0;
        toggleView();
    });
    $("#openMenu").click(event=>{
        if(tableSet){
            switch(currentView){
                case 2:
                    toggleView();
                    break;
                case 1:
                    toggleView();
                    break;
            }
        }
        else{
            alert("Table Not Set!");
            $("#openMenu").text("Open Menu");
            currentView = 0;
            toggleView();
        }
    });
});


client.onUpdate(function () {
    if(currentTable!=client.table){
        document.getElementById("section-a").innerHTML="";
        client.setTable(currentTable);
        return;
    }
    $("#discount").val("");
    console.log(client.orders);
    orderDate = client.orders;


    var total = 0;

    updateOrder();

    function updateOrder() {

        var sectionA = document.getElementById("section-a");
        sectionA.innerHTML = "";
        var content = "";
        orderDate.sort((a,b)=>{
            if(a.status=="serving" &&b.status!="serving"){
                return -1;
            }
            else if(b.status=="serving"&&a.status!="serving"){
                return 1;
            }else return 0;
        });
        for (var i = 0; i < orderDate.length; i++) {
            orderNum = orderDate[i].orderNum;
            orderTime = orderDate[i].orderTime;
            var date = new Date(orderTime).toUTCString();
            // console.log(date);


            status = orderDate[i].status;
            price = orderDate[i].price;
            total = total + price;
            let estTimeWaiting = orderDate[i].items.reduce((a,b)=>a+b.estTime*b.quantity,0);
            let timeWaiting = new Date(Math.abs(new Date()-orderTime)).getMinutes();
            content += `
        <div class='container-a'>
        <div class='topBox'>
        <span class='text-a'>Order ${orderNum}</span>
        <span class='text-b'>Est wait time<br><span class='estWait'>${estTimeWaiting}</span></span>
        <span class='text-c'>Time waiting<br><span class='waitTime'>${timeWaiting}</span></span>
        <span class='text-d'>${status}</span>
        <span class='text-e'>${orderDate[i].items.length} Items</span>
        <span class='dropDown' data-value='${i}'>Open</span>
        </div>
        <div class='openBox' style='display:none'>
        <div class='mobileTimeContainer'>
            <span class='text-f'>Est wait time<br><span class='estWait'>${estTimeWaiting}</span></span>
            <span class='text-g'>Time waiting<br><span class='waitTime'>${timeWaiting}</span></span>
        </div>
        `;

            for (var x = 0; x < orderDate[i].items.length; x++) {
                itemNum = orderDate[i].items[x].itemNum;
                itemName = orderDate[i].items[x].itemName;
                quantity = orderDate[i].items[x].quantity;
                notes = orderDate[i].items[x].notes;

                content += `
            <div class='container-b'>
            <span class='itemName'><b>${itemNum}.</b>${itemName}
                <span class='itemQuantity'>x${quantity}</span>
            </span>
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

    function calcTotal(){
        return orderDate.reduce((a,b)=>a+b.items.reduce((a,b)=>a+(b.price*b.quantity),0),0).toFixed(2);
    }
    function finalTotal() {
        if(parseInt(document.getElementById("discount").value)>100)document.getElementById("discount").value="100";
        total = calcTotal();
        document.getElementById("subTotal").innerHTML = "&#163;" + total;
        var discount = document.getElementById("discount").value;
        var finalTotal = 0;
        if (discount === "") {
            finalTotal = total;
        } else {
            finalTotal = total * ((100 - discount) / 100)
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
        dropDown[i].addEventListener('click', function () {
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

            if (!show) {
                openBox[num].style.display = "flex";
                this.innerHTML = "Close";
            }

        });
    }


    document.getElementById("tableClear").addEventListener('click', function () {
        document.getElementById("section-a").innerHTML = "<div class='container-a' id='addOrder'>+ Add Order</div>";
        if($(".wrapperOrders").is(":visible")){
            document.getElementById("addOrder").addEventListener('click', function () {
                //alert("Add order");
                toggleView();
            });
        }

        total = 0;
        finalTotal();
        document.getElementById("discount").value = 0;
    });

});

var category = [{
    "catID": 1,
    "catName": "Side Orders"
},
{
    "catID": 2,
    "catName": "Tye Wan Mein"
}
];

var item = [{
    "category": 1,
    "itemNum": 11,
    "itemName": "Tyepyedong Soup - Ramen Noodles",
    "estTime": 300
},
{
    "category": 1,
    "itemNum": 7,
    "itemName": "Edamame",
    "estTime": 400
},
{
    "category": 2,
    "itemNum": 14,
    "itemName": "Yasai Soup - Ramen Noodles",
    "estTime": 500
}
];

/*
client.addOrder({
items: [{
    itemNum: 30,
    quantity: 1,
    notes: "notes"
}, {
    itemNum: 31,
    quantity: 1,
    notes: "notes"
}]
});
*/

client.onMenuUpdate(function() {
    if(currentTable!=client.table)client.setTable(currentTable);
    console.log(client.items);
    console.log(client.categories);

    category = client.categories;
    item = client.items;
    var order = [];
    updateItems();

    function updateItems() {

        var sectionD = "";
        var sectionE = "";
        for (var i = 0; i < category.length; i++) {
            catID = category[i].catID;
            catName = category[i].catName;

            sectionD += `<li value="category${catID}" class="categoryList pageJumpMiddle">${catName}</li>`;

            sectionE += `<div id="category${catID}" style="display:none;"></div>`;

        }
        sectionD += `<div class="arrowRight pageJumpMiddle">&#62;</div>`;
        sectionE += `<div class="arrowLeft pageJumpLeft">&#60;</div><div class="arrowRight pageJumpRight">&#62;</div>`;
        document.getElementById("section-d").innerHTML = sectionD;
        document.getElementById("section-e").innerHTML = sectionE;



        for (var i = 0; i < item.length; i++) {
            content = "";

            categoryNum = item[i].category;
            itemNum = item[i].itemNum;
            itemName = item[i].itemName;

            content = `<li value="${itemNum}"><span class="txt">${itemNum}. ${itemName}</span><span class="numOf" id="itemNum${itemNum}"></span><span class="plus">&#43;</span></li>`;

            document.getElementById("category" + categoryNum).innerHTML += content;
        }


        var categoryList = document.getElementsByClassName("categoryList");
        for (var i = 0; i < categoryList.length; i++) {
            categoryList[i].addEventListener('click', function() {

                // hide all
                for (var x = 0; x < category.length; x++) {
                    document.getElementById("category" + Number(x + 1)).style.display = "none";
                }

                document.getElementById(this.getAttribute("value")).style.display = "block";
            });
        }

        var plus = document.getElementsByClassName("plus");
        for (var i = 0; i < plus.length; i++) {
            plus[i].addEventListener('click', function() {
                addOrder(this.parentNode.getAttribute("value"));
                //Fixs bug with last button not working
                document.getElementById("pageJumpMiddle").addEventListener("click", function(){ pageJump("section-e"); });
            });
        }




    }


    function addOrder(add) {

        var exists = false;
        for (var i = 0; i < order.length; i++) {
            if (order[i][0] === add) {
                exists = true;
                order[i][1] = order[i][1] + 1;
            }
        }
        if (!exists) {
            order.push([add, 1]);
        }
        console.log(order);

        updateSummary();



    }


    function minusOrder(data) {

        for (var i = 0; i < order.length; i++) {
            if (order[i][0] === data) {

                order[i][1] = order[i][1] - 1;
                if (order[i][1] < 1) {
                    order.splice(i, 1);
                    break;
                }

            }
        }
        updateSummary();
    }

    updateSummary();

    function updateSummary() {


        // Removes all number of items
        var numOf = document.getElementsByClassName("numOf");
        for (var i = 0; i < numOf.length; i++) {
            numOf[i].innerHTML = "";
        }

        // Sets data for all items
        var content = "Order Summary";
        var max = 0;
        for (var i = 0; i < item.length; i++) {
            for (var x = 0; x < order.length; x++) {

                if (Number(order[x][0]) === item[i].itemNum) {
                    // Calc's the max cook time
                    if (max < item[i].estTime) {
                        max = item[i].estTime;
                    }

                    // Generates order Summary
                    content += `<li value="${order[x][0]}"><span class="txt">${order[x][0]}. ${item[i].itemName}</span> <span class="numOf">x${order[x][1]}</span> <span class="minus">&#45;</span></li>`;


                    // displays number of items on middle menu page again
                    if(order[x][1] !== 0) {
                        document.getElementById("itemNum" + order[x][0]).innerHTML = "x" + order[x][1];
                    }
                }


            }
        }
        content += `<div id="estTime">Est Time<br>${max}</div>
    <div id="saveTable">Save To Table</div>
    <div class="arrowLeft pageJumpMiddle" id="pageJumpMiddle">&#60;</div>`;

        
        document.getElementById("section-f").innerHTML = content;



        document.getElementById("saveTable").addEventListener('click', function() {
            console.log("save Order Order Num, Array and Max");
            //console.log(items[order])
            let Oitems = [];
            order.forEach(el=>{
                Oitems.push({
                    itemNum:el[0],
                    quantity:el[1],
                    notes:"notes here"
                });
            })
            //console.log(Oitems);
            client.addOrder({items:Oitems});
            toggleView();
            order = [];
            updateSummary();
        });


        var minus = document.getElementsByClassName("minus");
        for (var i = 0; i < minus.length; i++) {
            minus[i].addEventListener('click', function() {
                minusOrder(this.parentNode.getAttribute("value"));
                //Fixs bug with last button not working
                document.getElementById("pageJumpMiddle").addEventListener("click", function(){ pageJump("section-e"); });
            });
        }
    }




    // Page jumps - Mobile view
    function pageJump(el) {
        document.getElementById("section-d").style.display = "none";
        document.getElementById("section-e").style.display = "none";
        document.getElementById("section-f").style.display = "none";
        document.getElementById(el).style.display = "block";
    }

    var pageJumpLeft = document.getElementsByClassName("pageJumpLeft");
    for (var i = 0; i < pageJumpLeft.length; i++) {
        pageJumpLeft[i].addEventListener("click", function(){ pageJump("section-d"); });
    }
    var pageJumpMiddle = document.getElementsByClassName("pageJumpMiddle");
    for (var i = 0; i < pageJumpMiddle.length; i++) {
        pageJumpMiddle[i].addEventListener("click", function(){ pageJump("section-e"); });
    }
    var pageJumpRight = document.getElementsByClassName("pageJumpRight");
    for (var i = 0; i < pageJumpRight.length; i++) {
        pageJumpRight[i].addEventListener("click", function(){ pageJump("section-f"); });
    }

    // When opens menu again starts at Catagrees
    document.getElementById("openMenu").addEventListener("click", function(){ pageJump("section-d"); });


});


//client.sync(5000);

