import { Response } from 'express';
import { Task } from '../entities/Task';
import { TaskService } from '../services/TaskService';
import { HttpStatus } from '../enum/httpStatus';


export async function getTaskIfOwner(
    taskService: TaskService,
    taskId: string,
    userId: string,
    res: Response):
    Promise<Task | null> {
    const task = await taskService.findById(taskId);

    if (!task) {
        res.status(HttpStatus.NOT_FOUND).json({ message: "Task não encontrada" });
        return null;
    }

    if (task.user?.id !== userId) {
        res.status(HttpStatus.FORBIDDEN).json({ message: "Você não tem permissão para acessar esta task" });
        return null;
    }

    return task;
}
