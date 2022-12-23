import { GrowdeverRepository } from "../../growdever/repositories/growdever.repository";
import { EnderecoRepository } from "../repositories/endereco.repository";

interface UpdateEnderecoDTO {
    id: string;
    rua: string;
    cidade: string;
    uf: string;
}

export class UpdateEnderecoUseCase {
    constructor(
        private growdeverRepository: GrowdeverRepository,
        private enderecoRepository: EnderecoRepository
    ) {}

    public async execute(data: UpdateEnderecoDTO) {
        const growdever = await this.growdeverRepository.get(data.id);

        // Regra 1 - verificar se o growdever existe
        if (!growdever) {
            return {
                ok: false,
                message: "growdever não existe",
                code: "NotFound",
            };
        }

        // Regra 2 - verificar se o growdever possui endereço
        if (!growdever.endereco) {
            return {
                ok: false,
                message: "growdever não possui endereço",
                code: "AddressNotFound",
            };
        }

        // Regra 3.1 - verificar se a UF é válida (2 caracteres)
        // Regra 3.2 - verificar se a UF é válida (representa um estado brasileiro)
        if (!this.verificaValidadeUF(data.uf)) {
            return {
                ok: false,
                message: "a UF é inválida",
                code: "InvalidValueError",
            };
        }

        const endereco = growdever.endereco;
        endereco.cidade = data.cidade;
        endereco.rua = data.rua;
        endereco.uf = data.uf;

        await this.enderecoRepository.update(endereco);

        return {
            ok: true,
            message: "o endereço foi atualizado com sucesso",
        };
    }

    private verificaValidadeUF(uf: string) {
        if (uf.length != 2) {
            return false;
        }

        const ufsValidas = [
            "AC",
            "AL",
            "AP",
            "AM",
            "BA",
            "CE",
            "DF",
            "ES",
            "GO",
            "MA",
            "MT",
            "MS",
            "MG",
            "PA",
            "PB",
            "PR",
            "PE",
            "PI",
            "RJ",
            "RN",
            "RS",
            "RO",
            "RR",
            "SC",
            "SP",
            "SE",
            "TO",
        ];

        return ufsValidas.includes(uf);
    }
}
