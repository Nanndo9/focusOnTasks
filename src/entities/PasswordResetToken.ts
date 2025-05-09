import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { UserEntity } from "./User";

@Entity("password_reset_token")
export class PasswordResetToken {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    token: string;

    @Column()
    expiresAt: Date;

    @ManyToOne(() => UserEntity)
    user: UserEntity;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;
}
