

let client = new AdminClient();
$(document).ready(function () {
    $("form#login_form").on("submit", function (e) {
        e.preventDefault();
        let password = $(this).find("input.input").val();
        client.login(password);
        client.onLogin(function () {
            $("div#login").hide();
            $("main").removeClass("hidden");
        });
        client.onUpdate(function () {
            updateCats();
            $('#menu_table').DataTable({
                data: client.items, columns: [
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