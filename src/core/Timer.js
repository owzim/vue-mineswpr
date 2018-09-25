const DEFAULT_OPTIONS = {
    delay: 1000,
    times: -1,
    immediate: false,
    callback: function() {
        // placeholder
    },
};

const INITIAL_STATE = {
    counter: 0,
    id: null,
    start: 0,
};

const Timer = {

    create(options_ = {}) {
        const state = { ... INITIAL_STATE };
        const {
            delay,
            times,
            callback,
            immediate,
        } = {
            ... DEFAULT_OPTIONS,
            ... options_,
        };

        function tick() {
            const currentTick = ++state.counter;

            if (times === -1 || currentTick <= times) {
                callback({
                    counter: currentTick,
                    delta: Date.now() - state.start,
                });
            } else {
                this.stop();
            }
        }

        return {
            start() {
                state.counter = 0;
                state.start = Date.now();

                if (immediate) {
                    tick();
                }

                state.id = setInterval(tick, delay);
                return this;
            },
            stop() {
                state.counter = 0;
                clearInterval(state.id);
            }
        };
    }
};

export default Timer;
