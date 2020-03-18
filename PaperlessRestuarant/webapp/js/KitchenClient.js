/**
 * KitchenClient class. for interfacing with the server as a Kitchen view.
 */

//OrderStatus enum
const OrderStatus = {
    get WAITING() { return "ORDER_STATUS:1" },
    get COOKING() { return "ORDER_STATUS:2" },
    get SERVING() { return "ORDER_STATUS:3" },
    get SERVED() { return "ORDER_STATUS:4" },
}
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
        setInterval(this.update, timeout);
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

    setStatus(orderID, orderStatus) {
        //use with OrderStatus enum! 
        //example: client.setStatus(2, OrderStatus.COOKING);
        if (typeof orderStatus === "string") {
            let status = parseInt(orderStatus.substr(13, 1));
            this.socket.emit("order_status", { orderID, status });
            this.socket.off("order_status_result");
            this.socket.on("order_status_result", function (response) {
                if (response.success) {
                    console.log("successfully set status of order " + orderID + " to '" + status + "'");
                } else console.log("Server responded with error while trying to update order status: " + response.reason);
            });
        }
    }

    _update_orders(orders) {
        for (let order of orders) {
            //order.status = Object.keys(OrderStatus)[order.status - 1].toLowerCase();
            order.orderTime = new Date(order.orderTime);
        }
        this._current_orders = orders;
        console.log(orders);
    }

    onUpdate(callback) {
        this._update_callback = callback;
    }
}