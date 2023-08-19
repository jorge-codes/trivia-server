import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

const mockCategory1 = {
  id: 1,
  name: 'Music',
  color: '#ffffff',
  organization: 1,
};
const mockCategory2 = {
  id: 2,
  name: 'Art',
  color: '#00ffff',
  organization: 1,
};
const mockCategoryArray = [mockCategory1, mockCategory2];

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            find: jest.fn().mockResolvedValue([mockCategory1, mockCategory2]),
            findOneOrFail: jest.fn().mockResolvedValue(mockCategory1),
            save: jest.fn().mockResolvedValue(mockCategory1),
            update: jest.fn().mockResolvedValue(mockCategory2),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categories = await service.findAll();
      expect(categories).toEqual(mockCategoryArray);
    });
  });

  describe('findOne', () => {
    it('should return one category', () => {
      const repoSpy = jest.spyOn(repository, 'findOneOrFail');
      expect(service.findOne(1)).resolves.toEqual(mockCategory1);
      expect(repoSpy).toBeCalledWith({ where: { id: 1 } });
    });
  });

  describe('create', () => {
    it('should successfully insert one category', async () => {
      const category = await service.create(mockCategory1);
      expect(category).toEqual(mockCategory1);
      expect(repository.save).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update one category', async () => {
      const category = await service.update(1, { name: mockCategory1.name });
      expect(category).toEqual(mockCategory1);
      expect(repository.update).toBeCalledTimes(1);
    });
  });

  describe('delete', () => {
    const failId = 3000;
    it('should try to delete one category and fail', async () => {
      const repoSpy = jest
        .spyOn(repository, 'delete')
        .mockRejectedValueOnce(new Error('Bad Delete Method'));
      await expect(service.remove(failId)).resolves.toEqual({
        deleted: false,
        details: 'Bad Delete Method',
      });
      expect(repoSpy).toBeCalledWith({ id: failId });
      expect(repoSpy).toBeCalledTimes(1);
    });

    it('should successfully delete one category', async () => {
      const repoSpy = jest
        .spyOn(repository, 'delete')
        .mockResolvedValue(new DeleteResult());
      await expect(service.remove(1)).resolves.toEqual({
        deleted: true,
      });
      expect(repoSpy).toBeCalledWith({ id: 1 });
      expect(repoSpy).toBeCalledTimes(1);
    });
  });
});
