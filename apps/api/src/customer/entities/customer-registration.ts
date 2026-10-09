import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Login } from "../../auth/entities/login";

@Entity("customer_registrations")
export class CustomerRegistration {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(
      () => Login,
      (login: any) => login.customer
    )
    logins!: Login[];

    @Column({ type: "varchar", name: "first_name" })
    first_name!: string;

    @Column({ type: "varchar", name: "last_name" })
    last_name!: string;

    @Column({ type: "varchar", name: "gender" })
    gender!: string;

    @Column({ type: "varchar" })
    cep!: string;

    @Column({ type: "varchar" })
    city!: string;
    
    @Column({ type: "varchar" })
    state!: string;
 
    @Column({ type: "varchar" })
    neighborhood!: string;
    
    @Column({ type: "varchar" })
    street!: string;

    @Column({ type: "varchar" })
    number!: string;

    @Column({ type: "boolean", default: false })
    declaration_accepted!: boolean;
    
    @Column({ type: "boolean", default: false, name: "accept_terms_and_privacy" })
    accept_terms_and_privacy!: boolean;

    @Column({ type: "varchar", nullable: true, name: "profile_picture" })
    profile_picture!: string;

    @Column ({ type: "timestamp", name: "CURRENT_TIMESTAMP", default: () => "CURRENT_TIMESTAMP" })
    CURRENT_TIMESTAMP!: Date;
}