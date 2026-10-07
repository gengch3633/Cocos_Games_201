const fs = require("fs");
const path = require("path");
const third = path.join(__dirname, "../assets/scripts/third");

const snakeEnums = `export enum Bodyparts {
    头_上 = 0,
    头_下 = 1,
    头_左 = 2,
    头_右 = 3,
    身体_右右 = 4,
    身体_下右 = 5,
    身体_上右 = 6,
    身体_左左 = 7,
    身体_下左 = 8,
    身体_上左 = 9,
    身体_上上 = 10,
    身体_右上 = 11,
    身体_左上 = 12,
    身体_下下 = 13,
    身体_右下 = 14,
    身体_左下 = 15,
    尾_上 = 16,
    尾_下 = 17,
    尾_左 = 18,
    尾_右 = 19,
}

export enum Direction {
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3,
}

export enum snakeState {
    norlmal = 0,
    dead = 1,
}

`;

let snake = fs.readFileSync(path.join(third, "snake.ts"), "utf8");
snake = snake.replace(/^import[\s\S]*?@ccclass/m, `import { ClickState } from "./game";
import AudioMgr from "./AudioMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import MultiPlatform from "./MultiPlatform";
import ResMgr from "./ResMgr";
import SpriteFrames from "./SpriteFrames";
import UserData from "./UserData";

${snakeEnums}const { ccclass } = cc._decorator;

@ccclass`);
snake = snake.replace(/: any = o\.norlmal;/, ": snakeState = snakeState.norlmal;");
snake = snake.replace(/\bg\.gameEvent\b/g, "gameEvent");
snake = snake.replace(/\bp\.default\.getInstance\(\)/g, "MultiPlatform.getInstance()");
snake = snake.replace(/\bo\.dead\b/g, "snakeState.dead");
snake = snake.replace(/\bcase a\.(Left|Right|Up|Down)\b/g, "case Direction.$1");
snake = snake.replace(/this\.direction = a\.(Left|Right|Up|Down)/g, "this.direction = Direction.$1");
snake = snake.replace(/t\.(x|y) === e\.(x|y)[+-] 1\? this\.direction = a\.(Left|Right|Up|Down)/g, (m) => m.replace(/a\.(Left|Right|Up|Down)/g, "Direction.$1"));
snake = snake.replace(/= a\.(Left|Right|Up|Down)/g, "= Direction.$1");
snake = snake.replace(/\bcase n\.(头|身体|尾)/g, "case Bodyparts.$1");
snake = snake.replace(/\breturn n\.(头|身体|尾)/g, "return Bodyparts.$1");
snake = snake.replace(/= n\.(尾_右|头_)/g, "= Bodyparts.$1");
snake = snake.replace(/this\.gameManager\.clickState == y\.ClickState\./g, "this.gameManager.clickState == ClickState.");
fs.writeFileSync(path.join(third, "snake.ts"), snake);

let rv = fs.readFileSync(path.join(third, "resultView.ts"), "utf8");
rv = rv.replace(/^const \{ ccclass[\s\S]*?import UserData[^\n]*\n\n/, `import AudioMgr from "./AudioMgr";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import GEMgr from "./GEMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import { bundleName, gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import Tips from "./Tips";
import UIMgr from "./UIMgr";
import UIParams from "./UIParams";
import UserData from "./UserData";

const { ccclass, property, menu } = cc._decorator;

`);
rv = rv.replace("@ccclass\nexport", '@ccclass\n@menu("业务逻辑/resultView")\nexport');
rv = rv.replace(/\bp\.UIParams\b/g, "UIParams");
rv = rv.replace(/\bc\.default\.show\b/g, "Tips.show");
rv = rv.replace(/\bh\.bundleName\b/g, "bundleName");
rv = rv.replace(/\bh\.gameEvent\b/g, "gameEvent");
fs.writeFileSync(path.join(third, "resultView.ts"), rv);
console.log("fixed snake and resultView");
