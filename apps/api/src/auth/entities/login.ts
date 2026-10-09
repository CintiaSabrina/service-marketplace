import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

import { ProfessionalRegistration } from "../../professional/entities/professional-registration";
import { CustomerRegistration } from "../../customer/entities/customer-registration";

@Entity("logins")
export class Login {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => ProfessionalRegistration, { onDelete: "CASCADE" })
    
    @JoinColumn({ name: "professional_id" })
    professional!: ProfessionalRegistration;

    @ManyToOne(() => CustomerRegistration, { onDelete: "CASCADE" })
    @JoinColumn({ name: "customer_id" })
    customer!: CustomerRegistration;

    @Column({ type: "varchar" })
    email!: string;

    @Column({ type: "varchar" })
    password!: string;

    @Column({ type: "varchar", name: "user_type" })
    user_type!: string;

    @Column({ type: "boolean", default: false, name: "is_active" })
    is_active!: boolean;

    @Column({ type: "timestamp", name: "CURRENT_TIMESTAMP", default: () => "CURRENT_TIMESTAMP" })
    CURRENT_TIMESTAMP!: Date;

    @Column({ type: "timestamp", name: "last_login", nullable: true })
    last_login!: Date | null;
}