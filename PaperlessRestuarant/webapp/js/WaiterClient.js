/**
 * WaiterClient class. for interfacing with the server as a Waiter view.
 */
const OrderStatus = {
    get WAITING() { return "ORDER_STATUS:1" },
    get COOKING() { return "ORDER_STATUS:2" },
    get SERVING() { return "ORDER_STATUS:3" },
    get SERVED() { return "ORDER_STATUS:4" },
}
class WaiterClient {
    _current_orders = [];
    _table = -1;
    _socket = io("/waiter");
    _update_callback = null;
    _menu_update_callback = null;
    _items = [];
    _categories = [];

    get socket() { return this._socket; }
    get orders() { return this._current_orders; }
    get items() { return this._items; }
    get categories() { return this._categories; }
    get table() { return this._table; }

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

    setTable(table) {
        if (typeof table === "number" && table >= 0) {
            this._table = table;
            this.update();
        }

    }


    sync(timeout) {
        setInterval(this.update, timeout);
    }

    update() {
        if (this._table > 0) {
            this.socket.emit("get_orders", { tableNum: this._table });
            this.socket.off("get_orders_result");
            let client = this;
            this.socket.on("get_orders_result", function (response) {
                console.log(response)
                if (response.success) {
                    client._update_orders(response.orders);
                    if (client._update_callback) client._update_callback(client.orders);
                } else {
                    alert("server responded with an error: " + response.reason);
                }
            });
        } else return "set table num using setTable(tableNum) before calling update!"
    }

    onUpdate(callback) {
        this._update_callback = callback;
    }
    onMenuUpdate(callback) {
        this._menu_update_callback = callback;
    }

    /* client-side simplification.
    order:{
        items:[{itemNum, quantity, notes}, ...],
    }
    */
    addOrder(order) {
        if (order && order.items) {
            if (this._table > 0) {
                this.socket.emit("order", {
                    order: {
                        tableNum: this._table,
                        items: order.items
                    }
                });
                this.socket.off("order_result");
                let client = this;
                this.socket.on("order_result", function (response) {
                    console.log(response);
                    if (response.success) {
                        console.log("order added successfully: ", order);
                        client.update();
                    } else {
                        console.log("Server responded with an error while trying to add order: " + response.reason);
                    }
                });
            } else return "set table num using setTable(tableNum) before calling addOrder!"
        } else return "invalid order object, provide items attribute."

    }
    _update_orders(orders) {
        for (let order of orders) {
            order.status = Object.keys(OrderStatus)[order.status - 1].toLowerCase();
            order.orderTime = new Date(order.orderTime);
        }
        this._current_orders = orders;
        console.log("orders for table " + this._table + ":", orders);
    }

}