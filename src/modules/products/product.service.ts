import { Product } from './product.entity';
import { CreateProductBodyDto, ProductQueryDto, UpdateProductBodyDto } from './product.dto';
import { AppDataSource } from '../../config/database/data-source';

export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);

  async findAll(filters: ProductQueryDto): Promise<{ products: Product[]; total: number, page: number, limit: number, totalPages: number }> {
    const query = this.productRepository.createQueryBuilder('product');

    const { name, page = 1, limit = 10, sort = "created_at", order = "ASC" } = filters;
    if (name) {
      query.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }

    query
      .orderBy(`product.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [products, total] = await query.getManyAndCount();



    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  async createProduct(productData: CreateProductBodyDto): Promise<Product> {
    const product = this.productRepository.create(productData);

    return this.productRepository.save(product);
  }

  async updateProduct(id: string, productData: UpdateProductBodyDto) {
    return this.productRepository.update(id, productData);
  }

  async deleteProduct(id: string) {
    await this.productRepository.update(id, { isActive: false });
    await this.productRepository.softDelete(id);
  }
}
