import {
  addStock,
  removeStock,
} from "@/services/inventoryService";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    const body = await request.json();

    if (!body.quantity) {
      return Response.json(
        { error: "Quantity is required" },
        { status: 400 }
      );
    }

    let updatedItem;

    if (body.operation === "add") {
      updatedItem = await addStock(id, body.quantity);
    } else if (body.operation === "remove") {
      updatedItem = await removeStock(id, body.quantity);
    } else {
      return Response.json(
        { error: "Operation must be add or remove" },
        { status: 400 }
      );
    }

    return Response.json(updatedItem);

  } catch (error) {
    console.error("STOCK UPDATE ERROR", error);

    if (error.message === "Inventory item not found") {
      return Response.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}