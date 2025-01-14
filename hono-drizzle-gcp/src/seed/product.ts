import { productsTable } from '../db/schema';
import db from '../db';


export async function batchInsertProduct() {
  try {
    const products = Array.from({ length: 10 }, (_, i) => ({
      title: `Product ${i + 1}`,
      description: `這是第 ${i + 1} 個產品的描述`,
      price: (i + 1) * 100,
      image: `http://fakeimg.pl/440x300/282828/EAE0D0/?text=image${i + 1}.jpg`,
    }));
    await db.insert(productsTable).values(products);
  } catch (error) {
    console.error(error);
  }
}
