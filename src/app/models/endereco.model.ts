export class Endereco {
    private _id!: number;

    constructor(
        private _rua: string,
        private _cidade: string,
        private _uf: string,
        private _complemento?: string
    ) {}

    public get rua() {
        return this._rua;
    }

    public get cidade() {
        return this._cidade;
    }

    public get complemento() {
        return this._complemento;
    }

    public get id() {
        return this._id;
    }

    public get uf() {
        return this._uf;
    }

    public toJson() {
        return {
            rua: this.rua,
            cidade: this.cidade,
            uf: this.uf,
            complemento: this.complemento,
        };
    }

    public static create(
        id: number,
        rua: string,
        cidade: string,
        uf: string,
        complemento?: string
    ) {
        const endereco = new Endereco(rua, cidade, uf, complemento);
        endereco._id = id;

        return endereco;
    }
}
