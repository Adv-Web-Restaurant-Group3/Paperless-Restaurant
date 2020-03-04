var category = [{
    "catID" : 1,
    "catName" : "Side Orders"
},
{
    "catID" : 2,
    "catName" : "Tye Wan Mein"
}];

var item = [{
    "category" : 1,
    "itemNum" : 11,
    "itemName" : "Tyepyedong Soup - Ramen Noodles",
    "estTime" : 300
},
{
    "category" : 1,
    "itemNum" : 7,
    "itemName" : "Edamame",
    "estTime" : 400
},
{
    "category" : 2,
    "itemNum" : 14,
    "itemName" : "Yasai Soup - Ramen Noodles",
    "estTime" : 500
}];


var order = [];


updateItems();
function updateItems() {

    var sectionA = "";
    var sectionB = "";
    for(var i=0;i<category.length;i++) {
        catID = category[i].catID;
        catName = category[i].catName;

        sectionA += `<li value="category${catID}" class="categoryList">${catName}</li>`;

        sectionB += `<div id="category${catID}" style="display:none;"></div>`;

    }
    document.getElementById("section-a").innerHTML = sectionA;
    document.getElementById("section-b").innerHTML = sectionB;


    
    for(var i=0;i<item.length;i++) {
        content = "";

        categoryNum = item[i].category;
        itemNum = item[i].itemNum;
        itemName = item[i].itemName;

        content = `<li value="${itemNum}">${itemNum}. ${itemName} <span class="plus">&#43;</span></li>`;

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
        });
    }

    


}


function addOrder(add) {

    var exists = false;
    for (var i = 0; i < order.length; i++) {
        if(order[i][0] === add) {
            exists = true;
            order[i][1] = order[i][1] + 1;
        }
    }
    if(!exists) {
        order.push([add, 1]);
    }
    console.log(order);

    updateSummary();


    
}


function minusOrder(data) {

    for (var i = 0; i < order.length; i++) {
        if(order[i][0] === data) {

            order[i][1] = order[i][1] - 1;
            if(order[i][1] < 1) {
                order.splice(i, 1);
                break;
            }

        }
    }
    updateSummary();
}

updateSummary();
function updateSummary() {

    var content = "Order Summary";
    var max = 0;
    for (var i = 0; i < item.length; i++) {
        for (var x = 0; x < order.length; x++) {

            if(Number(order[x][0]) === item[i].itemNum) {
                // Calc's the max cook time
                if(max < item[i].estTime) {
                    max = item[i].estTime;
                }

                // Generates order Summary
                content += `<li value="${order[x][0]}">${order[x][0]}. ${item[i].itemName} x${order[x][1]} <span class="minus">&#45;</span></li>`;
            }


        }
    }
    content += `<div id="estTime">Est Time<br>${max}</div>
    <div id="saveTable">Save To Table</div>`;

    document.getElementById("section-c").innerHTML = content;

    

    document.getElementById("saveTable").addEventListener('click', function() {
        console.log("save Order Order Num, Array and Max");
    });


    var minus = document.getElementsByClassName("minus");
    for (var i = 0; i < minus.length; i++) {
        minus[i].addEventListener('click', function() {
            minusOrder(this.parentNode.getAttribute("value"));
        });
    }
}

