export default class Random {
    public seed: number;

    private static _defaultRandom: Random | null = null;

    public static get defaultRandom(): Random {
        let instance = Random._defaultRandom;
        if (!instance) {
            instance = new Random();
            Random._defaultRandom = instance;
        }
        return instance;
    }

    public static get insideUnitCircle(): cc.Vec2 {
        return Random.defaultRandom.insideUnitCircle;
    }

    public static get onUnitCircle(): cc.Vec2 {
        return Random.defaultRandom.onUnitCircle;
    }

    public static get value(): number {
        return Random.defaultRandom.value;
    }

    public static range(min: number, max: number): number {
        return Random.defaultRandom.range(min, max);
    }

    public static floatRange(min: number, max: number): number {
        return Random.defaultRandom.floatRange(min, max);
    }

    public static rangeArray<T>(arr: T[], count: number = 1, allowRepeat: boolean = true): T[] {
        return Random.defaultRandom.rangeArray(arr, count, allowRepeat);
    }

    public static isHit(probability: number): boolean {
        return Random.defaultRandom.isHit(probability);
    }

    public static weightIndex(weights: number[]): number {
        return Random.defaultRandom.weightIndex(weights);
    }

    public static weightObject<T>(list: T[], key: string): T | undefined {
        return Random.defaultRandom.weightObject(list, key);
    }

    public constructor(seed?: number) {
        this.seed = seed || Date.now();
    }

    public rangeArray<T>(arr: T[], count: number = 1, allowRepeat: boolean = true): T[] {
        const result: T[] = [];
        if (!arr || arr.length <= 0 || count <= 0) {
            return result;
        }
        const pool = arr.concat();
        while (true) {
            const index = this.range(0, pool.length - 1);
            result.push(pool[index]);
            if (!allowRepeat) {
                pool.splice(index, 1);
            }
            if (result.length >= count || pool.length <= 0) {
                break;
            }
        }
        return result;
    }

    public weightIndex(weights: number[]): number {
        let total = 0;
        weights.forEach((weight) => {
            total += weight;
        });
        let accumulated = 0;
        const target = Random.range(1, total);
        for (let i = 0; i < weights.length; i++) {
            if (target > accumulated && target <= accumulated + weights[i]) {
                return i;
            }
            accumulated += weights[i];
        }
        return -1;
    }

    public weightObject<T>(list: T[], key: string): T | undefined {
        const weights: number[] = [];
        list.forEach((item) => {
            const weight = (item as any)[key];
            if (typeof weight === "number") {
                weights.push(weight);
            } else {
                console.warn("Random.weightObject: " + String(key) + " is not a number");
            }
        });
        return list[this.weightIndex(weights)];
    }

    public isHit(probability: number): boolean {
        return this.range(1, 100) <= probability;
    }

    public floatRange(min: number, max: number): number {
        const high = Math.max(max, min);
        const low = Math.min(max, min);
        this.seed = (9301 * this.seed + 49297) % 233280;
        return low + (this.seed / 233280) * (high - low);
    }

    public range(min: number, max: number): number {
        return Math.round(this.floatRange(min, max));
    }

    public get insideUnitCircle(): cc.Vec2 {
        const angle = this.floatRange(0, 360);
        const radius = this.floatRange(0, 1);
        return cc.v2(radius * Math.cos((angle * Math.PI) / 180), radius * Math.sin((angle * Math.PI) / 180));
    }

    public get onUnitCircle(): cc.Vec2 {
        const angle = this.floatRange(0, 360);
        return cc.v2(Math.cos((angle * Math.PI) / 180), Math.sin((angle * Math.PI) / 180));
    }

    public get value(): number {
        return this.floatRange(0, 1);
    }
}