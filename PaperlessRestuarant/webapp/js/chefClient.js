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
    }
]

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


