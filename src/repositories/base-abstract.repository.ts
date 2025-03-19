import { plainToInstance } from 'class-transformer';
// import { PageDto } from 'libs/common/src';
// import { PageMetaDto } from 'libs/common/src';
// import { PageOptionsDto } from 'libs/common/src';
import { FindOneOptions, FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';

export abstract class BaseAbstractRepository<T> extends Repository<T> {
  private repository: Repository<T>;

  protected constructor(repository: Repository<T>) {
    super(repository.target, repository.manager, repository.queryRunner);
    this.repository = repository;
  }

  // public async findOne(options: FindOneOptions<T>): Promise<T> {
  //     return this.repository.findOne(options);
  // }

  // public async findAll(): Promise<T[]> {
  //     return await this.repository.find();
  // }

  // public async pagination(
  //     pageOptionsDto: PageOptionsDto,
  //     dto: any,
  //     where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  //     orderOption?: FindOptionsOrder<T>,
  //     relations?: FindOptionsRelations<T>,
  //     withDeleted? : boolean
  // ): Promise<PageDto<any>> {
  //     const entities = await this.repository.find({
  //         skip: (pageOptionsDto.page - 1) * pageOptionsDto.take || 0,
  //         take: pageOptionsDto.take,
  //         where,
  //         order: {
  //             [pageOptionsDto.orderBy]: pageOptionsDto.order,
  //             ...orderOption,
  //         },
  //         relations,
  //         withDeleted: withDeleted
  //     });
  //     try {
  //         const itemCount = await this.repository.count({
  //             where,
  //             withDeleted: withDeleted
  //         });
  //         console.log('Count of non-deleted records:', itemCount);  // Debug log
  //         const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
  //         return new PageDto(plainToInstance(dto, entities), pageMetaDto);
  //       } catch (error) {
  //         console.error('Error counting non-deleted records:', error);  // Debug log
  //         throw error;
  //       }
  // }

  // public async convertToPagination(
  //     entities: T[],
  //     itemCount: number,
  //     pageOptionsDto: PageOptionsDto,
  //     dto: any,
  // ): Promise<PageDto<any>> {
  //     const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
  //     return new PageDto<T>(plainToInstance(dto, entities), pageMetaDto);
  // }
}
