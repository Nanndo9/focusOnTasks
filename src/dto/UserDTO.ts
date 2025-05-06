import { TaskDTO } from "./TaskDTO";

export interface UserDTO {
    name: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
    tasks: TaskDTO[];
}