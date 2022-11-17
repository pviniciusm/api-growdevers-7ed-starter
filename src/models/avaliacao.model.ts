import { v4 as createUuid } from "uuid";
import { Growdever } from "./growdever";

export class Avaliacao {
    private _id: string;

    constructor(
        private _modulo: string,
        private _nota: number,
        private _growdever: Growdever
    ) {
        this._id = createUuid();
    }

    public get modulo() {
        return this._modulo;
    }

    public get nota() {
        return this._nota;
    }

    public get growdever() {
        return this._growdever;
    }

    public get id() {
        return this._id;
    }
}
