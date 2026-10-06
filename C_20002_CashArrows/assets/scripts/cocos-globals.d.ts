declare function __awaiter(thisArg: any, _arguments: any, P: any, generator: (...args: any[]) => any): any;
declare function __generator(thisArg: any, body: (...args: any[]) => any): any;
declare function __assign(target: any, ...sources: any[]): any;
declare function __spreadArrays(...arrays: any[]): any[];

declare namespace sp {
    var timeScale: number;
    class Skeleton extends cc.Component {
        setAnimation(trackIndex: number, name: string, loop: boolean): void;
        setCompleteListener(callback: () => void): void;
        node: cc.Node;
    }
}

declare namespace jsb {
    const fileUtils: {
        getStringFromFile(path: string): string;
        [key: string]: any;
    };
    const AssetsManager: any;
}

interface Window {
    calliOS?: {
        showSplashAd?(options: any): void;
        showRewardVideoAd?(options: any): void;
        [key: string]: any;
    };
    GameGlobal?: any;
    [key: string]: any;
}

declare function require(id: string): any;

declare namespace cc {
    var _RF: { push: (...args: any[]) => void; pop: () => void };
    var gfx: any;

    interface Component {
        [key: string]: any;
    }

    interface Node {
        [key: string]: any;
    }

    interface Label {
        [key: string]: any;
    }

    interface Sprite {
        [key: string]: any;
    }

    interface EventTarget {
        on(type: string, callback: (...args: any[]) => void, target?: any, useCapture?: boolean): void;
        once(type: string, callback: (...args: any[]) => void, target?: any): void;
        off(type: string, callback?: (...args: any[]) => void, target?: any): void;
    }

    interface EventHandler {
        _dispatcher?: any;
        _type?: any;
        [key: string]: any;
    }

    interface EventKeyboard {
        preventDefault?(): void;
    }

    interface Director {
        timeScale?: number;
        calculateDeltaTime?(now?: number): number;
    }

    class Button {
        static EventType: any;
    }

    class Sprite {
        static EventType: any;
    }

    namespace assetManager {
        interface AssetManager {
            _bundles?: any;
            bundles?: any;
        }
    }
}

declare interface IPropertyOptions {
    type?: any;
    default?: any;
    tooltip?: string;
    visible?: boolean | (() => boolean);
    displayName?: string;
    multiline?: boolean;
    readonly?: boolean;
    [key: string]: any;
}

declare module cc {
    namespace _decorator {
        function property(options?: IPropertyOptions | any): any;
    }
}

declare class Agent {
    id: any;
    [key: string]: any;
}

declare class Obstacle {
    point: any;
    previous: any;
    next: any;
    convex: any;
    direction: any;
    id: any;
    [key: string]: any;
}

declare class ClientDataStore {
    referrer_url?: any;
    referrer_timestamp_server?: any;
    install_timestamp_server?: any;
    [key: string]: any;
}
