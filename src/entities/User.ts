// src/entities/User.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";
import { Task } from "./Task";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @CreateDateColumn({ name: "created_at" ,type: "timestamp"})
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" ,type: "timestamp"})
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
    deletedAt: Date;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];
}
