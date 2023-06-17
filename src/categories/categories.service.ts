import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryRepository.save(createCategoryDto);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOneOrFail({ where: { id } });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this.categoryRepository.update({ id }, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ deleted: boolean; details?: string }> {
    try {
      // TODO: find a way to also validate this line in tests with jest
      // const category = await this.findOne(id);
      // ******************************************
      await this.categoryRepository.delete({ id });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, details: err.message };
    }
  }
}
