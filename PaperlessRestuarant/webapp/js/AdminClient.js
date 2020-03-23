/**
 * Admin class. for interfacing with the server as an Admin view.
 */


class AdminClient {
    _current_tables = [];
    _socket = io("/admin");
    _menu_update_callback = null;
    _loggedIn = false;
    _items = [];
    _categories = [];

    get socket() { return this._socket; }

    constructor() {
    }

    sync(timeout) {
        setInterval(() => this.updateMenu(), timeout);
    }

    onMenuUpdate(callback) {
        this._menu_update_callback = callback;
    }

    login(password) {
        this.socket.emit("login", { password: password });
        this.socket.off("login_result");
        this.socket.on("login_result", function (response) {
            if (response.success) {
                console.log("logged in successfully.");
                this._loggedIn = true;
            }
            else {
                console.log(response.reason)
            }
        });
    }

    updateMenu() {
        this.socket.off("menu");
        let client = this;
        this.socket.on("menu", function (results) {
            console.log(results);
            client._items = results.items;
            client._categories = results.categories;

            if (client._menu_update_callback) client._menu_update_callback();
        })
        this.socket.emit("get_menu");
    }

    addMenuItem(item) {
        //itemName, price, category, isVegetarian = false, isVegan = false, glutenFree = false, containsNuts = false
        this.socket.emit("add_item", { item: item });
        this.socket.off("add_item_result");
        this.socket.on("add_item_result", function (response) {
            if (response.success) {
                console.log("successfully added item.");
            }
            else console.log(response.reason);
        })
    }

    removeMenuItem(itemNum) {
        this.socket.emit("remove_item", { item: itemNum });
        this.socket.off("remove_item_result");
        this.socket.on("remove_item_result", function (response) {
            if (response.success) {
                console.log("successfully removed item " + itemNum);
            }
            else console.log(response.reason);
        });
    }

    updateSales() {
        this.socket.emit("get_sales");
        this.socket.off("sales");
        this.socket.on("sales", function (response) {
            if (response.success) {
                console.log(response);
            }
            else console.log(response.reason);
        });
    }

}