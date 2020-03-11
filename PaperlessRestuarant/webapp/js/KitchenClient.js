/**
 * WaiterClient class. for interfacing with the server as a Waiter view.
 */

class KitchenClient {
    _current_orders = [];
    _socket = io("/kitchen");
    _update_callback = null;

    get socket() { return this._socket; }
    get orders() { return this._current_orders; }

    constructor() {
        this.update();
    }

    sync(timeout) {
        setInterval(this.update, timeout)
    }

    update() {
        this.socket.emit("get_orders");
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
    }

    _update_orders(orders) {
        this._current_orders = orders;
    }

    onUpdate(callback) {
        this._update_callback = callback;
    }
}