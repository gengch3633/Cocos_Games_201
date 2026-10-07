import { ABPXIYEANGWLG } from "./ABPXIYEANGWLG";
import { LKKFYC } from "./LKKFYC";

export class KWESXDIIOUWB extends LKKFYC {
    XTESKULC: any = null;
    KCVPMXISGECRXNF = false;
    LRRHEYFMQEPE: string = null;

    ABLSQCEEBRL(data: string): string {
        return decodeURIComponent(escape(atob(data)));
    }

    UVUTDBCYPEHW(data: string): void {
        try {
            this.LRRHEYFMQEPE = this.ABLSQCEEBRL(data);
            if (this.XTESKULC != null) {
                this.XTESKULC.UVUTDBCYPEHW(this.LRRHEYFMQEPE);
                this.KCVPMXISGECRXNF = false;
            } else {
                this.KCVPMXISGECRXNF = true;
            }
        } catch (_e) {}
    }

    HMZTTQYMEYZ(): void {}

    KMTYRBVRZVBENMR(handler: any): void {
        this.XTESKULC = handler;
        if (this.KCVPMXISGECRXNF) {
            this.XTESKULC.UVUTDBCYPEHW(this.LRRHEYFMQEPE);
            this.KCVPMXISGECRXNF = false;
        }
    }

    HWZEEGYDTCHMYPA(): void {
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.UVUTDBCYPEHW, this.UVUTDBCYPEHW, this);
    }
}
