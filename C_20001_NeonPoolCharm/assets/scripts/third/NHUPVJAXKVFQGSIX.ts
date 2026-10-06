import { LKKFYC } from "./LKKFYC";
import { JGJYJG } from "./JGJYJG";
import { ABPXIYEANGWLG } from "./ABPXIYEANGWLG";
import { HBEPBGXIBMH } from "./HBEPBGXIBMH";
import * as XWRHYLPIOGNSHModule from "./XWRHYLPIOGNSH";

const XWRHYLPIOGNSH = (XWRHYLPIOGNSHModule as any).XWRHYLPIOGNSH;

export class NHUPVJAXKVFQGSIX extends LKKFYC {
    NBRDUYDQ = "";
    TJVOIMYKUT = "";
    ACSMUPAJQNUZHYX = 0;
    BQUNEN = false;
    ONNMFLSKGJFZSIJ: { RHHFJDINHQRDBNV(value: number): void } | null = null;

    RHHFJDINHQRDBNV(value: number): void {
        console.log("launch " + value);
        if (this.ONNMFLSKGJFZSIJ != null) {
            this.ONNMFLSKGJFZSIJ.RHHFJDINHQRDBNV(value);
            this.BQUNEN = false;
        } else {
            this.ACSMUPAJQNUZHYX = value;
            this.BQUNEN = true;
        }
    }

    HWZEEGYDTCHMYPA(): void {
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.RHHFJDINHQRDBNV, this.RHHFJDINHQRDBNV, this);
    }

    HMZTTQYMEYZ(): void {}

    VBTSYPUPAPAQHRML(listener: { RHHFJDINHQRDBNV(value: number): void }): void {
        this.ONNMFLSKGJFZSIJ = listener;
        if (this.BQUNEN) {
            this.ONNMFLSKGJFZSIJ.RHHFJDINHQRDBNV(this.ACSMUPAJQNUZHYX);
            this.BQUNEN = false;
        }
    }

    EAKOGGQSF(): string {
        if (JGJYJG.YFEMHUUNOADK) {
            return "{}";
        }
        if (this.NBRDUYDQ == "") {
            this.NBRDUYDQ = XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().YDFDNEPFGPRESZ(HBEPBGXIBMH.NZDHSETMWOSYSWO);
        }
        return this.NBRDUYDQ;
    }
}
