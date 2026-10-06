import { LKKFYC } from "./LKKFYC";
import { ABPXIYEANGWLG } from "./ABPXIYEANGWLG";

export class KWESXDIIOUWB extends LKKFYC {
    XTESKULC: { UVUTDBCYPEHW(value: string): void } | null = null;
    KCVPMXISGECRXNF = false;
    LRRHEYFMQEPE: string | null = null;

    ABLSQCEEBRL(value: string): string {
        return decodeURIComponent(escape(atob(value)));
    }

    UVUTDBCYPEHW(payload: string): void {
        try {
            this.LRRHEYFMQEPE = this.ABLSQCEEBRL(payload);
            if (this.XTESKULC != null) {
                this.XTESKULC.UVUTDBCYPEHW(this.LRRHEYFMQEPE);
                this.KCVPMXISGECRXNF = false;
            } else {
                this.KCVPMXISGECRXNF = true;
            }
        } catch (_e) {}
    }

    HMZTTQYMEYZ(): void {}

    KMTYRBVRZVBENMR(listener: { UVUTDBCYPEHW(value: string): void }): void {
        this.XTESKULC = listener;
        if (this.KCVPMXISGECRXNF) {
            this.XTESKULC.UVUTDBCYPEHW(this.LRRHEYFMQEPE);
            this.KCVPMXISGECRXNF = false;
        }
    }

    HWZEEGYDTCHMYPA(): void {
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.UVUTDBCYPEHW, this.UVUTDBCYPEHW, this);
    }
}
