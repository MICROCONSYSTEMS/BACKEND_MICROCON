import { Product } from '../models/index.js';
import { SendEmail } from './SendMails.js';

export const AdjustStock = async (items, revert = false) => {
  for (const { product, quantity } of items) {
    const prod = await Product.findById(product);
    if (!prod) throw new Error(`Product not found: ${product}`);

    const newStock = revert ? prod.stock + quantity : prod.stock - quantity;
    if (newStock < 0) throw new Error(`Insufficient stock for product: ${prod.name}`);

    prod.stock = newStock;
    await prod.save();

    // Check stock alert condition
    if (!revert && (newStock <= prod.reorderLevel || newStock === 0)) {
      await SendEmail({
        to: 'teeshakakkar2004@gmail.com',
        subject: `Stock Alert: ${prod.name}`,
        html: `
          <p><strong>Stock Alert</strong></p>
          <p>The product <strong>${prod.name}</strong> (ID: ${prod._id}) has low stock.</p>
          <ul>
            <li>Current Stock: <strong>${newStock}</strong></li>
            <li>Reorder Level: <strong>${prod.reorderLevel}</strong></li>
          </ul>
          <p>Please review this product and restock if necessary.</p>
        `
      });
    }
  }
};
