export type RepositoryId = string;

export interface ListOptions {
  readonly limit?: number;
  readonly offset?: number;
}

export interface RepositoryReader<
  TEntity,
  TId extends RepositoryId = RepositoryId,
> {
  findById(id: TId): Promise<TEntity | null>;
  list(options?: ListOptions): Promise<readonly TEntity[]>;
}

export interface RepositoryWriter<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TId extends RepositoryId = RepositoryId,
> {
  create(input: TCreateInput): Promise<TEntity>;
  update(id: TId, input: TUpdateInput): Promise<TEntity>;
  delete(id: TId): Promise<void>;
}

export interface Repository<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TId extends RepositoryId = RepositoryId,
> extends RepositoryReader<TEntity, TId>,
    RepositoryWriter<TEntity, TCreateInput, TUpdateInput, TId> {}
