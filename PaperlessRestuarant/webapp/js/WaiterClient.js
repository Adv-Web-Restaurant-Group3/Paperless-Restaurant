/**
 * WaiterClient class. for interfacing with the server as a Waiter view.
 */

class WaiterClient {
    _party = -1;
    _socket = io("/waiter");

    setParty(party) {
        if (typeof party === "number" && party >= 0)
            this._party = party;
    }
    getParty() {
        return this._party;
    }

    update() {
        this._socket.emit("get_orders")
    }

    onUpdate(callback) {
        //code
        callback(data)
    }

    sendOrder(order) {

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

})