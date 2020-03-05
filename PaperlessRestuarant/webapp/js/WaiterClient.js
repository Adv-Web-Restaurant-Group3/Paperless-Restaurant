/**
 * WaiterClient class. for interfacing with the server as a Waiter view.
 */

class WaiterClient {
    _current_orders = [];
    _table = -1;
    _socket = io("/waiter");
    _update_callback = null;

    get socket() { return this._socket; }
    get orders() { return this._current_orders; }

    setTable(table) {
        if (typeof table === "number" && table >= 0) {
            this._table = table;
            this.update();
        }

    }
    getTable() {
        return this._table;
    }

    sync(timeout) {
        setInterval(this.update(), timeout)
    }

    update() {
        if (this._table > 0) {
            this.socket.emit("get_orders", { tableNum: this._table });
            this.socket.off("get_orders_result");
            let client = this;
            this.socket.on("get_orders_result", function(response) {
                console.log(response)
                if (response.success) {
                    client._update_orders(response.orders);
                    if (client._update_callback) client._update_callback();
                } else {
                    alert("server responded with an error: " + response.reason);
                }
            });
        } else return "set table num using setTable(tableNum) before calling update!"
    }

    onUpdate(callback) {
        this._update_callback = callback;
    }

    getOrders() {
        return this._current_orders;
    }

    sendOrder(order) {
        this.socket.emit("order", { order });
        this.socket.off("order_received");
        this.socket.on("order_received", function(response) {
            if (response.success) {
                console.log("order added successfully: ", order);
            } else {
                console.log("Server responded with an error while trying to add order: " + response.reason);
            }
        });
    }
    _update_orders(orders) {
        console.log("orders for table " + this._table + ":", orders);
        this._current_orders = orders;
    }

}