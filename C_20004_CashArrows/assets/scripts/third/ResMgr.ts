import ResKeeper from "./ResKeeper";
import ResLoader from "./ResLoader";
import Singleton from "./Singleton";

export default class ResMgr extends Singleton {
    private resLoader: ResLoader = ResLoader.getInstance();

    public get remoteUrl(): string {
        return this.resLoader.remoteUrl;
    }

    public set remoteUrl(url: string) {
        this.resLoader.remoteUrl = url;
    }

    public getBundle(name: string): any {
        return this.resLoader.getBundle(name);
    }

    public loadRes(url: string, type: any, keeper?: cc.Node | cc.Component | null, progress?: any, complete?: any): any {
        if (keeper === undefined) {
            keeper = null;
        }
        const target: any = keeper ? this.getKeeper(keeper) : this.resLoader;
        return target == null ? undefined : target.loadRes(url, type, progress, complete);
    }

    public setSpriteFrame(target: cc.Node | cc.Component, url: string, complete?: any, keeper?: cc.Node | cc.Component | null): any {
        if (keeper === undefined) {
            keeper = null;
        }
        const k: any = keeper ? this.getKeeper(keeper) : this.getKeeper(target, true);
        return k == null ? undefined : k.setSpriteFrame(target, url, complete);
    }

    public async setSkeleton(target: cc.Node | cc.Component, url: string, animationName?: string, loop?: boolean, keeper?: cc.Node | cc.Component | null): Promise<any> {
        if (keeper === undefined) {
            keeper = null;
        }
        const k: any = keeper ? this.getKeeper(keeper) : this.getKeeper(target, true);
        return k == null ? undefined : k.setSkeleton(target, url, animationName, loop);
    }

    public instantiate(prefab: cc.Prefab, parent?: cc.Node): cc.Node | null {
        const node = cc.instantiate(prefab);
        if (!node) {
            return null;
        }
        if (parent && parent.isValid && node.parent !== parent) {
            node.parent = parent;
        }
        return node;
    }

    public async instantiateByUrl(url: string, parent?: cc.Node, progress?: any, complete?: any): Promise<cc.Node | null> {
        const prefab: cc.Prefab = await this.resLoader.loadRes(url, cc.Prefab, progress, complete);
        return prefab ? this.instantiate(prefab, parent) : null;
    }

    public getKeeper(target: cc.Node | cc.Component | null, recursive: boolean = false): ResKeeper | null {
        if (!target || !target.isValid) {
            return null;
        }
        const keeper: ResKeeper = target.getComponent(ResKeeper);
        if (keeper) {
            return keeper;
        }
        if (recursive) {
            return target.addComponent(ResKeeper);
        }
        const node: cc.Node = target instanceof cc.Node ? target : target.node;
        return this.getKeeper(node.parent, recursive);
    }
}