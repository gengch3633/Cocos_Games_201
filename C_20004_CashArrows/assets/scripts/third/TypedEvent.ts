type EventCallback = (...args: any[]) => void;

interface ITypedEventEntry {
    callback: EventCallback;
    target: any;
    once: boolean;
}

export class TypedEventTarget {
    _eventMap: { [event: string]: ITypedEventEntry[] } = {};

    on(event: string, callback: EventCallback, target: any, once: boolean = false): void {
        if (typeof callback !== "function") {
            console.error("Callback for '" + event + "' is not a function.");
            return;
        }
        if (!target) {
            console.error("Target is null or undefined.");
            return;
        }
        if (this.has(event, callback, target)) {
            return;
        }
        if (!this._eventMap[event]) {
            this._eventMap[event] = [];
        }
        this._eventMap[event].push({
            callback: callback,
            target: target,
            once: once
        });
        if (Array.isArray(target.__eventTargets)) {
            target.__eventTargets.push(this);
        }
    }

    once(event: string, callback: EventCallback, target: any): void {
        this.on(event, callback, target, true);
    }

    off(event: string, callback: EventCallback, target: any): void {
        const list = this._eventMap[event];
        if (!list || !target) {
            return;
        }
        const index = list.findIndex(entry => entry.callback === callback && entry.target === target);
        if (index >= 0) {
            list.splice(index, 1);
        }
        if (Array.isArray(target.__eventTargets)) {
            const targetIndex = target.__eventTargets.indexOf(this);
            if (targetIndex >= 0) {
                target.__eventTargets.splice(targetIndex, 1);
            }
        }
    }

    targetOff(target: any): void {
        if (!target) {
            console.warn("Target is null or undefined.");
            return;
        }
        for (const key in this._eventMap) {
            const list = this._eventMap[key];
            if (list) {
                this._eventMap[key] = list.filter(entry => entry.target !== target);
            }
        }
        if (Array.isArray(target.__eventTargets)) {
            target.__eventTargets = target.__eventTargets.filter(item => item !== this);
        }
    }

    emit(event: string, ...args: any[]): void {
        const list = this._eventMap[event];
        if (!list) {
            return;
        }
        const entries = list.slice();
        entries.forEach(entry => {
            if (typeof entry.callback === "function") {
                entry.callback.apply(entry.target, args);
                if (entry.once) {
                    this.off(event, entry.callback, entry.target);
                }
            }
        });
    }

    has(event: string, callback: EventCallback, target: any): boolean {
        const list = this._eventMap[event];
        return !!list && list.some(entry => entry.callback === callback && entry.target === target);
    }

    clear(): void {
        for (const key in this._eventMap) {
            const list = this._eventMap[key];
            if (list) {
                for (let i = list.length - 1; i >= 0; i--) {
                    const entry = list[i];
                    this.off(key, entry.callback, entry.target);
                }
            }
        }
    }
}

export default TypedEventTarget;