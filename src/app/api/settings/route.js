import {
  getSettings,
  updateSettings,
} from "@/services/settingsService";

export async function GET() {
  try {
    const settings = await getSettings();

    return Response.json(settings);
  } catch (error) {
    console.error("GET SETTINGS ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();

    const settings = await updateSettings(body);

    return Response.json(settings);
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}