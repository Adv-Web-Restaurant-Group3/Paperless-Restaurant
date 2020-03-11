/**
 * WaiterClient class. for interfacing with the server as a Waiter view.
 */

class WaiterClient {
    _current_orders = [];
    _socket = io("/waiter");
    _update_callback = null;

    get socket() { return this._socket; }
    get orders() { return this._current_orders; }

    constructor() {
        this.updateMenu();
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

    sync(timeout) {
        setInterval(this.update, timeout)
    }

    update() {
        this.socket.emit("get_orders", { tableNum: this._table });
        this.socket.off("get_orders_result");
        let client = this;
        this.socket.on("get_orders_result", function (response) {
            console.log(response)
            if (response.success) {
                client._update_orders(response.orders);
                if (client._update_callback) client._update_callback();
            } else {
                alert("server responded with an error: " + response.reason);
            }
        });
    }

    onUpdate(callback) {
        this._update_callback = callback;
    }
}