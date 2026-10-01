//to do function
/*addStock()
removeStock()
checkAvaialabilityStock
getLowStockItem */
import Inventory from "@/models/Inventory";
import { connectDB } from "@/lib/mongodb";

export async function addStock(inventoryId, quantity) {
  await connectDB();

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const item = await Inventory.findById(inventoryId);

  if (!item) {
    throw new Error("Inventory item not found");
  }

  item.qty += quantity;

  await item.save();

  return item;
}
export async function removeStock(inventoryId, quantity) {
  await connectDB();

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const item = await Inventory.findById(inventoryId);

  if (!item) {
    throw new Error("Inventory item not found");
  }

  if (quantity > item.qty) {
    throw new Error("Not enough stock available");
  }

  item.qty -= quantity;

  await item.save();

  return item;
}
export async function getLowStockItems() {
  await connectDB();

  const items = await Inventory.find({
    $expr: {
      $lte: ["$qty", "$minQty"],
    },
    isActive: true,
  });

  return items;
}