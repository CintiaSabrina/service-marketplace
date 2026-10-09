import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

import { ProfessionalRegistration } from "./professional-registration";

@Entity("professional_services")
export class ProfessionalServices {
    @PrimaryGeneratedColumn()
    id!: number;    

    @ManyToOne(
        () => ProfessionalRegistration,
        professional => professional.services,
        { onDelete: "CASCADE" }
    )
    @JoinColumn({ name: "professional_id" })
    professional!: ProfessionalRegistration;

    @Column({ type: "int", name: "professional_id" })
    professional_id!: number;

    @Column({ type: "varchar", name: "category" })
    category!: string;

    @Column({ type: "varchar", name: "service_name" })
    service!: string;

    @Column({ type: "decimal", name: "value_service", precision: 10, scale: 2 })
    value_service!: number;

    @Column ({ type: "timestamp", name: "CURRENT_TIMESTAMP", default: () => "CURRENT_TIMESTAMP" })
    CURRENT_TIMESTAMP!: Date;
}