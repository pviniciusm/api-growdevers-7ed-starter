import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { AvaliacaoEntity } from "./avaliacao.entity";

@Entity({
    name: "growdever",
})
export class GrowdeverEntity {
    // @Column({
    //     primary: true
    // })
    @PrimaryColumn()
    id!: string;

    @Column({
        length: 60,
    })
    nome!: string;

    @Column()
    cpf!: number;

    @Column()
    idade!: number;

    @Column({
        nullable: true,
    })
    skills!: string;

    @OneToMany(() => AvaliacaoEntity, (avaliacao) => avaliacao.growdever)
    avaliacoes!: AvaliacaoEntity[];
}
