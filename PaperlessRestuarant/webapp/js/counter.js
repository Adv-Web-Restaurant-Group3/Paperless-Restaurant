let client = new CounterClient();
client.update();

var tables = [];
var currentTable = 0;
var showReport = false;
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

function getTable(num) {
    return tables.filter(el => el.tableNum == num);
}

function reset() {
    currentTable = 0;
    client.update();
    $("#pReceipt").hide();
    $("#tableContent").hide();
    $("#tablesBox").show();
}

function buildTableList(callback) {
    let items = "";
    let tNumList = [];
    tables.forEach(el => {
        let item = `
        <div class="tableItem">
            Table ${el.tableNum}
        </div>
        `;
        items = items.concat(item);
        tNumList.push(el.tableNum);
    });
    callback([items, tNumList]);
}

function buildItem(el, callback) {
    let item = "<div class='items'>";
    el.items.forEach(itemEl => {
        let quantity = "";
        if (itemEl.quantity != 1) {
            quantity = " x" + itemEl.quantity;
            quantity = `<div class="quantity">${quantity}</div>`;
        }
        item += `<div class='item'> 
            <div class="name">${itemEl.itemName}
            ${quantity}</div> 
            <div class="price">£${(itemEl.price * itemEl.quantity).toFixed(2)}</div>
        </div> `;
    });
    item += "</div>";
    callback(item);
}

function buildOrder(el, callback) {
    let item = "";
    buildItem(el, string => {
        callback(string);
    });
}

function ordersAdded(tableObj, callback) {
    if ($(".orderBox").length == tableObj.orders.length) callback();
}


function destroyPopup() {
    $("#popUp").html("");
    $("#popUp").hide();
    $("#overlay").hide();
}

function errorPopup() {
    let errhtml = `
    <div id=toppopbar></div>
    <div id="text">
        Error Clearing Bill!
    </div>
    `;
    billPopup(currentTable, errhtml, false)
    setTimeout(() => { destroyPopup(), 2000 });
}

function printpage(src) {
    let html = `
        <html>
        <head></head>
        <body onload="window.print()">
            <img src='${src}'>
        </body>
        </html>
    `;
    return html;
}

function printBill() {
    $("#billTable").hide();
    var width = $("#tableContainer").width();
    var height = $("#tableContainer").height();
    var node = document.getElementById('tableContainer');
    domtoimage.toPng(node).then(dataUrl => {
        console.log("success");
        let img = new Image();
        img.src = dataUrl;

        let imageWin = window.open("", "Bill", "width=" + width + ",height=" + height);
        imageWin.document.write(printpage(img.src));
        imageWin.focus();
        setTimeout(() => imageWin.print(), 700);
        $("#billTable").show();

    }).catch(err => {
        console.error(err);
        alert("Unable to save bill.");

    });

}

function billPopup(currentTable, html, addEvents) {
    $("#popUp").show();
    $("#overlay").show();
    $("#popUp").html(html);
    if (addEvents) {
        $("#exit").click(event => {
            destroyPopup();
        });
        $("#canBill").click(event => {
            client.cancelPending(currentTable, result => {
                switch (result) {
                    case true:
                        client.billTable(currentTable, result => {
                            if (result == true) {
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
function addReceiptBtn() {
    $("#pReceipt").show();
    $("#pReceipt").off("click");
    $("#pReceipt").click(e => printBill());
}

function displayTableContent(tNum) {
    currentTable = tNum;
    $("#tablesBox").hide();
    $("#tableContent").show();
    addReceiptBtn();
    let top = `
        <div id="titleBox">Table ${currentTable}</div>
    `;
    $("#tableContent").html(top);
    let tableObj = getTable(tNum)[0];
    console.log(tableObj);
    if (tableObj == undefined) { //if table is cleared from bill
        reset();
        return;
    }
    tableObj.orders.forEach(el => {
        let orderItem = `<div class="orderBox">`;
        buildOrder(el, string => {
            orderItem += string + "</div>";
            $("#tableContent").append(orderItem);
        });
    });
    ordersAdded(tableObj, () => {
        $("#tableContent").append("<hr>");
        let html = `
        <div id="bottomBar">
            <div id="billTable">
                Bill Table
            </div>
            <div id="grandTotal">
                Grand Total: £${tableObj.grandTotal.toFixed(2)}
            </div>
        </div>
        `;
        $("#tableContent").append(html);
        $("#tableContent").append("<hr>");
        $("#tableContent").wrapInner("<div id='tableContainer'></div>");
        $("#billTable").click(event => {
            client.billTable(currentTable, result => {
                switch (result) {
                    case true:
                        reset();
                        break;
                    case false:
                        billPopup(currentTable, billpopupHTML, true);
                        break;
                }
            });
        });
    });
}

function tableSelectEvent(el) {
    $(el).click(event => {
        displayTableContent($(el).data("tNum"));
    });
}

function tableList() {
    $("#tablesBox").html("");
    let top = `<div id="titleBox">Select a table</div>`;
    $("#tablesBox").append(top);
    buildTableList(data => {
        let string = data[0];
        let tNumList = data[1];
        $("#tablesBox").append(string);
        $(".tableItem").each((i, el) => {
            $(el).data("tNum", tNumList[i]);
            tableSelectEvent(el);
        });
    });
}

client.onUpdate(data => {
    if (JSON.stringify(tables) !== JSON.stringify(data)) {
        tables = data;
        tableList();
        if ($("#tableContent").is(":visible") && currentTable != 0) {
            displayTableContent(currentTable);
        }
    }
});
function togglereport() {
    switch (showReport) {
        case false:
            showReport = true;
            $("#toggleReport").text("Hide report");
            $("#report").fadeIn("fast");
            $("#report").css("display", "flex");
            break;
        case true:
            showReport = false;
            $("#toggleReport").text("Show weekly profits");
            $("#report").fadeOut("fast");
            break
    }
}

$(document).ready(() => {
    $("#return").click(event => {
        reset();
    });
    $("#toggleReport").click(event => {
        togglereport();
    });
});

google.charts.load('current', { 'packages': ['line'] });


function getGoogleArray(days) {
    console.log(days)
    let day;
    let googleArray = [];
    day = new Date(Date.parse(new Date((Math.floor(new Date().getTime() / 1000) - 86400 * 6) * 1000).toDateString())); //first day in array
    googleArray.push([day, days[0]]);
    day = new Date(Date.parse(new Date((Math.floor(new Date().getTime() / 1000) - 86400 * 5) * 1000).toDateString())); //second day in array
    googleArray.push([day, days[1]]);
    day = new Date(Date.parse(new Date((Math.floor(new Date().getTime() / 1000) - 86400 * 4) * 1000).toDateString())); //3 day in array
    googleArray.push([day, days[2]]);
    day = new Date(Date.parse(new Date((Math.floor(new Date().getTime() / 1000) - 86400 * 3) * 1000).toDateString())); //4 day in array
    googleArray.push([day, days[3]]);
    day = new Date(Date.parse(new Date((Math.floor(new Date().getTime() / 1000) - 86400 * 2) * 1000).toDateString())); //5 day in array
    googleArray.push([day, days[4]]);
    day = new Date(Date.parse(new Date((Math.floor(new Date().getTime() / 1000) - 86400 * 1) * 1000).toDateString())); //6 day in array
    googleArray.push([day, days[5]]);
    day = new Date(Date.parse(new Date((Math.floor(new Date().getTime() / 1000) - 86400 * 0) * 1000).toDateString())); //last day in array
    googleArray.push([day, days[6]]);
    console.log(googleArray)
    return googleArray;
}
function updateReport(report) {
    console.log(report)
    $table = $("table#report_table");
    $table.not(":first").remove(); //remove all rows except first. (headings)
    let cats = Object.keys(report.categories);
    for (let cat of cats) {
        let catDisplay = cat;
        if (cat === "total") catDisplay = "<b>TOTAL</b>"
        $table.append(`<tr><td>${catDisplay}</td><td>${report.categories[cat]}</td></tr>`);
    }

    let googleArray = getGoogleArray(report.days);


    //update google line chart
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Day');
    data.addColumn('number', 'Profit');

    data.addRows(googleArray);

    var options = {

        chart: {
            title: 'Weekly Profits',
            subtitle: 'for each day (£)',
            legend: 'none',
            pointSize: 20,
            vAxis: { viewWindow: { min: 0 } },
        },

        width: 750,
        height: 400,
    };

    var chart = new google.charts.Line(document.getElementById('report_chart'));

    chart.draw(data, google.charts.Line.convertOptions(options));
}

client.sync(5000);

client.onReportUpdate(updateReport);
client.updateReport();
