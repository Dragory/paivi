const noop = function() {};

class Queue {
    constructor() {
        this.items = [];
        this.running = false;
        this.stopped = false;

        this.finallyListeners = [];

        this.currentNext = noop;
        this.itemTimeoutMs = 0;
        this.itemTimeout = null;
    }

    setItemTimeout(ms) {
        this.itemTimeoutMs = ms;
    }

    run() {
        if (this.stopped) return;
        if (this.running) return;
        if (this.items.length === 0) return;

        this.running = true;

        let next = () => {
            if (this.stopped) return;

            if (this.items.length === 0) {
                this.running = false;
                this.currentNext = noop;
                return;
            }

            // Call item with params (next, stop)
            let callNextNext = () => {
                // If we've already been called, don't do anything
                if (this.currentNext !== callNextNext) return;

                this.items.shift();
                next();
            };

            this.currentNext = callNextNext;

            this.items[0](callNextNext, this.stop.bind(this));

            if (this.itemTimeoutMs !== 0) {
                clearTimeout(this.itemTimeout);
                setTimeout(() => this.forceNext(), this.itemTimeoutMs);
            }
        };

        next();
    }

    stop() {
        if (this.stopped) return;

        this.stopped = true;
        this.items = [];
        this.currentNext = noop;
        this.callFinallyListeners();
    }

    finally(cb) {
        this.finallyListeners.push(cb);
    }

    callFinallyListeners() {
        this.finallyListeners.forEach((cb) => cb());
    }

    add(item, run = true) {
        if (this.stopped) return;

        this.items.push(item);
        if (run) this.run();
    }

    forceNext() {
        this.currentNext();
    }
}

module.exports = Queue;