import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { GrowdeverEntity } from "./growdever.entity";

@Entity({
    name: "avaliacao",
})
export class AvaliacaoEntity {
    @PrimaryColumn()
    id!: string;

    @Column()
    modulo!: string;

    @Column()
    nota!: number;

    @ManyToOne(() => GrowdeverEntity)
    @JoinColumn({
        name: "id_growdever",
    })
    growdever!: GrowdeverEntity;
}
