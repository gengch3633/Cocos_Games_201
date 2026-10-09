export function CLICKLOCK(lockTime: number = 0.5) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        let locked = false;
        descriptor.value = function () {
            const args = [];
            for (let i = 0; i < arguments.length; i++) {
                args[i] = arguments[i];
            }
            if (locked) {
                console.log("跳过了", this.name, propertyKey);
            } else {
                locked = true;
                setTimeout(function () {
                    locked = false;
                }, 1000 * lockTime);
                original.apply(this, args);
            }
        };
        return descriptor;
    };
}
