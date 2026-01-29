// A simple pub-sub messaging handler.
// We'll separate out the pub-sub system as its own logic layer in this file.

// Note: We don't need to hardcode for specific event types;
// We can just make a generic 'mailman' and then wrap it in a more specific case later.

const PubSub = {
    _subscribers: {}, // store who is subscribed, and to what event
    // {
    //     "gets-hungry": [mouthCallback, brainCallback]
    // }
    // We can assume that a Stomach component might've emitted this event
    // but the receiver components (e.g. Mouth, Brain) don't need to know about it!

    subcribe(event, callback) {
        // register a given subscriber to a given event
        if (!this._subscribers[event]) {
            this._subscribers[event] = [];
            // initialise an empty array to store callbacks if there were no subscribers yet
        }
        this._subscribers[event].push(callback);
    },

    publish(event, ...data) {  // ...array separates one array into a series of indidivual terms
        // broadcast the event & provided payload data to the event's subscribers
        if (this._subscribers[event]) {
            this._subscribers[event].forEach(callback => callback(...data));
        }
    },
};
