export function CLICKLOCK(delay: number = 0.5) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        let locked = false;
        descriptor.value = function (...args: any[]) {
            if (locked) {
                console.log("跳过了", this.name, propertyKey);
            } else {
                locked = true;
                setTimeout(() => {
                    locked = false;
                }, 1000 * delay);
                original.apply(this, args);
            }
        };
        return descriptor;
    };
}
