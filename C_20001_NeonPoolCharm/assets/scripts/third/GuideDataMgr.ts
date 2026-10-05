declare const i18n: { t(key: string, params?: any): string };

class GuideDataMgr {
    step = 1;
    isClick = false;
    isShowFieldHand = false;

    private static _instance: GuideDataMgr = null;

    private static _getInstance(): GuideDataMgr {
        if (!GuideDataMgr._instance) {
            GuideDataMgr._instance = new GuideDataMgr();
        }
        return GuideDataMgr._instance;
    }

    setStep(step: number): void {
        this.step = step;
    }

    getStep(): number {
        return this.step;
    }

    getGuideCopy(step: number = this.step): string {
        const guideCopy = [
            i18n.t("newcomer_step_1"),
            i18n.t("newcomer_step_2"),
            i18n.t("newcomer_step_3"),
            i18n.t("newcomer_step_4"),
            i18n.t("newcomer_step_5"),
            i18n.t("newcomer_step_6"),
            i18n.t("newcomer_step_7"),
            i18n.t("newcomer_step_8"),
            i18n.t("newcomer_step_9"),
            "",
            i18n.t("newcomer_step_10"),
            i18n.t("newcomer_step_11"),
            i18n.t("newcomer_step_12"),
            i18n.t("newcomer_step_13"),
            i18n.t("newcomer_step_14"),
            i18n.t("newcomer_step_15"),
            i18n.t("newcomer_step_16"),
            i18n.t("newcomer_step_17"),
            i18n.t("newcomer_step_18"),
            i18n.t("newcomer_step_19"),
            "",
            i18n.t("newcomer_step_20"),
            "",
            i18n.t("newcomer_step_21"),
            i18n.t("newcomer_step_22"),
        ];
        console.log("guideCopy step: ", step);
        console.log("guideCopy[step - 1]: ", guideCopy[step - 1]);
        return guideCopy[step - 1];
    }
}

export default GuideDataMgr._getInstance();
