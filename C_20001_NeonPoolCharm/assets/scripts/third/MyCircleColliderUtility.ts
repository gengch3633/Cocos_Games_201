interface CircleCollider {
    r: number;
    position: cc.Vec2;
}

export default class MyCircleColliderUtility {
    static collide(
        circleA: CircleCollider,
        circleB: CircleCollider,
        direction: cc.Vec2,
        graphics?: cc.Graphics
    ): cc.Vec2 {
        direction.normalizeSelf();
        const posA = circleA.position;
        const posB = circleB.position;
        const sumRadius = circleA.r + circleB.r;
        const delta = posB.clone().subSelf(posA);
        if (direction.angle(delta) >= Math.PI / 2) {
            return null;
        }
        const extended = direction.clone().mulSelf(delta.len() + 100);
        const projection = delta.project(extended);
        const hitPoint = posA.clone().addSelf(projection);
        if (graphics) {
            graphics.strokeColor = cc.Color.CYAN;
            graphics.moveTo(posA.x, posA.y);
            graphics.lineTo(hitPoint.x, hitPoint.y);
            graphics.stroke();
        }
        const offset = projection.clone().subSelf(delta);
        const dist = offset.len();
        if (dist < sumRadius) {
            if (graphics) {
                const lineEnd = offset.clone().addSelf(posB);
                graphics.strokeColor = cc.Color.CYAN;
                graphics.moveTo(posB.x, posB.y);
                graphics.lineTo(lineEnd.x, lineEnd.y);
                graphics.stroke();
            }
            const chordHalf = Math.sin(Math.acos(dist / sumRadius)) * sumRadius;
            const approach = projection.len() - chordHalf;
            const result = projection.normalizeSelf().mulSelf(approach).clone().addSelf(posA);
            if (graphics) {
                graphics.strokeColor = cc.Color.RED;
                graphics.moveTo(posA.x, posA.y);
                graphics.lineTo(result.x, result.y);
                graphics.circle(result.x, result.y, circleA.r);
                graphics.stroke();
            }
            return result;
        }
        return null;
    }

    static collideWhitLine(
        circle: CircleCollider,
        lineStart: cc.Vec2,
        lineEnd: cc.Vec2,
        direction: cc.Vec2,
        graphics?: cc.Graphics
    ): cc.Vec2 {
        direction = direction.normalize();
        lineStart = lineStart.clone();
        lineEnd = lineEnd.clone();
        const center = circle.position;
        const segment = lineEnd.clone().subSelf(lineStart);
        const angle = cc.v2(segment).signAngle(direction);
        if (angle <= 0 || angle >= Math.PI) {
            return null;
        }
        const farPoint = center.add(direction.mul(2e5));
        const segmentLen = segment.len();
        const toStart = center.clone().subSelf(lineStart);
        if (graphics) {
            const point = toStart.clone().addSelf(lineStart);
            this.drawLine(lineStart, point, graphics, cc.Color.WHITE);
        }
        const projOnSegment = toStart.project(segment);
        const reject = projOnSegment.clone().subSelf(toStart);
        const farProj = farPoint.clone().subSelf(lineStart);
        const farOnSegment = farProj.project(segment);
        const farReject = farOnSegment.clone().subSelf(farProj);
        if (farOnSegment.angle(farReject) < 1 && farReject.len() > reject.len()) {
            return null;
        }
        if (graphics) {
            const point = projOnSegment.clone().addSelf(lineStart);
            this.drawLine(lineStart, point, graphics, cc.Color.WHITE);
        }
        if (graphics) {
            const point = reject.clone().addSelf(center);
            this.drawLine(center, point, graphics, cc.Color.WHITE);
        }
        const rejectLen = reject.len();
        const sinAngle = Math.sin(direction.angle(segment));
        let dist = rejectLen / sinAngle;
        dist -= circle.r / sinAngle;
        const hitPoint = direction.clone().mulSelf(dist).clone().add(center);
        const onSegment = hitPoint.clone().sub(lineStart).project(segment).clone().add(lineStart);
        const distFromStart = onSegment.sub(lineStart).len();
        const distFromEnd = onSegment.sub(lineEnd).len();
        if ((distFromStart > circle.r && distFromStart >= segmentLen) ||
            (distFromEnd > circle.r && distFromEnd >= segmentLen)) {
            return null;
        }
        if (graphics) {
            this.drawLine(lineStart, onSegment, graphics, cc.Color.BLUE);
        }
        if (hitPoint.sub(center).angle(direction) > Math.PI / 2) {
            return null;
        }
        if (graphics) {
            this.drawLine(center, hitPoint, graphics, cc.Color.RED);
            this.drawCircle(hitPoint, circle.r, graphics, cc.Color.RED);
        }
        return hitPoint;
    }

    static collideCheck(circleA: CircleCollider, circleB: CircleCollider, direction: cc.Vec2): boolean {
        const posA = circleA.position;
        const delta = circleB.position.clone().subSelf(posA);
        return delta.angle(direction) < Math.asin((circleA.r + circleB.r) / delta.len());
    }

    static drawCircle(center: cc.Vec2, radius: number, graphics: cc.Graphics, color: cc.Color): void {
        graphics.strokeColor = color;
        graphics.circle(center.x, center.y, radius);
        graphics.stroke();
    }

    static collidePoint(
        circle: CircleCollider,
        point: cc.Vec2,
        direction: cc.Vec2,
        graphics?: cc.Graphics
    ): cc.Vec2 {
        const pointCircle: CircleCollider = { r: 0, position: point };
        return this.collide(circle, pointCircle, direction, graphics);
    }

    static drawLine(from: cc.Vec2, to: cc.Vec2, graphics: cc.Graphics, color: cc.Color): void {
        graphics.strokeColor = color;
        graphics.moveTo(from.x, from.y);
        graphics.lineTo(to.x, to.y);
        graphics.stroke();
    }
}
