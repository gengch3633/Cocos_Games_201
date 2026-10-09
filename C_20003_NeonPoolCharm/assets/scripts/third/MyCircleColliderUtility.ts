export default class MyCircleColliderUtility {
    static collide(circle, other, dir, graphics) {
        dir.normalizeSelf();
        const position = circle.position;
        const otherPos = other.position;
        const radiusSum = circle.r + other.r;
        const offset = otherPos.clone().subSelf(position);
        if (dir.angle(offset) >= Math.PI / 2) {
            return null;
        }
        const ray = dir.clone().mulSelf(offset.len() + 100);
        const projected = offset.project(ray);
        const hitPoint = position.clone().addSelf(projected);
        if (graphics) {
            graphics.strokeColor = cc.Color.CYAN;
            graphics.moveTo(position.x, position.y);
            graphics.lineTo(hitPoint.x, hitPoint.y);
            graphics.stroke();
        }
        const gap = projected.clone().subSelf(offset);
        const gapLen = gap.len();
        if (gapLen < radiusSum) {
            if (graphics) {
                const gapEnd = gap.clone().addSelf(otherPos);
                graphics.strokeColor = cc.Color.CYAN;
                graphics.moveTo(otherPos.x, otherPos.y);
                graphics.lineTo(gapEnd.x, gapEnd.y);
                graphics.stroke();
            }
            const halfChord = Math.sin(Math.acos(gapLen / radiusSum)) * radiusSum;
            const along = projected.len() - halfChord;
            const contact = projected.normalizeSelf().mulSelf(along).clone().addSelf(position);
            if (graphics) {
                graphics.strokeColor = cc.Color.RED;
                graphics.moveTo(position.x, position.y);
                graphics.lineTo(contact.x, contact.y);
                graphics.circle(contact.x, contact.y, circle.r);
                graphics.stroke();
            }
            return contact;
        }
        return null;
    }

    static collideWhitLine(circle, lineStart, lineEnd, dir, graphics) {
        dir = dir.normalize();
        lineStart = lineStart.clone();
        lineEnd = lineEnd.clone();
        const position = circle.position;
        const lineVec = lineEnd.clone().subSelf(lineStart);
        const sign = cc.v2(lineVec).signAngle(dir);
        if (sign <= 0 || sign >= Math.PI) {
            return null;
        }
        const farPoint = position.add(dir.mul(200000));
        const lineLen = lineVec.len();
        const fromStart = position.clone().subSelf(lineStart);
        if (graphics) {
            const fromStartEnd = fromStart.clone().addSelf(lineStart);
            this.drawLine(lineStart, fromStartEnd, graphics, cc.Color.WHITE);
        }
        const projected = fromStart.project(lineVec);
        const reject = projected.clone().subSelf(fromStart);
        const farFromStart = farPoint.clone().subSelf(lineStart);
        const farProjected = farFromStart.project(lineVec);
        const farReject = farProjected.clone().subSelf(farFromStart);
        farProjected.angle(farReject);
        if (farProjected.angle(farReject) < 1 && farReject.len() > reject.len()) {
            return null;
        }
        if (graphics) {
            const projectedPoint = projected.clone().addSelf(lineStart);
            this.drawLine(lineStart, projectedPoint, graphics, cc.Color.WHITE);
        }
        if (graphics) {
            const rejectPoint = reject.clone().addSelf(position);
            this.drawLine(position, rejectPoint, graphics, cc.Color.WHITE);
        }
        const rejectLen = reject.len();
        const dirAngle = dir.angle(lineVec);
        const dirSin = Math.sin(dirAngle);
        let along = rejectLen / dirSin;
        along -= circle.r / dirSin;
        const hit = dir.clone().mulSelf(along).clone().add(position);
        const onLine = hit.clone().sub(lineStart).project(lineVec).clone().add(lineStart);
        onLine.clone();
        const distStart = onLine.sub(lineStart).len();
        const distEnd = onLine.sub(lineEnd).len();
        if (distStart > circle.r && distStart >= lineLen || distEnd > circle.r && distEnd >= lineLen) {
            return null;
        }
        graphics && this.drawLine(lineStart, onLine, graphics, cc.Color.BLUE);
        if (hit.sub(position).angle(dir) > Math.PI / 2) {
            return null;
        }
        if (graphics) {
            this.drawLine(position, hit, graphics, cc.Color.RED);
            this.drawCircle(hit, circle.r, graphics, cc.Color.RED);
        }
        return hit;
    }

    static collideCheck(circle, other, dir) {
        const position = circle.position;
        const offset = other.position.clone().subSelf(position);
        return offset.angle(dir) < Math.asin((circle.r + other.r) / offset.len());
    }

    static drawCircle(center, radius, graphics, color) {
        graphics.strokeColor = color;
        graphics.circle(center.x, center.y, radius);
        graphics.stroke();
    }

    static collidePoint(circle, point, dir, graphics) {
        const other = {
            r: 0,
            position: point
        };
        return this.collide(circle, other, dir, graphics);
    }

    static drawLine(start, end, graphics, color) {
        graphics.strokeColor = color;
        graphics.moveTo(start.x, start.y);
        graphics.lineTo(end.x, end.y);
        graphics.stroke();
    }
}
