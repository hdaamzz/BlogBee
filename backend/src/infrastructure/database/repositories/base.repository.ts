import { Document, Model, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

export abstract class BaseRepository<TDocument extends Document, TEntity> {
  constructor(protected model: Model<TDocument>) {}

  protected async findOneById(id: string): Promise<TDocument | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      console.error(`Error finding document by id: ${id}`, error);
      return null;
    }
  }

  protected async findOneByFilter(filter: FilterQuery<TDocument>): Promise<TDocument | null> {
    try {
      return await this.model.findOne(filter);
    } catch (error) {
      console.error('Error finding document by filter:', error);
      return null;
    }
  }

  protected async findManyByFilter(
    filter: FilterQuery<TDocument>,
    options?: {
      sort?: any;
      skip?: number;
      limit?: number;
      populate?: any;
    }
  ): Promise<TDocument[]> {
    try {
      let query = this.model.find(filter);

      if (options?.sort) query = query.sort(options.sort);
      if (options?.skip) query = query.skip(options.skip);
      if (options?.limit) query = query.limit(options.limit);
      if (options?.populate) query = query.populate(options.populate);

      return await query;
    } catch (error) {
      console.error('Error finding documents by filter:', error);
      return [];
    }
  }

  protected async createDocument(data: any): Promise<TDocument> {
    const document = new this.model(data);
    return await document.save();
  }

  protected async updateById(
    id: string,
    update: UpdateQuery<TDocument>,
    options?: QueryOptions
  ): Promise<TDocument | null> {
    try {
      return await this.model.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
        ...options
      });
    } catch (error) {
      console.error(`Error updating document by id: ${id}`, error);
      return null;
    }
  }

  protected async deleteById(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error(`Error deleting document by id: ${id}`, error);
      return false;
    }
  }

  protected async countDocuments(filter: FilterQuery<TDocument> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      console.error('Error counting documents:', error);
      return 0;
    }
  }

  protected async findWithPagination(
    filter: FilterQuery<TDocument> = {},
    page: number = 1,
    limit: number = 10,
    options?: {
      sort?: any;
      populate?: any;
    }
  ): Promise<{ documents: TDocument[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [documents, total] = await Promise.all([
        this.findManyByFilter(filter, {
          skip,
          limit,
          sort: options?.sort || { createdAt: -1 },
          populate: options?.populate
        }),
        this.countDocuments(filter)
      ]);

      return { documents, total };
    } catch (error) {
      console.error('Error finding documents with pagination:', error);
      return { documents: [], total: 0 };
    }
  }

  protected abstract mapToEntity(document: TDocument): TEntity;
}
