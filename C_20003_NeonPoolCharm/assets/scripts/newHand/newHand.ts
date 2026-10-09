const { ccclass, property } = cc._decorator;

let frameSDKRef: any = null;
function getFrameSDK() {
    if (!frameSDKRef) {
        const found = cc.js.getClassByName("FrameSDK");
        frameSDKRef = found !== null && found !== undefined ? found : cc.js._registeredClassNames.FrameSDK;
    }
    return frameSDKRef;
}

let frameDataRef: any = null;
function getFrameData() {
    if (!frameDataRef) {
        const found = cc.js.getClassByName("FrameData");
        frameDataRef = found !== null && found !== undefined ? found : cc.js._registeredClassNames.FrameData;
    }
    return frameDataRef;
}

let h: any = null;

@ccclass
export default class newHand extends cc.Component {

    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;

    @property(cc.Node)
    state1Node: cc.Node = null;

    @property(cc.Node)
    state2Node: cc.Node = null;

    @property(cc.Label)
    welcomeLabel: cc.Label = null;

    @property([cc.Node])
    lightNodes: cc.Node[] = [];

    @property(cc.RichText)
    richText1: cc.RichText = null;

    @property(cc.Label)
    levelLabel: cc.Label = null;

    @property(cc.Node)
    withdrawNode: cc.Node = null;

    @property(cc.Label)
    minBonusLabel: cc.Label = null;

    @property(cc.RichText)
    richText2: cc.RichText = null;

    @property(cc.Sprite)
    progress: cc.Sprite = null;

    @property(cc.Label)
    labelBar: cc.Label = null;

    @property(cc.Label)
    labelBartips: cc.Label = null;

    @property(cc.Label)
    buttonLabel: cc.Label = null;

    @property(cc.Node)
    startButton: cc.Node = null;

    @property(cc.Node)
    light: cc.Node = null;

    earlierStageEvent: any = null;
    sdyEvent: any = null;
    logGameEvent: any = null;
    logLifeEvent: any = null;
    _state = 0;

    randomFloat(min, max?) {
        if (Array.isArray(min)) {
            max = min[1];
            min = min[0];
        }
        return (max - min) * Math.random() + min;
    }

    playEffect(name, loop = false, callback?) {
        cc.assetManager.getBundle("newHand").load("Sound/" + name, cc.AudioClip, function (err, clip) {
            if (clip) {
                const audioId = cc.audioEngine.playEffect(clip, loop);
                if (callback) {
                    callback(audioId);
                }
            } else {
                cc.warn("没有这个音效", name);
            }
        });
    }

    init(earlierStageEvent, sdyEvent, logGameEvent, logLifeEvent) {
        this.earlierStageEvent = earlierStageEvent;
        this.sdyEvent = sdyEvent;
        this.logGameEvent = logGameEvent;
        this.logLifeEvent = logLifeEvent;
    }

    start() {
        this.logLifeEvent("guide_start");
        this.logGameEvent("thepool_game_new", {
            object_action: "show",
            object_name: "new_1"
        }, true);
        this.earlierStageEvent("guide_start", "enter_success");
    }

    onTouchGo() {
        if (0 === this._state) {
            this._state = 1;
            this.state1Node.active = false;
            this.state2Node.active = true;
            this.buttonLabel.string = "nkey_008";
            this.skeleton.setAnimation(0, "start2", false);
            this.skeleton.addAnimation(0, "loop2", true);
            this.playEffect("YX_TC_01");
        } else {
            this.logLifeEvent("guide_end");
            this.sdyEvent(345, "1");
            const sdk = getFrameSDK();
            if (sdk != null) {
                sdk.openWindow("Panel_Award_New");
            }
            cc.sys.localStorage.setItem("newHand", "1");
            this.node.destroy();
        }
    }

    randomInt(min, max?) {
        if (Array.isArray(min)) {
            max = min[1];
            min = min[0];
        }
        return Math.floor((max - min + 1) * Math.random()) + min;
    }

    onEnable() {
        this._state = 0;
        this.state1Node.active = true;
        this.state2Node.active = false;
        this.skeleton.setAnimation(0, "start", false);
        this.skeleton.addAnimation(0, "loop", true);
        this.playEffect("YX_TC_01");
    }

    onLoad() {
        const self = this;
        this.startButton.active = false;
        this.light.active = false;
        this.progress.node.parent.active = true;
        this.welcomeLabel.string = "nkey_001??&value1==The Pool Quest";
        const handConf = getFrameData().FRAME_CONF.newHand;
        const people = this.randomInt(handConf.people);
        const bonus = getFrameSDK().formatNumber(people * this.randomFloat(handConf.random), 2, getFrameData().FRAME_CONF.RedeemRateConfig[0]);
        this.lightNodes.forEach(function (node) {
            node.angle = 0;
            cc.Tween.stopAllByTarget(node);
            cc.tween(node).set({
                angle: 0
            }).to(2, {
                angle: 360
            }).union().repeatForever().start();
        });
        this.richText1.string = "<outline color= #42237C width=3>nkey_003</outline>??&value1==<size=42><color= #FEF865>" + getFrameSDK().formatNumber(people) + "</c></size>&value2==<size=50><color= #FEF865>" + bonus + "</c></size>";
        this.buttonLabel.string = "nkey_004";
        this.levelLabel.string = "nkey_005??&value1==" + getFrameSDK().getFirstRedeemRequirement().rdm_1;
        cc.tween(this.withdrawNode).to(.5, {
            scale: .9
        }, {
            easing: "sineInOut"
        }).to(.5, {
            scale: 1
        }, {
            easing: "sineInOut"
        }).union().repeatForever().start();
        this.minBonusLabel.string = getFrameSDK().formatNumber(3e4, 2, getFrameData().FRAME_CONF.RedeemRateConfig[0]);
        this.richText2.string = "<outline color= #42237C width=3>nkey_009??&value1==86%&value2==<size=42><color= #FEF865>30</c></size>";
        let dotCount = -1;
        this.schedule(function () {
            dotCount = (dotCount + 1) % 3;
            self.labelBartips.string = ".".repeat(dotCount + 1);
        }, .5);
        this.progress.fillRange = 0;
        cc.tween(this.progress).to(5, {
            fillRange: .95
        }, {
            progress: function (start, end, current, ratio) {
                const value = start + (end - start) * ratio;
                self.labelBar.string = Math.floor(100 * value) + "%";
                return value;
            }
        }).start();
        this.schedule(this.getFrame);
    }

    getFrame() {
        const frameClass: any = cc.js.getClassByName("FrameSDK");
        if (frameClass && frameClass.Panel) {
            this.unschedule(this.getFrame);
            frameClass.addi18nArray(h);
            this.progress.node.parent.active = false;
            this.startButton.active = true;
            this.startButton.scale = 1;
            this.light.active = true;
            cc.Tween.stopAllByTarget(this.startButton);
            cc.tween(this.startButton).to(.2, {
                scale: 1.1
            }, {
                easing: "sineInOut"
            }).to(.2, {
                scale: 1
            }, {
                easing: "sineInOut"
            }).union().repeatForever().start();
        }
    }
}

function parseLanguage(code) {
    const hashIndex = code.indexOf("#");
    code = code.substring(0, -1 == hashIndex ? code.length : hashIndex);
    const parts = code.split(-1 != code.indexOf("_") ? "_" : "-");
    for (let i = parts.length - 1; i >= 0; i--) {
        if ("" == parts[i]) {
            parts.splice(i, 1);
        }
    }
    if (-1 != parts[0].indexOf("zh")) {
        parts[0] = "en";
    }
    let info = {
        lang: parts[0],
        country: "SBALL"
    };
    if (parts.length > 1) {
        info = {
            lang: parts[0],
            country: parts[parts.length - 1]
        };
    }
    return info;
}

const lang = parseLanguage(cc.sys.languageCode).lang;
const keyMap = {};
h = [{
    key: "nkey_001",
    zh: "欢迎来到xxx_1,本产品由多家广告平台联合开发",
    zh_CN: "欢迎来到xxx_1,本产品由多家广告平台联合开发",
    en: "Welcome to xxx_1. This product is developed in collaboration with multiple advertising platforms.",
    es: "Bienvenido a xxx_1. Este producto se desarrolló en colaboración con múltiples plataformas publicitarias.",
    fr: "Bienvenue sur xxx_1. Ce produit est développé en collaboration avec plusieurs plateformes publicitaires.",
    ja: "xxx_1へようこそ。この製品は複数の広告プラットフォームと共同で開発されています。",
    de: "Willkommen bei xxx_1. Dieses Produkt wurde in Zusammenarbeit mit mehreren Werbeplattformen entwickelt.",
    ru: "Добро пожаловать в xxx_1. Этот продукт разработан совместно с несколькими рекламными платформами.",
    pt: "Bem-vindo ao xxx_1. Este produto foi desenvolvido em colaboração com diversas plataformas de publicidade.",
    in: "Selamat datang di xxx_1. Produk ini dikembangkan bekerja sama dengan berbagai platform periklanan.",
    vi: "Chào mừng đến với xxx_1. Sản phẩm này được phát triển với sự hợp tác của nhiều nền tảng quảng cáo.",
    ar: "مرحبًا بك في xxx_1. تم تطوير هذا المنتج بالتعاون مع منصات إعلانية متعددة.",
    th: "ยินดีต้อนรับสู่ xxx_1 ผลิตภัณฑ์นี้ได้รับการพัฒนาร่วมกับแพลตฟอร์มโฆษณามากมาย",
    ko: "xxx_1에 오신 것을 환영합니다. 이 제품은 여러 광고 플랫폼과의 협업을 통해 개발되었습니다.",
    fil: "Maligayang pagdating sa xxx_1. Ang produktong ito ay binuo sa pakikipagtulungan sa maraming platform ng advertising.",
    ms: "Selamat datang ke xxx_1. Produk ini dibangunkan dengan kerjasama pelbagai platform pengiklanan.",
    hi: "xxx_1 में आपका स्वागत है। यह उत्पाद कई विज्ञापन प्लेटफ़ॉर्म के सहयोग से विकसित किया गया है।",
    tr: "xxx_1'e hoş geldiniz. Bu ürün, birden fazla reklam platformuyla iş birliği yapılarak geliştirilmiştir."
}, {
    key: "nkey_002",
    zh: "平台担保，赚钱有保障",
    zh_CN: "平台担保，赚钱有保障",
    en: "Platform guarantee, earning assured",
    es: "Garantía de plataforma, ganancias aseguradas",
    fr: "Garantie de la plateforme, gains assurés",
    ja: "プラットフォーム保証、収益保証",
    de: "Plattformgarantie, Verdienst garantiert",
    ru: "Гарантия платформы, гарантированный заработок",
    pt: "Garantia de plataforma, ganhos assegurados",
    in: "Jaminan platform, penghasilan terjamin",
    vi: "Nền tảng đảm bảo, thu nhập chắc chắn",
    ar: "ضمان المنصة، كسب مضمون",
    th: "รับประกันแพลตฟอร์ม สร้างรายได้แน่นอน",
    ko: "플랫폼 보장, 확실한 수익",
    fil: "Garantiya sa platform, siguradong kumita",
    ms: "Jaminan platform, pendapatan terjamin",
    hi: "प्लेटफ़ॉर्म गारंटी, कमाई सुनिश्चित",
    tr: "Platform garantisi, kazanç garantisi"
}, {
    key: "nkey_003",
    zh: "已有xxx_1人参与游戏\n累计提现xxx_2",
    zh_CN: "已有xxx_1人参与游戏累计\n累计提现xxx_2",
    en: "xxx_1 people have joined the game\nA total of xxx_2 withdrawn.",
    es: "xxx_1 personas se han unido al juego\nUn total de xxx_2 se han retirado.",
    fr: "xxx_1 personnes ont rejoint le jeu\nUn total de xxx_2 se sont retirées.",
    ja: "xxx_1 人がゲームに参加しました\n合計 xxx_2 人が退出しました。",
    de: "xxx_1 Personen sind dem Spiel beigetreten\nInsgesamt haben xxx_2 sich zurückgezogen.",
    ru: "К игре присоединилось xxx_1 человек. Всего выведено xxx_2 человек.",
    pt: "xxx_1 pessoas entraram no jogo\nUm total de xxx_2 desistiram.",
    in: "xxx_1 orang telah bergabung dalam permainan\nSebanyak xxx_2 orang telah mengundurkan diri.",
    vi: "xxx_1 người đã tham gia trò chơi\nTổng cộng xxx_2 người đã rút lui.",
    ar: "انضم xxx_1 شخصًا إلى اللعبة\nتم سحب ما مجموعه xxx_2 شخصًا.",
    th: "xxx_1 คนเข้าร่วมเกม\nทั้งหมด xxx_2 คนถูกถอนออก",
    ko: "xxx_1명이 게임에 참여했습니다.\n총 xxx_2명이 철회했습니다.",
    fil: "xxx_1 tao ang sumali sa laro\nKabuuan na xxx_2 ang na-withdraw.",
    ms: "xxx_1 orang telah menyertai permainan\nSebanyak xxx_2 ditarik balik.",
    hi: "xxx_1 लोग खेल में शामिल हुए हैं\nकुल xxx_2 लोग वापस लिए गए.",
    tr: "xxx_1 kişi oyuna katıldı\nToplam xxx_2 kişi oyundan çekildi."
}, {
    key: "nkey_004",
    zh: "开始赚钱",
    zh_CN: "开始赚钱",
    en: "Start Earning",
    es: "Empieza a ganar",
    fr: "Commencez à gagner",
    ja: "稼ぎ始める",
    de: "Beginnen Sie zu verdienen",
    ru: "Начните зарабатывать",
    pt: "Comece a ganhar",
    in: "Mulai Menghasilkan",
    vi: "Bắt đầu kiếm tiền",
    ar: "ابدأ في الكسب",
    th: "เริ่มรับรายได้",
    ko: "수입을 시작하세요",
    fil: "Simulan ang Kumita",
    ms: "Mula Mendapat",
    hi: "कमाई शुरू करें",
    tr: "Kazanmaya Başlayın"
}, {
    key: "nkey_005",
    zh: "简单击球进洞即可赚钱，通过第xxx_1关，收集到的所有货币，都可提现",
    zh_CN: "简单击球进洞即可赚钱，通过第xxx_1关，收集到的所有货币，都可提现",
    en: "Earn money by hitting the ball into the hole. All the currency collected after completing level xxx_1 can be withdrawn.",
    es: "Gana dinero metiendo la bola en el agujero. Todo el dinero acumulado tras completar el nivel xxx_1 se puede retirar.",
    fr: "Gagnez de l'argent en envoyant la balle dans le trou. Toutes les pièces collectées après avoir terminé le niveau xxx_1 peuvent être retirées.",
    ja: "ボールを穴に打ち込むとお金がもらえます。レベルxxx_1をクリアすると獲得した通貨はすべて引き出すことができます。",
    de: "Verdiene Geld, indem du den Ball ins Loch schlägst. Die gesamte Währung, die du nach Abschluss von Level xxx_1 gesammelt hast, kannst du dir auszahlen lassen.",
    ru: "Зарабатывайте деньги, забивая мяч в лунку. Всю валюту, собранную после прохождения уровня xxx_1, можно вывести.",
    pt: "Ganhe dinheiro acertando a bola no buraco. Toda a moeda coletada após completar o nível xxx_1 pode ser sacada.",
    in: "Dapatkan uang dengan memasukkan bola ke dalam lubang. Semua mata uang yang terkumpul setelah menyelesaikan level xxx_1 dapat ditarik.",
    vi: "Kiếm tiền bằng cách đánh bóng vào lỗ. Toàn bộ tiền thu được sau khi hoàn thành cấp độ xxx_1 có thể được rút.",
    ar: "اربح المال بضرب الكرة في الحفرة. يمكنك سحب جميع العملات المجمعة بعد إكمال المستوى xxx_1.",
    th: "หาเงินด้วยการตีลูกลงหลุม เงินทั้งหมดที่เก็บได้หลังจากผ่านด่าน xxx_1 สามารถถอนออกมาใช้ได้",
    ko: "공을 구멍에 넣어 돈을 벌어보세요. 레벨 xxx_1을 완료한 후 모은 모든 화폐는 출금할 수 있습니다.",
    fil: "Kumita ng pera sa pamamagitan ng pagtama ng bola sa butas. Ang lahat ng currency na nakolekta pagkatapos makumpleto ang antas xxx_1 ay maaaring bawiin.",
    ms: "Dapatkan wang dengan memukul bola ke dalam lubang. Semua mata wang yang dikumpul selepas melengkapkan tahap xxx_1 boleh ditarik balik.",
    hi: "गेंद को छेद में मारकर पैसे कमाएँ। लेवल xxx_1 पूरा करने के बाद एकत्रित की गई सारी मुद्रा निकाली जा सकती है।",
    tr: "Topu deliğe sokarak para kazan. xxx_1 seviyesini tamamladıktan sonra toplanan tüm para çekilebilir."
}, {
    key: "nkey_006",
    zh: "提现",
    zh_CN: "提现",
    en: "Withdrawal",
    es: "Retiro",
    fr: "Retrait",
    ja: "引き出し",
    de: "Rückzug",
    ru: "Снятие",
    pt: "Cancelamento",
    in: "Penarikan",
    vi: "Rút tiền",
    ar: "انسحاب",
    th: "การถอนเงิน",
    ko: "철수",
    fil: "Pag-withdraw",
    ms: "Pengeluaran",
    hi: "निकासी",
    tr: "Para çekme"
}, {
    key: "nkey_007",
    zh: "至少",
    zh_CN: "至少",
    en: "Minimum Get",
    es: "Mínimo Obtener",
    fr: "Minimum Get",
    ja: "最小取得",
    de: "Mindestabruf",
    ru: "Минимальная сумма",
    pt: "Obtenção mínima",
    in: "Minimal Mendapatkan",
    vi: "Tối thiểu Nhận được",
    ar: "الحد الأدنى للحصول",
    th: "รับขั้นต่ำ",
    ko: "최소 획득",
    fil: "Minimum Get",
    ms: "Dapatkan Minimum",
    hi: "न्यूनतम प्राप्ति",
    tr: "Minimum Kazanç"
}, {
    key: "nkey_008",
    zh: "开始挑战",
    zh_CN: "开始挑战",
    en: "Start Challenge",
    es: "Iniciar desafío",
    fr: "Démarrer le défi",
    ja: "チャレンジを始める",
    de: "Herausforderung starten",
    ru: "Начать вызов",
    pt: "Iniciar desafio",
    in: "Mulai Tantangan",
    vi: "Bắt đầu thử thách",
    ar: "ابدأ التحدي",
    th: "เริ่มความท้าทาย",
    ko: "챌린지 시작",
    fil: "Simulan ang Hamon",
    ms: "Mulakan Cabaran",
    hi: "चुनौती शुरू करें",
    tr: "Meydan Okumaya Başla"
}, {
    key: "nkey_009",
    zh: "xxx_1用户可在xxx_2分钟内完成挑战",
    zh_CN: "xxx_1用户可在xxx_2分钟内完成挑战",
    en: "xxx_1 users can complete the challenge in xxx_2 minutes.",
    es: "Los usuarios de xxx_1 pueden completar el desafío en xxx_2 minutos.",
    fr: "Les utilisateurs xxx_1 peuvent relever le défi en xxx_2 minutes.",
    ja: "xxx_1 人のユーザーが xxx_2 分でチャレンジを完了できます。",
    de: "xxx_1 Benutzer können die Herausforderung in xxx_2 Minuten abschließen.",
    ru: "xxx_1 пользователей могут выполнить задание за xxx_2 минуты.",
    pt: "Usuários xxx_1 podem completar o desafio em xxx_2 minutos.",
    in: "Pengguna xxx_1 dapat menyelesaikan tantangan dalam xxx_2 menit.",
    vi: "xxx_1 người dùng có thể hoàn thành thử thách trong xxx_2 phút.",
    ar: "يمكن لمستخدمي xxx_1 إكمال التحدي في xxx_2 دقيقة.",
    th: "ผู้ใช้ xxx_1 คนสามารถทำภารกิจนี้ให้สำเร็จได้ภายใน xxx_2 นาที",
    ko: "xxx_1명의 사용자가 xxx_2분 안에 챌린지를 완료할 수 있습니다.",
    fil: "Makukumpleto ng xxx_1 user ang hamon sa loob ng xxx_2 minuto.",
    ms: "xxx_1 pengguna boleh menyelesaikan cabaran dalam xxx_2 minit.",
    hi: "xxx_1 उपयोगकर्ता xxx_2 मिनट में चुनौती पूरी कर सकते हैं।",
    tr: "xxx_1 kullanıcıları mücadeleyi xxx_2 dakikada tamamlayabilir."
}];
for (let m = 0; m < h.length; m++) {
    const item = h[m];
    const splitAt = item.key.lastIndexOf("_") + 1;
    const prefix = item.key.substring(0, splitAt);
    const index = parseInt(item.key.substring(splitAt, item.key.length));
    if (keyMap[prefix] == null) {
        keyMap[prefix] = {};
    }
    keyMap[prefix][index] = item[lang];
}

function parseQuery(text) {
    const result = {};
    const parts = text.split("&");
    const count = parts.length;
    for (let i = 0; i < count; i++) {
        if (parts[i]) {
            const pair = parts[i].split("==");
            pair[1] = pair[1].replace(/%/g, "%25");
            result[pair[0]] = decodeURIComponent(pair[1]);
        }
    }
    return result;
}

function translate(text) {
    for (const prefix in keyMap) {
        const indexAt = text.indexOf(prefix);
        if (-1 != indexAt) {
            const numberText = text.substring(indexAt + prefix.length, indexAt + prefix.length + 3);
            const index = parseInt(numberText);
            if (keyMap[prefix] && keyMap[prefix][index]) {
                const replaced = text.replace(prefix + numberText, keyMap[prefix][index]);
                const marker = replaced.indexOf("??&");
                if (-1 != marker) {
                    let body = replaced.substring(0, marker);
                    const query = replaced.substring(marker + 2, replaced.length);
                    const values = parseQuery(query);
                    const tokens = body.match(/xxx_\d/g);
                    if (tokens) {
                        for (let i = 0; i < tokens.length; i++) {
                            body = body.replace(tokens[i], values["value" + tokens[i].substring(4, 5)]);
                        }
                    }
                    return body;
                }
                return replaced;
            }
            return text;
        }
    }
    return text;
}

const labelStringDesc: any = Object.getOwnPropertyDescriptor(cc.Label.prototype, "string");
Object.defineProperty(cc.Label.prototype, "string", {
    set: function (value) {
        labelStringDesc.set.call(this, translate(value.toString()));
    },
    get: function () {
        this._string = translate(this._string);
        return labelStringDesc.get.call(this);
    }
});
const richTextStringDesc: any = Object.getOwnPropertyDescriptor(cc.RichText.prototype, "string");
Object.defineProperty(cc.RichText.prototype, "string", {
    set: function (value) {
        richTextStringDesc.set.call(this, translate(value.toString()));
    },
    get: function () {
        this._N$string = translate(this._N$string);
        return richTextStringDesc.get.call(this);
    }
});
