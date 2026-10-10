let cachedSetTimeout;
let cachedClearTimeout;

function timeoutNotDefined() {
    throw new Error("setTimeout has not been defined");
}

function clearTimeoutNotDefined() {
    throw new Error("clearTimeout has not been defined");
}

function runTimeout(callback) {
    if (cachedSetTimeout === setTimeout) {
        return setTimeout(callback, 0);
    }
    if ((cachedSetTimeout === timeoutNotDefined || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(callback, 0);
    }
    try {
        return cachedSetTimeout(callback, 0);
    } catch (err) {
        try {
            return cachedSetTimeout.call(null, callback, 0);
        } catch (err2) {
            return cachedSetTimeout.call(this, callback, 0);
        }
    }
}

function runClearTimeout(timer) {
    if (cachedClearTimeout === clearTimeout) {
        return clearTimeout(timer);
    }
    if ((cachedClearTimeout === clearTimeoutNotDefined || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(timer);
    }
    try {
        return cachedClearTimeout(timer);
    } catch (err) {
        try {
            return cachedClearTimeout.call(null, timer);
        } catch (err2) {
            return cachedClearTimeout.call(this, timer);
        }
    }
}

let currentQueue;
let queue = [];
let draining = false;
let queueIndex = -1;

function cleanUpNextTick() {
    if (draining && currentQueue) {
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }
}

function drainQueue() {
    if (!draining) {
        const timeout = runTimeout(cleanUpNextTick);
        draining = true;
        let len = queue.length;
        while (len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
    }
}

class NextTickItem {
    fun;
    array;

    constructor(fun, array) {
        this.fun = fun;
        this.array = array;
    }

    run() {
        this.fun.apply(null, this.array);
    }
}

function noop() {}

(function () {
    try {
        cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : timeoutNotDefined;
    } catch (e) {
        cachedSetTimeout = timeoutNotDefined;
    }
    try {
        cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : clearTimeoutNotDefined;
    } catch (e) {
        cachedClearTimeout = clearTimeoutNotDefined;
    }
})();

const process = {
    nextTick: function (callback) {
        const args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (let i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new NextTickItem(callback, args));
        1 !== queue.length || draining || runTimeout(drainQueue);
    },
    title: "browser",
    browser: true,
    env: {},
    argv: [],
    version: "",
    versions: {},
    on: noop,
    addListener: noop,
    once: noop,
    off: noop,
    removeListener: noop,
    removeAllListeners: noop,
    emit: noop,
    prependListener: noop,
    prependOnceListener: noop,
    listeners: function () {
        return [];
    },
    binding: function () {
        throw new Error("process.binding is not supported");
    },
    cwd: function () {
        return "/";
    },
    chdir: function () {
        throw new Error("process.chdir is not supported");
    },
    umask: function () {
        return 0;
    }
};

export default process;
