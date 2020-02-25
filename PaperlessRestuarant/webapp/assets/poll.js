var socket = io("/waiter");

class WaiterClient {
    _party = -1;

    setParty(party) {
        this._party = party;
    }
    getParty() {
        return this._party;
    }

    update() {
        //update code
        //return orders
    }

    onUpdate(callback) {
        //code
    }

}
//API to poll the socket server.

//sendOrder

function sendOrder(order) {

}

//receiveOrder




let client = new WaiterClient();

client.party = 1;

client.update();

client.onUpdate(function(orders) {

})


string += `${hello}`