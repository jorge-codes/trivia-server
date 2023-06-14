import { Test, TestingModule } from '@nestjs/testing';
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

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            save: jest.fn().mockResolvedValue(mockCategory1),
            find: jest.fn().mockResolvedValue([mockCategory1, mockCategory2]),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
