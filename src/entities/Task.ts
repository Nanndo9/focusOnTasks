import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./User";

@Entity()
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "title" })
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: false })
    completed: boolean;

    @ManyToOne(() => UserEntity, (user) => user.tasks)
    user: UserEntity;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
    updated_at: Date;
}
