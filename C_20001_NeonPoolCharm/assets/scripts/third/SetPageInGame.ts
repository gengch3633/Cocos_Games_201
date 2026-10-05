const { ccclass } = cc._decorator;

@ccclass
export default class SetPageInGame extends cc.Component {
    static URL = "db://assets/resources/pages/SetPageInGame.prefab";

    SetPageInGame: cc.Node = null;
    page_bg: cc.Node = null;
    titleLabel: cc.Node = null;
    btn_close: cc.Node = null;
    btn_music: cc.Node = null;
    icon_on: cc.Node = null;
    icon_off: cc.Node = null;
    btn_sound: cc.Node = null;
    icon_sound_on: cc.Node = null;
    icon_sound_off: cc.Node = null;
    btn_shake: cc.Node = null;
    icon_shake_on: cc.Node = null;
    icon_shake_off: cc.Node = null;
    Layout: cc.Node = null;
    btn_quit: cc.Node = null;
    label_quit: cc.Node = null;
    btn_more_game: cc.Node = null;
    label_more_game: cc.Node = null;
    policy: cc.Node = null;

    onLoad(): void {
        this.SetPageInGame = this.node;
        this.page_bg = this.SetPageInGame.getChildByName("page_bg");
        this.titleLabel = this.page_bg.getChildByName("titleLabel");
        this.btn_close = this.page_bg.getChildByName("btn_close");
        this.btn_music = this.page_bg.getChildByName("btn_music");
        this.icon_on = this.btn_music.getChildByName("icon_on");
        this.icon_off = this.btn_music.getChildByName("icon_off");
        this.btn_sound = this.page_bg.getChildByName("btn_sound");
        this.icon_sound_on = this.btn_sound.getChildByName("icon_sound_on");
        this.icon_sound_off = this.btn_sound.getChildByName("icon_sound_off");
        this.btn_shake = this.page_bg.getChildByName("btn_shake");
        this.icon_shake_on = this.btn_shake.getChildByName("icon_shake_on");
        this.icon_shake_off = this.btn_shake.getChildByName("icon_shake_off");
        this.Layout = this.page_bg.getChildByName("Layout");
        this.btn_more_game = this.Layout.getChildByName("btn_more_game");
        this.label_more_game = this.btn_more_game.getChildByName("label_more_game");
        this.btn_quit = this.Layout.getChildByName("btn_quit");
        this.label_quit = this.btn_quit.getChildByName("label_quit");
        this.policy = this.Layout.getChildByName("policy");
    }
}
