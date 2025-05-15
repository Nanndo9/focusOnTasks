import { Repository } from "typeorm";
import { Task } from "../entities/Task";
import { BaseRepository } from "./BaseRepository";
import { getTypeORMRepository } from "../config/DataSource";
import { ITaskRepository } from "../interfaces/ITaskRepository";

export class TaskRepository extends BaseRepository<Task> implements ITaskRepository {
    constructor(repository: Repository<Task>) {
        super(repository)
    }

    public async findById(id: string): Promise<Task | null> {
        return await this.repository.findOne({
            where: { id },
            relations: {
                user: true
            }
        })
    }

    public async findByUserId(userId: string): Promise<Task[]> {
        return await this.repository.findBy({ user: { id: userId } });
    }

    public async findDeletedTaskById(id: string): Promise<Task | null> {
        return await this.repository.findOne({
            where: { id },
            relations: {
                user: true
            },
            withDeleted: true
        });
    }

    public async disableTask(id: string): Promise<void> {
        await this.repository.softDelete(id)
    }

    public async restore(id: string): Promise<void> {
        await this.repository.restore(id)
    }

    public async save(task: Task): Promise<Task> {
        return await this.repository.save(task);
    }

    public async update(id: string, taskData: Partial<Task>): Promise<void> {
        await this.repository.update(id, taskData);
    }
}

export const taskRepository = new TaskRepository(
    getTypeORMRepository(Task)
)