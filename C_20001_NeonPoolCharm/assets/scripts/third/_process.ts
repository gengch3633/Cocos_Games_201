let cachedSetTimeout: typeof setTimeout | typeof throwSetTimeoutNotDefined;
let cachedClearTimeout: typeof clearTimeout | typeof throwClearTimeoutNotDefined;

function throwSetTimeoutNotDefined(): never {
    throw new Error("setTimeout has not been defined");
}

function throwClearTimeoutNotDefined(): never {
    throw new Error("clearTimeout has not been defined");
}

function runTimeout(fun: () => void): ReturnType<typeof setTimeout> {
    if (cachedSetTimeout === setTimeout) {
        return setTimeout(fun, 0);
    }
    if (cachedSetTimeout === throwSetTimeoutNotDefined || !cachedSetTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        return cachedSetTimeout(fun, 0);
    } catch (t) {
        try {
            return cachedSetTimeout.call(null, fun, 0);
        } catch (t) {
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}

function runClearTimeout(marker: ReturnType<typeof setTimeout>): void {
    if (cachedClearTimeout === clearTimeout) {
        return clearTimeout(marker);
    }
    if (cachedClearTimeout === throwClearTimeoutNotDefined || !cachedClearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        return cachedClearTimeout(marker);
    } catch (t) {
        try {
            return cachedClearTimeout.call(null, marker);
        } catch (t) {
            return cachedClearTimeout.call(this, marker);
        }
    }
}

let queue: Item[] = [];
let draining = false;
let currentQueue: Item[] = null;
let queueIndex = -1;

function cleanUpNextTick(): void {
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

function drainQueue(): void {
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

class Item {
    fun: (...args: any[]) => void;
    array: any[];

    constructor(fun: (...args: any[]) => void, array: any[]) {
        this.fun = fun;
        this.array = array;
    }

    run(): void {
        this.fun.apply(null, this.array);
    }
}

function noop(): void {
}

(function initTimers() {
    try {
        cachedSetTimeout = typeof setTimeout === "function" ? setTimeout : throwSetTimeoutNotDefined;
    } catch (e) {
        cachedSetTimeout = throwSetTimeoutNotDefined;
    }
    try {
        cachedClearTimeout = typeof clearTimeout === "function" ? clearTimeout : throwClearTimeoutNotDefined;
    } catch (e) {
        cachedClearTimeout = throwClearTimeoutNotDefined;
    }
})();

const process = {
    nextTick(callback: (...args: any[]) => void, ...args: any[]): void {
        const newArgs = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (let i = 1; i < arguments.length; i++) {
                newArgs[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(callback, newArgs));
        if (queue.length !== 1 || draining) {
            return;
        }
        runTimeout(drainQueue);
    },
    title: "browser",
    browser: true,
    env: {},
    argv: [] as string[],
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
    listeners(): any[] {
        return [];
    },
    binding(): never {
        throw new Error("process.binding is not supported");
    },
    cwd(): string {
        return "/";
    },
    chdir(): never {
        throw new Error("process.chdir is not supported");
    },
    umask(): number {
        return 0;
    },
};

export default process;
