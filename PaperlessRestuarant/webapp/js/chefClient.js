let ordersObj = [
    {
        orderID:123,
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
        orderID:123,
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
        orderID:123,
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
        orderID:123,
        tableNo:1,
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
        orderID:123,
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
    }
];


function buildItem(obj){
    var orderTitle = obj.tableNo;
    var item = $("<div class='orderBox'></div>");
    // TOP BAR
    var topBar = $("<div class='topBar'><div class='orderTitle'></div><span class='status'></span</div>");
    topBar.find(".orderTitle").append("Table "+orderTitle);
    topBar.find(".status").append("Waiting To Cook");
    item.append(topBar);
    item.append("<hr>");
    //ITEMS
    var itemsStr="<div class='orderItems'><ul>";
    obj.items.forEach(el=>{
        itemsStr+= "<li>";
        itemsStr+= "<div class='orderItem'>" 
        itemsStr+= "<span class='itemTXT'>"+el.name+"</span>";
        itemsStr+= "<span class='itemNotes'>"+el.notes+"</span>";
        itemsStr+= "</div>";
        itemsStr+= "</li>";
    });  
    itemsStr+="</ul></div>";
    item.append($(itemsStr));
    //console.log(itemsStr);
    $("#content").append(item);
    //console.log(item.prop('outerHTML'));    
}

$(document).ready(()=>{
    ordersObj.forEach(el=>{
        buildItem(el);
    });
});

/*
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
/*
function toggleIMG(divContent){
    if(divContent.includes("checked")){
        return '<img src="images/box.png">';
    }else{
        return '<img src="images/checked-box.png">';
    }
}
$(".orderItem").click(event=>{
    let itemImage = $(event.target).parent().find(".itemIMG");
    if(!$(event.target).find("img").length) itemImage = $(event.target).parent().parent().find(".itemIMG");
    itemImage.html(toggleIMG(itemImage.html()));
});
*/


