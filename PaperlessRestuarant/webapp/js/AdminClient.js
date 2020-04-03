/**
 * Admin class. for interfacing with the server as an Admin view.
 */


class AdminClient {
    constructor(_socket, _update_callback, _loggedIn, _items, _categories, _current_sales) {
        this._socket = io("/admin");
        this._update_callback = null;
        this._loggedIn = false;
        this._items = []; //includes sales data.
        this._categories = [];
        this._current_sales = null;
    }
    get socket() { return this._socket; }
    get items() {
        let items = this._items;
        for (let item of items) {
            item.category = this.categories.find(c => c.catID === item.category).catName;
        }
        return this._items;
    }
    get categories() { return this._categories; }

    

    catID(category) {
        for (let c of this.categories) {
            if (c.catName.toUpperCase() === category.toUpperCase()) return c.catID;
        }
        return null;
    }

    sync(timeout) {
        setInterval(() => this.update(), timeout);
    }

    onUpdate(callback) {
        this._update_callback = callback;
    }

    login(password, callback) {
        if (!this._loggedIn) {
            this.socket.emit("login", { password: password });
            this.socket.off("login_result");
            let client = this;
            this.socket.on("login_result", function (response) {
                if (response.success) {
                    console.log("logged in successfully.");
                    client._loggedIn = true;
                    client.update();
                    if (callback) callback();
                }
                else {
                    console.log(response.reason)
                }
            });
        } else console.log("already logged in!");
    }

    update() {
        if (this._loggedIn) {
            this.socket.off("menu");
            let client = this;
            this.socket.on("menu", function (results) {
                console.log(results);
                let items = results.items;

                client._items = items;
                client._categories = results.categories;

                if (client._update_callback) client._update_callback();
            })
            this.socket.emit("get_menu");
        } else console.log("log in first!");
    }

    addItem(item, callback) {
        if (this._loggedIn) {
            //itemName, price, category, isVegetarian = false, isVegan = false, glutenFree = false, containsNuts = false
            this.socket.emit("add_item", { item: item });
            this.socket.off("add_item_result");
            let client = this;
            this.socket.on("add_item_result", function (response) {
                if (response.success) {
                    console.log("successfully added item.");
                    client.update();
                    if (callback) callback(true);
                    return;
                }
                else console.log(response.reason);
                if (callback) callback(false)
            })
        } else console.log("log in first!");
    }

    removeItem(itemNum, callback) {
        if (this._loggedIn) {
            this.socket.emit("remove_item", { item: itemNum });
            this.socket.off("remove_item_result");
            let client = this;
            this.socket.on("remove_item_result", function (response) {
                if (response.success) {
                    console.log("successfully removed item " + itemNum);
                    client.update();
                    if (callback) callback(true);
                    return;
                }
                else console.log(response.reason);
                if (callback) callback(false);
            });
        } else console.log("log in first!");
    }

    changePassword(newPassword) {
        if (this._loggedIn) {
            this.socket.emit("update_password", { password: newPassword });
            this.socket.off("update_password_result");
            this.socket.on("update_password_result", function (response) {
                if (response.success) {
                    console.log("password changed successfully.");
                } else console.log(response.reason);
            });
        } else console.log("log in first!");
    }

}