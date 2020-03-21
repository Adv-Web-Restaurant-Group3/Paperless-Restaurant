let client = new CounterClient();
client.update();

var tables = [];
var currentTable = 0;
var billpopupHTML = `
    <div id=toppopbar></div>
    <div id="text">
        There are still unserved orders for this table
        these must be cancelled to clear the bill
    </div>
    <div id="options"> 
        <div id="canBill">Bill Anyway</div>
        <div id="exit">Exit</div>
    </div>
`;

function getTable(num){
    return tables.filter(el=>el.tableNum==num);
}

function reset(){
    currentTable = 0;
    client.update();
    $("#tableContent").hide();
    $("#tablesBox").show();
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
            <div class="price">£${itemEl.price*itemEl.quantity}</div>
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


function destroyPopup(){
    $("#popUp").html("");
    $("#popUp").hide();
    $("#overlay").hide();
}

function errorPopup(){
    let errhtml = `
    <div id=toppopbar></div>
    <div id="text">
        Error Clearing Bill!
    </div>
    `;
    billPopup(currentTable,errhtml,false)
    setTimeout(()=>{destroyPopup(),2000});
}

function billPopup(currentTable,html,addEvents){
    $("#popUp").show();
    $("#overlay").show();
    $("#popUp").html(html);
    if(addEvents){
        $("#exit").click(event=>{
            destroyPopup();
        });
        $("#canBill").click(event=>{
            client.cancelPending(currentTable,result=>{
                switch(result){
                    case true:
                        client.billTable(currentTable,result=>{
                            if(result==true){
                                destroyPopup();
                                reset();
                            }
                            else errorPopup();
                        });
                        break;
                    case false:
                        errorPopup();
                        break;
                }
            });
        });
    }
}

function displayTableContent(tNum){
    currentTable = tNum;
    $("#tablesBox").hide();
    $("#tableContent").show();
    let top = `
        <div id="titleBox">Table ${currentTable}</div>
    `;
    $("#tableContent").html(top);
    let tableObj = getTable(tNum)[0];
    console.log(tableObj);
    if(tableObj==undefined){ //if table is cleared from bill
        reset();
        return;
    }
    tableObj.orders.forEach(el=>{
        let orderItem = `<div class="orderBox">`;
        buildOrder(el, string=>{
            orderItem += string + "</div>";
            $("#tableContent").append(orderItem);
        });
    });
    ordersAdded(tableObj,()=>{
        $("#tableContent").append("<hr>");
        let html = `
        <div id="bottomBar">
            <div id="billTable">
                Bill Table
            </div>
            <div id="grandTotal">
                Grand Total: £${tableObj.grandTotal}
            </div>
        </div>
        `;
        $("#tableContent").append(html);
        $("#tableContent").append("<hr>");
        $("#billTable").click(event=>{
            client.billTable(currentTable,result=>{
                switch(result){
                    case true:
                        reset();
                        break;
                    case false:
                        billPopup(currentTable,billpopupHTML,true);
                        break;
                }
            });
        });
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
        reset();
    });
});

client.sync(5000);
