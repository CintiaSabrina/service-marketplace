import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ProfessionalServices } from "./professional-services";
import { Login } from "../../auth/entities/login";

@Entity("professional_registrations")
export class ProfessionalRegistration {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(
    () => ProfessionalServices,
    service => service.professional
    )
    services!: ProfessionalServices[];

    @OneToMany(
    () => Login,
    login => login.professional
    )
    logins!: Login[];

    @Column({ type: "varchar", name: "first_name" })
    first_name!: string;
    
    @Column({ type: "varchar", name: "last_name" })
    last_name!: string;

    @Column({ type: "varchar", name: "gender" })
    gender!: string;
    
    @Column({ type: "varchar", name: "birth_date" })
    birth_date!: string;
    
    @Column({ type: "varchar" })
    cpf!: string;
    
    @Column({ type: "varchar" })
    rg!: string;
    
    @Column({ type: "varchar" })
    cep!: string;
    
    @Column({ type: "varchar" })
    street!: string;
    
    @Column({ type: "varchar" })
    number!: string;
    
    @Column({ type: "varchar" })
    neighborhood!: string;
    
    @Column({ type: "varchar" })
    city!: string;
    
    @Column({ type: "varchar" })
    state!: string;
    
    @Column({ type: "varchar" })
    title!: string;
    
    @Column({ type: "text", nullable: true })
    about!: string;
    
    @Column({ type: "text", nullable: true, name: "recent_works" })
    recent_works!: string;
    
    @Column({ type: "varchar", nullable: true, name: "profile_picture" })
    profile_picture!: string;

    @Column({ type: "varchar", nullable: true, name: "criminal_record" })
    criminal_record!: string;
    
    @Column({ type: "boolean", default: false })
    declaration_accepted!: boolean;
    
    @Column({ type: "boolean", default: false, name: "accept_independent_contractor" })
    accept_independent_contractor!: boolean;
    
    @Column({ type: "boolean", default: false, name: "accept_terms_and_privacy" })
    accept_terms_and_privacy!: boolean;

    @Column ({ type: "timestamp", name: "CURRENT_TIMESTAMP", default: () => "CURRENT_TIMESTAMP" })
    CURRENT_TIMESTAMP!: Date;
}