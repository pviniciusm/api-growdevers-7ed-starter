import { v4 as createUuid } from "uuid";

export class Growdever {
    public _id: string;

    constructor(
        public _nome: string,
        public _idade: number,
        public _skills?: string[]
    ) {
        this._id = createUuid();
        this._skills = this._skills ?? [];
    }
}
