declare const i18n: any;
declare const wx: any;
declare const tt: any;
declare function require(path: string): any;

declare namespace jsb {
    const reflection: {
        callStaticMethod(className: string, methodName: string, signature: string, ...args: any[]): any;
    };
}

interface Window {
    i18n?: any;
    callAndroid?: any;
    calliOS?: any;
    regeneratorRuntime?: any;
}

declare namespace cc {
    let __$_WebView_onEnable_$__: any;
    interface WebView {
        __splashEventListened?: boolean;
        __scaleX?: number;
        __scaleY?: number;
    }
    namespace Vec2 {
        function mag(v: cc.Vec2): number;
    }
    interface Node {
        setScaleY(y: number): void;
        pageView?: any;
        _touchListener?: any;
    }
    interface Game {
        _renderContext?: any;
    }
    interface Touch {
        _point?: cc.Vec2;
    }
}
