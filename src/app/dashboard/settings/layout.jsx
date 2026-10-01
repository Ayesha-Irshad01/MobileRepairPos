import SettingsSidebar from "@/components/settings/SettingsSidebar";

export default function SettingsLayout({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50/30 dark:bg-[#0d1117]">
      <SettingsSidebar />
      <main className="min-w-0 flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/[0.15]">
        {children}
      </main>
    </div>
  );
}
