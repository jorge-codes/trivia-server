import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
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

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategory1,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll - regular', () => {
    it('should return an array of categories', async () => {
      const result = [mockCategory2];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findAll - promise', () => {
    it('should return an array of categories', async () => {
      const result = [mockCategory2];
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => new Promise((resolve) => resolve(result)));

      expect(await controller.findAll()).toBe(result);
    });
  });
});
