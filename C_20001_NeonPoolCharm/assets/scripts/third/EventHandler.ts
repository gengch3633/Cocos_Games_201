import Handler from "./Handler";

export default class EventHandler extends Handler {
    private _dispatcher: unknown = null;
    private _type: string = null;
    private static _pool: EventHandler[] = [];

    constructor(caller?: unknown, method?: Function, args?: unknown[], once?: boolean) {
        super(caller, method, args, once);
    }

    static create(
        caller?: unknown,
        method?: Function,
        args?: unknown[],
        once: boolean = true
    ): EventHandler {
        if (EventHandler._pool.length) {
            return EventHandler._pool.pop().setTo(caller, method, args, once) as EventHandler;
        }
        return new EventHandler(caller, method, args, once);
    }

    recover(): void {
        if (this._id > 0) {
            this._id = 0;
            EventHandler._pool.push(this.clear() as EventHandler);
        }
    }

    register(dispatcher: unknown, type: string): void {
        this._dispatcher = dispatcher;
        this._type = type;
    }

    check(dispatcher: unknown, type: string): boolean {
        return !(
            (this._dispatcher && this._dispatcher != dispatcher) ||
            (this._type && this._type != type)
        );
    }
}
