export default class Random {
    static _defaultRandom: Random | null = null;

    seed: number;

    constructor(seed?: number) {
        this.seed = seed || Date.now();
    }

    static get defaultRandom(): Random {
        if (!Random._defaultRandom) {
            Random._defaultRandom = new Random();
        }
        return Random._defaultRandom;
    }

    static get insideUnitCircle(): cc.Vec2 {
        return Random.defaultRandom.insideUnitCircle;
    }

    static get onUnitCircle(): cc.Vec2 {
        return Random.defaultRandom.onUnitCircle;
    }

    static get value(): number {
        return Random.defaultRandom.value;
    }

    static range(min: number, max: number): number {
        return Random.defaultRandom.range(min, max);
    }

    static floatRange(min: number, max: number): number {
        return Random.defaultRandom.floatRange(min, max);
    }

    static rangeArray<T>(source: T[], count: number = 1, allowDuplicate: boolean = true): T[] {
        return Random.defaultRandom.rangeArray(source, count, allowDuplicate);
    }

    static isHit(rate: number): boolean {
        return Random.defaultRandom.isHit(rate);
    }

    static weightIndex(weights: number[]): number {
        return Random.defaultRandom.weightIndex(weights);
    }

    static weightObject<T extends { [key: string]: any }>(items: T[], weightKey: string): T {
        return Random.defaultRandom.weightObject(items, weightKey);
    }

    rangeArray<T>(source: T[], count: number = 1, allowDuplicate: boolean = true): T[] {
        const result: T[] = [];
        if (!source || source.length <= 0 || count <= 0) {
            return result;
        }
        const pool = source.concat();
        while (true) {
            const index = this.range(0, pool.length - 1);
            result.push(pool[index]);
            if (!allowDuplicate) {
                pool.splice(index, 1);
            }
            if (result.length >= count || pool.length <= 0) {
                break;
            }
        }
        return result;
    }

    weightIndex(weights: number[]): number {
        let total = 0;
        weights.forEach((weight) => {
            total += weight;
        });
        let accumulated = 0;
        const pick = Random.range(1, total);
        for (let i = 0; i < weights.length; i++) {
            if (pick > accumulated && pick <= accumulated + weights[i]) {
                return i;
            }
            accumulated += weights[i];
        }
        return -1;
    }

    weightObject<T extends { [key: string]: any }>(items: T[], weightKey: string): T {
        const weights: number[] = [];
        items.forEach((item) => {
            const weight = item[weightKey];
            if (typeof weight === "number") {
                weights.push(weight);
            } else {
                console.warn("Random.weightObject: " + String(weightKey) + " is not a number");
            }
        });
        return items[this.weightIndex(weights)];
    }

    isHit(rate: number): boolean {
        return this.range(1, 100) <= rate;
    }

    floatRange(min: number, max: number): number {
        const upper = Math.max(max, min);
        const lower = Math.min(max, min);
        this.seed = (9301 * this.seed + 49297) % 233280;
        return lower + (this.seed / 233280) * (upper - lower);
    }

    range(min: number, max: number): number {
        return Math.round(this.floatRange(min, max));
    }

    get insideUnitCircle(): cc.Vec2 {
        const angle = this.floatRange(0, 360);
        const radius = this.floatRange(0, 1);
        return cc.v2(radius * Math.cos(angle * Math.PI / 180), radius * Math.sin(angle * Math.PI / 180));
    }

    get onUnitCircle(): cc.Vec2 {
        const angle = this.floatRange(0, 360);
        return cc.v2(Math.cos(angle * Math.PI / 180), Math.sin(angle * Math.PI / 180));
    }

    get value(): number {
        return this.floatRange(0, 1);
    }
}
