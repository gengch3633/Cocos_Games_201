export class SpineAttacheUtil {
    static defaultBoneName = "kuang";

    static addPolygonNodeToSkeleton(
        group: string,
        skeleton: sp.Skeleton,
        boneName = SpineAttacheUtil.defaultBoneName,
        slotName: string,
        templateNode?: cc.Node
    ): cc.PolygonCollider {
        if (!(group && skeleton && boneName && slotName)) {
            return null;
        }
        const attachUtil = skeleton.attachUtil;
        if (!attachUtil) {
            return null;
        }
        const attachedNodes = attachUtil.generateAttachedNodes(boneName);
        if (!attachedNodes || attachedNodes.length == 0) {
            return null;
        }
        const parentNode = attachedNodes[0];
        const slot = skeleton.findSlot(slotName);
        if (!slot) {
            return null;
        }
        const vertices = (slot.attachment as any).vertices;
        const collider = this.generatePolygonCollider(vertices, templateNode);
        if (!collider) {
            return null;
        }
        parentNode.addChild(collider.node);
        collider.node.x = collider.node.y = 0;
        collider.node.group = group;
        collider.node.name = boneName;
        return collider;
    }

    static destroyAttachedNodes(skeleton: sp.Skeleton, boneName: string): void {
        if (!skeleton || !boneName) {
            return null;
        }
        const attachUtil = skeleton.attachUtil;
        attachUtil && attachUtil.destroyAttachedNodes(boneName);
    }

    static addAllPolygonNodeToSkeleton(
        group: string,
        skeleton: sp.Skeleton,
        boneName = SpineAttacheUtil.defaultBoneName,
        templateNode?: cc.Node
    ): cc.PolygonCollider[] {
        if (!group || !skeleton || !boneName) {
            return null;
        }
        const attachUtil = skeleton.attachUtil;
        if (!attachUtil) {
            return null;
        }
        const attachedNodes = attachUtil.generateAttachedNodes(boneName);
        if (!attachedNodes || attachedNodes.length == 0) {
            return null;
        }
        const parentNode = attachedNodes[0];
        const slotNames = this.getAllSlotNameByBoneName(skeleton, boneName);
        const colliders: cc.PolygonCollider[] = [];
        for (let index = 0; index < slotNames.length; index++) {
            const slot = skeleton.findSlot(slotNames[index]);
            if (slot) {
                const attachment = slot.attachment;
                if (attachment) {
                    const vertices = (attachment as any).vertices;
                    if (vertices) {
                        const collider = this.generatePolygonCollider(vertices, templateNode);
                        if (collider) {
                            parentNode.addChild(collider.node);
                            collider.node.x = collider.node.y = 0;
                            collider.node.group = group;
                            collider.node.name = boneName;
                            colliders.push(collider);
                        }
                    }
                }
            }
        }
        return colliders;
    }

    static generateAllByBonePrefix(
        group: string,
        skeleton: sp.Skeleton,
        templateNode?: cc.Node,
        bonePrefix = "kuang"
    ): cc.PolygonCollider[] {
        if (!group || !skeleton) {
            return null;
        }
        if (!skeleton.attachUtil) {
            return null;
        }
        let colliders: cc.PolygonCollider[] = [];
        const boneNames = this.getAllBoneNameByDefaultMode(skeleton, bonePrefix);
        for (let index = 0; index < boneNames.length; index++) {
            const boneName = boneNames[index];
            const boneColliders = this.addAllPolygonNodeToSkeleton(group, skeleton, boneName, templateNode);
            colliders = colliders.concat(boneColliders);
        }
        return colliders;
    }

    static destroyAllAttachedNodes(skeleton: sp.Skeleton): void {
        if (!skeleton) {
            return null;
        }
        const attachUtil = skeleton.attachUtil;
        attachUtil && attachUtil.destroyAllAttachedNodes();
    }

    static getAttachedNodes(skeleton: sp.Skeleton, boneName: string): cc.Node[] {
        if (!skeleton || !boneName) {
            return null;
        }
        const attachUtil = skeleton.attachUtil;
        return attachUtil ? attachUtil.getAttachedNodes(boneName) : null;
    }

    static getAllBoneNameByDefaultMode(skeleton: sp.Skeleton, bonePrefix = "kuang"): string[] {
        if (!skeleton) {
            return null;
        }
        if (!skeleton.skeletonData) {
            return null;
        }
        const bones = skeleton.skeletonData.skeletonJson.bones;
        const boneNames: string[] = [];
        for (let index = 0; index < bones.length; index++) {
            const bone = bones[index];
            -1 != bone.name.indexOf(bonePrefix) && boneNames.push(bone.name);
        }
        return boneNames;
    }

    static generateAllByDefaultMode(
        group: string,
        skeleton: sp.Skeleton,
        templateNode?: cc.Node
    ): cc.PolygonCollider[] {
        if (!group || !skeleton) {
            return null;
        }
        if (!skeleton.attachUtil) {
            return null;
        }
        let colliders: cc.PolygonCollider[] = [];
        const boneNames = this.getAllBoneNameByDefaultMode(skeleton);
        for (let index = 0; index < boneNames.length; index++) {
            const boneName = boneNames[index];
            const boneColliders = this.addAllPolygonNodeToSkeleton(group, skeleton, boneName, templateNode);
            colliders = colliders.concat(boneColliders);
        }
        return colliders;
    }

    static getNodeFromBone(skeleton: sp.Skeleton, boneName = SpineAttacheUtil.defaultBoneName): cc.Node {
        if (!skeleton || !boneName) {
            return null;
        }
        const attachUtil = skeleton.attachUtil;
        if (!attachUtil) {
            return null;
        }
        const attachedNodes = attachUtil.generateAttachedNodes(boneName);
        return attachedNodes && attachedNodes.length != 0 ? attachedNodes[0] : null;
    }

    static getAllSlotNameByBoneName(skeleton: sp.Skeleton, boneName = SpineAttacheUtil.defaultBoneName): string[] {
        if (!skeleton || !boneName) {
            return null;
        }
        if (!skeleton.skeletonData) {
            return null;
        }
        const slots = skeleton.skeletonData.skeletonJson.slots;
        const slotNames: string[] = [];
        for (let index = 0; index < slots.length; index++) {
            const slot = slots[index];
            slot.bone == boneName && slotNames.push(slot.name);
        }
        return slotNames;
    }

    static addNodeToBone(node: cc.Node, skeleton: sp.Skeleton, boneName = SpineAttacheUtil.defaultBoneName): cc.Node {
        if (!node || !skeleton || !boneName) {
            return null;
        }
        const attachUtil = skeleton.attachUtil;
        if (!attachUtil) {
            return null;
        }
        const attachedNodes = attachUtil.generateAttachedNodes(boneName);
        if (!attachedNodes || attachedNodes.length == 0) {
            return null;
        }
        attachedNodes[0].addChild(node);
        return node;
    }

    static generatePolygonCollider(vertices: number[], templateNode?: cc.Node): cc.PolygonCollider {
        if (!vertices || vertices.length <= 0) {
            return null;
        }
        let node = templateNode;
        node = node ? cc.instantiate(templateNode) : new cc.Node();
        node.active = true;
        const collider = node.addComponent(cc.PolygonCollider);
        collider.points = [];
        for (let index = 0; index < vertices.length; index++) {
            collider.points.push(cc.v2(vertices[index], vertices[index + 1]));
            index++;
        }
        return collider;
    }
}
