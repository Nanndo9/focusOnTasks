import { Task } from "../entities/Task";
import { ITaskRepository } from "../interfaces/ITaskRepository";
import { taskRepository } from "../repositories/TaskRepository";

export class TaskService {
    constructor(private readonly taskRepository: ITaskRepository) { }

    async createTask(task: Task): Promise<Task> {
        return await this.taskRepository.save(task)
    }

    async findById(id: string): Promise<Task | null> {
        return await this.taskRepository.findById(id)
    }

    async findByUserId(userId: string): Promise<Task[]> {
        return await this.taskRepository.findByUserId(userId)
    }

    async update(id: string, taskData: Partial<Task>): Promise<void> {
        return await this.taskRepository.update(id, taskData)
    }

    async delete(id: string): Promise<void> {
        return await this.taskRepository.disableTask(id)
    }

    async restore(id: string): Promise<void> {
        return await this.taskRepository.restore(id)
    }
}

export const taskService = new TaskService(taskRepository)