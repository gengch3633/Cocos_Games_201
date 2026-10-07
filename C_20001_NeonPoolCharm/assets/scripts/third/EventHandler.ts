import Handler from "./Handler";
import EventDispatcher from "./EventDispatcher";

export default class EventHandler extends Handler {
    static _pool: EventHandler[] = [];

    _dispatcher: EventDispatcher = null;
    _type: string = null;

    constructor(caller?: any, method?: Function, args?: any, once?: boolean) {
        super(caller, method, args, once);
    }

    static create(caller: any, method: Function, args: any = null, once: boolean = true): EventHandler {
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

    register(dispatcher: EventDispatcher, type: string): void {
        this._dispatcher = dispatcher;
        this._type = type;
    }

    check(dispatcher: EventDispatcher, type: string): boolean {
        return !(
            (this._dispatcher && this._dispatcher != dispatcher) ||
            (this._type && this._type != type)
        );
    }
}
