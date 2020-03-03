/**
 * WaiterClient class. for interfacing with the server as a Waiter view.
 */

class WaiterClient {
    _current_orders = [];
    _table = -1;
    _socket = io("/waiter");

    get socket() { return this._socket; }

    setTable(table) {
        if (typeof table === "number" && table >= 0)
            this._table = table;
    }
    getTable() {
        return this._table;
    }

    sync(timeout) {
        setInterval(this._update(), timeout)
    }

    update() {
        this.socket.emit("get_orders", { tableNum: this._table });
        this.socket.off("get_orders_result");
        this.socket.on("get_orders_result", function(response) {
            if (response.success) {
                this._update_orders(response.orders);
            } else {
                alert("server responded with an error: " + response.reason);
            }
        });
    }

    onUpdate(callback) {
        //code
        callback()
    }

    getOrders() {
        return this._current_orders;
    }

    sendOrder(order) {
        this.socket.emit()
    }
    _update_orders(orders) {
        this._current_orders = orders;
    }

}
//API to poll the socket server.

//sendOrder
function sendOrder(order) {

}
//receiveOrder

let client = new WaiterClient();

client.update();

client.onUpdate(function(orders) {

});