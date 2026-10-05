export default class SpineAttacheUtil {
    static defaultBoneName = "kuang";

    static addPolygonNodeToSkeleton(
        group: string,
        skeleton: sp.Skeleton,
        boneName = SpineAttacheUtil.defaultBoneName,
        slotName: string,
        template?: cc.Node
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
        const vertices = slot.attachment.vertices;
        const collider = this.generatePolygonCollider(vertices, template);
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
        if (attachUtil) {
            attachUtil.destroyAttachedNodes(boneName);
        }
    }

    static addAllPolygonNodeToSkeleton(
        group: string,
        skeleton: sp.Skeleton,
        boneName = SpineAttacheUtil.defaultBoneName,
        template?: cc.Node
    ): cc.PolygonCollider[] {
        if (!(group && skeleton && boneName)) {
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
        for (let i = 0; i < slotNames.length; i++) {
            const slot = skeleton.findSlot(slotNames[i]);
            if (slot) {
                const attachment = slot.attachment;
                if (attachment) {
                    const vertices = attachment.vertices;
                    if (vertices) {
                        const collider = this.generatePolygonCollider(vertices, template);
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
        template?: cc.Node,
        prefix = "kuang"
    ): cc.PolygonCollider[] {
        if (!(group && skeleton)) {
            return null;
        }
        if (!skeleton.attachUtil) {
            return null;
        }
        let colliders: cc.PolygonCollider[] = [];
        const boneNames = this.getAllBoneNameByDefaultMode(skeleton, prefix);
        for (let i = 0; i < boneNames.length; i++) {
            const boneColliders = this.addAllPolygonNodeToSkeleton(group, skeleton, boneNames[i], template);
            colliders = colliders.concat(boneColliders);
        }
        return colliders;
    }

    static destroyAllAttachedNodes(skeleton: sp.Skeleton): void {
        if (!skeleton) {
            return null;
        }
        const attachUtil = skeleton.attachUtil;
        if (attachUtil) {
            attachUtil.destroyAllAttachedNodes();
        }
    }

    static getAttachedNodes(skeleton: sp.Skeleton, boneName: string): cc.Node[] {
        if (!skeleton || !boneName) {
            return null;
        }
        const attachUtil = skeleton.attachUtil;
        return attachUtil ? attachUtil.getAttachedNodes(boneName) : null;
    }

    static getAllBoneNameByDefaultMode(skeleton: sp.Skeleton, prefix = "kuang"): string[] {
        if (!skeleton) {
            return null;
        }
        if (!skeleton.skeletonData) {
            return null;
        }
        const bones = skeleton.skeletonData.skeletonJson.bones;
        const names: string[] = [];
        for (let i = 0; i < bones.length; i++) {
            const bone = bones[i];
            if (bone.name.indexOf(prefix) != -1) {
                names.push(bone.name);
            }
        }
        return names;
    }

    static generateAllByDefaultMode(
        group: string,
        skeleton: sp.Skeleton,
        template?: cc.Node
    ): cc.PolygonCollider[] {
        if (!(group && skeleton)) {
            return null;
        }
        if (!skeleton.attachUtil) {
            return null;
        }
        let colliders: cc.PolygonCollider[] = [];
        const boneNames = this.getAllBoneNameByDefaultMode(skeleton);
        for (let i = 0; i < boneNames.length; i++) {
            const boneColliders = this.addAllPolygonNodeToSkeleton(group, skeleton, boneNames[i], template);
            colliders = colliders.concat(boneColliders);
        }
        return colliders;
    }

    static getNodeFromBone(skeleton: sp.Skeleton, boneName = SpineAttacheUtil.defaultBoneName): cc.Node {
        if (!(skeleton && boneName)) {
            return null;
        }
        const attachUtil = skeleton.attachUtil;
        if (!attachUtil) {
            return null;
        }
        const nodes = attachUtil.generateAttachedNodes(boneName);
        return nodes && nodes.length != 0 ? nodes[0] : null;
    }

    static getAllSlotNameByBoneName(skeleton: sp.Skeleton, boneName = SpineAttacheUtil.defaultBoneName): string[] {
        if (!(skeleton && boneName)) {
            return null;
        }
        if (!skeleton.skeletonData) {
            return null;
        }
        const slots = skeleton.skeletonData.skeletonJson.slots;
        const names: string[] = [];
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            if (slot.bone == boneName) {
                names.push(slot.name);
            }
        }
        return names;
    }

    static addNodeToBone(node: cc.Node, skeleton: sp.Skeleton, boneName = SpineAttacheUtil.defaultBoneName): cc.Node {
        if (!(node && skeleton && boneName)) {
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

    static generatePolygonCollider(vertices: number[], template?: cc.Node): cc.PolygonCollider {
        if (!vertices || vertices.length <= 0) {
            return null;
        }
        const node = template ? cc.instantiate(template) : new cc.Node();
        node.active = true;
        const collider = node.addComponent(cc.PolygonCollider);
        collider.points = [];
        for (let i = 0; i < vertices.length; i++) {
            collider.points.push(cc.v2(vertices[i], vertices[i + 1]));
            i++;
        }
        return collider;
    }
}
