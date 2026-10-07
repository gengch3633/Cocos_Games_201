interface TypedEventRecord {
    callback: (...args: any[]) => void;
    target: any;
    once: boolean;
}

export class TypedEventTarget {
    _eventMap: { [key: string]: TypedEventRecord[] } = {};

    on(eventName: string, callback: (...args: any[]) => void, target: any, once = false): void {
        if (typeof callback !== "function") {
            console.error("Callback for '" + eventName + "' is not a function.");
            return;
        }
        if (!target) {
            console.error("Target is null or undefined.");
            return;
        }
        if (this.has(eventName, callback, target)) {
            return;
        }
        this._eventMap[eventName] = this._eventMap[eventName] || [];
        this._eventMap[eventName].push({
            callback,
            target,
            once,
        });
        if (target && Array.isArray(target.__eventTargets)) {
            target.__eventTargets.push(this);
        }
    }

    once(eventName: string, callback: (...args: any[]) => void, target: any): void {
        this.on(eventName, callback, target, true);
    }

    off(eventName: string, callback: (...args: any[]) => void, target: any): void {
        const records = this._eventMap[eventName];
        if (records && target) {
            const index = records.findIndex((record) => record.callback === callback && record.target === target);
            if (index >= 0) {
                records.splice(index, 1);
            }
            if (target && Array.isArray(target.__eventTargets)) {
                const targetIndex = target.__eventTargets.indexOf(this);
                if (targetIndex >= 0) {
                    target.__eventTargets.splice(targetIndex, 1);
                }
            }
        }
    }

    targetOff(target: any): void {
        if (!target) {
            console.warn("Target is null or undefined.");
            return;
        }
        for (const eventName in this._eventMap) {
            const records = this._eventMap[eventName];
            if (records) {
                this._eventMap[eventName] = records.filter((record) => record.target !== target);
            }
        }
        if (target && Array.isArray(target.__eventTargets)) {
            target.__eventTargets = target.__eventTargets.filter((item: TypedEventTarget) => item !== this);
        }
    }

    emit(eventName: string, ...args: any[]): void {
        const records = this._eventMap[eventName];
        if (!records) {
            return;
        }
        const snapshot = records.slice();
        snapshot.forEach((record) => {
            if (typeof record.callback === "function") {
                record.callback.apply(record.target, args);
                if (record.once) {
                    this.off(eventName, record.callback, record.target);
                }
            }
        });
    }

    has(eventName: string, callback: (...args: any[]) => void, target: any): boolean {
        const records = this._eventMap[eventName];
        return !!records && records.some((record) => record.callback === callback && record.target === target);
    }

    clear(): void {
        for (const eventName in this._eventMap) {
            const records = this._eventMap[eventName];
            if (records) {
                for (let index = records.length - 1; index >= 0; index--) {
                    const record = records[index];
                    this.off(eventName, record.callback, record.target);
                }
            }
        }
    }
}
