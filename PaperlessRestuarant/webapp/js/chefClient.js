var socket = io("/kitchen");
let ordersObj = [
    {
        orderID:19,
        tableNo:3,
        orderTime:"12:45",
        items: [
            {
                itemNo:22,
                name:"Chicken Chow Mein",
                quantity:1,
                notes:"Well Done"
            },
            {
                itemNo:20,
                name:"noodles",
                quantity:1,
                notes:"No Sauce"
            },
            {
                itemNo:22,
                name:"blah blah",
                quantity:1,
                notes:"blah"
            }
        ]
    },
    {
        orderID:16,
        tableNo:3,
        orderTime:"12:45",
        items: [
            {
                itemNo:22,
                name:"Chicken Chow Mein",
                quantity:1,
                notes:"Well Done"
            },
            {
                itemNo:20,
                name:"noodles",
                quantity:5,
                notes:"No Sauce"
            },
            {
                itemNo:22,
                name:"blah blah",
                quantity:1,
                notes:"blah"
            }
        ]
    },
    {
        orderID:6,
        tableNo:7,
        orderTime:"12:45",
        items: [
            {
                itemNo:22,
                name:"Chicken Chow Mein",
                quantity:1,
                notes:"Well Done"
            },
            {
                itemNo:20,
                name:"noodles",
                quantity:3,
                notes:"No Sauce"
            },
            {
                itemNo:22,
                name:"blah blah",
                quantity:1,
                notes:"blah"
            }
        ]
    },
    {
        orderID:33,
        tableNo:1,
        orderTime:"12:45",
        items: [
            {
                itemNo:22,
                name:"Chicken Chow Mein",
                quantity:3,
                notes:"Well Done"
            },
            {
                itemNo:20,
                name:"noodles",
                quantity:2,
                notes:"No Sauce"
            },
            {
                itemNo:22,
                name:"blah blah",
                quantity:1,
                notes:"blah"
            }
        ]
    },
    {
        orderID:12,
        tableNo:2,
        orderTime:"12:45",
        items: [
            {
                itemNo:22,
                name:"Chicken Chow Mein",
                quantity:1,
                notes:"Well Done"
            },
            {
                itemNo:20,
                name:"Noodles",
                quantity:1
            },
            {
                itemNo:22,
                name:"blah blah",
                quantity:1,
                notes:"blah"
            }
        ]
    },
    {
        orderID:123,
        tableNo:5,
        orderTime:"12:45",
        items: [
            {
                itemNo:22,
                name:"Chicken Chow Mein",
                quantity:1,
                notes:"Well Done"
            },
            {
                itemNo:22,
                name:"Chicken Chow Mein",
                quantity:1,
                notes:"Well Done"
            },
            {
                itemNo:22,
                name:"Chicken Chow Mein",
                quantity:1,
                notes:"Well Done"
            },   
            {
                itemNo:22,
                name:"Chicken Chow Mein",
                quantity:1,
                notes:"Well Done"
            }   
        ]
    }
];
function orderStatus(status){
    switch(status){
        case 2:
            return "Waiting to Cook";
        case 1: 
            return "Cooking";
        default:
            return "Order Ready!";
    }
}

function buildItem(obj){

    var status = orderStatus(obj.status);
    var orderID = obj.orderID;
    var item = $("<div class='orderBox'></div>");
    // TOP BAR
    var topBar = $("<div class='topBar'><div class='orderTitle'></div><span class='status'></span</div>");
    topBar.find(".orderTitle").append("Order "+orderID);
    topBar.find(".status").append(status);
    item.append(topBar);
    item.append("<hr>");
    //ITEMS
    var itemsStr="<div class='orderItems'><ul>";
    obj.items.forEach(el=>{
        itemsStr+= "<li>";
        itemsStr+= "<div class='orderItem'>" 
        itemsStr+= "<span class='itemTXT'>"+el.itemName;
        if(el.quantity>1)itemsStr+="  <span class='red'>x"+el.quantity+"</span></span>";
        else itemsStr+= "</span>";
        if(el.notes)itemsStr+= "<span class='itemNotes'>"+el.notes+"</span>";
        itemsStr+= "</div>";
        itemsStr+= "</li>";
    });  
    itemsStr+="</ul></div>";
    item.append($(itemsStr));
    $("#content").append(item); 
    
}

function divName(){
    $(".orderBox").each((i,el)=>{
        $(el).data("Info",ordersObj[i]);
        $(el).data("Status",ordersObj[i].status);
    });
}

function removeItem(orderID){
    ordersObj = ordersObj.filter(el=>{return el.orderID != orderID}); 
    console.log(ordersObj);
}

socket.on("order_status_result",output=>{
    if(output.success)console.log("Order status successfully updated!");
    else console.error(output.reason);
    
});

function alterOrderVal(orderID,attribute,newVal){
    ordersObj.forEach(el=>{
        if(el.orderID==orderID){
            el[attribute] = newVal;
            switch(attribute){
                case "status":
                    socket.emit("order_status",el);
                    break;
            }
        }
    });
}

function ordersReceived(){
    ordersObj.sort((a,b)=>a.orderID-b.orderID);
    ordersObj.forEach(el=>{
        buildItem(el);
    });     
    $(".status").click(event=>{
        switch($(event.target).parent().parent().data("Status")){
            case 2:
                alterOrderVal($(event.target).parent().parent().data("Info").orderID,"status",1);
                $(event.target).parent().parent().data("Status",1);
                $(event.target).html("Cooking");
                $(event.target).hover(()=>{
                    $(event.target).css("background-color","red");
                },()=>{
                    $(event.target).css("background-color","orange");
                });
                break;
            case 1:
                alterOrderVal($(event.target).parent().parent().data("Info").orderID,"status",0);
                removeItem($(event.target).parent().parent().data("Info").orderID);
                $(event.target).parent().parent().remove();
                break;
            case 0:
                alterOrderVal($(event.target).parent().parent().data("Info").orderID,"status",0);
                removeItem($(event.target).parent().parent().data("Info").orderID);
                $(event.target).parent().parent().remove();
                break;
        }
    });
    divName(); //check all the orderObj are added to page then ID them
}

$(document).ready(()=>{
    socket.emit("get_orders");
    socket.on("get_orders_result",(output)=>{
        if(output.success) ordersObj=output.orders, ordersReceived(),console.log(ordersObj);
        else console.log("ORDER REQUEST UNSUCCESFUL");                                                                                                                       
    });

});

/*  --- DIV STRUCTURE
    <div class="orderBox"> 
        <div class="topBar">
            <div class="orderTitle">
                Table 1
            </div>
            <span class="status">waiting to cook</span>
        </div>
        <hr />
        <div class="orderItems">
            <ul>
                <li>
                    <div class="orderItem">
                        <span class="itemTXT">item 1</span>
                        <span class="itemNotes">well done</span>
                    </div>
                </li>
                <li>
                    <div class="orderItem">
                        <span class="itemTXT">item2</span>
                        <span class="itemNotes">medium rare</span>
                    </div>
                </li>
                <li>
                    <div class="orderItem">
                        <span class="itemTXT">item3</span>
                        <span class="itemNotes">blah blah</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>

*/
