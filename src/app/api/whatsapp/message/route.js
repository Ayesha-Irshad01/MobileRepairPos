import { buildWhatsAppData } from "@/services/whatsappDataService";
import { generateWhatsAppMessage } from "@/services/whatsappTemplateService";

export async function POST(request) {
  try {
    const body = await request.json();

    const { repairId, templateKey } = body;

    if (!repairId) {
      return Response.json(
        { error: "Repair ID is required" },
        { status: 400 }
      );
    }

    if (!templateKey) {
      return Response.json(
        { error: "Template key is required" },
        { status: 400 }
      );
    }

    const data = await buildWhatsAppData(repairId);

    const result = await generateWhatsAppMessage(
      templateKey,
      data
    );

    return Response.json({
      message: result.message,
      template: result.template,
    });
  } catch (error) {
    console.error("GENERATE WHATSAPP MESSAGE ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}