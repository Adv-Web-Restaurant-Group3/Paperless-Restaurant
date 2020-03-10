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


function buildItem(obj){
    var orderID = obj.orderID;
    var item = $("<div class='orderBox'></div>");
    // TOP BAR
    var topBar = $("<div class='topBar'><div class='orderTitle'></div><span class='status'></span</div>");
    topBar.find(".orderTitle").append("Order "+orderID);
    topBar.find(".status").append("Waiting To Cook");
    item.append(topBar);
    item.append("<hr>");
    //ITEMS
    var itemsStr="<div class='orderItems'><ul>";
    obj.items.forEach(el=>{
        for(let i=0;i<el.quantity;i++){
            itemsStr+= "<li>";
            itemsStr+= "<div class='orderItem'>" 
            itemsStr+= "<span class='itemTXT'>"+el.name+"</span>";
            if(el.notes)itemsStr+= "<span class='itemNotes'>"+el.notes+"</span>";
            itemsStr+= "</div>";
            itemsStr+= "</li>";
        }
    });  
    itemsStr+="</ul></div>";
    item.append($(itemsStr));
    //console.log(itemsStr);
    $("#content").append(item);
    //console.log(item.prop('outerHTML'));    
    
}

function divName(){
    if($(".orderBox").length!=ordersObj.length){
        divCount();
    }else{
        $(".orderBox").each((i,el)=>{
            $(el).data("Info",ordersObj[i]);
            $(el).data("Status","Waiting To Cook");
            //console.log($(el).data("Status"));
        });
    }
}

function removeItem(orderID){
    ordersObj = ordersObj.filter(el=>{return el.orderID != orderID}); 
    console.log(ordersObj);
}

$(document).ready(()=>{
    ordersObj.sort((a,b)=>a.orderID-b.orderID);
    ordersObj.forEach(el=>{
        buildItem(el);
    });

    $(".status").click(event=>{
        switch($(event.target).parent().parent().data("Status")){
            case "Waiting To Cook":
                $(event.target).parent().parent().data("Status","Cooking")
                $(event.target).html("Cooking");
                break;
            case "Cooking":
                removeItem($(event.target).parent().parent().data("Info").orderID);
                $(event.target).parent().parent().remove();
                break;
        }
    });
    divName(); //check all the orderObj are added to page then ID them

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


