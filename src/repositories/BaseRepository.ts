import {
    type ObjectLiteral,
    type Repository,
} from "typeorm";

export class BaseRepository<T extends ObjectLiteral> {
    public constructor(protected readonly repository: Repository<T>) { }

    public async list(): Promise<T[]> {
        return await this.repository.find();
    }

    public async create(model: T): Promise<T> {
        return await this.repository.save(model);
    }

    public async softDelete(id: string): Promise<void> {
        await this.repository.softDelete(id)
    }

    public async restore(id: string): Promise<void> {
        await this.repository.restore(id)
    }
    
}
