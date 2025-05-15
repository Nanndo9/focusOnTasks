import { Task } from "../entities/Task";

export interface ITaskRepository {
    findById(id: string): Promise<Task | null>;
    findByUserId(userId: string): Promise<Task[]>;
    save(task: Task): Promise<Task>;
    update(id: string, taskData: Partial<Task>): Promise<void>;
    disableTask(id: string): Promise<void>;
    restore(id: string): Promise<void>;
    findDeletedTaskById(id:string):Promise<Task|null>
}