import { v4 as createUuid } from "uuid";

export class Growdever {
    private _id: string;

    constructor(
        private _nome: string,
        private _cpf: number,
        private _idade: number,
        private _skills?: string[]
    ) {
        this._id = createUuid();
        this._skills = this._skills ?? [];
    }

    public get cpf() {
        return this._cpf;
    }

    public get nome() {
        return this._nome;
    }

    public set nome(nome: string) {
        this._nome = nome;
    }

    public get idade() {
        return this._idade;
    }

    public set idade(idade: number) {
        this._idade = idade;
    }

    public get id() {
        return this._id;
    }

    public get skills(): string[] {
        return this._skills ?? [];
    }

    // Adapter
    public getGrowdever() {
        return {
            nome: this._nome,
            idade: this._idade,
            cpf: this._cpf,
            id: this._id,
            skills: this._skills,
        };
    }
}
