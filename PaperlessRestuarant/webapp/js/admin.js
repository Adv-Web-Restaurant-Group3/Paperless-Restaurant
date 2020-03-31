

var client = new AdminClient();
$(document).ready(function () {
    $('#menu_table').DataTable({
        data: [], columns: [
            { data: "itemNum" },
            { data: "itemName" },
            { data: "category" },
            { data: "price" },
            { data: "estTime" },
            { data: "sales.week.units_sold" },
            { data: "sales.month.units_sold" },
            { data: "sales.year.units_sold" },
            { data: "sales.week.income" },
            { data: "sales.month.income" },
            { data: "sales.year.income" },
        ]
    });

    $("form#login_form").on("submit", function (e) {
        e.preventDefault();
        let password = $(this).find("input.input").val();
        client.login(password, function () {
            $("div#login").hide();
            $("main").removeClass("hidden");
        });
        client.onUpdate(function () {
            updateCats();
            let table = $('#menu_table').dataTable();
            console.log(table)
            table.fnClearTable();
            table.fnAddData(client.items);
        });
    });
    $("form#add_item_form").on("submit", function (e) {
        e.preventDefault();
        let itemNum = $(this).find("input#itemNum").val();
        let itemName = $(this).find("input#itemName").val();
        let price = parseInt($(this).find("input#price").val());
        let estTime = parseInt($(this).find("input#estTime").val());
        let category = parseInt($(this).find("select#category").val());
        let isVegetarian = $(this).find("input#vegetarian").prop("checked");
        let isVegan = $(this).find("input#vegan").prop("checked");
        let containsNuts = $(this).find("input#nuts").prop("checked");
        let glutenFree = $(this).find("input#gluten_free").prop("checked");
        if (itemNum.length == 0) itemNum = undefined;
        client.addItem({ itemNum, itemName, price, category, estTime, isVegetarian, isVegan, containsNuts, glutenFree }, function (success) {
            if (success) $("form#add_item_form p.message").text("successfully added menu item")
            else $("form#add_item_form p.message").text("error")
            setTimeout(function () { $("form#add_item_form p.message").text("") }, 4000)
        });
    });
    $("form#remove_item_form").on("submit", function (e) {
        e.preventDefault();
        let itemNum = parseInt($(this).find("input#itemNum").val());
        client.removeItem(itemNum, function (success) {
            if (success) $("form#remove_item_form p.message").text("successfully removed menu item")
            else $("form#remove_item_form p.message").text("error")
            setTimeout(function () { $("form#remove_item_form p.message").text("") }, 4000)
        });
    });


});

function updateCats() {
    let $cats = $("select#category");
    $cats.not(":first").remove();
    for (let cat of client.categories) {
        $cats.append(`<option value="${cat.catID}">${cat.catName}</option>`);
    }
}