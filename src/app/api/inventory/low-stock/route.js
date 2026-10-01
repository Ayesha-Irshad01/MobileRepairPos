import { getLowStockItems } from "@/services/inventoryService";

export async function GET() {
  try {
    const items = await getLowStockItems();

    return Response.json(items);

  } catch (error) {
    console.error("GET LOW STOCK ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}