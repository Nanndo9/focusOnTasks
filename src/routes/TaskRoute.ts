import { Router, Request, Response, NextFunction } from "express";
import { taskService, TaskService } from "../services/TaskService";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Task } from "../entities/Task";
import { UserEntity } from "../entities/User";
import { HttpStatus } from "../enum/httpStatus";
import { getTaskIfOwner } from "../helpers/getTaskIfOwner";

interface AuthRequest extends Request {
    user?: string | object
}

export class TaskRoute {
    constructor(private readonly taskService: TaskService) { }

    public getRoute(): Router {
        const router = Router()

        router.post("/create",
            authMiddleware,
            async (req: AuthRequest, res: Response, next: NextFunction) => {
                try {
                    const { title, description } = req.body;

                    const userId = (req.user as any).id;
                    const task = new Task();
                    task.title = title;
                    task.description = description;
                    task.user = { id: userId } as UserEntity;

                    const createdTask = await this.taskService.createTask(task);

                    res.status(HttpStatus.CREATED).json({
                        message: "Task created successfully",
                        task: createdTask
                    });

                } catch (error) {
                    next(error);
                }
            })

        router.patch("/:id", authMiddleware,
            async (req: AuthRequest, res: Response, next: NextFunction) => {

                try {
                    const id = req.params.id
                    const taskData = req.body
                    const userId = (req.user as any).id

                    const task = await getTaskIfOwner(this.taskService, id, userId, res)

                    if (!task) return

                    const updatedTask = await this.taskService.update(id, taskData)

                    res.status(HttpStatus.OK).json({

                        message: `Changed successfully!`,
                        task: updatedTask
                    })

                } catch (error) {
                    next(error)
                }
            }

        )

        router.delete("/delete/:id",
            authMiddleware,
            async (req: AuthRequest, res: Response, next: NextFunction) => {

                try {
                    const id = req.params.id

                    const userId = (req.user as any).id
                    const task = await getTaskIfOwner(this.taskService, id, userId, res)

                    if (!task) return



                    await this.taskService.delete(id)

                    res.status(HttpStatus.ACCEPTED).json({
                        message: `Task deleted successfully!`
                    });
                } catch (error) {
                    next(error)
                }

            }
        )
        router.patch("/restore/:id",
            authMiddleware,
            async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
                try {
                    const taskId = req.params.id;
                    const userId = (req.user as any).id;

                    const taskExist = await this.taskService.findDeletedTaskById(taskId);


                    if (taskExist?.user?.id !== userId) {
                        res.status(HttpStatus.FORBIDDEN).json({
                            message: "Você não tem permissão para restaurar esta task"
                        });
                        return;
                    }

                    await this.taskService.restore(taskId);

                    res.status(HttpStatus.OK).json({
                        message: `Task with ID ${taskId} successfully restored!`
                    });
                } catch (error) {
                    next(error);
                }
            }
        )

        return router;
    }
}

export const taskRoute = new TaskRoute(taskService)