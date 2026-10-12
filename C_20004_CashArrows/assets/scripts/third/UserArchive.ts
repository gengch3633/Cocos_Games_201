import ArchiveMgr from "./ArchiveMgr";
import Common from "./Common";
import Watch from "./Watch";

const NON_SERIALIZED_KEYS = "_$nonSerializedKeys";

export function nonSerialized(): PropertyDecorator {
	return function (target: any, propertyKey: string | symbol): void {
		let keys: (string | symbol)[] = target[NON_SERIALIZED_KEYS];
		if (!keys) {
			keys = [];
			target[NON_SERIALIZED_KEYS] = keys;
		}
		keys.push(propertyKey);
	};
}

export default class UserArchive {
	public static _ins: Watch = null;

	@nonSerialized()
	public _$key: string;

	@nonSerialized()
	public _$serverIndex: number = -1;

	@nonSerialized()
	public _$watch: Watch = null;

	@Watch.ignoreWatch()
	public _$version: number = 0;

	@nonSerialized()
	@Watch.ignoreWatch()
	public _id: string = "";

	public static getInstance(): Watch {
		if (!this._ins) {
			const ins = new this();
			ins.create();
			this._ins = ins._$watch;
		}
		return this._ins;
	}

	public constructor(key: string = "", serverIndex: number = 0) {
		this._$key = Common.version + "_" + key;
		if (serverIndex <= 0) {
			let sum = 0;
			key.split("").forEach((ch) => {
				sum += ch.charCodeAt(0);
			});
			serverIndex = 6 + sum % 20;
		}
		this._$serverIndex = serverIndex;
	}

	public create(): void {
		this._id = "UserArchive_" + this._$key + "_" + Date.now();
		let isNew = true;
		const archive: any = ArchiveMgr.getInstance().get(this._$key, this._$serverIndex);
		if (archive && archive._$version) {
			Object.assign(this, archive);
			isNew = false;
		}
		this.init(isNew);
		this._$watch = Watch.create(this);
		ArchiveMgr.getInstance().register(this);
	}

	protected init(isNew: boolean): void {
	}

	public on(event: string, callback: (...args: any[]) => void, ...args: any[]): void {
		this._$watch.on(event, callback, ...args);
	}

	public once(event: string, callback: (...args: any[]) => void, ...args: any[]): void {
		this._$watch.once(event, callback, ...args);
	}

	public off(event: string, callback: (...args: any[]) => void, ...args: any[]): void {
		this._$watch.off(event, callback, ...args);
	}

	public targetOff(target: any): void {
		this._$watch.targetOff(target);
	}

	public clearAllEvent(): void {
		this._$watch.clearAllEvent();
	}

	public toJSON(): any {
		const json: any = {};
		const keys: (string | symbol)[] = (this as any)[NON_SERIALIZED_KEYS];
		for (const prop in this) {
			if (Object.prototype.hasOwnProperty.call(this, prop)) {
				if (keys && keys.indexOf(prop) !== -1) {
					continue;
				}
				json[prop] = (this as any)[prop];
			}
		}
		return json;
	}
}