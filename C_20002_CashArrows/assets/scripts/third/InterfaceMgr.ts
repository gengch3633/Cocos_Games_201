export enum bundleName {
    game = "game",
    config = "config",
    lobby = "lobby",
    ui = "ui"
}

export enum gameEvent {
    gameAdTips = "gameAdTips",
    gameAdChnage = "gameAdChnage",
    gameAdYichu = "gameAdYichu",
    gameAdFuzhuxian = "gameAdFuzhuxian",
    gameAdFuhuo = "gameAdFuhuo",
    gameNext = "gameNext",
    gameRestart = "gameRestart",
    gameFail = "gameFail",
    notifySnakeNum = "notifySnakeNum",
    notifySnakeNumChange = "notifySnakeNumChange",
    notifySnakeTouch = "notifySnakeTouch",
    snakeTouchSnake = "snakeTouchSnake",
    gameScaleChange = "gameScaleChange",
    closeSet = "closeSet",
    gettipsCard = "gettipsCard",
    notifyGameNoMove = "notifyGameNoMove",
    notifyGameCanMove = "notifyGameCanMove",
    fuzhulineState = "fuzhulineState",
    jumpLevel = "jumpLevel",
    gameWin = "gameWin",
    languageChanged = "languageChanged",
    userInfoUpdated = "userInfoUpdated",
    arrowRewardClaimed = "arrowRewardClaimed",
    settleRewardOpen = "settleRewardOpen",
    settleRewardClose = "settleRewardClose",
    levelFailReport = "levelFailReport"
}

const InterfaceMgr = {
    bundleName,
    gameEvent
};

export default InterfaceMgr;
