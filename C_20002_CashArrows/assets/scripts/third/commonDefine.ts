export function ObserverObj(this: any, e: any) {
    e && (this.value = e);
}

export function KeyValuePair(this: any, e: any, t: any) {
    this.Key = e;
    this.Value = t;
}
