let client = new CounterClient();
client.update();

var tables = [];
var currentTable = 0;

function getTable(num){
    return tables.filter(el=>el.tableNum==num);
}

function buildTableList(callback){
    let items = "";
    let tNumList = [];
    tables.forEach(el=>{
        let item = `
        <div class="tableItem">
            Table ${el.tableNum}
        </div>
        `;
        items = items.concat(item);
        tNumList.push(el.tableNum);
    });
    callback([items,tNumList]);
}

function buildItem(el,callback){
    let item = "<div class='items'>";
    el.items.forEach(itemEl=>{
        let quantity ="";
        if(itemEl.quantity!=1){
            quantity = " x"+itemEl.quantity;
            quantity = `<div class="quantity">${quantity}</div>`;
        }
        item += `<div class='item'> 
            <div class="name">${itemEl.itemName}
            ${quantity}</div> 
            <div class="price">£${itemEl.price}</div>
        </div> `;
    });
    item += "</div>";
    callback(item);
}

function buildOrder(el,callback){
    let item = "";
    buildItem(el,string=>{
        callback(string);
    });
}

function ordersAdded(tableObj, callback){
    if($(".orderBox").length == tableObj.orders.length)callback();
}

function displayTableContent(tNum){
    currentTable = tNum;
    $("#tablesBox").hide();
    $("#tableContent").show();
    let top = `
        <div id="titleBox">Table: ${currentTable}</div>
    `;
    $("#tableContent").html(top);
    let tableObj = getTable(tNum)[0];
    console.log(tableObj);
    tableObj.orders.forEach(el=>{
        let orderItem = `<div class="orderBox">`;
        buildOrder(el, string=>{
            orderItem += string + "</div>";
            $("#tableContent").append(orderItem);
        });
    });
    ordersAdded(tableObj,()=>{
        $("#tableContent").append("<hr>");
        let total = `
            <div id="grandTotal">
                Grand Total: £${tableObj.grandTotal}
            </div>
        `;
        $("#tableContent").append(total);
        $("#tableContent").append("<hr>");
    });
}

function tableSelectEvent(el){
    $(el).click(event=>{
        displayTableContent($(el).data("tNum"));
    });
}

function tableList(){
    $("#tablesBox").html("");
    let top = `<div id="titleBox">Select a table</div>`;
    $("#tablesBox").append(top);
    buildTableList(data=>{
        let string = data[0];
        let tNumList = data[1];
        $("#tablesBox").append(string);
        $(".tableItem").each((i,el)=>{
            $(el).data("tNum", tNumList[i]);
            tableSelectEvent(el);
        });
    });
}

client.onUpdate(data=>{
    if(JSON.stringify(tables) !== JSON.stringify(data)){
        tables = data;
        tableList();
        if($("#tableContent").is(":visible") && currentTable != 0){
            displayTableContent(currentTable);
        }
    }
});

$(document).ready(()=>{
    $("#return").click(event=>{
        currentTable = 0;
        client.update();
        $("#tableContent").hide();
        $("#tablesBox").show();
    });
});

client.sync(5000);
