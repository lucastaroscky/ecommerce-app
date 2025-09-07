import { AppDataSource } from './data-source';
import { User } from '../modules/auth/user.entity';
import { Product } from '../modules/products/product.entity';
import { userFactory } from './factories/user.factory';
import { productFactory } from './factories/product.factory';

async function main() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const productRepo = AppDataSource.getRepository(Product);


  const usersData = await userFactory();
  const isUserAlreadyExists = await userRepo.findOne({ where: { email: usersData.email } })

  if (isUserAlreadyExists) {
    console.log(`⚠️ User with email ${usersData.email} already exists. Skipping creation.`);
  } else {
    await userRepo.save(usersData);
  }


  console.log(`✅ User created: ${usersData.fullName} (${usersData.email})`);

  const products = await productFactory()
  await productRepo.save(products);

  products.forEach((p) => {
    console.log(`✅ Product created: ${p.name} - $${p.price}`);
  });

  console.log('🎉 Seeding completed.');
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error('❌ Error during seeding:', err);
  process.exit(1);
});
