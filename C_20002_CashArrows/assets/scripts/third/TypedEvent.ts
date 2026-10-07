interface EventRecord {
    callback: (...args: any[]) => void;
    target: any;
    once: boolean;
}

export class TypedEventTarget {
    _eventMap: Record<string, EventRecord[]> = {};

    on(event: string, callback: (...args: any[]) => void, target: any, once: boolean = false): void {
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
        this._eventMap[event] = this._eventMap[event] || [];
        this._eventMap[event].push({ callback, target, once });
        if (target && Array.isArray(target.__eventTargets)) {
            target.__eventTargets.push(this);
        }
    }

    once(event: string, callback: (...args: any[]) => void, target: any): void {
        this.on(event, callback, target, true);
    }

    off(event: string, callback: (...args: any[]) => void, target: any): void {
        const list = this._eventMap[event];
        if (list && target) {
            const index = list.findIndex((item) => item.callback === callback && item.target === target);
            if (index >= 0) {
                list.splice(index, 1);
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
        for (const event in this._eventMap) {
            const list = this._eventMap[event];
            if (list) {
                this._eventMap[event] = list.filter((item) => item.target !== target);
            }
        }
        if (target && Array.isArray(target.__eventTargets)) {
            target.__eventTargets = target.__eventTargets.filter((item: any) => item !== this);
        }
    }

    emit(event: string, ...args: any[]): void {
        const list = this._eventMap[event];
        if (list) {
            const copy = list.slice();
            copy.forEach((item) => {
                if (typeof item.callback === "function") {
                    item.callback.apply(item.target, args);
                    if (item.once) {
                        this.off(event, item.callback, item.target);
                    }
                }
            });
        }
    }

    has(event: string, callback: (...args: any[]) => void, target: any): boolean {
        const list = this._eventMap[event];
        return !!list && list.some((item) => item.callback === callback && item.target === target);
    }

    clear(): void {
        for (const event in this._eventMap) {
            const list = this._eventMap[event];
            if (list) {
                for (let i = list.length - 1; i >= 0; i--) {
                    const item = list[i];
                    this.off(event, item.callback, item.target);
                }
            }
        }
    }
}
