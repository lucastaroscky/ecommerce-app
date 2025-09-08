import { Product } from "../../../modules/products/product.entity";

export const productFactory = async (): Promise<Product[]> => {
  const fakerStoreApi = await fetch('https://fakestoreapi.com/products');
  const productsData = await fakerStoreApi.json();

  const products: Product[] = productsData.map((item: any) => {
    const product = new Product();
    product.name = item.title;
    product.description = item.description;
    product.price = item.price;
    product.stockQuantity = 10;
    product.isActive = true;
    product.photo = item.image;

    return product;
  });

  return products;
};
