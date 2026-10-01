import Settings from "@/models/Settings";
import { connectDB } from "@/lib/mongodb";

export async function getSettings() {
  await connectDB();

  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  return settings;
}

export async function updateSettings(data) {
  await connectDB();

  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create(data);
    return settings;
  }

  settings = await Settings.findOneAndUpdate(
    { _id: settings._id },
    { $set: data },
    {
      new: true,
      runValidators: true,
    }
  );

  return settings;
}