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
    "itemName" : "Duck Pancake Rolls"
}];

updateOrder();
function updateOrder() {

    var sectionA = document.getElementById("section-a");

    var content = "";

    for(var i=0;i<category.length;i++) {
        catID = category[i].catID;
        catName = category[i].catName;

        content += `
        <li value="${catID}">${catName}</li>
        `;

    }

    sectionA.innerHTML = content;

}